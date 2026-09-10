import { prisma } from "db/client";
import type { CreateOrgInput, UpdateOrgInput, CreateInviteInput, AcceptInviteInput } from "../models/org.Schemas";

// 1. Create Organization Service
export const createOrganizationService = async (userId: string, input: CreateOrgInput) => {
  const { name, slug, description, avatarUrl } = input;

  // Check if the slug is already taken
  const existingOrg = await prisma.organization.findUnique({
    where: { slug },
  });

  if (existingOrg) {
    const error: any = new Error("Organization slug already exists");
    error.statusCode = 409;
    throw error;
  }

  // Atomic transaction
  return await prisma.$transaction(async (tx) => {
    // Create organization
    const organization = await tx.organization.create({
      data: {
        name,
        slug,
        description: description || null,
        avatarUrl: avatarUrl || null,
      },
    });

    // Create organization membership (OWNER)
    const membership = await tx.organizationMember.create({
      data: {
        userId,
        organizationId: organization.id,
        role: "OWNER",
      },
    });

    return {
      ...organization,
      userRole: membership.role,
    };
  });
};

// 2. Get User Organizations Service
export const getUserOrganizationsService = async (userId: string) => {
  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return memberships.map((m) => ({
    ...m.organization,
    role: m.role,
  }));
};

// 3. Get Single Organization Details Service
export const getOrganizationByIdService = async (userId: string, orgId: string) => {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: orgId,
      },
    },
    include: {
      organization: true,
    },
  });

  if (!membership) {
    const error: any = new Error("Organization not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: orgId,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      },
      boards: {
        select: {
          id: true,
          title: true,
          backgroundColor: true,
          isClosed: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return {
    ...organization,
    currentUserRole: membership.role,
  };
};

// 4. Delete Organization Service
export const deleteOrganizationService = async (userId: string, orgId: string) => {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: orgId,
      },
    },
  });

  if (!membership || membership.role !== "OWNER") {
    const error: any = new Error("Only organization owners can delete this organization");
    error.statusCode = 403;
    throw error;
  }

  await prisma.organization.delete({
    where: {
      id: orgId,
    },
  });

  return {
    message: "Organization Deleted Successfully",
  };
};

// 5. Remove Organization Member Service
export const removeOrganizationMemberService = async (
  requesterId: string,
  orgId: string,
  targetUserId: string
) => {
  const requesterMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId: requesterId, organizationId: orgId },
    },
  });

  if (!requesterMembership) {
    const error: any = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  const targetMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId: targetUserId, organizationId: orgId },
    },
  });

  if (!targetMembership) {
    const error: any = new Error("Member not found in organization");
    error.statusCode = 404;
    throw error;
  }

  const isSelf = requesterId === targetUserId;
  const isOwner = requesterMembership.role === "OWNER";
  const isAdmin = requesterMembership.role === "ADMIN";

  if (!isSelf && !isOwner && !(isAdmin && targetMembership.role === "MEMBER")) {
    const error: any = new Error("Insufficient permissions to remove this member");
    error.statusCode = 403;
    throw error;
  }

  await prisma.organizationMember.delete({
    where: {
      userId_organizationId: { userId: targetUserId, organizationId: orgId },
    },
  });

  return { message: "Member removed successfully" };
};

// 6. Create Email Invitation Service
export const createOrganizationInviteService = async (
  inviterId: string,
  orgId: string,
  input: CreateInviteInput
) => {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId: inviterId, organizationId: orgId },
    },
  });

  if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
    const error: any = new Error("Only Owners and Admins can invite members");
    error.statusCode = 403;
    throw error;
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await prisma.organizationInvite.create({
    data: {
      email: input.email,
      organizationId: orgId,
      inviterId,
      token,
      expiresAt,
      status: "PENDING",
    },
  });

  return invite;
};

// 7. Accept Invitation Service
export const acceptOrganizationInviteService = async (userId: string, token: string) => {
  const invite = await prisma.organizationInvite.findUnique({
    where: { token },
  });

  if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
    const error: any = new Error("Invalid or expired invitation token");
    error.statusCode = 400;
    throw error;
  }

  // Check if user is already a member of this organization
  const existingMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: invite.organizationId,
      },
    },
  });

  return await prisma.$transaction(async (tx) => {
    // Mark invite as ACCEPTED
    await tx.organizationInvite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" },
    });

    if (existingMembership) {
      return {
        organizationId: invite.organizationId,
        role: existingMembership.role,
      };
    }

    // Add user as MEMBER if not already a member
    const membership = await tx.organizationMember.create({
      data: {
        userId,
        organizationId: invite.organizationId,
        role: "MEMBER",
      },
    });

    return {
      organizationId: invite.organizationId,
      role: membership.role,
    };
  });
};
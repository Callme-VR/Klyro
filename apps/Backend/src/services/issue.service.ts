import { prisma } from "db/client";
import type { CreateIssueInput, UpdateIssueInput } from "../models/issue.Schemas";

const verifySectionAccess = async (userId: string, sectionId: string) => {
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    select: {
      id: true,
      board: { select: { id: true, organizationId: true } },
    },
  });
  if (!section) {
    const error: any = new Error("Section not found");
    error.statusCode = 404;
    throw error;
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId, organizationId: section.board.organizationId },
    },
  });
  if (!membership) {
    const error: any = new Error("Access denied: You are not a member of this organization");
    error.statusCode = 403;
    throw error;
  }
  return section;
};

const verifyIssueAccess = async (userId: string, issueId: string) => {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: {
      id: true,
      sectionId: true,
      section: {
        select: {
          id: true,
          board: { select: { id: true, organizationId: true } },
        },
      },
    },
  });
  if (!issue) {
    const error: any = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId, organizationId: issue.section.board.organizationId },
    },
  });
  if (!membership) {
    const error: any = new Error("Access denied: You are not a member of this organization");
    error.statusCode = 403;
    throw error;
  }
  return issue;
};

// ============================================================
// Issue Services
// ============================================================

export const createIssueService = async (
  userId: string,
  sectionId: string,
  input: CreateIssueInput
) => {
  await verifySectionAccess(userId, sectionId);

  let issueOrder = input.order;
  if (issueOrder === undefined) {
    const maxIssue = await prisma.issue.findFirst({
      where: { sectionId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    issueOrder = maxIssue ? maxIssue.order + 65536.0 : 65536.0;
  }

  const issue = await prisma.issue.create({
    data: {
      title: input.title,
      description: input.description ?? null,
      order: issueOrder,
      dueDate: input.dueDate ?? null,
      sectionId,
    },
    include: {
      assignees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  return issue;
};

export const getSectionIssuesService = async (userId: string, sectionId: string) => {
  await verifySectionAccess(userId, sectionId);

  const issues = await prisma.issue.findMany({
    where: { sectionId },
    orderBy: { order: "asc" },
    include: {
      assignees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  return issues;
};

export const getIssueByIdService = async (userId: string, issueId: string) => {
  await verifyIssueAccess(userId, issueId);

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      assignees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      section: {
        select: { id: true, title: true, boardId: true },
      },
    },
  });

  return issue;
};

export const updateIssueService = async (
  userId: string,
  issueId: string,
  input: UpdateIssueInput
) => {
  const currentIssue = await verifyIssueAccess(userId, issueId);

  if (input.sectionId && input.sectionId !== currentIssue.sectionId) {
    await verifySectionAccess(userId, input.sectionId);
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.order !== undefined && { order: input.order }),
      ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
      ...(input.sectionId !== undefined && { sectionId: input.sectionId }),
    },
    include: {
      assignees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
        },
      },
      _count: {
        select: { comments: true },
      },
    },
  });

  return updatedIssue;
};

export const deleteIssueService = async (userId: string, issueId: string) => {
  await verifyIssueAccess(userId, issueId);
  await prisma.issue.delete({ where: { id: issueId } });
  return { message: "Issue deleted successfully" };
};

// ============================================================
// Issue Assignees Services
// ============================================================

export const addIssueAssigneeService = async (
  userId: string,
  issueId: string,
  assigneeUserId: string
) => {
  const issue = await verifyIssueAccess(userId, issueId);

  const targetMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: assigneeUserId,
        organizationId: issue.section.board.organizationId,
      },
    },
  });
  if (!targetMembership) {
    const error: any = new Error("User is not a member of this organization");
    error.statusCode = 400;
    throw error;
  }

  const existingAssignment = await prisma.issueAssignee.findUnique({
    where: {
      issueId_userId: { issueId, userId: assigneeUserId },
    },
  });
  if (existingAssignment) {
    const error: any = new Error("User is already assigned to this issue");
    error.statusCode = 400;
    throw error;
  }

  const assignment = await prisma.issueAssignee.create({
    data: { issueId, userId: assigneeUserId },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });

  return assignment;
};

export const removeIssueAssigneeService = async (
  userId: string,
  issueId: string,
  assigneeUserId: string
) => {
  await verifyIssueAccess(userId, issueId);

  const existingAssignment = await prisma.issueAssignee.findUnique({
    where: {
      issueId_userId: { issueId, userId: assigneeUserId },
    },
  });
  if (!existingAssignment) {
    const error: any = new Error("User assignment not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.issueAssignee.delete({
    where: {
      issueId_userId: { issueId, userId: assigneeUserId },
    },
  });

  return { message: "Assignee removed successfully" };
};
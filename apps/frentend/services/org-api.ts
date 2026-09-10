
import { apiClient } from "@/lib/api-client";
import { Organization } from "@/types/alltypes";

export interface CreateOrgPayload {
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
}

export interface CreateInvitePayload {
  email: string;
}

export interface OrganizationInvite {
  id: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  organizationId: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  expiresAt: string;
}

/**
 * Generate an email invite for an organization.
 * Owner/Admin only.
 */
export async function createOrgInviteApi(
  orgId: string,
  payload: CreateInvitePayload
): Promise<OrganizationInvite> {
  return apiClient<OrganizationInvite>(
    `/organizations/${orgId}/invites`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      requiresAuth: true,
    }
  );
}

/**
 * Accept an organization invitation token.
 */
export async function acceptOrgInviteApi(
  token: string
): Promise<{ organizationId: string; role: string }> {
  return apiClient<{ organizationId: string; role: string }>(
    "/organizations/invites/accept",
    {
      method: "POST",
      body: JSON.stringify({ token }),
      requiresAuth: true,
    }
  );
}

/**
 * Remove a member from an organization.
 */
export async function removeOrgMemberApi(
  orgId: string,
  userId: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(
    `/organizations/${orgId}/members/${userId}`,
    {
      method: "DELETE",
      requiresAuth: true,
    }
  );
}

/**
 * Get all organizations for the authenticated user.
 */
export async function getUserOrgsApi(): Promise<Organization[]> {
  return apiClient<Organization[]>("/organizations", {
    method: "GET",
    requiresAuth: true,
  });
}

/**
 * Create a new organization.
 */
export async function createOrgApi(
  payload: CreateOrgPayload
): Promise<Organization> {
  return apiClient<Organization>("/organizations", {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}

/**
 * Get detailed organization information by ID.
 */
export async function getOrgByIdApi(
  orgId: string
): Promise<Organization> {
  return apiClient<Organization>(
    `/organizations/${orgId}`,
    {
      method: "GET",
      requiresAuth: true,
    }
  );
}

/**
 * Delete an organization.
 * Owner only.
 */
export async function deleteOrgApi(
  orgId: string
): Promise<void> {
  return apiClient<void>(
    `/organizations/${orgId}`,
    {
      method: "DELETE",
      requiresAuth: true,
    }
  );
}
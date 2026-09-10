import { describe, expect, test } from "bun:test";
import { registerUser } from "../../services/auth.service";
import {
  createOrganizationService,
  getUserOrganizationsService,
  getOrganizationByIdService,
  createOrganizationInviteService,
  acceptOrganizationInviteService,
  removeOrganizationMemberService,
  deleteOrganizationService,
} from "../../services/org.service";

describe("Organization & Member Services Integration Tests", () => {
  const timestamp = Date.now();
  let ownerId = "";
  let memberId = "";
  let orgId = "";
  let inviteToken = "";

  test("Setup test users for Organization integration tests", async () => {
    const owner = await registerUser({
      email: `org_owner_${timestamp}@example.com`,
      password: "Password123!",
      name: "Org Owner",
    });
    ownerId = owner.user.id;

    const member = await registerUser({
      email: `org_member_${timestamp}@example.com`,
      password: "Password123!",
      name: "Org Member",
    });
    memberId = member.user.id;

    expect(ownerId).toBeDefined();
    expect(memberId).toBeDefined();
  });

  test("createOrganizationService creates organization and sets user as OWNER", async () => {
    const org = await createOrganizationService(ownerId, {
      name: `Unit Test Org ${timestamp}`,
      slug: `unit-test-org-${timestamp}`,
      description: "Test Org Description",
    });

    expect(org.id).toBeDefined();
    expect(org.userRole).toBe("OWNER");
    orgId = org.id;
  });

  test("getUserOrganizationsService returns user organizations list", async () => {
    const orgs = await getUserOrganizationsService(ownerId);
    expect(orgs.length).toBeGreaterThan(0);
    expect(orgs.some((o: any) => o.id === orgId)).toBe(true);
  });

  test("getOrganizationByIdService retrieves organization details for member", async () => {
    const org = await getOrganizationByIdService(ownerId, orgId);
    expect(org.id).toBe(orgId);
    expect(org.currentUserRole).toBe("OWNER");
  });

  test("getOrganizationByIdService throws 404/403 for non-member", async () => {
    try {
      await getOrganizationByIdService(memberId, orgId);
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
    }
  });

  test("createOrganizationInviteService generates invitation token", async () => {
    const invite = await createOrganizationInviteService(ownerId, orgId, {
      email: `invited_${timestamp}@example.com`,
    });

    expect(invite.token).toBeDefined();
    expect(invite.status).toBe("PENDING");
    inviteToken = invite.token;
  });

  test("acceptOrganizationInviteService adds member to organization", async () => {
    const result = await acceptOrganizationInviteService(memberId, inviteToken);
    expect(result.organizationId).toBe(orgId);
    expect(result.role).toBe("MEMBER");
  });

  test("removeOrganizationMemberService removes member from organization", async () => {
    const result = await removeOrganizationMemberService(ownerId, orgId, memberId);
    expect(result.message).toBe("Member removed successfully");
  });

  test("deleteOrganizationService deletes organization (OWNER only)", async () => {
    const result = await deleteOrganizationService(ownerId, orgId);
    expect(result.message).toBe("Organization Deleted Successfully");
  });
});

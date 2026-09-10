import { describe, expect, test } from "bun:test";
import { SignupSchema, SigninSchema } from "../../models/auth.Schemas";
import { CreateOrgSchema, AcceptInviteSchema } from "../../models/org.Schemas";
import { CreateBoardSchema } from "../../models/board.Schemas";
import { CreateSectionSchema } from "../../models/section.Schemas";
import {
  CreateIssueSchema,
  AddAssigneeSchema,
} from "../../models/issue.Schemas";
import { CreateCommentSchema, UpdateCommentSchema } from "../../models/comments.Schemas";

describe("Zod Validation Schemas Unit Tests", () => {
  // ==========================================
  // Auth Schemas
  // ==========================================
  describe("Auth Schemas", () => {
    test("SignupSchema accepts valid user data", () => {
      const result = SignupSchema.safeParse({
        email: "valid@example.com",
        password: "Password123!",
        name: "Valid Name",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Valid Name");
      }
    });

    test("SignupSchema rejects invalid email format", () => {
      const result = SignupSchema.safeParse({
        email: "invalid-email",
        password: "Password123!",
      });
      expect(result.success).toBe(false);
    });

    test("SignupSchema rejects short password", () => {
      const result = SignupSchema.safeParse({
        email: "user@example.com",
        password: "123",
      });
      expect(result.success).toBe(false);
    });

    test("SigninSchema accepts valid credentials", () => {
      const result = SigninSchema.safeParse({
        email: "user@example.com",
        password: "Password123!",
      });
      expect(result.success).toBe(true);
    });
  });

  // ==========================================
  // Organization Schemas
  // ==========================================
  describe("Organization Schemas", () => {
    test("CreateOrgSchema validates valid slug and name", () => {
      const result = CreateOrgSchema.safeParse({
        name: "Acme Corp",
        slug: "acme-corp",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe("acme-corp");
      }
    });

    test("CreateOrgSchema rejects invalid slug characters", () => {
      const result = CreateOrgSchema.safeParse({
        name: "Acme Corp",
        slug: "invalid slug with spaces!",
      });
      expect(result.success).toBe(false);
    });

    test("AcceptInviteSchema rejects empty token", () => {
      const result = AcceptInviteSchema.safeParse({ token: "" });
      expect(result.success).toBe(false);
    });
  });

  // ==========================================
  // Board Schemas
  // ==========================================
  describe("Board Schemas", () => {
    test("CreateBoardSchema validates hex color format", () => {
      const valid = CreateBoardSchema.safeParse({
        title: "Sprint Board",
        organizationId: "123e4567-e89b-12d3-a456-426614174000",
        backgroundColor: "#0079BF",
      });
      expect(valid.success).toBe(true);

      const invalidColor = CreateBoardSchema.safeParse({
        title: "Sprint Board",
        organizationId: "123e4567-e89b-12d3-a456-426614174000",
        backgroundColor: "blue-color",
      });
      expect(invalidColor.success).toBe(false);
    });
  });

  // ==========================================
  // Section Schemas
  // ==========================================
  describe("Section Schemas", () => {
    test("CreateSectionSchema validates title length", () => {
      const valid = CreateSectionSchema.safeParse({ title: "In Progress" });
      expect(valid.success).toBe(true);

      const empty = CreateSectionSchema.safeParse({ title: "" });
      expect(empty.success).toBe(false);
    });
  });

  // ==========================================
  // Issue Schemas
  // ==========================================
  describe("Issue Schemas", () => {
    test("CreateIssueSchema validates ISO date string for dueDate", () => {
      const valid = CreateIssueSchema.safeParse({
        title: "Fix Auth Middleware",
        dueDate: "2026-08-25T12:00:00.000Z",
      });
      expect(valid.success).toBe(true);
      if (valid.success && valid.data.dueDate) {
        expect(valid.data.dueDate instanceof Date).toBe(true);
      }
    });

    test("AddAssigneeSchema validates target userId UUID", () => {
      const valid = AddAssigneeSchema.safeParse({
        userId: "123e4567-e89b-12d3-a456-426614174000",
      });
      expect(valid.success).toBe(true);

      const invalidUuid = AddAssigneeSchema.safeParse({ userId: "invalid-id" });
      expect(invalidUuid.success).toBe(false);
    });
  });

  // ==========================================
  // Comment Schemas
  // ==========================================
  describe("Comment Schemas", () => {
    test("CreateCommentSchema trims content", () => {
      const result = CreateCommentSchema.safeParse({ content: "Great work!" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).toBe("Great work!");
      }
    });

    test("UpdateCommentSchema rejects empty strings", () => {
      const result = UpdateCommentSchema.safeParse({ content: "" });
      expect(result.success).toBe(false);
    });
  });
});

import { describe, expect, test } from "bun:test";
import { CreateSection } from "../../controllers/sections.controller";
import { CreateIssue } from "../../controllers/issue.controller";
import { CreateComment } from "../../controllers/comments.controller";
import type { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import type { Response } from "express";

describe("Controllers Layer Unit Tests", () => {
  test("CreateSection controller returns 401 when req.user is undefined", async () => {
    const req = { params: { boardId: "board-123" } } as unknown as AuthenticatedRequest;
    let statusCode = 0;
    let responseBody: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseBody = data;
        return res;
      },
    } as unknown as Response;

    await CreateSection(req, res);

    expect(statusCode).toBe(401);
    expect(responseBody.success).toBe(false);
    expect(responseBody.error.code).toBe("UNAUTHORIZED");
  });

  test("CreateIssue controller returns 400 when title is empty string", async () => {
    const req = {
      user: { userId: "user-123", email: "user@example.com" },
      params: { sectionId: "section-123" },
      body: { title: "" },
    } as unknown as AuthenticatedRequest;

    let statusCode = 0;
    let responseBody: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseBody = data;
        return res;
      },
    } as unknown as Response;

    await CreateIssue(req, res);

    expect(statusCode).toBe(400);
    expect(responseBody.success).toBe(false);
    expect(responseBody.error.code).toBe("BAD_REQUEST");
  });

  test("CreateComment controller returns 400 when issueId param is missing", async () => {
    const req = {
      user: { userId: "user-123", email: "user@example.com" },
      params: {},
      body: { content: "Valid content" },
    } as unknown as AuthenticatedRequest;

    let statusCode = 0;
    let responseBody: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseBody = data;
        return res;
      },
    } as unknown as Response;

    await CreateComment(req, res);

    expect(statusCode).toBe(400);
    expect(responseBody.success).toBe(false);
    expect(responseBody.error.code).toBe("BAD_REQUEST");
  });
});

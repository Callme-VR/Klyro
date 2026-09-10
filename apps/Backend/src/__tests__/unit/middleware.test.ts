import { describe, expect, test, mock } from "bun:test";
import { authenticateToken, type AuthenticatedRequest } from "../../middlewares/auth.middleware";
import { generateToken } from "../../utils/jwt";
import type { Response } from "express";

describe("Auth Middleware Unit Tests", () => {
  test("authenticateToken should return 401 if Authorization header is missing", () => {
    const req = { headers: {} } as AuthenticatedRequest;
    let statusCode = 0;
    let responseJson: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseJson = data;
        return res;
      },
    } as unknown as Response;

    const next = mock(() => {});

    authenticateToken(req, res, next);

    expect(statusCode).toBe(401);
    expect(responseJson.success).toBe(false);
    expect(responseJson.error.message).toBe("Authentication token missing");
    expect(next).not.toHaveBeenCalled();
  });

  test("authenticateToken should return 401 if token is invalid or corrupted", () => {
    const req = {
      headers: { authorization: "Bearer invalid-token-string" },
    } as AuthenticatedRequest;

    let statusCode = 0;
    let responseJson: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        responseJson = data;
        return res;
      },
    } as unknown as Response;

    const next = mock(() => {});

    authenticateToken(req, res, next);

    expect(statusCode).toBe(401);
    expect(responseJson.success).toBe(false);
    expect(responseJson.error.message).toBe("Invalid or expired token");
    expect(next).not.toHaveBeenCalled();
  });

  test("authenticateToken should attach user payload to req.user and call next() for valid token", () => {
    const payload = { userId: "user-uuid-123", email: "user@example.com" };
    const validToken = generateToken(payload);

    const req = {
      headers: { authorization: `Bearer ${validToken}` },
    } as AuthenticatedRequest;

    const res = {} as Response;
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    authenticateToken(req, res, next);

    expect(nextCalled).toBe(true);
    expect(req.user).toBeDefined();
    expect(req.user?.userId).toBe(payload.userId);
    expect(req.user?.email).toBe(payload.email);
  });
});

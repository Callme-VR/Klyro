import { describe, expect, test } from "bun:test";
import { generateToken, verifyToken, decodeToken } from "../../utils/jwt";

describe("JWT Utility Unit Tests", () => {
  const mockPayload = {
    userId: "123e4567-e89b-12d3-a456-426614174000",
    email: "testuser@example.com",
  };

  test("generateToken should produce a valid JWT string", () => {
    const token = generateToken(mockPayload);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
  });

  test("verifyToken should successfully decode a valid token", () => {
    const token = generateToken(mockPayload);
    const decoded = verifyToken(token);

    expect(decoded.userId).toBe(mockPayload.userId);
    expect(decoded.email).toBe(mockPayload.email);
  });

  test("decodeToken should parse payload without verifying signature", () => {
    const token = generateToken(mockPayload);
    const decoded = decodeToken(token);

    expect(decoded.userId).toBe(mockPayload.userId);
    expect(decoded.email).toBe(mockPayload.email);
  });

  test("verifyToken should throw error for invalid token string", () => {
    expect(() => verifyToken("invalid-malformed-token")).toThrow();
  });
});

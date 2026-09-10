import { describe, expect, test } from "bun:test";
import { registerUser, loginUser, getUserById } from "../../services/auth.service";

describe("Auth Services Integration Tests", () => {
  const timestamp = Date.now();
  const testUserEmail = `unit_test_user_${timestamp}@example.com`;
  const testPassword = "SecurePassword123!";
  let createdUserId = "";

  test("registerUser successfully creates user and returns JWT token", async () => {
    const result = await registerUser({
      email: testUserEmail,
      password: testPassword,
      name: "Unit Test User",
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testUserEmail);
    expect(result.user.name).toBe("Unit Test User");
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe("string");

    createdUserId = result.user.id;
  });

  test("registerUser throws 409 error when registering duplicate email", async () => {
    try {
      await registerUser({
        email: testUserEmail,
        password: testPassword,
      });
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("User already exists");
    }
  });

  test("loginUser returns user details and JWT token on correct credentials", async () => {
    const result = await loginUser({
      email: testUserEmail,
      password: testPassword,
    });

    expect(result.user).toBeDefined();
    expect(result.user.id).toBe(createdUserId);
    expect(result.token).toBeDefined();
  });

  test("loginUser throws 401 error on invalid password", async () => {
    try {
      await loginUser({
        email: testUserEmail,
        password: "WrongPassword!",
      });
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Invalid email or password");
    }
  });

  test("getUserById returns user profile for valid userId", async () => {
    const profile = await getUserById(createdUserId);
    expect(profile.id).toBe(createdUserId);
    expect(profile.email).toBe(testUserEmail);
  });

  test("getUserById throws 404 for non-existent userId", async () => {
    try {
      await getUserById("00000000-0000-0000-0000-000000000000");
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("User not found");
    }
  });
});

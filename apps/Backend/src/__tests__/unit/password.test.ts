import { describe, expect, test } from "bun:test";

describe("Argon2id Password Hashing Unit Tests", () => {
  const plainPassword = "SecurePassword123!";

  test("Bun.password.hash should generate valid Argon2id hash string", async () => {
    const hash = await Bun.password.hash(plainPassword, {
      algorithm: "argon2id",
    });

    expect(typeof hash).toBe("string");
    expect(hash.startsWith("$argon2id$")).toBe(true);
  });

  test("Bun.password.verify should return true for correct password", async () => {
    const hash = await Bun.password.hash(plainPassword, {
      algorithm: "argon2id",
    });

    const isMatch = await Bun.password.verify(plainPassword, hash);
    expect(isMatch).toBe(true);
  });

  test("Bun.password.verify should return false for incorrect password", async () => {
    const hash = await Bun.password.hash(plainPassword, {
      algorithm: "argon2id",
    });

    const isMatch = await Bun.password.verify("WrongPassword!", hash);
    expect(isMatch).toBe(false);
  });
});

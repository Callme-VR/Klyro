import { prisma } from "db/client";
import type { SignupInput, SigninInput } from "../models/auth.Schemas";
import { generateToken } from "../utils/jwt";

export const registerUser = async (input: SignupInput) => {
  const { email, password, name, avatarUrl } = input;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    const error: any = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  // Hash password using Argon2id
  const passwordHash = await Bun.password.hash(password, {
    algorithm: "argon2id",
  });

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      avatarUrl,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
    },
  });

  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
};

export const loginUser = async (input: SigninInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await Bun.password.verify(password, user.passwordHash);

  if (!isPasswordValid) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    token,
  };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    const error: any = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};


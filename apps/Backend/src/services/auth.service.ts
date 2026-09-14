import { prisma } from "db/client";
import type { SignupInput, SigninInput } from "../models/auth.Schemas";
import { generateToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { getGoogleUser } from "../utils/googleAuthProvider";

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

  if (!user || !user.passwordHash) {
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
  const cachekey = `user:${userId}`;
  const cacheUser = await redis.get(cachekey);
  if (cacheUser) {
    return JSON.parse(cacheUser);
  }
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
  await redis.setex(cachekey, 300, JSON.stringify(user));

  return user;
};

export const handleGoogleauthservice = async (googleuser: {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}) => {
  const { id, email, name, picture } = googleuser;

  let user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { providerId: id }],
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        avatarUrl: picture || null,
        provider: "GOOGLE",
        providerId: id,
        verified: true,
      },
    });
  } else if (!user.providerId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        providerId: id,
        avatarUrl: picture || user.avatarUrl,
        verified: true,
      },
    });
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
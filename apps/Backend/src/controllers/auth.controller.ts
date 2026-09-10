import type { Request, Response } from "express";
import { SignupSchema, SigninSchema } from "../models/auth.Schemas";
import { registerUser, loginUser, getUserById } from "../services/auth.service";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

// Validate user input and process signup
export const Signup = async (req: Request, res: Response) => {
  try {
    const validation = SignupSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Invalid input data",
          details: validation.error.flatten().fieldErrors,
        },
      });
      return;
    }

    const user = await registerUser(validation.data);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 409 ? "CONFLICT" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Something went wrong",
      },
    });
  }
};

// Authenticate user and return token
export const Signin = async (req: Request, res: Response) => {
  try {
    const validation = SigninSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Invalid input data",
          details: validation.error.flatten().fieldErrors,
        },
      });
      return;
    }

    const result = await loginUser(validation.data);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 401 ? "UNAUTHORIZED" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Something went wrong",
      },
    });
  }
};

// Fetch current user profile
export const GetMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      });
      return;
    }

    const user = await getUserById(req.user.userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Something went wrong",
      },
    });
  }
};
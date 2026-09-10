import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CreateOrgSchema, CreateInviteSchema, AcceptInviteSchema } from "../models/org.Schemas";
import {
  acceptOrganizationInviteService,
  createOrganizationInviteService,
  createOrganizationService,
  deleteOrganizationService,
  getOrganizationByIdService,
  getUserOrganizationsService,
  removeOrganizationMemberService,
} from "../services/org.service";

export const CreateOrg = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const validation = CreateOrgSchema.safeParse(req.body);
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

    const result = await createOrganizationService(req.user.userId, validation.data);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 409 ? "CONFLICT" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to create organization",
      },
    });
  }
};

// GET /api/v1/organizations/
export const GetUserOrgs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const orgs = await getUserOrganizationsService(req.user.userId);
    res.status(200).json({
      success: true,
      data: orgs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

// GET /api/v1/organizations/:orgId
export const GetOrgById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const orgId = req.params.orgId as string;
    if (!orgId) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Organization ID parameter is required" },
      });
      return;
    }

    const result = await getOrganizationByIdService(req.user.userId, orgId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR",
        message: error.message || "Organization not found",
      },
    });
  }
};

// DELETE /api/v1/organizations/:orgId
export const DeleteOrg = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const orgId = req.params.orgId as string;
    if (!orgId) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Organization ID parameter is required" },
      });
      return;
    }

    const result = await deleteOrganizationService(req.user.userId, orgId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

// DELETE /api/v1/organizations/:orgId/members/:userId
export const RemoveOrgMember = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const orgId = req.params.orgId as string;
    const userId = req.params.userId as string;

    if (!orgId || !userId) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Organization ID and User ID parameters are required" },
      });
      return;
    }

    const result = await removeOrganizationMemberService(req.user.userId, orgId, userId);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

// POST /api/v1/organizations/:orgId/invites
export const CreateOrgInvite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const orgId = req.params.orgId as string;
    if (!orgId) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", message: "Organization ID parameter is required" },
      });
      return;
    }

    const validation = CreateInviteSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", details: validation.error.flatten().fieldErrors },
      });
      return;
    }

    const invite = await createOrganizationInviteService(req.user.userId, orgId, validation.data);
    res.status(201).json({
      success: true,
      data: invite,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

// POST /api/v1/organizations/invites/accept
export const AcceptOrgInvite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const validation = AcceptInviteSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: { code: "BAD_REQUEST", details: validation.error.flatten().fieldErrors },
      });
      return;
    }

    const result = await acceptOrganizationInviteService(req.user.userId, validation.data.token);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      error: { code: statusCode === 400 ? "BAD_REQUEST" : "INTERNAL_SERVER_ERROR", message: error.message },
    });
  }
};

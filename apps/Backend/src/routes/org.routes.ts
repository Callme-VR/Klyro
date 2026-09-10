import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  AcceptOrgInvite,
  CreateOrg,
  CreateOrgInvite,
  DeleteOrg,
  GetOrgById,
  GetUserOrgs,
  RemoveOrgMember,
} from "../controllers/org.controller";

const orgRouter = Router();

// Protect all organization routes with JWT middleware
orgRouter.use(authenticateToken);

orgRouter.post("/", CreateOrg);
orgRouter.get("/", GetUserOrgs);

// Static invite route MUST be declared before parameterized /:orgId routes
orgRouter.post("/invites/accept", AcceptOrgInvite);

orgRouter.get("/:orgId", GetOrgById);
orgRouter.delete("/:orgId", DeleteOrg);

// Member management & Invites
orgRouter.delete("/:orgId/members/:userId", RemoveOrgMember);
orgRouter.post("/:orgId/invites", CreateOrgInvite);

export default orgRouter;
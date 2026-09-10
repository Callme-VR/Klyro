import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  CreateSection,
  DeleteSection,
  GetSections,
  UpdateSection,
} from "../controllers/sections.controller";

// Router for standalone /sections/:sectionId routes
export const sectionRouter = Router();
sectionRouter.use(authenticateToken);
sectionRouter.patch("/:sectionId", UpdateSection);
sectionRouter.delete("/:sectionId", DeleteSection);

// Router for nested /boards/:boardId/sections routes
export const boardSectionRouter = Router({ mergeParams: true });
boardSectionRouter.use(authenticateToken);
boardSectionRouter.post("/", CreateSection);
boardSectionRouter.get("/", GetSections);

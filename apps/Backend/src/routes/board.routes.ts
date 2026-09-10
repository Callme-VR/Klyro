import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import {
  CreateBoard,
  GetBoards,
  GetBoardById,
  UpdateBoard,
  DeleteBoard,
} from "../controllers/board.controller";
import { boardSectionRouter } from "./section.routes";

const boardRouter = Router();

boardRouter.use(authenticateToken);
boardRouter.post("/", CreateBoard);
boardRouter.get("/", GetBoards);
boardRouter.get("/:boardId", GetBoardById);
boardRouter.patch("/:boardId", UpdateBoard);
boardRouter.delete("/:boardId", DeleteBoard);

// Nested Section routes for a specific board
boardRouter.use("/:boardId/sections", boardSectionRouter);

export default boardRouter;


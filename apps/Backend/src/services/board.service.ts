import { prisma } from "db/client";
import type { CreateBoardInput, UpdateBoardInput } from "../models/board.Schemas";

const verifyMembership = async (userId: string, organizationId: string) => {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    const error: any = new Error("Access denied: You are not a member of this organization.");
    error.statusCode = 403;
    throw error;
  }
  return membership.role;
};

export const createBoardService = async (userId: string, input: CreateBoardInput) => {
  const { title, organizationId, backgroundColor } = input;
  await verifyMembership(userId, organizationId);

  const board = await prisma.board.create({
    data: {
      title,
      organizationId,
      backgroundColor: backgroundColor || "#0079BF",
      creatorId: userId,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });
  return board;
};

export const getBoardService = async (userId: string, orgId?: string) => {
  if (orgId) {
    await verifyMembership(userId, orgId);

    return await prisma.board.findMany({
      where: {
        organizationId: orgId,
        isClosed: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { sections: true },
        },
      },
    });
  }

  // Fetch all boards across all organizations the user belongs to
  const userMemberships = await prisma.organizationMember.findMany({
    where: { userId },
    select: { organizationId: true },
  });
  const orgIds = userMemberships.map((m) => m.organizationId);

  return await prisma.board.findMany({
    where: {
      organizationId: { in: orgIds },
      isClosed: false,
    },
    orderBy: { createdAt: "desc" },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { sections: true },
      },
    },
  });
};

export const getBoardByIdService = async (userId: string, boardId: string) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          issues: {
            orderBy: { order: "asc" },
            include: {
              assignees: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
              _count: {
                select: { comments: true },
              },
            },
          },
        },
      },
    },
  });

  if (!board) {
    const error: any = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if user is a member of the organization that owns this board
  await verifyMembership(userId, board.organizationId);

  return board;
};

export const updateBoardService = async (
  userId: string,
  boardId: string,
  input: UpdateBoardInput
) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    const error: any = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  await verifyMembership(userId, board.organizationId);

  const updatedBoard = await prisma.board.update({
    where: { id: boardId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.backgroundColor !== undefined && { backgroundColor: input.backgroundColor }),
      ...(input.isClosed !== undefined && { isClosed: input.isClosed }),
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });

  return updatedBoard;
};

export const deleteBoardService = async (userId: string, boardId: string) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
  });

  if (!board) {
    const error: any = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  await verifyMembership(userId, board.organizationId);

  await prisma.board.delete({
    where: { id: boardId },
  });

  return { message: "Board deleted successfully" };
};

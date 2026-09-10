import { prisma } from "db/client";
import type { CreateSectionInput, UpdateSectionInput } from "../models/section.Schemas";

// ============================================================
// Verify Board Access
// ============================================================

const verifyBoardAccess = async (userId: string, boardId: string) => {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
    select: {
      id: true,
      organizationId: true,
    },
  });

  if (!board) {
    const error: any = new Error("Board not found");
    error.statusCode = 404;
    throw error;
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: board.organizationId,
      },
    },
  });

  if (!membership) {
    const error: any = new Error(
      "Access denied: You are not a member of this organization"
    );
    error.statusCode = 403;
    throw error;
  }

  return board;
};

// ============================================================
// Create Section
// ============================================================

export const createSectionService = async (
  userId: string,
  boardId: string,
  input: CreateSectionInput
) => {
  // Verify user has access to the board
  await verifyBoardAccess(userId, boardId);

  let sectionOrder = input.order;

  // Automatically calculate order if not provided
  if (sectionOrder === undefined) {
    const maxSection = await prisma.section.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    sectionOrder = maxSection
      ? maxSection.order + 65536.0
      : 65536.0;
  }

  // Create section
  const section = await prisma.section.create({
    data: {
      title: input.title,
      order: sectionOrder,
      boardId,
    },
  });

  return section;
};

// ============================================================
// Get Sections for Board
// ============================================================

export const getSectionsService = async (
  userId: string,
  boardId: string
) => {
  // Verify user has access to the board
  await verifyBoardAccess(userId, boardId);

  const sections = await prisma.section.findMany({
    where: {
      boardId,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      issues: {
        orderBy: {
          order: "asc",
        },
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
            select: {
              comments: true,
            },
          },
        },
      },
    },
  });

  return sections;
};

// ============================================================
// Update Section
// ============================================================

export const updateSectionService = async (
  userId: string,
  sectionId: string,
  input: UpdateSectionInput
) => {
  // Find section first
  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
    },
    select: {
      id: true,
      boardId: true,
    },
  });

  // Section doesn't exist
  if (!section) {
    const error: any = new Error("Section not found");
    error.statusCode = 404;
    throw error;
  }

  // Verify user has access to the board
  await verifyBoardAccess(userId, section.boardId);

  // Update only the fields that were provided
  const updatedSection = await prisma.section.update({
    where: {
      id: sectionId,
    },
    data: {
      ...(input.title !== undefined && {
        title: input.title,
      }),
      ...(input.order !== undefined && {
        order: input.order,
      }),
    },
  });

  return updatedSection;
};

// ============================================================
// Delete Section
// ============================================================

export const deleteSectionService = async (
  userId: string,
  sectionId: string
) => {
  // Find section
  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
    },
    select: {
      id: true,
      boardId: true,
    },
  });

  // Section doesn't exist
  if (!section) {
    const error: any = new Error("Section not found");
    error.statusCode = 404;
    throw error;
  }

  // Verify access to the board
  await verifyBoardAccess(userId, section.boardId);

  // Delete section
  await prisma.section.delete({
    where: {
      id: sectionId,
    },
  });

  return {
    message: "Section deleted successfully",
  };
};

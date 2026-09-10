import { prisma } from "db/client";
import type { CreateCommentInput, UpdateCommentInput } from "../models/comments.Schemas";

const verifyIssueAccess = async (userId: string, issueId: string) => {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: {
      id: true,
      sectionId: true,
      section: {
        select: {
          id: true,
          board: { select: { id: true, organizationId: true } },
        },
      },
    },
  });
  if (!issue) {
    const error: any = new Error("Issue not found");
    error.statusCode = 404;
    throw error;
  }
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: { userId, organizationId: issue.section.board.organizationId },
    },
  });
  if (!membership) {
    const error: any = new Error("Access denied: You are not a member of this organization");
    error.statusCode = 403;
    throw error;
  }
  return issue;
};

export const createCommentService = async (
  userId: string,
  issueId: string,
  input: CreateCommentInput
) => {
  await verifyIssueAccess(userId, issueId);

  const comment = await prisma.comment.create({
    data: {
      content: input.content,
      issueId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          email: true,
        },
      },
    },
  });
  return comment;
};

export const getIssueCommentsService = async (userId: string, issueId: string) => {
  await verifyIssueAccess(userId, issueId);
  const comments = await prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });
  return comments;
};

export const updateCommentService = async (
  userId: string,
  commentId: string,
  input: UpdateCommentInput
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      userId: true,
      issueId: true,
    },
  });
  if (!comment) {
    const error: any = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  await verifyIssueAccess(userId, comment.issueId);
  // Author verification: only the author of the comment can edit it
  if (comment.userId !== userId) {
    const error: any = new Error("Forbidden: You can only edit your own comments");
    error.statusCode = 403;
    throw error;
  }
  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content: input.content },
    include: {
      user: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });
  return updatedComment;
};

export const deleteCommentService = async (userId: string, commentId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      userId: true,
      issueId: true,
    },
  });
  if (!comment) {
    const error: any = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }
  await verifyIssueAccess(userId, comment.issueId);
  // Author verification: only the author of the comment can delete it
  if (comment.userId !== userId) {
    const error: any = new Error("Forbidden: You can only delete your own comments");
    error.statusCode = 403;
    throw error;
  }
  await prisma.comment.delete({
    where: { id: commentId },
  });
  return { message: "Comment deleted successfully" };
};

import { apiClient } from "@/lib/api-client";
import { Comment } from "@/types/alltypes";

export interface CreateCommentPayload {
  content: string;
}
export interface UpdateCommentPayload {
  content: string;
}


export async function getIssueCommentsApi(issueId: string): Promise<Comment[]> {
  return apiClient<Comment[]>(`/issues/${issueId}/comments`, {
    method: "GET",
    requiresAuth: true,
  });
}
/**
 * Add a new comment to an issue
 */
export async function createCommentApi(
  issueId: string,
  payload: CreateCommentPayload
): Promise<Comment> {
  return apiClient<Comment>(`/issues/${issueId}/comments`, {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}
/**
 * Update an existing comment
 */
export async function updateCommentApi(
  commentId: string,
  payload: UpdateCommentPayload
): Promise<Comment> {
  return apiClient<Comment>(`/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}
/**
 * Delete a comment
 */
export async function deleteCommentApi(
  commentId: string
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/comments/${commentId}`, {
    method: "DELETE",
    requiresAuth: true,
  });
}
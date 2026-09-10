import { apiClient } from "@/lib/api-client";
import { Board } from "@/types/alltypes";

export interface CreateBoardPayload {
  title: string;
  organizationId: string;
  backgroundColor?: string;
  imageUrl?: string;
}

export interface UpdateBoardPayload {
  title?: string;
  backgroundColor?: string;
  isClosed?: boolean;
}

// Get all boards for an organization (or all user boards)
export async function getBoardsApi(orgId?: string): Promise<Board[]> {
  const url = orgId ? `/boards?orgId=${encodeURIComponent(orgId)}` : `/boards`;
  return apiClient<Board[]>(url, {
    method: "GET",
    requiresAuth: true,
  });
}

// Alias for backwards compatibility
export const getBoardApi = getBoardsApi;

// Get board by ID
export async function getBoardByIdApi(boardId: string): Promise<Board> {
  const url = `/boards/${boardId}`;
  return apiClient<Board>(url, {
    method: "GET",
    requiresAuth: true,
  });
}

// Create new board
export async function createBoardApi(payload: CreateBoardPayload): Promise<Board> {
  return apiClient<Board>("/boards", {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}
export const createBoardapi = createBoardApi;

// Update board
export async function updateBoardApi(boardId: string, payload: UpdateBoardPayload): Promise<Board> {
  return apiClient<Board>(`/boards/${boardId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}
export const updateBoardapi = updateBoardApi;

// Delete board
export async function deleteBoardApi(boardId: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/boards/${boardId}`, {
    method: "DELETE",
    requiresAuth: true,
  });
}


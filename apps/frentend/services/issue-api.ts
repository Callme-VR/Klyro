import { apiClient } from "@/lib/api-client";
import { Issue } from "@/types/alltypes";

export interface CreateIssuePayload {
  title: string;
  description?: string;
  dueDate?: string;
  order?: number;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  sectionId?: string;
  order?: number;
  dueDate?: string;
}

export async function createIssueApi(sectionId: string, payload: CreateIssuePayload): Promise<Issue> {
  return apiClient<Issue>(`/sections/${sectionId}/issues`, {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}

// Alias for capitalization compatibility
export const CreateIssueApi = createIssueApi;

export async function updateIssueApi(issueId: string, payload: UpdateIssuePayload): Promise<Issue> {
  return apiClient<Issue>(`/issues/${issueId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}

export async function deleteIssueApi(issueId: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/issues/${issueId}`, {
    method: "DELETE",
    requiresAuth: true,
  });
}

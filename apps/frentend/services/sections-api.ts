import { apiClient } from "@/lib/api-client";
import { Section } from "@/types/alltypes";

export interface CreateSectionPayload {
  title: string;
  order?: number;
}

export interface UpdateSectionPayload {
  title?: string;
  order?: number;
}

export async function createSectionApi(boardId: string, payload: CreateSectionPayload): Promise<Section> {
  return apiClient<Section>(`/boards/${boardId}/sections`, {
    method: "POST",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}

export async function updateSectionApi(sectionId: string, payload: UpdateSectionPayload): Promise<Section> {
  return apiClient<Section>(`/sections/${sectionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    requiresAuth: true,
  });
}

export async function deleteSectionApi(sectionId: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/sections/${sectionId}`, {
    method: "DELETE",
    requiresAuth: true,
  });
}

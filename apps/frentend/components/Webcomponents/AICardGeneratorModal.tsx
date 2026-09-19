"use client";

import { InsightAISidebar } from "./InsightAISidebar";

interface AICardGeneratorModalProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  orgId?: string;
}

export function AICardGeneratorModal({
  boardId,
  orgId = "",
  isOpen,
  onClose,
}: AICardGeneratorModalProps) {
  if (!isOpen || !orgId) return null;
  return (
    <InsightAISidebar
      orgId={orgId}
      boardId={boardId}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}


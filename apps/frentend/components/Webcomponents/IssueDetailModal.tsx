"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlignLeft,
  Calendar,
  MessageSquare,
  Trash2,
  Send,
  Columns,
} from "lucide-react";

import { Issue, Comment, Section } from "@/types/alltypes";
import { updateIssueApi, deleteIssueApi } from "@/services/issue-api";
import {
  getIssueCommentsApi,
  createCommentApi,
  deleteCommentApi,
} from "@/services/comments-api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";

interface IssueDetailModalProps {
  issue: Issue | null;
  sections: Section[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function IssueDetailModal({
  issue,
  sections,
  isOpen,
  onClose,
  onUpdate,
}: IssueDetailModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");

  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !issue) return;

    setTitle(issue.title);
    setDescription(issue.description || "");
    setSelectedSectionId(issue.sectionId);
    setDueDate(issue.dueDate ? issue.dueDate.split("T")[0] : "");

    const fetchComments = async () => {
      try {
        setIsLoadingComments(true);

        const data = await getIssueCommentsApi(issue.id);

        setComments(data);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load comments");
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [isOpen, issue]);

  const handleSaveDetails = async () => {
    if (!issue) return;

    try {
      setIsSaving(true);

      let isoDueDate: string | undefined = undefined;

      if (dueDate) {
        const parsed = new Date(`${dueDate}T00:00:00`);

        if (!Number.isNaN(parsed.getTime())) {
          isoDueDate = parsed.toISOString();
        }
      }

      await updateIssueApi(issue.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        sectionId: selectedSectionId,
        dueDate: isoDueDate,
      });

      toast.success("Task details saved");
      onUpdate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!issue || !newCommentContent.trim()) return;

    try {
      setIsPostingComment(true);

      await createCommentApi(issue.id, {
        content: newCommentContent.trim(),
      });

      setNewCommentContent("");

      toast.success("Comment added");

      const data = await getIssueCommentsApi(issue.id);
      setComments(data);

      onUpdate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to post comment");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!issue) return;

    try {
      await deleteCommentApi(commentId);

      toast.success("Comment deleted");

      const data = await getIssueCommentsApi(issue.id);
      setComments(data);

      onUpdate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete comment");
    }
  };

  const handleDeleteIssue = async () => {
    if (!issue) return;

    if (!window.confirm("Are you sure you want to delete this card?")) {
      return;
    }

    try {
      await deleteIssueApi(issue.id);

      toast.success("Card deleted");

      onClose();
      onUpdate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete card");
    }
  };

  const handleSectionChange = async (sectionId: string) => {
    if (!issue) return;

    const previousSectionId = selectedSectionId;

    setSelectedSectionId(sectionId);

    try {
      await updateIssueApi(issue.id, {
        sectionId,
      });

      onUpdate();
    } catch (err: any) {
      setSelectedSectionId(previousSectionId);
      toast.error(err?.message || "Failed to move card");
    }
  };

  const handleDueDateChange = async (date: string) => {
    if (!issue) return;

    setDueDate(date);

    try {
      await updateIssueApi(issue.id, {
        dueDate: date || undefined,
      });

      onUpdate();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update due date");
    }
  };

  if (!issue) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl border-zinc-800 bg-zinc-900 text-white max-h-[90vh] overflow-y-auto rounded-[12px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex-1 pr-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveDetails}
              className="h-auto rounded-[6px] border-transparent bg-transparent px-2 py-1 text-xl font-bold text-white hover:border-zinc-700 focus:border-[#ff4f00] focus:bg-zinc-950"
            />
          </div>

          <button
            type="button"
            onClick={handleDeleteIssue}
            title="Delete Card"
            className="cursor-pointer rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-6 md:col-span-2">
            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                <AlignLeft className="h-4 w-4 text-[#ff4f00]" />
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a detailed description for this task..."
                rows={4}
                className="w-full rounded-[6px] border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-[#ff4f00] focus:outline-none"
              />

              <Button
                type="button"
                onClick={handleSaveDetails}
                disabled={isSaving}
                className="h-8 cursor-pointer rounded-[12px] bg-[#ff4f00] px-4 text-xs font-semibold text-[#fffefb] transition-all hover:bg-[#e04500] active:scale-95"
              >
                {isSaving ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  "Save Description"
                )}
              </Button>
            </div>

            {/* Comments */}
            <div className="space-y-4 border-t border-zinc-800 pt-4">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <MessageSquare className="h-4 w-4 text-[#ff4f00]" />
                Activity & Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Write a comment..."
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  className="rounded-[6px] border-zinc-800 bg-zinc-950 text-xs"
                />

                <Button
                  type="submit"
                  disabled={
                    isPostingComment || !newCommentContent.trim()
                  }
                  className="h-9 cursor-pointer rounded-[12px] bg-[#ff4f00] px-3.5 text-xs text-[#fffefb] hover:bg-[#e04500] active:scale-95"
                >
                  {isPostingComment ? (
                    <Spinner className="h-3.5 w-3.5" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </Button>
              </form>

              {/* Comment Feed */}
              {isLoadingComments ? (
                <div className="py-4 text-center">
                  <Spinner className="mx-auto h-5 w-5 text-[#ff4f00]" />
                </div>
              ) : comments.length === 0 ? (
                <p className="py-4 text-center font-mono text-xs text-zinc-500">
                  No comments yet. Start the conversation!
                </p>
              ) : (
                <div className="space-y-3 pt-2">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="group space-y-1.5 rounded-[12px] border border-zinc-800 bg-zinc-950/60 p-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#ff4f00]">
                          {comment.user?.name ||
                            comment.user?.email ||
                            "User"}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500">
                            {new Date(
                              comment.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteComment(comment.id)
                            }
                            title="Delete comment"
                            className="cursor-pointer text-zinc-500 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 border-l border-zinc-800 pl-4">
            {/* Column */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <Columns className="h-3.5 w-3.5 text-zinc-400" />
                List Column
              </label>

              <select
                value={selectedSectionId}
                onChange={(e) =>
                  handleSectionChange(e.target.value)
                }
                className="w-full cursor-pointer rounded-[6px] border border-zinc-800 bg-zinc-950 p-2 text-xs text-white focus:border-[#ff4f00] focus:outline-none"
              >
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Due Date
              </label>

              <Input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  handleDueDateChange(e.target.value)
                }
                className="rounded-[6px] border-zinc-800 bg-zinc-950 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
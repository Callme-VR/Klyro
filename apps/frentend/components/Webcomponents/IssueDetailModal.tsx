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
  if (!issue) return null;

  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description || "");
  const [selectedSectionId, setSelectedSectionId] = useState(issue.sectionId);
  const [dueDate, setDueDate] = useState(
    issue.dueDate ? issue.dueDate.split("T")[0] : ""
  );

  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const data = await getIssueCommentsApi(issue.id);
      setComments(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (isOpen && issue) {
      setTitle(issue.title);
      setDescription(issue.description || "");
      setSelectedSectionId(issue.sectionId);
      setDueDate(issue.dueDate ? issue.dueDate.split("T")[0] : "");
      fetchComments();
    }
  }, [isOpen, issue]);

  const handleSaveDetails = async () => {
    try {
      setIsSaving(true);
      let isoDueDate: string | undefined = undefined;
      if (dueDate) {
        const parsed = new Date(dueDate);
        if (!isNaN(parsed.getTime())) {
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
      toast.error(err.message || "Failed to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    try {
      setIsPostingComment(true);
      await createCommentApi(issue.id, {
        content: newCommentContent.trim(),
      });

      setNewCommentContent("");
      toast.success("Comment added");
      fetchComments();
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to post comment");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentApi(commentId);
      toast.success("Comment deleted");
      fetchComments();
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comment");
    }
  };

  const handleDeleteIssue = async () => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      await deleteIssueApi(issue.id);
      toast.success("Card deleted");
      onClose();
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete card");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl border-zinc-800 bg-zinc-900 text-white max-h-[90vh] overflow-y-auto rounded-[12px]">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex-1 pr-4">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveDetails}
              className="text-xl font-bold bg-transparent border-transparent hover:border-zinc-700 focus:border-[#ff4f00] focus:bg-zinc-950 text-white px-2 py-1 h-auto rounded-[6px]"
            />
          </div>
          <button
            onClick={handleDeleteIssue}
            title="Delete Card"
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Main Left Column (Description & Comments) */}
          <div className="md:col-span-2 space-y-6">
            {/* Description Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
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
                onClick={handleSaveDetails}
                disabled={isSaving}
                className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold text-xs h-8 px-4 rounded-[12px] cursor-pointer active:scale-95 transition-all"
              >
                {isSaving ? <Spinner className="h-3.5 w-3.5" /> : "Save Description"}
              </Button>
            </div>

            {/* Comments Thread Section */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#ff4f00]" />
                Activity & Comments ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Write a comment..."
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 text-xs rounded-[6px]"
                />
                <Button
                  type="submit"
                  disabled={isPostingComment || !newCommentContent.trim()}
                  className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] text-xs h-9 px-3.5 rounded-[12px] cursor-pointer active:scale-95"
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
                  <Spinner className="h-5 w-5 text-[#ff4f00] mx-auto" />
                </div>
              ) : comments.length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono text-center py-4">
                  No comments yet. Start the conversation!
                </p>
              ) : (
                <div className="space-y-3 pt-2">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="group p-3 rounded-[12px] border border-zinc-800 bg-zinc-950/60 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#ff4f00]">
                          {comment.user?.name || comment.user?.email || "User"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500">
                            {new Date(comment.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-300">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Controls (Column Move & Due Date) */}
          <div className="space-y-4 border-l border-zinc-800 pl-4">
            {/* Move Column Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                <Columns className="h-3.5 w-3.5 text-zinc-400" />
                List Column
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => {
                  setSelectedSectionId(e.target.value);
                  updateIssueApi(issue.id, { sectionId: e.target.value }).then(() =>
                    onUpdate()
                  );
                }}
                className="w-full rounded-[6px] border border-zinc-800 bg-zinc-950 p-2 text-xs text-white focus:border-[#ff4f00] focus:outline-none cursor-pointer"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  updateIssueApi(issue.id, { dueDate: e.target.value }).then(() =>
                    onUpdate()
                  );
                }}
                className="bg-zinc-950 border-zinc-800 text-xs text-white rounded-[6px]"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

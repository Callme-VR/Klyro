"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  ArrowLeft,
  Plus,
  Trash2,
  MessageSquare,
  GripVertical,
} from "lucide-react";

import { Board, Section, Issue } from "@/types/alltypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getBoardByIdApi } from "@/services/boards-api";
import {
  createSectionApi,
  updateSectionApi,
  deleteSectionApi,
} from "@/services/sections-api";
import {
  createIssueApi,
  updateIssueApi,
  deleteIssueApi,
} from "@/services/issue-api";
import { calculateNewOrder } from "@/lib/order-utils";
import { IssueDetailModal } from "@/components/Webcomponents/IssueDetailModal";
import UseBoardSocketConnections from "@/hooks/useBoardSocket";
import BoardPresence from "@/components/Webcomponents/BoardPresence";

export default function BoardCanvasPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = (params?.boardId as string) || "";

  const { connected, currentUserId, onlineUsers } = UseBoardSocketConnections(boardId);

  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Inline Section Creation State
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);

  // Inline Issue Creation State
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [newIssueTitle, setNewIssueTitle] = useState("");

  const fetchBoard = async () => {
    if (!boardId) return;
    try {
      setIsLoading(true);
      const data = await getBoardByIdApi(boardId);
      setBoard(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load board");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  // Handle Drag & Drop End Event
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination || !board || !board.sections) return;

    // Dropped in the exact same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // ==========================================
    // 1. REORDER COLUMNS (SECTIONS)
    // ==========================================
    if (type === "COLUMN") {
      const remainingSections = board.sections.filter((s) => s.id !== draggableId);
      const newOrder = calculateNewOrder(remainingSections, destination.index);

      const updatedSections = Array.from(board.sections);
      const [movedSection] = updatedSections.splice(source.index, 1);
      updatedSections.splice(destination.index, 0, movedSection);

      // Optimistic UI Update
      setBoard({
        ...board,
        sections: updatedSections.map((sec) =>
          sec.id === draggableId ? { ...sec, order: newOrder } : sec
        ),
      });

      try {
        await updateSectionApi(draggableId, { order: newOrder });
      } catch (err: any) {
        toast.error("Failed to reorder list");
        fetchBoard(); // Rollback on error
      }
      return;
    }

    // ==========================================
    // 2. REORDER CARDS (ISSUES) ACROSS/WITHIN COLUMNS
    // ==========================================
    const sourceSection = board.sections.find((s) => s.id === source.droppableId);
    const destSection = board.sections.find((s) => s.id === destination.droppableId);

    if (!sourceSection || !destSection) return;

    const sourceIssues = Array.from(sourceSection.issues || []);
    const destIssues =
      source.droppableId === destination.droppableId
        ? sourceIssues
        : Array.from(destSection.issues || []);

    const [movedIssue] = sourceIssues.splice(source.index, 1);

    // Update target section ID if moved across columns
    movedIssue.sectionId = destination.droppableId;
    destIssues.splice(destination.index, 0, movedIssue);

    const newOrder = calculateNewOrder(
      destIssues.filter((i) => i.id !== draggableId),
      destination.index
    );

    // Optimistic Local State Update
    const newSections = board.sections.map((sec) => {
      if (sec.id === source.droppableId && source.droppableId === destination.droppableId) {
        return { ...sec, issues: destIssues };
      }
      if (sec.id === source.droppableId) {
        return { ...sec, issues: sourceIssues };
      }
      if (sec.id === destination.droppableId) {
        return { ...sec, issues: destIssues };
      }
      return sec;
    });

    setBoard({ ...board, sections: newSections });

    try {
      await updateIssueApi(draggableId, {
        sectionId: destination.droppableId,
        order: newOrder,
      });
    } catch (err: any) {
      toast.error("Failed to move card");
      fetchBoard(); // Rollback on error
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    try {
      await createSectionApi(boardId, { title: newSectionTitle.trim() });
      toast.success("List added");
      setNewSectionTitle("");
      setIsAddingSection(false);
      fetchBoard();
    } catch (err: any) {
      toast.error(err.message || "Failed to add list");
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm("Delete this column and all its issues?")) return;
    try {
      await deleteSectionApi(sectionId);
      toast.success("List deleted");
      fetchBoard();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete list");
    }
  };

  const handleCreateIssue = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newIssueTitle.trim()) return;

    try {
      await createIssueApi(sectionId, { title: newIssueTitle.trim() });
      toast.success("Card added");
      setNewIssueTitle("");
      setActiveSectionId(null);
      fetchBoard();
    } catch (err: any) {
      toast.error(err.message || "Failed to add card");
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    try {
      await deleteIssueApi(issueId);
      toast.success("Card deleted");
      fetchBoard();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete card");
    }
  };

  if (isLoading || !isMounted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 flex-1">
        <Spinner className="h-8 w-8 text-blue-500" />
        <p className="text-sm font-mono text-zinc-500">Loading Kanban Canvas...</p>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="text-center py-16 flex-1">
        <h2 className="text-xl font-bold">Board Not Found</h2>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col min-h-0 p-6 transition-colors duration-500 overflow-hidden relative"
      style={{ backgroundColor: board.backgroundColor || "#0079BF" }}
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3.5 bg-black/40 backdrop-blur-xl rounded-[12px] border border-white/15 shadow-xl shrink-0 mb-6 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-[10px] text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 border border-white/10"
            title="Back to Workspace"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tight drop-shadow-md flex items-center gap-2">
              {board.title}
            </h1>
          </div>
        </div>

        {/* Live Real-time WebSocket Presence */}
        <BoardPresence
          connected={connected}
          onlineUsers={onlineUsers}
          currentUserId={currentUserId}
        />
      </div>

      {/* DragDropContext Container */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="relative z-10 flex-1 flex items-start gap-5 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700/50 min-h-0 select-none"
            >
              {board.sections?.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(providedSection, snapshotSection) => (
                    <div
                      ref={providedSection.innerRef}
                      {...providedSection.draggableProps}
                      className={`w-80 shrink-0 rounded-[12px] bg-zinc-900/95 border border-zinc-800/90 text-white shadow-2xl backdrop-blur-xl flex flex-col max-h-full transition-all duration-200 ${snapshotSection.isDragging
                        ? "ring-2 ring-[#ff4f00] shadow-2xl scale-[1.01] bg-zinc-900 z-50"
                        : "hover:border-zinc-700/80"
                        }`}
                    >
                      {/* Column Header & Drag Handle */}
                      <div
                        {...providedSection.dragHandleProps}
                        className="px-4 py-3.5 flex items-center justify-between border-b border-zinc-800/80 cursor-grab active:cursor-grabbing group/header"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GripVertical className="h-4 w-4 text-zinc-500 group-hover/header:text-zinc-300 transition-colors shrink-0" />
                          <h3 className="font-bold text-sm text-zinc-100 truncate tracking-tight">
                            {section.title}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff4f00]/15 text-[#ff4f00] font-mono font-bold border border-[#ff4f00]/30 shrink-0">
                            {section.issues?.length || 0}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer opacity-70 hover:opacity-100"
                          title="Delete List"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Droppable Issue Cards Container */}
                      <Droppable droppableId={section.id} type="CARD">
                        {(providedCards, snapshotCards) => (
                          <div
                            ref={providedCards.innerRef}
                            {...providedCards.droppableProps}
                            className={`p-3.5 space-y-3 overflow-y-auto flex-1 min-h-[120px] scrollbar-thin scrollbar-thumb-zinc-800 rounded-b-[12px] transition-colors ${snapshotCards.isDraggingOver ? "bg-[#ff4f00]/10 ring-1 ring-[#ff4f00]/30 ring-inset" : ""
                              }`}
                          >
                            {section.issues?.map((issue, issueIndex) => (
                              <Draggable
                                key={issue.id}
                                draggableId={issue.id}
                                index={issueIndex}
                              >
                                {(providedIssue, snapshotIssue) => (
                                  <div
                                    ref={providedIssue.innerRef}
                                    {...providedIssue.draggableProps}
                                    {...providedIssue.dragHandleProps}
                                    onClick={() => setSelectedIssue(issue)}
                                    className={`group relative rounded-[12px] border border-zinc-800/90 bg-zinc-950/90 p-3.5 hover:border-[#ff4f00]/60 hover:bg-zinc-900/90 transition-all duration-200 shadow-sm cursor-pointer ${snapshotIssue.isDragging
                                      ? "ring-2 ring-[#ff4f00] rotate-1 shadow-2xl bg-zinc-900 scale-105 z-50"
                                      : "hover:shadow-md hover:-translate-y-0.5"
                                      }`}
                                  >
                                    <p className="text-sm font-medium text-zinc-100 leading-snug break-words">
                                      {issue.title}
                                    </p>

                                    <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-900/80 pt-2.5">
                                      <div className="flex items-center gap-2">
                                        {issue._count?.comments ? (
                                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff4f00]/10 text-[#ff4f00] font-mono text-[10px] border border-[#ff4f00]/30 font-semibold">
                                            <MessageSquare className="h-3 w-3 text-[#ff4f00]" />
                                            {issue._count.comments}
                                          </span>
                                        ) : null}
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteIssue(issue.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                        title="Delete Card"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {providedCards.placeholder}

                            {/* Quick Add Issue Form / Trigger */}
                            {activeSectionId === section.id ? (
                              <form
                                onSubmit={(e) => handleCreateIssue(e, section.id)}
                                className="space-y-2.5 pt-1.5 p-2.5 bg-zinc-950/90 rounded-[12px] border border-zinc-800 shadow-lg"
                              >
                                <Input
                                  type="text"
                                  placeholder="Enter card title..."
                                  value={newIssueTitle}
                                  onChange={(e) => setNewIssueTitle(e.target.value)}
                                  autoFocus
                                  className="bg-zinc-900 border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus-visible:border-[#ff4f00] focus-visible:ring-1 focus-visible:ring-[#ff4f00] rounded-[6px]"
                                />
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="submit"
                                    className="bg-[#ff4f00] hover:bg-[#e04500] text-white text-xs h-7 px-3.5 rounded-[12px] font-semibold shadow-sm transition-all active:scale-95"
                                  >
                                    Add Card
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setActiveSectionId(null)}
                                    className="text-xs h-7 px-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-[12px]"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveSectionId(section.id);
                                  setNewIssueTitle("");
                                }}
                                className="w-full py-2 px-3 text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 rounded-[12px] flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-transparent hover:border-zinc-700/50"
                              >
                                <Plus className="h-3.5 w-3.5 text-[#ff4f00]" /> Add a card
                              </button>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Add New Column List */}
              <div className="w-80 shrink-0">
                {isAddingSection ? (
                  <form
                    onSubmit={handleCreateSection}
                    className="rounded-[12px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 p-3.5 space-y-3 shadow-2xl"
                  >
                    <Input
                      type="text"
                      placeholder="Enter list title..."
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      autoFocus
                      className="bg-zinc-950 border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus-visible:border-[#ff4f00] focus-visible:ring-1 focus-visible:ring-[#ff4f00] rounded-[6px]"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="submit"
                        className="bg-[#ff4f00] hover:bg-[#e04500] text-white text-xs h-8 px-4 rounded-[12px] font-semibold shadow-md shadow-[#ff4f00]/20 transition-all active:scale-95"
                      >
                        Add List
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddingSection(false)}
                        className="text-xs h-8 px-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-[12px]"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingSection(true)}
                    className="w-full p-3.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/15 hover:border-[#ff4f00]/50 text-white rounded-[12px] text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl active:scale-98 group"
                  >
                    <Plus className="h-4 w-4 text-[#ff4f00] group-hover:scale-110 transition-transform" /> Add another list
                  </button>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <IssueDetailModal
        issue={selectedIssue}
        sections={board.sections || []}
        isOpen={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdate={fetchBoard}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Kanban,
  Plus,
  ArrowLeft,
  Users,
  Shield,
  Trash2,
  ExternalLink,
  Layers,
  Check,
} from "lucide-react";

import { getOrgByIdApi, removeOrgMemberApi } from "@/services/org-api";
import { getBoardsApi, createBoardApi, deleteBoardApi } from "@/services/boards-api";
import { Organization, Board } from "@/types/alltypes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InviteModal from "@/components/Webcomponents/InviteMemberModal";

const PRESET_COLORS = [
  { hex: "#ff4f00", name: "Zapier Orange" },
  { hex: "#0079BF", name: "Classic Blue" },
  { hex: "#10b981", name: "Emerald Wave" },
  { hex: "#7c3aed", name: "Deep Violet" },
  { hex: "#0284c7", name: "Ocean Cyan" },
  { hex: "#ec4899", name: "Sunset Pink" },
  { hex: "#d97706", name: "Warm Amber" },
  { hex: "#201515", name: "Coffee Ink" },
];

export default function OrganizationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = (params?.orgId as string) || "";

  const [org, setOrg] = useState<Organization | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"boards" | "members">("boards");

  // Create Board State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ff4f00");
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    if (!orgId) return;
    try {
      setIsLoading(true);
      const [orgData, boardsData] = await Promise.all([
        getOrgByIdApi(orgId),
        getBoardsApi(orgId),
      ]);
      setOrg(orgData);
      setBoards(boardsData);
    } catch (err: any) {
      toast.error(err.message || "Failed to load workspace data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim()) {
      toast.error("Board title is required");
      return;
    }

    try {
      setIsCreating(true);
      const newBoard = await createBoardApi({
        title: boardTitle.trim(),
        organizationId: orgId,
        backgroundColor: selectedColor,
      });

      toast.success(`Board "${newBoard.title}" created successfully!`);
      setBoardTitle("");
      setIsDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create board");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBoard = async (boardId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete board "${title}"?`)) return;

    try {
      await deleteBoardApi(boardId);
      toast.success(`Board "${title}" deleted`);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete board");
    }
  };

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!window.confirm(`Remove ${userName} from workspace?`)) return;
    try {
      await removeOrgMemberApi(orgId, userId);
      toast.success("Member removed");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove member");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner className="h-8 w-8 text-blue-500" />
        <p className="text-sm text-zinc-500 font-mono">Loading Workspace details...</p>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Organization Not Found</h2>
        <Button onClick={() => router.push("/organizations")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Organizations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
      {/* Workspace Header */}
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800 space-y-4">
        <Link
          href="/organizations"
          className="inline-flex items-center text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back to Workspaces
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#ff4f00] text-[#fffefb] font-extrabold text-xl shadow-lg shadow-[#ff4f00]/20">
              {org.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold">{org.name}</h1>
                <Badge variant="outline" className="border-[#ff4f00]/30 text-[#ff4f00] bg-[#ff4f00]/10 font-mono text-xs rounded-full">
                  {org.currentUserRole || org.userRole || org.role || "MEMBER"}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                slug: <span className="font-mono text-[#ff4f00]">/{org.slug}</span> • {org.members?.length || 1} Members
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <InviteModal orgId={org.id} orgname={org.name} />

            {/* Create Board Button Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                render={
                  <Button className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] shadow-md shadow-[#ff4f00]/20 cursor-pointer active:scale-95 transition-all">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create New Board
                  </Button>
                }
              />
              <DialogContent className="border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-[12px] shadow-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold tracking-tight">Create Kanban Board</DialogTitle>
                  <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
                    Add a new board to <span className="font-semibold text-zinc-900 dark:text-zinc-100">{org.name}</span>.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateBoard} className="space-y-5 pt-2">
                  {/* Live Mini Board Card Preview */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Live Card Preview</label>
                    <div
                      className="h-28 rounded-[12px] p-4 flex flex-col justify-between text-white shadow-lg transition-all duration-300 relative overflow-hidden"
                      style={{ backgroundColor: selectedColor }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="font-bold text-sm drop-shadow-md truncate">
                          {boardTitle.trim() || "Untitled Kanban Board"}
                        </span>
                        <div className="h-5 px-2 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-mono font-medium flex items-center">
                          Kanban
                        </div>
                      </div>
                      <div className="relative z-10 flex items-center gap-1.5">
                        <div className="h-2 w-10 rounded-full bg-white/40" />
                        <div className="h-2 w-14 rounded-full bg-white/30" />
                        <div className="h-2 w-8 rounded-full bg-white/20" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Board Title *</label>
                    <Input
                      type="text"
                      placeholder="e.g. Q4 Product Roadmap or Sprint Kanban"
                      value={boardTitle}
                      onChange={(e) => setBoardTitle(e.target.value)}
                      required
                      className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-[6px] focus-visible:border-[#ff4f00] text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Background Theme Accent</label>
                    <div className="grid grid-cols-4 gap-2.5 pt-1">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.hex}
                          type="button"
                          onClick={() => setSelectedColor(color.hex)}
                          className={`h-9 w-full rounded-[8px] border-2 transition-all cursor-pointer flex items-center justify-center relative shadow-xs ${selectedColor === color.hex
                            ? "border-white dark:border-zinc-100 scale-105 shadow-md ring-2 ring-[#ff4f00]"
                            : "border-transparent opacity-85 hover:opacity-100 hover:scale-102"
                            }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {selectedColor === color.hex && (
                            <Check className="h-4 w-4 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="rounded-[12px] border-zinc-300 dark:border-zinc-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] shadow-md shadow-[#ff4f00]/20 cursor-pointer active:scale-95 transition-all"
                    >
                      {isCreating ? <Spinner className="h-4 w-4 text-white" /> : "Create Board"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Boards | Members */}
      <div className="flex items-center gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("boards")}
          className={`text-sm font-bold pb-2 border-b-2 transition cursor-pointer ${activeTab === "boards"
            ? "border-[#ff4f00] text-[#ff4f00]"
            : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
        >
          Workspace Boards ({boards.length})
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`text-sm font-bold pb-2 border-b-2 transition cursor-pointer ${activeTab === "members"
            ? "border-[#ff4f00] text-[#ff4f00]"
            : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
        >
          Members ({org.members?.length || 1})
        </button>
      </div>

      {activeTab === "boards" ? (
        /* Boards Section */
        <div className="space-y-4">
          {boards.length === 0 ? (
            <Card className="border-dashed border-zinc-300 dark:border-zinc-800 bg-[#fffefb]/70 dark:bg-zinc-900/50 p-10 text-center rounded-[12px]">
              <Layers className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold">No Boards Yet</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Create your first Kanban board to start organizing tasks and tracking project workflows.
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold text-xs rounded-[12px] cursor-pointer active:scale-95"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Create Board
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {boards.map((board) => (
                <div
                  key={board.id}
                  className="group relative flex flex-col justify-between rounded-[12px] overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 hover:shadow-xl transition duration-300"
                >
                  {/* Board Color Header Banner */}
                  <div
                    className="h-24 p-4 flex justify-between items-start text-white relative"
                    style={{ backgroundColor: board.backgroundColor || "#0079BF" }}
                  >
                    <h3 className="font-bold text-base drop-shadow-md line-clamp-2">
                      {board.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteBoard(board.id, board.title);
                      }}
                      title="Delete Board"
                      className="opacity-0 group-hover:opacity-100 p-1.5 bg-black/40 hover:bg-red-600 rounded-lg text-white transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Footer link */}
                  <div className="p-4 flex items-center justify-between text-xs border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-400 font-mono">
                      {board.sections?.length || 0} columns
                    </span>
                    <Link
                      href={`/boards/${board.id}`}
                      className="inline-flex items-center font-semibold text-[#ff4f00] hover:underline gap-1"
                    >
                      Open Board
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Members Tab */
        <div className="space-y-4">
          <div className="rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-zinc-500 dark:text-zinc-400">
              <thead className="bg-[#f8f4f0] dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {org.members?.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4f00] text-white font-extrabold text-xs shadow-sm">
                        {(member.user?.name || member.user?.email || "U").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {member.user?.name || "Unnamed User"}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          {member.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="border-[#ff4f00]/30 text-[#ff4f00] bg-[#ff4f00]/10 font-mono text-[10px] rounded-full">
                        {member.role}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleRemoveMember(member.userId, member.user?.name || member.user?.email)}
                        title="Remove Member"
                        className="text-zinc-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Users,
  Kanban,
  FileCheck2,
  X,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { aiApi, WorkspaceInsightResult } from "@/services/ai-api";
import { toast } from "sonner";

interface InsightAISidebarProps {
  orgId: string;
  boardId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InsightAISidebar({
  orgId,
  boardId,
  isOpen,
  onClose,
}: InsightAISidebarProps) {
  const [insight, setInsight] = useState<WorkspaceInsightResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    if (!orgId) return;
    try {
      setLoading(true);
      const data = await aiApi.getInsight({ orgId, boardId });
      setInsight(data);
    } catch (err: any) {
      console.error("[InsightAI Frontend Error]", err);
      toast.error(err.message || "Failed to load InsightAI analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && orgId) {
      fetchInsight();
    }
  }, [isOpen, orgId, boardId]);

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (score >= 60) return "text-[#ff4f00] border-[#ff4f00]/40 bg-[#ff4f00]/10";
    return "text-rose-400 border-rose-500/40 bg-rose-500/10";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#201515] border-l border-zinc-800 text-zinc-100 shadow-2xl flex flex-col justify-between overflow-y-auto rounded-l-[16px]">
          {/* Header */}
          <div>
            <div className="p-6 border-b border-zinc-800/80 bg-[#201515]/90 flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-[12px] bg-[#ff4f00]/15 text-[#ff4f00] border border-[#ff4f00]/30 shadow-inner">
                  <BrainCircuit className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    InsightAI <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff4f00] text-white font-semibold">Gemini 3.5</span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium">
                    {boardId ? "Board Health & Performance" : "Workspace Executive Intelligence"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-6">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-[#ff4f00]/20 border-t-[#ff4f00] animate-spin" />
                    <BrainCircuit className="w-6 h-6 text-[#ff4f00] absolute inset-0 m-auto" />
                  </div>
                  <p className="text-xs text-zinc-400 font-medium animate-pulse">
                    Evaluating organization metrics & task bottlenecks...
                  </p>
                </div>
              ) : insight ? (
                <>
                  {/* Health Score & Stats Grid */}
                  <div className="bg-[#2a1d1d] border border-zinc-800 rounded-[12px] p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[#ff4f00]" />
                        Workspace Health Index
                      </span>
                      <div className={`px-3 py-1 rounded-[9999px] text-xs font-bold border ${getScoreColor(insight.healthScore)} flex items-center gap-1`}>
                        <span>{insight.healthScore} / 100</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80">
                      <div className="p-2.5 rounded-[8px] bg-[#201515] border border-zinc-800 text-center">
                        <div className="text-xs text-zinc-400 flex items-center justify-center gap-1 mb-1">
                          <Kanban className="w-3.5 h-3.5 text-[#ff4f00]" />
                          Boards
                        </div>
                        <div className="text-lg font-bold text-white">{insight.totalBoards}</div>
                      </div>
                      <div className="p-2.5 rounded-[8px] bg-[#201515] border border-zinc-800 text-center">
                        <div className="text-xs text-zinc-400 flex items-center justify-center gap-1 mb-1">
                          <Users className="w-3.5 h-3.5 text-[#ff4f00]" />
                          Members
                        </div>
                        <div className="text-lg font-bold text-white">{insight.totalMembers}</div>
                      </div>
                      <div className="p-2.5 rounded-[8px] bg-[#201515] border border-zinc-800 text-center">
                        <div className="text-xs text-zinc-400 flex items-center justify-center gap-1 mb-1">
                          <FileCheck2 className="w-3.5 h-3.5 text-[#ff4f00]" />
                          Tasks
                        </div>
                        <div className="text-lg font-bold text-white">{insight.totalIssues}</div>
                      </div>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ff4f00]" />
                      Executive Summary
                    </h3>
                    <div className="p-4 rounded-[12px] bg-[#2a1d1d] border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                      {insight.summary}
                    </div>
                  </div>

                  {/* Bottlenecks & Risks */}
                  {insight.bottlenecks && insight.bottlenecks.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Identified Bottlenecks & Risks
                      </h3>
                      <div className="space-y-2">
                        {insight.bottlenecks.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-[12px] bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actionable Recommendations */}
                  {insight.recommendations && insight.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Agile Recommendations
                      </h3>
                      <div className="space-y-2">
                        {insight.recommendations.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-[12px] bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-xs text-zinc-400">
                  No insight analysis available. Click refresh to analyze workspace.
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-zinc-800 bg-[#201515] sticky bottom-0">
            <button
              onClick={fetchInsight}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold text-xs rounded-[12px] transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Analyzing Workspace..." : "Refresh InsightAI Analysis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

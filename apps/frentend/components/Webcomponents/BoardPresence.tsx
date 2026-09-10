"use client";

import { User } from "lucide-react";
import { SocketUser } from "@/hooks/useBoardSocket";

interface BoardPresenceProps {
  connected: boolean;
  onlineUsers: SocketUser[];
  currentUserId: string | null;
}



export default function BoardPresence({
  connected,
  onlineUsers,
  currentUserId
}: BoardPresenceProps) {

  const totalCount = onlineUsers.length + (currentUserId ? 1 : 0);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs shadow-inner">
        <div
          className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-500"
            }`}
        />
        <span className="font-mono text-[11px] text-zinc-200 font-medium">
          {connected ? "Live Sync" : "Disconnected"}
        </span>
      </div>

      {/* online user roster */}
      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-inner">
        <User className="h-3.5 w-3.5 text-zinc-400 mr-1" />

        {currentUserId && (
          <div
            title={`You (${currentUserId})`}
            className="flex h-6 px-2 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold ring-1 ring-blue-400 shadow-sm"
          >
            You
          </div>
        )}

        {onlineUsers.map((user, idx) => (
          <div
            key={user.userId}
            title={`User ${user.userId}`}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-bold ring-1 ring-purple-400 shadow-sm"
          >
            U{idx + 1}
          </div>
        ))}

        <span className="text-[11px] font-mono text-zinc-300 ml-1.5">
          {totalCount} online
        </span>
      </div>
    </div>
  );
}

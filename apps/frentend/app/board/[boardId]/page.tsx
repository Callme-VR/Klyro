"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function LegacyBoardRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = (params?.boardId as string) || "";

  useEffect(() => {
    if (boardId) {
      router.replace(`/boards/${boardId}`);
    } else {
      router.replace("/organizations");
    }
  }, [boardId, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 text-white">
      <Spinner className="h-8 w-8 text-blue-500" />
      <p className="text-sm font-mono text-zinc-400">Redirecting to Board Canvas...</p>
    </div>
  );
}

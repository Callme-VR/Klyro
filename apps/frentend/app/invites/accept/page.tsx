"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Building2 } from "lucide-react";

import { acceptOrgInviteApi } from "@/services/org-api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [isProcessing, setIsProcessing] = useState(true);
  const [successOrgId, setSuccessOrgId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No invitation token provided in URL.");
      setIsProcessing(false);
      return;
    }

    const processInvite = async () => {
      try {
        setIsProcessing(true);
        const result = await acceptOrgInviteApi(token);
        setSuccessOrgId(result.organizationId);
        toast.success("Invitation accepted! Welcome to the workspace.");
      } catch (err: any) {
        setError(err.message || "Invalid or expired invitation token.");
      } finally {
        setIsProcessing(false);
      }
    };

    processInvite();
  }, [token]);

  return (
    <div className="w-full max-w-md rounded-[12px] border border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 p-8 text-center space-y-6 shadow-2xl text-zinc-900 dark:text-white">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#ff4f00]/10 text-[#ff4f00] border border-[#ff4f00]/20">
        <Building2 className="h-8 w-8" />
      </div>

      {isProcessing ? (
        <div className="space-y-3">
          <Spinner className="h-8 w-8 text-[#ff4f00] mx-auto" />
          <h2 className="text-xl font-bold">Accepting Invitation...</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Verifying your token...</p>
        </div>
      ) : successOrgId ? (
        <div className="space-y-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-extrabold">You're In!</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            You have successfully joined the organization workspace.
          </p>
          <Button
            onClick={() => router.push(`/organizations/${successOrgId}`)}
            className="w-full bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold py-2.5 cursor-pointer rounded-[12px] shadow-lg shadow-[#ff4f00]/20 active:scale-95 transition-all"
          >
            Go to Workspace Boards
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Invitation Error</h2>
          <p className="text-xs text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-[6px]">
            {error}
          </p>
          <Button
            onClick={() => router.push("/organizations")}
            className="w-full bg-[#201515] hover:bg-[#2f2a26] font-semibold py-2 cursor-pointer text-[#fffefb] rounded-[12px]"
          >
            Back to Organizations
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 text-zinc-900 dark:text-white">
      <Suspense fallback={<Spinner className="h-8 w-8 text-[#ff4f00] mx-auto" />}>
        <AcceptInviteContent />
      </Suspense>
    </main>
  );
}

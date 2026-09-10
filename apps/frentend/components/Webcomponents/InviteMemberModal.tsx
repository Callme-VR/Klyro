"use client";

import { createOrgInviteApi } from "@/services/org-api";
import React, { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Check, Copy, Mail, UserPlus } from "lucide-react";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";


interface InviteMembermodalProps {
  orgId: string,
  orgname: string
}


export default function InviteModal({
  orgId, orgname
}: InviteMembermodalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setIsEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setIsCopied] = useState(false);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsSubmitting(true);
      const invited = await createOrgInviteApi(orgId, { email: email.trim() })

      const invitedUrl = `${window.location.origin}/invites/accept?token=${invited.token}`

      setGeneratedLink(invitedUrl)
      toast.success(`invites generated succefully for ${email}`)


    } catch (error: any) {
      setError(error.message || "Failed to invite member");

    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink)
    setIsCopied(true);
    toast.success("Invite link copied to clipboard!");

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)

  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="border-[#c5c0b1] dark:border-zinc-700 text-xs rounded-[12px]">
            <UserPlus className="h-3.5 w-3.5 mr-1.5 text-[#ff4f00]" />
            Invite Member
          </Button>
        }
      />

      {/* Content */}
      <DialogContent className="border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-[12px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invite to {orgname}</DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs"> Send an invitation link to add a team member to this workspace </DialogDescription>
        </DialogHeader>
        {!generatedLink ? (
          <form onSubmit={handleSendInvite} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Member Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setIsEmail(e.target.value)}
                  required
                  className="pl-9 bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800 text-xs rounded-[6px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="text-xs rounded-[12px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] text-xs font-semibold rounded-[12px] cursor-pointer active:scale-95"
              >
                {isSubmitting ? <Spinner className="h-3.5 w-3.5" /> : "Generate Link"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="p-3 rounded-[12px] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Share this token link with <span className="font-semibold text-[#ff4f00]">{email}</span>:</p>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={generatedLink}
                  className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-800 text-[11px] font-mono rounded-[6px]"
                />
                <Button
                  onClick={handleCopyLink}
                  className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] shrink-0 rounded-[12px] active:scale-95"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setGeneratedLink(null);
                  setIsEmail("");
                  setIsOpen(false);
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-[#fffefb] text-xs rounded-[12px]"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

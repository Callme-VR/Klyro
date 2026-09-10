"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Building2, Plus, ArrowRight, Users, Trash2 } from "lucide-react";

import { getUserOrgsApi, createOrgApi, deleteOrgApi } from "@/services/org-api";
import { Organization } from "@/types/alltypes";
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

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [orgDescription, setOrgDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const fetchOrgs = async () => {
    try {
      setIsLoading(true);
      const data = await getUserOrgsApi();
      setOrganizations(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load organizations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleNameChange = (val: string) => {
    setOrgName(val);
    if (!isSlugEdited) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setOrgSlug(generated);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) {
      toast.error("Organization name is required");
      return;
    }

    const computedSlug = (orgSlug.trim() || orgName.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!computedSlug || computedSlug.length < 2) {
      toast.error("Organization slug must be at least 2 characters long");
      return;
    }

    try {
      setIsCreating(true);
      const newOrg = await createOrgApi({
        name: orgName.trim(),
        slug: computedSlug,
        description: orgDescription.trim() || undefined,
      });
      toast.success(`Organization "${newOrg.name}" created!`);
      setOrgName("");
      setOrgSlug("");
      setIsSlugEdited(false);
      setOrgDescription("");
      setIsDialogOpen(false);
      fetchOrgs();
    } catch (err: any) {
      toast.error(err.message || "Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteOrg = async (orgId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete organization "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteOrgApi(orgId);
      toast.success(`Organization "${name}" deleted`);
      fetchOrgs();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete organization");
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Organizations</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your collaborative workspaces and team boards
          </p>
        </div>

        {/* Create Organization Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] shadow-md shadow-[#ff4f00]/20 cursor-pointer active:scale-95 transition-all">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Organization
              </Button>
            }
          />
          <DialogContent className="border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-[12px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create New Organization</DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                Set up a new workspace for your team and boards.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateOrg} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Organization Name *</label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Corp or Dev Team"
                  value={orgName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 rounded-[6px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Workspace Slug (URL Identifier) *</label>
                <Input
                  type="text"
                  placeholder="e.g. acme-corp"
                  value={orgSlug}
                  onChange={(e) => {
                    setOrgSlug(e.target.value);
                    setIsSlugEdited(true);
                  }}
                  required
                  className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 font-mono text-xs rounded-[6px]"
                />
                <p className="text-[11px] text-zinc-500">Lowercase letters, numbers, and hyphens only.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Description (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g. Engineering & Product Design Team"
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  className="border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 rounded-[6px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-zinc-300 dark:border-zinc-700 rounded-[12px] cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] cursor-pointer active:scale-95"
                >
                  {isCreating ? <Spinner className="h-4 w-4" /> : "Create Workspace"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Spinner className="h-8 w-8 text-[#ff4f00]" />
          <p className="text-sm text-zinc-500 font-mono">Loading workspaces...</p>
        </div>
      ) : organizations.length === 0 ? (
        /* Empty State */
        <Card className="border-dashed border-zinc-300 dark:border-zinc-800 bg-[#fffefb]/70 dark:bg-zinc-900/50 p-12 text-center rounded-[12px]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[12px] bg-[#ff4f00]/10 text-[#ff4f00] border border-[#ff4f00]/20">
            <Building2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold">No Organizations Found</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            You don&apos;t belong to any organization yet. Create your first workspace to start collaborating!
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="mt-6 bg-[#ff4f00] hover:bg-[#e04500] text-[#fffefb] font-semibold rounded-[12px] cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Your First Organization
          </Button>
        </Card>
      ) : (
        /* Organizations Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => {
            const currentRole = org.role || org.userRole || "OWNER";
            return (
              <Card
                key={org.id}
                className="border-zinc-200 dark:border-zinc-800 bg-[#fffefb] dark:bg-zinc-900 hover:border-[#ff4f00]/50 transition-all duration-300 shadow-md group rounded-[12px]"
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ff4f00]/15 border border-[#ff4f00]/30 text-[#ff4f00] font-extrabold text-sm">
                      {org.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-[#ff4f00]/30 text-[#ff4f00] bg-[#ff4f00]/10 text-[10px] font-mono rounded-full">
                        {currentRole}
                      </Badge>
                      {currentRole === "OWNER" && (
                        <button
                          onClick={() => handleDeleteOrg(org.id, org.name)}
                          title="Delete Organization"
                          className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#ff4f00] transition">
                    {org.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {org.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2 flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{org.members?.length || 1} Member(s)</span>
                  </div>
                  <Link
                    href={`/organizations/${org.id}`}
                    className="flex items-center gap-1 font-semibold text-[#ff4f00] hover:underline"
                  >
                    View Boards
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

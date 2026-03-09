import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useClaimAdminIfFirst,
  useDeleteApplication,
  useGetApplications,
  useIsCallerAdmin,
  useUpdateApplicationStatus,
} from "@/hooks/useQueries";
import { LoanStatus } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { toast } from "sonner";
import type { LoanApplication } from "../backend.d";

/* ─── Format nanosecond timestamp ─── */
function formatDate(ns: bigint): string {
  try {
    const ms = Number(ns / BigInt(1_000_000));
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(ms));
  } catch {
    return "N/A";
  }
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: LoanStatus }) {
  if (status === LoanStatus.approved) {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 gap-1 px-2 py-0.5 text-xs font-semibold">
        <CheckCircle2 className="w-3 h-3" />
        Approved
      </Badge>
    );
  }
  if (status === LoanStatus.rejected) {
    return (
      <Badge className="bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/20 gap-1 px-2 py-0.5 text-xs font-semibold">
        <XCircle className="w-3 h-3" />
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 gap-1 px-2 py-0.5 text-xs font-semibold">
      <AlertCircle className="w-3 h-3" />
      Pending
    </Badge>
  );
}

/* ─── Login prompt ─── */
function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-card border border-border rounded-3xl p-10 max-w-md w-full text-center shadow-deep"
      >
        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-gold" />
        </div>
        <h1 className="font-display text-2xl font-black mb-3">Admin Access</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          This area is restricted to authorized administrators only. Sign in
          with your Internet Identity to continue.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="admin.primary_button"
          className="w-full h-12 bg-gold text-primary-foreground hover:bg-gold-light font-semibold rounded-xl"
        >
          {isLoggingIn ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Signing In...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In with Internet Identity
            </span>
          )}
        </Button>
        <Link to="/" className="block mt-4">
          <Button
            variant="ghost"
            size="sm"
            data-ocid="nav.link"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

/* ─── Access denied (admin seat already taken) ─── */
function AccessDenied() {
  const { clear } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-card border border-border rounded-3xl p-10 max-w-md w-full text-center shadow-deep"
      >
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-black mb-3">Access Denied</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          The admin seat for this site has already been claimed by another
          account. Only one administrator is allowed.
        </p>
        <div className="flex flex-col gap-2">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              data-ocid="nav.link"
              className="text-muted-foreground hover:text-foreground w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            data-ocid="admin.secondary_button"
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Delete confirmation dialog ─── */
function DeleteDialog({
  open,
  appName,
  onConfirm,
  onCancel,
  isPending,
}: {
  open: boolean;
  appName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        data-ocid="admin.delete.dialog"
        className="gradient-card border border-border rounded-2xl"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display font-bold">
            Delete Application?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            This will permanently delete{" "}
            <span className="text-foreground font-semibold">{appName}</span>'s
            loan application. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-ocid="admin.delete.cancel_button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-xl"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="admin.delete.confirm_button"
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ─── Admin dashboard ─── */
function AdminDashboard() {
  const { clear, identity } = useInternetIdentity();
  const {
    data: applications,
    isLoading,
    isError,
    refetch,
  } = useGetApplications();

  const updateStatus = useUpdateApplicationStatus();
  const deleteApp = useDeleteApplication();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LoanStatus>("all");
  const [deleteTarget, setDeleteTarget] = useState<LoanApplication | null>(
    null,
  );

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-5)}`
    : "";

  /* ─── Stats ─── */
  const total = applications?.length ?? 0;
  const pendingCount =
    applications?.filter((a) => a.status === LoanStatus.pending).length ?? 0;
  const approvedCount =
    applications?.filter((a) => a.status === LoanStatus.approved).length ?? 0;
  const rejectedCount =
    applications?.filter((a) => a.status === LoanStatus.rejected).length ?? 0;

  /* ─── Filtered list ─── */
  const filtered = (applications ?? []).filter((app) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      app.name.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.whatsapp.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* ─── Action handlers ─── */
  function handleApprove(app: LoanApplication) {
    updateStatus.mutate(
      { id: app.id, newStatus: LoanStatus.approved },
      {
        onSuccess: () => toast.success(`${app.name}'s application approved`),
        onError: () => toast.error("Failed to approve application"),
      },
    );
  }

  function handleReject(app: LoanApplication) {
    updateStatus.mutate(
      { id: app.id, newStatus: LoanStatus.rejected },
      {
        onSuccess: () => toast.success(`${app.name}'s application rejected`),
        onError: () => toast.error("Failed to reject application"),
      },
    );
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    deleteApp.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`${name}'s application deleted`);
        setDeleteTarget(null);
      },
      onError: () => {
        toast.error("Failed to delete application");
        setDeleteTarget(null);
      },
    });
  }

  /* ─── Pending IDs for per-row loading ─── */
  const pendingStatusId = updateStatus.isPending
    ? updateStatus.variables?.id
    : undefined;
  const pendingDeleteId = deleteApp.isPending ? deleteApp.variables : undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" data-ocid="nav.link">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Site
              </Button>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
                <span className="text-xs font-display font-black text-primary-foreground">
                  IL
                </span>
              </div>
              <span className="font-display font-bold text-sm">
                Invest<span className="text-gold">Loan</span>
                <span className="text-muted-foreground font-normal ml-2">
                  Admin
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {shortPrincipal && (
              <span className="text-xs text-muted-foreground font-mono hidden sm:block">
                {shortPrincipal}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="gap-2 text-xs"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-foreground gap-2 text-xs"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-gold" />
            </div>
            <h1 className="font-display text-3xl font-black">
              Loan Applications
            </h1>
          </div>
          <p className="text-muted-foreground text-sm ml-13">
            View, approve, reject, and manage all submitted loan applications.
          </p>
        </motion.div>

        {/* Stats bar */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
          >
            <div className="gradient-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Total Applications
              </p>
              <p className="font-display text-2xl font-black text-gold">
                {total}
              </p>
            </div>
            <div className="gradient-card border border-amber-500/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Pending</p>
              <p className="font-display text-2xl font-black text-amber-400">
                {pendingCount}
              </p>
            </div>
            <div className="gradient-card border border-emerald-500/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Approved</p>
              <p className="font-display text-2xl font-black text-emerald-400">
                {approvedCount}
              </p>
            </div>
            <div className="gradient-card border border-red-500/20 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Rejected</p>
              <p className="font-display text-2xl font-black text-red-400">
                {rejectedCount}
              </p>
            </div>
          </motion.div>
        )}

        {/* Search + filter toolbar */}
        {!isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="admin.search_input"
                placeholder="Search by name, email, or WhatsApp..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-card border-border text-sm rounded-xl"
              />
            </div>
            <Tabs
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | LoanStatus)}
            >
              <TabsList className="bg-card border border-border h-9 rounded-xl p-1">
                <TabsTrigger
                  value="all"
                  data-ocid="admin.filter.tab"
                  className="rounded-lg text-xs h-7 px-3"
                >
                  All ({total})
                </TabsTrigger>
                <TabsTrigger
                  value={LoanStatus.pending}
                  data-ocid="admin.filter.tab"
                  className="rounded-lg text-xs h-7 px-3"
                >
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger
                  value={LoanStatus.approved}
                  data-ocid="admin.filter.tab"
                  className="rounded-lg text-xs h-7 px-3"
                >
                  Approved ({approvedCount})
                </TabsTrigger>
                <TabsTrigger
                  value={LoanStatus.rejected}
                  data-ocid="admin.filter.tab"
                  className="rounded-lg text-xs h-7 px-3"
                >
                  Rejected ({rejectedCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        )}

        {/* Table card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-card border border-border rounded-2xl overflow-hidden"
        >
          {/* Loading */}
          {isLoading && (
            <div data-ocid="admin.loading_state" className="p-8 space-y-3">
              {["sk1", "sk2", "sk3", "sk4", "sk5"].map((key) => (
                <Skeleton key={key} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div data-ocid="admin.error_state" className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="font-semibold mb-2">
                Failed to load applications
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                There was an error fetching the application data. Please try
                again.
              </p>
              <Button
                variant="outline"
                onClick={() => void refetch()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}

          {/* Empty — no applications at all */}
          {!isLoading &&
            !isError &&
            applications &&
            applications.length === 0 && (
              <div data-ocid="admin.empty_state" className="p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">
                  No Applications Yet
                </h3>
                <p className="text-muted-foreground text-sm">
                  Loan applications will appear here once submitted through the
                  public site.
                </p>
              </div>
            )}

          {/* Empty — filter produced no results */}
          {!isLoading &&
            !isError &&
            applications &&
            applications.length > 0 &&
            filtered.length === 0 && (
              <div data-ocid="admin.empty_state" className="p-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">
                  No Matching Applications
                </h3>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </div>
            )}

          {/* Table */}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-muted-foreground w-10">
                      #
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Full Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      WhatsApp
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Loan Amount
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Purpose
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground">
                      Submitted
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((app: LoanApplication, i: number) => {
                    const rowNum = i + 1;
                    const isStatusPending =
                      updateStatus.isPending && pendingStatusId === app.id;
                    const isDeletePending =
                      deleteApp.isPending && pendingDeleteId === app.id;
                    const isRowBusy = isStatusPending || isDeletePending;

                    return (
                      <TableRow
                        key={app.id.toString()}
                        data-ocid="admin.row"
                        className="border-b border-border/50 hover:bg-accent/20 transition-colors"
                      >
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {rowNum}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {app.name}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-green-bright">
                          {app.whatsapp}
                        </TableCell>
                        <TableCell className="text-sm text-gold">
                          {app.email}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold">
                            {app.loanAmount}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-40">
                          <span className="line-clamp-2">{app.purpose}</span>
                        </TableCell>
                        <TableCell>
                          {isStatusPending ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : (
                            <StatusBadge status={app.status} />
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(app.submittedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Approve */}
                            <Button
                              size="sm"
                              variant="outline"
                              data-ocid={`admin.approve.button.${rowNum}`}
                              disabled={
                                isRowBusy || app.status === LoanStatus.approved
                              }
                              onClick={() => handleApprove(app)}
                              className="h-7 px-2.5 text-xs rounded-lg border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/60 disabled:opacity-40 gap-1"
                            >
                              {isStatusPending &&
                              updateStatus.variables?.newStatus ===
                                LoanStatus.approved ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              Approve
                            </Button>
                            {/* Reject */}
                            <Button
                              size="sm"
                              variant="outline"
                              data-ocid={`admin.reject.button.${rowNum}`}
                              disabled={
                                isRowBusy || app.status === LoanStatus.rejected
                              }
                              onClick={() => handleReject(app)}
                              className="h-7 px-2.5 text-xs rounded-lg border-amber-500/40 text-amber-400 hover:bg-amber-500/15 hover:text-amber-300 hover:border-amber-500/60 disabled:opacity-40 gap-1"
                            >
                              {isStatusPending &&
                              updateStatus.variables?.newStatus ===
                                LoanStatus.rejected ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              Reject
                            </Button>
                            {/* Delete */}
                            <Button
                              size="sm"
                              variant="outline"
                              data-ocid={`admin.delete.button.${rowNum}`}
                              disabled={isRowBusy}
                              onClick={() => setDeleteTarget(app)}
                              className="h-7 px-2 text-xs rounded-lg border-red-500/40 text-red-400 hover:bg-red-500/15 hover:text-red-300 hover:border-red-500/60 disabled:opacity-40"
                            >
                              {isDeletePending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>

        {/* Result count */}
        {!isLoading && !isError && applications && applications.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4 text-right">
            Showing {filtered.length} of {total} application
            {total !== 1 ? "s" : ""}
          </p>
        )}
      </main>

      {/* Delete confirmation dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        appName={deleteTarget?.name ?? ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteApp.isPending}
      />
    </div>
  );
}

/* ─── Auto-claim gate (logged in but not yet admin) ─── */
function AutoClaimGate() {
  const claimAdminIfFirst = useClaimAdminIfFirst();

  const mutateRef = useRef(claimAdminIfFirst.mutate);
  useEffect(() => {
    mutateRef.current();
  }, []);

  if (claimAdminIfFirst.isPending || claimAdminIfFirst.isIdle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">
            Setting up admin access...
          </p>
        </div>
      </div>
    );
  }

  if (claimAdminIfFirst.isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div data-ocid="admin.error_state" className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">
            Something went wrong. Please refresh and try again.
          </p>
        </div>
      </div>
    );
  }

  // data === false means admin seat is already taken
  if (claimAdminIfFirst.data === false) {
    return <AccessDenied />;
  }

  // data === true: admin was just claimed; query invalidation in the hook
  // will trigger re-render of AdminPage which will now show AdminDashboard
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div
        data-ocid="admin.loading_state"
        className="flex flex-col items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">
          Setting up admin access...
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────── ADMIN PAGE ─────────────────────────── */
export default function AdminPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  // Still initializing auth
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading authentication...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!identity) {
    return <LoginPrompt />;
  }

  // Checking admin status
  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  // Not yet admin — automatically attempt to claim
  if (!isAdmin) {
    return <AutoClaimGate />;
  }

  // Admin dashboard
  return <AdminDashboard />;
}

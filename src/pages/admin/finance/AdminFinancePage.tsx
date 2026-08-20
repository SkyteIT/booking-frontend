import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SegmentedTabs from "../../../components/common/SegmentedTabs";
import { useAuth } from "../../../context/useAuth";
import {
  approvePayoutExport,
  computePayoutBatch,
  computeVendorInvoice,
  createCommissionOverride,
  createLoyaltyTier,
  deleteLoyaltyTier,
  getAllVendors,
  getInvoicesForVendor,
  getLoyaltyTiers,
  getOverridesForVendor,
  getPayoutBatchesForVendor,
  getPayoutExportThreshold,
  getPendingPayoutExports,
  markInvoiceOverdue,
  markInvoicePaid,
  processOverdueInvoices,
  requestPayoutExport,
  revokeCommissionOverride,
  rejectPayoutExport,
  seniorApprovePayoutExport,
  settlePayoutBatch,
  updateLoyaltyTier,
  type AdminVendorSummaryDto,
  type LoyaltyDiscountTierDto,
  type PayoutBatchDto,
  type PayoutExportRunDto,
  type VendorCommissionOverrideDto,
  type VendorInvoiceDto,
} from "../../../services/Admin/financeService";

const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return "Something went wrong.";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return (data as { message?: string }).message ?? "Something went wrong.";
  }
  return "Something went wrong.";
};

const todayIso = () => new Date().toISOString().slice(0, 10);
const monthAgoIso = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};

function StatusChip({ status }: { status: string }) {
  const color =
    status === "Settled" || status === "Paid" || status === "Approved" || status === "Active"
      ? "success"
      : status === "Overdue" || status === "Rejected" || status === "Revoked"
        ? "error"
        : "warning";
  return <Chip size="small" label={status} color={color} />;
}

export default function AdminFinancePage() {
  const [vendors, setVendors] = useState<AdminVendorSummaryDto[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<AdminVendorSummaryDto | null>(null);
  const [tab, setTab] = useState<"payouts" | "invoices" | "commission">("payouts");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const { user } = useAuth();
  const role = String(user?.role ?? "").toLowerCase();
  // Admin can view every screen here (customer/vendor support needs the
  // context), but only Finance (and SuperAdmin, whose token also carries
  // the Finance claim) can actually move money - every compute/settle/
  // approve/mark-paid/override action is hidden, not just 403'd, for a
  // plain Admin.
  const canManageFinance = role === "finance" || role === "superadmin";

  useEffect(() => {
    getAllVendors()
      .then(setVendors)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setVendorsLoading(false));
  }, []);

  const showError = (err: unknown) => setError(getApiErrorMessage(err));
  const showNotice = (msg: string) => {
    setNotice(msg);
    setError("");
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
      >
        Finance &amp; Payments
      </Typography>
      <Typography color="text.secondary" mt={0.5} mb={3}>
        Payout batches, vendor invoices, and commission policy across all vendors.
      </Typography>

      <Autocomplete
        options={vendors}
        loading={vendorsLoading}
        getOptionLabel={(v) => `${v.businessName} (${v.ownerEmail})`}
        value={selectedVendor}
        onChange={(_, v) => setSelectedVendor(v)}
        isOptionEqualToValue={(a, b) => a.vendorProfileId === b.vendorProfileId}
        sx={{ maxWidth: 480, mb: 3 }}
        renderInput={(params) => <TextField {...params} label="Select a vendor" placeholder="Search by business name..." />}
      />

      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert severity="success" onClose={() => setNotice("")} sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <SegmentedTabs
          options={["payouts", "invoices", "commission"] as const}
          value={tab}
          labels={{ payouts: "Payout Batches", invoices: "Vendor Invoices", commission: "Commission Policy" }}
          onChange={setTab}
        />
      </Box>

      {!canManageFinance && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You have view-only access here. Computing, settling, approving, or overriding anything
          requires the Finance role.
        </Alert>
      )}

      {tab === "payouts" && (
        <PayoutBatchesTab vendor={selectedVendor} canManage={canManageFinance} onError={showError} onNotice={showNotice} />
      )}
      {tab === "invoices" && (
        <VendorInvoicesTab vendor={selectedVendor} canManage={canManageFinance} onError={showError} onNotice={showNotice} />
      )}
      {tab === "commission" && (
        <CommissionPolicyTab vendor={selectedVendor} canManage={canManageFinance} onError={showError} onNotice={showNotice} />
      )}
    </Box>
  );
}

type TabProps = {
  vendor: AdminVendorSummaryDto | null;
  canManage: boolean;
  onError: (err: unknown) => void;
  onNotice: (msg: string) => void;
};

function VendorRequiredNotice() {
  return (
    <Alert severity="info" sx={{ maxWidth: 480 }}>
      Select a vendor above to view or compute their payout batches.
    </Alert>
  );
}

// ── Payout Batches ─────────────────────────────────────────────────────────
function PayoutBatchesTab({ vendor, canManage, onError, onNotice }: TabProps) {
  const [batches, setBatches] = useState<PayoutBatchDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodStart, setPeriodStart] = useState(monthAgoIso());
  const [periodEnd, setPeriodEnd] = useState(todayIso());
  const [busy, setBusy] = useState(false);

  const { user } = useAuth();
  const currentUserId = user?.userId ?? user?.id ?? null;

  const [threshold, setThreshold] = useState<number | null>(null);
  const [exportRuns, setExportRuns] = useState<PayoutExportRunDto[]>([]);
  const [exportRunsLoading, setExportRunsLoading] = useState(true);
  const [exportBusy, setExportBusy] = useState(false);

  const loadBatches = (vendorProfileId: string) => {
    setLoading(true);
    getPayoutBatchesForVendor(vendorProfileId)
      .then(setBatches)
      .catch(onError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (vendor) loadBatches(vendor.vendorProfileId);
    else setBatches([]);
  }, [vendor]);

  useEffect(() => {
    getPayoutExportThreshold()
      .then((t) => setThreshold(t.largeExportThreshold))
      .catch(() => setThreshold(null));
  }, []);

  // Any admin can discover a run someone else started - not just the
  // browser session that requested it - so this loads from the server
  // instead of relying on local state left over from a "request" click.
  const loadExportRuns = () => {
    setExportRunsLoading(true);
    getPendingPayoutExports()
      .then(setExportRuns)
      .catch(onError)
      .finally(() => setExportRunsLoading(false));
  };

  useEffect(() => {
    loadExportRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCompute = async () => {
    if (!vendor) return;
    setBusy(true);
    try {
      await computePayoutBatch({ vendorProfileId: vendor.vendorProfileId, periodStart, periodEnd });
      onNotice("Payout batch computed.");
      loadBatches(vendor.vendorProfileId);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleSettle = async (id: string) => {
    if (!vendor) return;
    setBusy(true);
    try {
      await settlePayoutBatch(id);
      onNotice("Payout batch settled.");
      loadBatches(vendor.vendorProfileId);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleRequestExport = async () => {
    setExportBusy(true);
    try {
      await requestPayoutExport();
      onNotice("Export requested — needs approval from a different admin.");
      loadExportRuns();
    } catch (err) {
      onError(err);
    } finally {
      setExportBusy(false);
    }
  };

  const handleApproveExport = async (runId: string) => {
    setExportBusy(true);
    try {
      const result = await approvePayoutExport(runId);
      if (result.fileDownloaded) {
        onNotice("Export approved — CSV downloaded.");
      } else {
        onNotice("Approved — total is over the threshold, a senior (third) admin must approve before download.");
      }
      loadExportRuns();
    } catch (err) {
      onError(err);
    } finally {
      setExportBusy(false);
    }
  };

  const handleSeniorApproveExport = async (runId: string) => {
    setExportBusy(true);
    try {
      const blob = await seniorApprovePayoutExport(runId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `payout-export-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      onNotice("Senior approval granted — CSV downloaded.");
      loadExportRuns();
    } catch (err) {
      onError(err);
    } finally {
      setExportBusy(false);
    }
  };

  const handleRejectExport = async (runId: string) => {
    setExportBusy(true);
    try {
      await rejectPayoutExport(runId);
      onNotice("Export run rejected.");
      loadExportRuns();
    } catch (err) {
      onError(err);
    } finally {
      setExportBusy(false);
    }
  };

  return (
    <Stack spacing={4}>
      <Box>
        {!vendor ? (
          <VendorRequiredNotice />
        ) : (
          <>
            {canManage && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
                  Compute a new payout batch for {vendor.businessName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" mb={3}>
                  <TextField
                    label="Period start"
                    type="date"
                    size="small"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Period end"
                    type="date"
                    size="small"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button variant="contained" disabled={busy} onClick={handleCompute}>
                    Compute batch
                  </Button>
                </Stack>
              </>
            )}

            {loading ? (
              <CircularProgress size={24} />
            ) : batches.length === 0 ? (
              <Typography color="text.secondary">No payout batches for this vendor yet.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {batches.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>
                          {new Date(b.periodStart).toLocaleDateString()} – {new Date(b.periodEnd).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">{b.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusChip status={b.status} />
                        </TableCell>
                        <TableCell align="right">
                          {canManage && b.status === "Pending" && (
                            <Button size="small" disabled={busy} onClick={() => handleSettle(b.id)}>
                              Settle
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Payout export (maker-checker)
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Locks every settled-eligible batch into one export run. Requires approval from a different
          admin than whoever requested it — and a third admin if the total is over the threshold
          {threshold != null ? ` (${threshold.toFixed(2)})` : ""}.
        </Typography>
        {canManage && (
          <Button variant="outlined" disabled={exportBusy} onClick={handleRequestExport} sx={{ mb: 2 }}>
            Request export
          </Button>
        )}

        {exportRunsLoading ? (
          <CircularProgress size={20} />
        ) : exportRuns.length === 0 ? (
          <Typography color="text.secondary">No export runs awaiting approval.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {exportRuns.map((run) => {
              const isRequester = currentUserId === run.requestedByUserId;
              const isFirstApprover = currentUserId === run.approvedByUserId;

              // Maker-checker: whoever requested (or, at the senior stage,
              // also whoever gave the first approval) cannot act on their
              // own run - the backend enforces this too (403), this just
              // keeps the button from being shown to someone it'll reject.
              const canAct =
                run.status === "PendingApproval"
                  ? !isRequester
                  : !isRequester && !isFirstApprover;

              return (
                <Stack
                  key={run.id}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                >
                  <StatusChip status={run.status} />
                  <Typography variant="body2">Total: {run.totalAmount.toFixed(2)}</Typography>
                  {canManage && canAct ? (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={exportBusy}
                        onClick={() =>
                          run.status === "PendingSeniorApproval"
                            ? handleSeniorApproveExport(run.id)
                            : handleApproveExport(run.id)
                        }
                      >
                        {run.status === "PendingSeniorApproval" ? "Senior approve" : "Approve"}
                      </Button>
                      <Button size="small" color="error" disabled={exportBusy} onClick={() => handleRejectExport(run.id)}>
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      {run.status === "PendingSeniorApproval"
                        ? "Waiting for a third admin to give senior approval."
                        : "Waiting for a different admin to approve."}
                    </Typography>
                  )}
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

// ── Vendor Invoices ────────────────────────────────────────────────────────
function VendorInvoicesTab({ vendor, canManage, onError, onNotice }: TabProps) {
  const [invoices, setInvoices] = useState<VendorInvoiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodStart, setPeriodStart] = useState(monthAgoIso());
  const [periodEnd, setPeriodEnd] = useState(todayIso());
  const [gracePeriodDays, setGracePeriodDays] = useState(14);
  const [busy, setBusy] = useState(false);

  const loadInvoices = (vendorProfileId: string) => {
    setLoading(true);
    getInvoicesForVendor(vendorProfileId)
      .then(setInvoices)
      .catch(onError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (vendor) loadInvoices(vendor.vendorProfileId);
    else setInvoices([]);
  }, [vendor]);

  const handleCompute = async () => {
    if (!vendor) return;
    setBusy(true);
    try {
      await computeVendorInvoice({ vendorProfileId: vendor.vendorProfileId, periodStart, periodEnd, gracePeriodDays });
      onNotice("Vendor invoice computed.");
      loadInvoices(vendor.vendorProfileId);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (!vendor) return;
    setBusy(true);
    try {
      await markInvoicePaid(id);
      onNotice("Invoice marked paid.");
      loadInvoices(vendor.vendorProfileId);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleMarkOverdue = async (id: string) => {
    if (!vendor) return;
    setBusy(true);
    try {
      await markInvoiceOverdue(id);
      onNotice("Invoice marked overdue - vendor account suspended until paid.");
      loadInvoices(vendor.vendorProfileId);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleProcessOverdueSweep = async () => {
    setBusy(true);
    try {
      const result = await processOverdueInvoices();
      onNotice(`Overdue sweep complete — ${result.length} invoice(s) flagged.`);
      if (vendor) loadInvoices(vendor.vendorProfileId);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack spacing={4}>
      {canManage && (
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Overdue sweep (all vendors)
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1.5}>
            Flags every pending invoice past its due date as Overdue and suspends that vendor's
            account until paid. There's no scheduler yet, so this runs on demand.
          </Typography>
          <Button variant="outlined" color="warning" disabled={busy} onClick={handleProcessOverdueSweep}>
            Run overdue sweep now
          </Button>
        </Box>
      )}

      {canManage && <Divider />}

      <Box>
        {!vendor ? (
          <VendorRequiredNotice />
        ) : (
          <>
            {canManage && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
                  Compute a new commission invoice for {vendor.businessName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" mb={3}>
                  <TextField
                    label="Period start"
                    type="date"
                    size="small"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Period end"
                    type="date"
                    size="small"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Grace period (days)"
                    type="number"
                    size="small"
                    sx={{ width: 160 }}
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(Number(e.target.value) || 0)}
                  />
                  <Button variant="contained" disabled={busy} onClick={handleCompute}>
                    Compute invoice
                  </Button>
                </Stack>
              </>
            )}

            {loading ? (
              <CircularProgress size={24} />
            ) : invoices.length === 0 ? (
              <Typography color="text.secondary">No invoices for this vendor yet.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell align="right">Amount owed</TableCell>
                      <TableCell>Due date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>
                          {new Date(inv.periodStart).toLocaleDateString()} – {new Date(inv.periodEnd).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">{inv.amountOwed.toFixed(2)}</TableCell>
                        <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <StatusChip status={inv.status} />
                        </TableCell>
                        <TableCell align="right">
                          {canManage && inv.status === "Pending" && (
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button size="small" disabled={busy} onClick={() => handleMarkPaid(inv.id)}>
                                Mark paid
                              </Button>
                              <Button size="small" color="warning" disabled={busy} onClick={() => handleMarkOverdue(inv.id)}>
                                Mark overdue
                              </Button>
                            </Stack>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>
    </Stack>
  );
}

// ── Commission Policy ──────────────────────────────────────────────────────
function CommissionPolicyTab({ vendor, canManage, onError, onNotice }: TabProps) {
  const [overrides, setOverrides] = useState<VendorCommissionOverrideDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(10);
  const [startDate, setStartDate] = useState(todayIso());
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const [tiers, setTiers] = useState<LoyaltyDiscountTierDto[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [newTierMonths, setNewTierMonths] = useState(6);
  const [newTierPercent, setNewTierPercent] = useState(5);

  const loadOverrides = (vendorProfileId: string) => {
    setLoading(true);
    getOverridesForVendor(vendorProfileId)
      .then(setOverrides)
      .catch(onError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (vendor) loadOverrides(vendor.vendorProfileId);
    else setOverrides([]);
  }, [vendor]);

  const loadTiers = () => {
    setTiersLoading(true);
    getLoyaltyTiers()
      .then(setTiers)
      .catch(onError)
      .finally(() => setTiersLoading(false));
  };

  useEffect(() => {
    loadTiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateOverride = async () => {
    if (!vendor || !reason.trim()) return;
    setBusy(true);
    try {
      await createCommissionOverride({
        vendorProfileId: vendor.vendorProfileId,
        commissionPercent: percent,
        startDate,
        reason: reason.trim(),
      });
      onNotice("Commission override created.");
      setReason("");
      loadOverrides(vendor.vendorProfileId);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!vendor) return;
    setBusy(true);
    try {
      await revokeCommissionOverride(id);
      onNotice("Override revoked.");
      loadOverrides(vendor.vendorProfileId);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleCreateTier = async () => {
    setBusy(true);
    try {
      await createLoyaltyTier({ monthsActive: newTierMonths, discountPercent: newTierPercent });
      onNotice("Loyalty tier created.");
      loadTiers();
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateTier = async (id: string, discountPercent: number) => {
    setBusy(true);
    try {
      await updateLoyaltyTier(id, discountPercent);
      onNotice("Loyalty tier updated.");
      loadTiers();
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteTier = async (id: string) => {
    setBusy(true);
    try {
      await deleteLoyaltyTier(id);
      onNotice("Loyalty tier deleted.");
      loadTiers();
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack spacing={4}>
      <Box>
        {!vendor ? (
          <VendorRequiredNotice />
        ) : (
          <>
            {canManage && (
              <>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
                  Commission override for {vendor.businessName}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="flex-start" flexWrap="wrap" mb={3}>
                  <TextField
                    label="Commission %"
                    type="number"
                    size="small"
                    sx={{ width: 140 }}
                    value={percent}
                    onChange={(e) => setPercent(Number(e.target.value) || 0)}
                  />
                  <TextField
                    label="Start date"
                    type="date"
                    size="small"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Reason"
                    size="small"
                    sx={{ minWidth: 240 }}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <Button variant="contained" disabled={busy || !reason.trim()} onClick={handleCreateOverride}>
                    Create override
                  </Button>
                </Stack>
              </>
            )}

            {loading ? (
              <CircularProgress size={24} />
            ) : overrides.length === 0 ? (
              <Typography color="text.secondary">No commission overrides for this vendor.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Commission %</TableCell>
                      <TableCell>Start</TableCell>
                      <TableCell>End</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overrides.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>{o.commissionPercent}%</TableCell>
                        <TableCell>{new Date(o.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{o.endDate ? new Date(o.endDate).toLocaleDateString() : "—"}</TableCell>
                        <TableCell>{o.reason}</TableCell>
                        <TableCell>
                          <StatusChip status={o.status} />
                        </TableCell>
                        <TableCell align="right">
                          {canManage && o.status === "Active" && (
                            <Button size="small" color="warning" disabled={busy} onClick={() => handleRevoke(o.id)}>
                              Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
          Loyalty discount tiers (platform-wide)
        </Typography>
        {canManage && (
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" mb={2}>
            <TextField
              label="Months active"
              type="number"
              size="small"
              sx={{ width: 160 }}
              value={newTierMonths}
              onChange={(e) => setNewTierMonths(Number(e.target.value) || 0)}
            />
            <TextField
              label="Discount %"
              type="number"
              size="small"
              sx={{ width: 140 }}
              value={newTierPercent}
              onChange={(e) => setNewTierPercent(Number(e.target.value) || 0)}
            />
            <Button variant="contained" disabled={busy} onClick={handleCreateTier}>
              Add tier
            </Button>
          </Stack>
        )}

        {tiersLoading ? (
          <CircularProgress size={24} />
        ) : tiers.length === 0 ? (
          <Typography color="text.secondary">No loyalty tiers configured.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Months active</TableCell>
                  <TableCell>Discount %</TableCell>
                  {canManage && <TableCell align="right">Action</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {tiers.map((t) => (
                  <TierRow key={t.id} tier={t} busy={busy} canManage={canManage} onUpdate={handleUpdateTier} onDelete={handleDeleteTier} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Stack>
  );
}

function TierRow({
  tier,
  busy,
  canManage,
  onUpdate,
  onDelete,
}: {
  tier: LoyaltyDiscountTierDto;
  busy: boolean;
  canManage: boolean;
  onUpdate: (id: string, discountPercent: number) => void;
  onDelete: (id: string) => void;
}) {
  const [percent, setPercent] = useState(tier.discountPercent);
  const dirty = useMemo(() => percent !== tier.discountPercent, [percent, tier.discountPercent]);

  return (
    <TableRow>
      <TableCell>{tier.monthsActive}</TableCell>
      <TableCell>
        {canManage ? (
          <TextField
            type="number"
            size="small"
            sx={{ width: 100 }}
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value) || 0)}
          />
        ) : (
          `${tier.discountPercent}%`
        )}
      </TableCell>
      {canManage && (
        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {dirty && (
              <Button size="small" disabled={busy} onClick={() => onUpdate(tier.id, percent)}>
                Save
              </Button>
            )}
            <Button size="small" color="error" disabled={busy} onClick={() => onDelete(tier.id)}>
              Delete
            </Button>
          </Stack>
        </TableCell>
      )}
    </TableRow>
  );
}

import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  TextField,
  Grid,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import SegmentedTabs from "../../../components/common/SegmentedTabs";
import StatCard from "../../../components/Vendor/Dashboard/StatCard";
import { getVendorListings } from "../../../services/Vendor/listingService";
import {
  getLedger,
  getPayoutBatches,
  getCommissionAcknowledgements,
  acknowledgeCommissionRate,
  getDisputes,
  getVendorEarnings,
  exportRevenueReportCsv,
  type LedgerEntry,
  type PayoutBatchDto,
  type CommissionAcknowledgementDto,
  type PaymentDisputeDto,
  type VendorEarningsDto,
  type ReportGranularity,
} from "../../../services/Vendor/payoutsService";

const TABS = ["Earnings", "Commission", "Disputes"] as const;

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);
const defaultStartDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return toDateInputValue(d);
};
const defaultEndDate = () => toDateInputValue(new Date());

const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "LKR" }).format(amount);

const chipColor = (bg: string, color: string) => ({
  bgcolor: bg,
  color,
  fontWeight: 600,
});

const directionChipSx = (direction: "Credit" | "Debit") =>
  direction === "Credit" ? chipColor("#D1FAE5", "#059669") : chipColor("#FEE2E2", "#DC2626");

const payoutStatusSx = (status: PayoutBatchDto["status"]) => {
  switch (status) {
    case "Settled":
      return chipColor("#D1FAE5", "#059669");
    case "Exported":
      return chipColor("#DBEAFE", "#1D4ED8");
    case "Processing":
      return chipColor("#FEF3C7", "#D97706");
    default:
      return chipColor("#E5E7EB", "#6B7280");
  }
};

const disputeStatusSx = (status: PaymentDisputeDto["status"]) => {
  switch (status) {
    case "Won":
      return chipColor("#D1FAE5", "#059669");
    case "Opened":
      return chipColor("#FEF3C7", "#D97706");
    case "Lost":
      return chipColor("#FEE2E2", "#DC2626");
    default:
      return chipColor("#E5E7EB", "#6B7280");
  }
};

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
      }}
    >
      <CardContent sx={{ pt: 2, pb: 2.5 }}>{children}</CardContent>
    </Card>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <Box
      sx={(t) => ({
        p: 2,
        mb: 2,
        borderRadius: 2,
        bgcolor: alpha(t.palette.error.main, 0.08),
        border: `1px solid ${alpha(t.palette.error.main, 0.2)}`,
      })}
    >
      <Typography variant="body2" sx={{ color: "error.main", fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
}

function CommissionTab() {
  const [categories, setCategories] = useState<{ id: string; name: string }[] | null>(null);
  const [history, setHistory] = useState<CommissionAcknowledgementDto[] | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [checking, setChecking] = useState(false);
  const [lastResult, setLastResult] = useState<CommissionAcknowledgementDto | null>(null);
  const [error, setError] = useState("");

  const loadHistory = useCallback(() => {
    getCommissionAcknowledgements()
      .then(setHistory)
      .catch(() => setError("Failed to load commission history."));
  }, []);

  useEffect(() => {
    getVendorListings()
      .then((listings) => {
        const unique = new Map<string, string>();
        listings.forEach((l) => unique.set(l.categoryId, l.categoryName));
        const options = Array.from(unique, ([id, name]) => ({ id, name }));
        setCategories(options);
        if (options.length > 0) setSelectedCategoryId(options[0].id);
      })
      .catch(() => setError("Failed to load your listing categories."));
    loadHistory();
  }, [loadHistory]);

  const handleAcknowledge = async () => {
    if (!selectedCategoryId) return;
    setChecking(true);
    setError("");
    try {
      const result = await acknowledgeCommissionRate(selectedCategoryId);
      setLastResult(result);
      loadHistory();
    } catch {
      setError("Failed to fetch the current commission rate.");
    } finally {
      setChecking(false);
    }
  };

  if (error) return <ErrorBanner message={error} />;
  if (categories === null || history === null) return <LoadingSpinner fullScreen={false} size={28} py={2} />;

  if (categories.length === 0) {
    return <EmptyState label="You don't have any listings yet, so there's no category to check a commission rate for." />;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="commission-category-label">Category</InputLabel>
          <Select
            labelId="commission-category-label"
            label="Category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleAcknowledge}
          disabled={checking}
          sx={{ borderRadius: "999px" }}
        >
          {checking ? "Checking…" : "View & Acknowledge Current Rate"}
        </Button>
      </Stack>

      {lastResult && (
        <Alert severity="success">
          Current commission rate: <strong>{lastResult.commissionPercentShown}%</strong> — acknowledged{" "}
          {formatDate(lastResult.acknowledgedAt)}.
        </Alert>
      )}

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Acknowledgement history
        </Typography>
        {history.length === 0 ? (
          <EmptyState label="No commission rate has been acknowledged yet." />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Acknowledged</TableCell>
                  <TableCell align="right">Rate shown</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{formatDate(h.acknowledgedAt)}</TableCell>
                    <TableCell align="right">{h.commissionPercentShown}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Stack>
  );
}

function DisputesTab() {
  const [disputes, setDisputes] = useState<PaymentDisputeDto[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDisputes()
      .then(setDisputes)
      .catch(() => setError("Failed to load disputes."));
  }, []);

  if (error) return <ErrorBanner message={error} />;
  if (disputes === null) return <LoadingSpinner fullScreen={false} size={28} py={2} />;
  if (disputes.length === 0) return <EmptyState label="No disputes on your bookings." />;

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Opened</TableCell>
            <TableCell>Resolved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {disputes.map((d) => (
            <TableRow key={d.id}>
              <TableCell align="right">{formatMoney(d.amount)}</TableCell>
              <TableCell>{d.reason}</TableCell>
              <TableCell>
                <Chip size="small" label={d.status} sx={disputeStatusSx(d.status)} />
              </TableCell>
              <TableCell>{formatDate(d.openedAt)}</TableCell>
              <TableCell>{formatDate(d.resolvedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// A single money figure in "Your Money" row - deliberately not StatCard
// (that's used below for the KPI row instead): larger, plainer, built to
// read as a running total (Gross - Commission - Refunds = Net).
function MoneyTile({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "negative" | "positive";
}) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(15,27,45,0.06)",
        background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
        flex: 1,
        minWidth: 180,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mt: 0.5,
            fontWeight: 700,
            letterSpacing: -0.2,
            color: tone === "negative" ? "error.main" : tone === "positive" ? "success.main" : "text.primary",
          }}
        >
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function EarningsTab() {
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [granularity, setGranularity] = useState<ReportGranularity>("Daily");
  const [data, setData] = useState<VendorEarningsDto | null>(null);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[] | null>(null);
  const [ledgerError, setLedgerError] = useState("");
  const [payoutBatches, setPayoutBatches] = useState<PayoutBatchDto[] | null>(null);
  const [payoutError, setPayoutError] = useState("");

  const reportParams = { startDate, endDate, granularity };

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError("");
    getVendorEarnings(reportParams)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load earnings.");
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, granularity]);

  // Ledger + payout history: whole-history detail tables underneath the
  // date-ranged summary above, loaded once - not affected by the date
  // range picker (that only scopes the aggregated numbers).
  useEffect(() => {
    getLedger()
      .then(setLedgerEntries)
      .catch(() => setLedgerError("Failed to load ledger."));
    getPayoutBatches()
      .then(setPayoutBatches)
      .catch(() => setPayoutError("Failed to load payout history."));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportRevenueReportCsv(reportParams);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to export revenue report.");
    } finally {
      setExporting(false);
    }
  };

  const periodLabel = (iso: string) => {
    const date = new Date(iso);
    if (granularity === "Monthly") {
      return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    }
    if (granularity === "Weekly") {
      const weekEnd = new Date(date);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${formatDate(iso)} – ${formatDate(weekEnd.toISOString())}`;
    }
    return formatDate(iso);
  };

  return (
    <Stack spacing={4}>
      {/* Date range + granularity + export */}
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <TextField
          label="Start date"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="End date"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="report-granularity-label">Granularity</InputLabel>
          <Select
            labelId="report-granularity-label"
            label="Granularity"
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as ReportGranularity)}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          disabled={exporting || !data || data.revenueTrend.length === 0}
          sx={{ ml: "auto", borderRadius: "999px" }}
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </Button>
      </Stack>

      {error ? (
        <ErrorBanner message={error} />
      ) : data === null ? (
        <LoadingSpinner fullScreen={false} size={28} py={2} />
      ) : (
        <>
          {/* "Your Money" - the literal gross vs UBE's cut vs net breakdown */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Your Money
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <MoneyTile label="Gross Revenue" value={formatMoney(data.breakdown.grossRevenue)} sub="What customers paid" />
              <MoneyTile
                label="Platform Commission"
                value={`-${formatMoney(data.breakdown.platformCommission)}`}
                sub="Owed to UBE"
                tone="negative"
              />
              <MoneyTile
                label="Refunds"
                value={`-${formatMoney(data.breakdown.refunds)}`}
                tone="negative"
              />
              <MoneyTile label="Net Earnings" value={formatMoney(data.breakdown.netEarnings)} sub="Yours, after UBE's cut" tone="positive" />
            </Stack>
          </Box>

          {/* KPI row */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard title="Total Bookings" value={String(data.totalBookings)} icon={<EventAvailableOutlinedIcon />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard title="Avg. Booking Value" value={formatMoney(data.averageBookingValue)} icon={<MonetizationOnOutlinedIcon />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Revenue Change"
                value={`${data.revenueChangePercent >= 0 ? "+" : ""}${data.revenueChangePercent.toFixed(1)}%`}
                icon={data.revenueChangePercent >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                helperText="vs previous period"
              />
            </Grid>
          </Grid>

          {/* Top listings - the money each listing/business brought in this
              period. Revenue trend and booking-status charts already live
              on the main Dashboard page, not duplicated here. */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Top Listings
            </Typography>
            {data.topListings.length === 0 ? (
              <EmptyState label="No confirmed or completed bookings in this date range." />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Listing</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Bookings</TableCell>
                      <TableCell align="right">Avg. per Booking</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.topListings.map((l) => (
                      <TableRow key={l.listingId}>
                        <TableCell>{l.listingTitle}</TableCell>
                        <TableCell align="right">{formatMoney(l.grossRevenue)}</TableCell>
                        <TableCell align="right">{l.bookingCount}</TableCell>
                        <TableCell align="right">
                          {formatMoney(l.bookingCount > 0 ? l.grossRevenue / l.bookingCount : 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          {/* Detail: period-by-period revenue table (the raw numbers behind Export CSV) */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Revenue Detail
            </Typography>
            {data.revenueTrend.length === 0 ? (
              <EmptyState label="No revenue in this date range." />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell align="right">Net Revenue</TableCell>
                      <TableCell align="right">Bookings</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.revenueTrend.map((p) => (
                      <TableRow key={p.periodStart}>
                        <TableCell>{periodLabel(p.periodStart)}</TableCell>
                        <TableCell align="right">{formatMoney(p.netRevenue)}</TableCell>
                        <TableCell align="right">{p.bookingCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </>
      )}

      {/* Every transaction behind these numbers */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          Transaction Ledger
        </Typography>
        {ledgerError ? (
          <ErrorBanner message={ledgerError} />
        ) : ledgerEntries === null ? (
          <LoadingSpinner fullScreen={false} size={28} py={2} />
        ) : ledgerEntries.length === 0 ? (
          <EmptyState label="No ledger entries yet." />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Direction</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Booking</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ledgerEntries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{formatDate(e.createdAt)}</TableCell>
                    <TableCell>{e.entryType}</TableCell>
                    <TableCell>
                      <Chip size="small" label={e.direction} sx={directionChipSx(e.direction)} />
                    </TableCell>
                    <TableCell align="right">{formatMoney(e.amount)}</TableCell>
                    <TableCell>{e.bookingNumber ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* When UBE actually settled money to your bank */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          Payout History
        </Typography>
        {payoutError ? (
          <ErrorBanner message={payoutError} />
        ) : payoutBatches === null ? (
          <LoadingSpinner fullScreen={false} size={28} py={2} />
        ) : payoutBatches.length === 0 ? (
          <EmptyState label="No payout batches yet." />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Settled</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payoutBatches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      {formatDate(b.periodStart)} – {formatDate(b.periodEnd)}
                    </TableCell>
                    <TableCell align="right">{formatMoney(b.totalAmount)}</TableCell>
                    <TableCell>
                      <Chip size="small" label={b.status} sx={payoutStatusSx(b.status)} />
                    </TableCell>
                    <TableCell>{formatDate(b.settledAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Stack>
  );
}

export default function Payouts() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Earnings");

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
          }}
        >
          Earnings
          <Box component="span" sx={{ width: 8, height: 8, borderRadius: "3px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your money - what customers paid, what UBE takes, what's yours - plus commission rate and disputes
        </Typography>
      </Box>

      <SectionCard>
        <Box sx={{ mb: 2 }}>
          <SegmentedTabs options={TABS} value={tab} onChange={setTab} />
        </Box>

        {tab === "Earnings" && <EarningsTab />}
        {tab === "Commission" && <CommissionTab />}
        {tab === "Disputes" && <DisputesTab />}
      </SectionCard>
    </Stack>
  );
}

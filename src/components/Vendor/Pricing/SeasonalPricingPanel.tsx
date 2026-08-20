import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  createSeasonalRule,
  deleteSeasonalRule,
  getSeasonalRules,
  type SeasonalPricingRuleDto,
  type SeasonalRateAdjustmentType,
} from "../../../services/Vendor/seasonalPricingService";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

type Props = {
  listingId: string | null;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const emptyForm = {
  name: "",
  startDate: "",
  endDate: "",
  adjustmentType: "PercentageAdjustment" as SeasonalRateAdjustmentType,
  adjustmentValue: "",
};

export default function SeasonalPricingPanel({ listingId, onError, onSuccess }: Props) {
  const [rules, setRules] = useState<SeasonalPricingRuleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    try {
      const data = await getSeasonalRules(listingId);
      setRules(data);
    } catch (err) {
      onError(getApiErrorMessage(err, "Failed to load seasonal pricing rules."));
    } finally {
      setLoading(false);
    }
  }, [listingId, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!listingId) return;
    if (!form.name.trim() || !form.startDate || !form.endDate || !form.adjustmentValue) {
      onError("Please fill in name, start date, end date, and adjustment value.");
      return;
    }
    setSaving(true);
    try {
      await createSeasonalRule(listingId, {
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        adjustmentType: form.adjustmentType,
        adjustmentValue: Number(form.adjustmentValue),
      });
      onSuccess("Seasonal rate rule created.");
      setForm(emptyForm);
      await load();
    } catch (err) {
      onError(getApiErrorMessage(err, "Failed to create seasonal rate rule."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ruleId: string) => {
    if (!listingId) return;
    try {
      await deleteSeasonalRule(listingId, ruleId);
      onSuccess("Seasonal rate rule removed.");
      await load();
    } catch (err) {
      onError(getApiErrorMessage(err, "Failed to remove seasonal rate rule."));
    }
  };

  if (!listingId) {
    return <Typography color="text.secondary">Select a listing to manage its seasonal pricing.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Define named date-range rate adjustments — e.g. "Peak Season" at +30%, or "Off-Season" at
        -15%. Only applies to per-night / per-day listings; date ranges for the same listing can't
        overlap.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr auto auto auto" },
          gap: 1.5,
          alignItems: "flex-start",
        }}
      >
        <TextField
          label="Name"
          size="small"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <TextField
          label="Start date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={form.startDate}
          onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
        />
        <TextField
          label="End date"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={form.endDate}
          onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
        />
        <TextField
          select
          label="Type"
          size="small"
          value={form.adjustmentType}
          onChange={(e) => setForm((f) => ({ ...f, adjustmentType: e.target.value as SeasonalRateAdjustmentType }))}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="PercentageAdjustment">Percentage</MenuItem>
          <MenuItem value="FixedRate">Fixed rate</MenuItem>
        </TextField>
        <TextField
          label={form.adjustmentType === "PercentageAdjustment" ? "Percent (+/-)" : "Nightly rate"}
          type="number"
          size="small"
          value={form.adjustmentValue}
          onChange={(e) => setForm((f) => ({ ...f, adjustmentValue: e.target.value }))}
          sx={{ maxWidth: 140 }}
        />
        <Button variant="contained" disabled={saving} onClick={handleCreate} sx={{ textTransform: "none", borderRadius: "999px" }}>
          {saving ? "Adding..." : "Add rule"}
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Dates</TableCell>
            <TableCell>Adjustment</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">Loading...</TableCell>
            </TableRow>
          ) : rules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No seasonal rate rules yet.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rules.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.startDate} &ndash; {r.endDate}</TableCell>
                <TableCell>
                  {r.adjustmentType === "PercentageAdjustment"
                    ? `${r.adjustmentValue > 0 ? "+" : ""}${r.adjustmentValue}%`
                    : `Fixed ${r.adjustmentValue}`}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Stack>
  );
}

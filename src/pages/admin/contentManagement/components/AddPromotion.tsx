// src/pages/admin/contentManagement/components/AddPromotion.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Chip,
  InputAdornment,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useNavigate } from "react-router-dom";
import { createPromotion } from "../services/contentService";

const CATEGORIES = ["All Categories", "Hotels", "Car Rentals", "Activities", "Restaurants", "Event Tickets"];

const cardStyle = {
  p: 3,
  borderRadius: 3,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

function generateCode(prefix = "PROMO") {
  return `${prefix}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export default function AddPromotion() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    code: "",
    type: "Percentage" as "Percentage" | "Fixed Amount",
    value: "",
    usageLimitEnabled: true,
    usageLimit: "100",
    minOrderAmount: "",
    applicableCategory: "All Categories",
    startDate: "",
    endDate: "",
    status: true,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.code.trim()) newErrors.code = "Promo code is required";
    if (!form.value || Number(form.value) <= 0) newErrors.value = "Enter a valid discount value";
    if (form.type === "Percentage" && Number(form.value) > 100)
      newErrors.value = "Percentage cannot exceed 100%";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      newErrors.endDate = "End date must be after start date";
    if (form.usageLimitEnabled && (!form.usageLimit || Number(form.usageLimit) < 1))
      newErrors.usageLimit = "Enter a valid usage limit";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await createPromotion({
        code: form.code,
        promotionType: form.type === "Percentage" ? 0 : 1,
        discountValue: Number(form.value),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        usageLimit: form.usageLimitEnabled ? Number(form.usageLimit) : undefined,
      });
      navigate("/admin/content");
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        setErrors((prev) => ({
          ...prev,
          code: `Promo code "${form.code}" already exists. Please use a different code.`,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          code: err?.response?.data?.message || err?.response?.data?.error || "Failed to save. Please try again.",
        }));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/admin/content");

  const previewValue =
    form.value
      ? form.type === "Percentage"
        ? `${form.value}%`
        : `$${form.value}`
      : "—";

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleCancel} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>Add New Promotion</Typography>
            <Typography variant="body2" color="text.secondary">
              Create a promo code for discounts and campaigns
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ bgcolor: "#0077B6", "&:hover": { bgcolor: "#005A8D" } }}
          >
            {saving ? "Saving..." : "Save Promotion"}
          </Button>
        </Box>
      </Box>

      {/* TWO-COLUMN GRID */}
      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 2, alignItems: "start" }}>

        {/* ── LEFT COLUMN ── */}
        <Box display="flex" flexDirection="column" gap={2}>

          {/* 1. Promo Code */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e3f0fb", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <LocalOfferIcon sx={{ fontSize: 20, color: "#0077B6" }} />
              </Box>
              <Typography fontWeight={600}>1. Promo Code</Typography>
            </Box>

            <Box display="flex" gap={1} alignItems="flex-start">
              <TextField
                label="Promo Code"
                placeholder="e.g., SUMMER50"
                fullWidth
                required
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                error={!!errors.code}
                helperText={errors.code || "Customers will enter this at checkout"}
                inputProps={{ style: { fontWeight: 700, letterSpacing: 2 } }}
              />
              <Button
                variant="outlined"
                onClick={() => handleChange("code", generateCode())}
                sx={{ mt: 0.5, whiteSpace: "nowrap", height: 56 }}
                startIcon={<AddCircleOutlineIcon />}
              >
                Generate
              </Button>
            </Box>

            <TextField
              label="Description (optional)"
              placeholder="Brief note about this promotion for internal reference"
              fullWidth
              multiline
              rows={2}
              sx={{ mt: 2 }}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Paper>

          {/* 2. Discount Type & Value */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e8f5e9", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={20}>💰</Typography>
              </Box>
              <Typography fontWeight={600}>2. Discount Type & Value</Typography>
            </Box>

            <Box display="flex" gap={1} mb={2}>
              {(["Percentage", "Fixed Amount"] as const).map((t) => (
                <Button
                  key={t}
                  variant={form.type === t ? "contained" : "outlined"}
                  onClick={() => handleChange("type", t)}
                  sx={{
                    flex: 1,
                    bgcolor: form.type === t ? "#0077B6" : "transparent",
                    "&:hover": { bgcolor: form.type === t ? "#005A8D" : undefined },
                  }}
                >
                  {t === "Percentage" ? "Percentage (%)" : "Fixed Amount ($)"}
                </Button>
              ))}
            </Box>

            <TextField
              label={form.type === "Percentage" ? "Discount Percentage" : "Discount Amount"}
              type="number"
              fullWidth
              required
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              error={!!errors.value}
              helperText={errors.value}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {form.type === "Percentage" ? "%" : "$"}
                  </InputAdornment>
                ),
              }}
              inputProps={{ min: 0, max: form.type === "Percentage" ? 100 : undefined }}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Minimum Order Amount (optional)"
              type="number"
              fullWidth
              value={form.minOrderAmount}
              onChange={(e) => handleChange("minOrderAmount", e.target.value)}
              helperText="Promo applies only if cart total exceeds this amount"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0 }}
            />
          </Paper>

          {/* 3. Applicable Category */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fff3e0", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={20}>🗂️</Typography>
              </Box>
              <Typography fontWeight={600}>3. Applicable Category</Typography>
            </Box>

            <TextField
              label="Category"
              select
              fullWidth
              value={form.applicableCategory}
              onChange={(e) => handleChange("applicableCategory", e.target.value)}
              helperText="Restrict this promo to a specific booking category, or apply to all"
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Paper>

          {/* 4. Usage Limit */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fce4ec", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={20}>🔢</Typography>
              </Box>
              <Typography fontWeight={600}>4. Usage Limit</Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.usageLimitEnabled}
                  onChange={(e) => handleChange("usageLimitEnabled", e.target.checked)}
                />
              }
              label="Limit total number of uses"
              sx={{ mb: 2 }}
            />

            {form.usageLimitEnabled && (
              <TextField
                label="Maximum Uses"
                type="number"
                fullWidth
                value={form.usageLimit}
                onChange={(e) => handleChange("usageLimit", e.target.value)}
                error={!!errors.usageLimit}
                helperText={errors.usageLimit || "Total number of times this code can be redeemed"}
                inputProps={{ min: 1 }}
              />
            )}

            {!form.usageLimitEnabled && (
              <Box sx={{ p: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                <Typography fontSize={13} color="#1565c0">
                  This promo code can be used an unlimited number of times.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* 5. Validity Period */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#ede7f6", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={20}>📅</Typography>
              </Box>
              <Typography fontWeight={600}>5. Validity Period</Typography>
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                error={!!errors.startDate}
                helperText={errors.startDate}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={form.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            </Box>
          </Paper>
        </Box>

        {/* ── RIGHT COLUMN ── */}
        <Box display="flex" flexDirection="column" gap={2}>

          {/* Status */}
          <Paper sx={cardStyle}>
            <Typography fontWeight={600} mb={2}>Status</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={form.status}
                  onChange={(e) => handleChange("status", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077B6" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077B6" },
                  }}
                />
              }
              label={form.status ? "Active" : "Draft"}
            />
            <Box
              sx={{
                mt: 1.5,
                p: 2,
                borderRadius: 2,
                bgcolor: form.status ? "#e6f4ea" : "#f5f5f5",
                border: `1px solid ${form.status ? "#c8e6c9" : "#e0e0e0"}`,
              }}
            >
              <Typography fontSize={13} color={form.status ? "#2e7d32" : "#757575"}>
                {form.status
                  ? "Promo code is active and can be redeemed by customers"
                  : "Saved as draft — not yet available to customers"}
              </Typography>
            </Box>
          </Paper>

          {/* Live Preview */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #0077B6, #00B4D8)",
              color: "#fff",
            }}
          >
            <Typography fontWeight={600} mb={2}>Promo Preview</Typography>

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 2 }} />

            {[
              { label: "Code", value: form.code || "—" },
              { label: "Discount", value: previewValue },
              { label: "Type", value: form.type },
              { label: "Category", value: form.applicableCategory || "—" },
              {
                label: "Usage limit",
                value: form.usageLimitEnabled ? (form.usageLimit || "—") : "Unlimited",
              },
              {
                label: "Valid",
                value:
                  form.startDate && form.endDate
                    ? `${form.startDate} → ${form.endDate}`
                    : "—",
              },
            ].map(({ label, value }) => (
              <Box key={label} display="flex" justifyContent="space-between" mb={1}>
                <Typography fontSize={13} sx={{ opacity: 0.8 }}>{label}</Typography>
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  sx={{
                    maxWidth: 130,
                    textAlign: "right",
                    wordBreak: "break-word",
                    ...(label === "Code" ? { letterSpacing: 1.5, fontFamily: "monospace" } : {}),
                  }}
                >
                  {value}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mt: 1, mb: 2 }} />

            <Chip
              label={form.status ? "Active" : "Draft"}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.25)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 11,
              }}
            />
          </Paper>

          {/* Tips */}
          <Paper sx={{ ...cardStyle, bgcolor: "#fff8e1", border: "1px solid #ffe082" }}>
            <Typography fontWeight={600} mb={1} fontSize={14}>💡 Tips</Typography>
            <Typography fontSize={12} color="text.secondary" lineHeight={1.8}>
              • Use uppercase codes like SUMMER50 — easier to type<br />
              • Set a usage limit to create urgency<br />
              • Always set an end date to auto-expire promotions<br />
              • Test the code before sharing it publicly
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
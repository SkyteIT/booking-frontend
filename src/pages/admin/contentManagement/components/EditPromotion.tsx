// src/pages/admin/contentManagement/components/EditPromotion.tsx
import { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Paper, MenuItem,
  FormControlLabel, Switch, IconButton, Chip, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useNavigate, useParams } from "react-router-dom";
import { getPromotionById, updatePromotion } from "../services/contentService";

const cardStyle = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,27,45,0.06)",
  background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
};

interface EditPromotionProps {
  promotionId?: string;
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
}

export default function EditPromotion({ promotionId, open, onClose, onSaved }: EditPromotionProps) {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = promotionId ?? params.id ?? "";

  const [form, setForm] = useState({
    code: "",
    type: "Percentage" as "Percentage" | "Fixed Amount",
    value: "",
    usageLimitEnabled: true,
    usageLimit: "100",
    usageCount: 0,
    startDate: "",
    endDate: "",
    status: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPromotionById(id)
      .then((promo) => {
        if (!promo) return;
        setForm({
          code: promo.code,
          type: promo.type as "Percentage" | "Fixed Amount",
          value: String(promo.value),
          usageLimitEnabled: promo.usageLimit !== null,
          usageLimit: promo.usageLimit ? String(promo.usageLimit) : "100",
          usageCount: promo.usageCount,
          startDate: promo.startDate,
          endDate: promo.endDate,
          status: promo.status === "Active",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: string, value: string | boolean | number) => {
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
      await updatePromotion(id, {
        promoCode: form.code,
        type: form.type === "Percentage" ? 0 : 1,
        value: Number(form.value),
        usageCount: form.usageCount,
        usageLimit: form.usageLimitEnabled ? Number(form.usageLimit) : undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status ? 1 : 0,
      });
      if (onSaved) onSaved();
      else navigate("/admin/content");
    } catch {
      setErrors((prev) => ({ ...prev, code: "Failed to save. Please try again." }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else navigate("/admin/content");
  };

  const previewValue = form.type === "Percentage"
    ? `${form.value || "0"}% OFF`
    : `$${form.value || "0"} OFF`;

  const formContent = loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" py={8}>
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: open ? "1fr" : "2fr 1fr", gap: 2, alignItems: "start" }}>
        {/* ── LEFT COLUMN ── */}
        <Box display="flex" flexDirection="column" gap={2}>
          {/* 1. Promo Code & Type */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e3f0fb", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <LocalOfferIcon sx={{ fontSize: 18, color: "#0077b6" }} />
              </Box>
              <Typography fontWeight={600}>1. Promo Code & Type</Typography>
            </Box>

            <TextField
              label="Promo Code"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
              error={!!errors.code}
              helperText={errors.code}
              inputProps={{ style: { fontFamily: "monospace", fontWeight: 700, letterSpacing: 2 } }}
            />

            <TextField
              label="Discount Type"
              select
              fullWidth
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <MenuItem value="Percentage">Percentage (%)</MenuItem>
              <MenuItem value="Fixed Amount">Fixed Amount ($)</MenuItem>
            </TextField>
          </Paper>

          {/* 2. Discount Value */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e8f5e9", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>💰</Typography>
              </Box>
              <Typography fontWeight={600}>2. Discount Value</Typography>
            </Box>
            <TextField
              label="Discount Value"
              type="number"
              fullWidth
              required
              value={form.value}
              onChange={(e) => handleChange("value", e.target.value)}
              error={!!errors.value}
              helperText={errors.value}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {form.type === "Percentage" ? "%" : "$"}
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {/* 3. Usage Limits */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fff3e0", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>🎯</Typography>
              </Box>
              <Typography fontWeight={600}>3. Usage Limits</Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={form.usageLimitEnabled}
                  onChange={(e) => handleChange("usageLimitEnabled", e.target.checked)}
                />
              }
              label="Enable usage limit"
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
                helperText={errors.usageLimit}
              />
            )}
          </Paper>

          {/* 4. Validity Period */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fce4ec", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>📅</Typography>
              </Box>
              <Typography fontWeight={600}>4. Validity Period</Typography>
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

        {/* ── RIGHT COLUMN (standalone only) ── */}
        {!open && (
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
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#10B981" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#10B981" },
                    }}
                  />
                }
                label={form.status ? "Active" : "Inactive"}
              />
            </Paper>

            {/* Preview */}
            <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(160deg, #005a8d, #0077b6)", color: "#fff" }}>
              <Typography fontWeight={600} mb={2}>Promotion Preview</Typography>
              <Box textAlign="center" py={2}>
                <Chip
                  label={form.code || "PROMO_CODE"}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 800, fontSize: 16, mb: 2, letterSpacing: 2 }}
                />
                <Typography fontWeight={900} fontSize={32}>{previewValue}</Typography>
                <Typography fontSize={13} sx={{ opacity: 0.8, mt: 1 }}>
                  {form.startDate && form.endDate ? `Valid ${form.startDate} → ${form.endDate}` : "Set dates above"}
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );

  // Modal mode
  if (open !== undefined) {
    return (
      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Edit Promotion</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {/* Status toggle inside modal */}
          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.status}
                  onChange={(e) => handleChange("status", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#10B981" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#10B981" },
                  }}
                />
              }
              label={<Typography fontWeight={600}>{form.status ? "Active" : "Inactive"}</Typography>}
            />
          </Box>
          {formContent}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              background: "linear-gradient(160deg, #005a8d, #0077b6)",
              boxShadow: "0 4px 14px rgba(0,119,182,0.32)",
              "&:hover": { background: "linear-gradient(160deg, #004a75, #005a8d)" },
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Standalone page mode
  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleCancel} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>Edit Promotion</Typography>
            <Typography variant="body2" color="text.secondary">Update promotion details</Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              background: "linear-gradient(160deg, #005a8d, #0077b6)",
              boxShadow: "0 4px 14px rgba(0,119,182,0.32)",
              "&:hover": { background: "linear-gradient(160deg, #004a75, #005a8d)" },
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
      {formContent}
    </Box>
  );
}
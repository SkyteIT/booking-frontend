// src/pages/admin/contentManagement/components/AddBanner.tsx
import { useState } from "react";
import {
  Box, Typography, TextField, Button, Paper, MenuItem,
  FormControlLabel, Switch, IconButton, Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import { createBanner, PLACEMENT_OPTIONS } from "../services/contentService";

const cardStyle = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,27,45,0.06)",
  background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  mb: 0,
};

export default function AddBanner() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    // placement is now an int matching the backend enum
    placement: "" as "" | number,
    startDate: "",
    endDate: "",
    status: true,
    openInNewTab: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  // imageUrl sent to backend — empty string satisfies non-nullable requirement
  const [imageUrl, setImageUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setImagePreview(null);
      setImageName(null);
      setImageUrl("");
      setErrors((prev) => ({
        ...prev,
        imageUrl: "Banner image must be 10 MB or smaller",
      }));
      return;
    }
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
      // For now store base64 as imageUrl; replace with upload endpoint if available
      setImageUrl(result);
      setErrors((prev) => ({ ...prev, imageUrl: "" }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim())       newErrors.title     = "Banner title is required";
    if (!imageUrl.trim())         newErrors.imageUrl   = "Banner image is required";
    if (form.placement === "")    newErrors.placement = "Placement is required";
    if (!form.startDate)          newErrors.startDate = "Start date is required";
    if (!form.endDate)            newErrors.endDate   = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      newErrors.endDate = "End date must be after start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Payload matches CreateBannerDto exactly:
      // Title (string), Subtitle (string?), ImageUrl (string),
      // Placement (int), StartDate (DateOnly), EndDate (DateOnly)
      await createBanner({
        title:     form.title,
        subtitle:  form.subtitle || undefined,
        imageUrl:  imageUrl || "",        // required non-nullable field
        placement: form.placement as number, // int enum
        startDate: form.startDate,           // "YYYY-MM-DD"
        endDate:   form.endDate,             // "YYYY-MM-DD"
      });
      navigate("/admin/content");
    } catch {
      setErrors((prev) => ({ ...prev, title: "Failed to save. Please try again." }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/admin/content");

  const previewPlacementLabel =
    PLACEMENT_OPTIONS.find((p) => p.value === form.placement)?.label ?? "—";
  const previewStatus = form.status ? "Active" : "Inactive";
  const today = new Date().toISOString().split("T")[0];
  const isScheduled = form.startDate && form.startDate > today;

  return (
    <Box>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleCancel} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              Add New Banner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a promotional banner for your platform
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{ borderRadius: "999px", textTransform: "none", borderColor: "#E2E8F0", color: "#64748B" }}
          >
            Cancel
          </Button>
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
            {saving ? "Saving..." : "Save Banner"}
          </Button>
        </Box>
      </Box>

      {/* TWO-COLUMN GRID */}
      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 2, alignItems: "start" }}>

        {/* ── LEFT COLUMN ── */}
        <Box display="flex" flexDirection="column" gap={2}>

          {/* 1. Basic Information */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e3f0fb", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>🖼️</Typography>
              </Box>
              <Typography fontWeight={600}>1. Basic Information</Typography>
            </Box>

            <TextField
              label="Banner Title"
              placeholder="e.g., Summer Sale 2024"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              label="Subtitle"
              placeholder="Short description shown below the banner title..."
              fullWidth
              multiline
              rows={3}
              value={form.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </Paper>

          {/* 2. Placement & Scheduling */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e8f5e9", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>📍</Typography>
              </Box>
              <Typography fontWeight={600}>2. Placement & Scheduling</Typography>
            </Box>

            <TextField
              label="Placement"
              select
              fullWidth
              required
              sx={{ mb: 2 }}
              // value must be number or "" — keep as-is
              value={form.placement}
              onChange={(e) => handleChange("placement", Number(e.target.value))}
              error={!!errors.placement}
              helperText={errors.placement}
            >
              {PLACEMENT_OPTIONS.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>

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

          {/* 3. Banner Image */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fff3e0", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>🖼</Typography>
              </Box>
              <Typography fontWeight={600}>3. Banner Image</Typography>
            </Box>

            <Box
              component="label"
              htmlFor="banner-image-input"
              sx={{
                border: "2px dashed #b0c4d8",
                borderRadius: 2, p: 4,
                textAlign: "center", cursor: "pointer",
                bgcolor: imagePreview ? "transparent" : "#f8fafc",
                display: "block", mb: 2,
                "&:hover": { borderColor: "#0077b6", bgcolor: "rgba(0,119,182,0.05)" },
                transition: "all 0.2s",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, objectFit: "cover" }}
                />
              ) : (
                <Box>
                  <UploadIcon sx={{ fontSize: 36, color: "#90a4ae", mb: 1 }} />
                  <Typography color="text.secondary" fontSize={14}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography color="text.disabled" fontSize={12} mt={0.5}>
                    PNG, JPG up to 10MB — Recommended: 1200×400px
                  </Typography>
                </Box>
              )}
              <input
                id="banner-image-input"
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Box>
            {errors.imageUrl && (
              <Typography fontSize={12} color="error" sx={{ mt: -1, mb: 1 }}>
                {errors.imageUrl}
              </Typography>
            )}

            {imageName && (
              <Chip
                label={imageName}
                size="small"
                onDelete={() => {
                  setImagePreview(null);
                  setImageName(null);
                  setImageUrl("");
                  setErrors((prev) => ({ ...prev, imageUrl: "" }));
                }}
              />
            )}
          </Paper>

          {/* 4. Link & Behaviour */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fce4ec", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>🔗</Typography>
              </Box>
              <Typography fontWeight={600}>4. Link & Behaviour</Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.openInNewTab}
                  onChange={(e) => handleChange("openInNewTab", e.target.checked)}
                />
              }
              label="Open link in new tab"
            />
          </Paper>
        </Box>

        {/* ── RIGHT COLUMN ── */}
        <Box display="flex" flexDirection="column" gap={2}>

          {/* Status */}
          <Paper sx={cardStyle}>
            <Typography fontWeight={600} mb={2}>Status & Visibility</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={form.status}
                  onChange={(e) => handleChange("status", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077b6" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#0077b6" },
                  }}
                />
              }
              label={form.status ? "Active" : "Inactive"}
            />
            <Box
              sx={{
                mt: 2, p: 2, borderRadius: 2,
                bgcolor: form.status ? "#e6f4ea" : "#f5f5f5",
                border: `1px solid ${form.status ? "#c8e6c9" : "#e0e0e0"}`,
              }}
            >
              <Typography fontSize={13} color={form.status ? "#2e7d32" : "#757575"}>
                {form.status
                  ? isScheduled
                    ? "Banner is scheduled and will go live on " + form.startDate
                    : "Banner is active and visible to users"
                  : "Banner is hidden from users"}
              </Typography>
            </Box>
          </Paper>

          {/* Preview */}
          <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(160deg, #005a8d, #0077b6)", color: "#fff" }}>
            <Typography fontWeight={600} mb={2}>Banner Preview</Typography>
            {[
              { label: "Title",     value: form.title || "—" },
              { label: "Placement", value: previewPlacementLabel },
              { label: "Duration",  value: form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : "—" },
            ].map((row) => (
              <Box key={row.label} display="flex" justifyContent="space-between" mb={1}>
                <Typography fontSize={13} sx={{ opacity: 0.8 }}>{row.label}</Typography>
                <Typography fontSize={13} fontWeight={600}>{row.value}</Typography>
              </Box>
            ))}
            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={13} sx={{ opacity: 0.8 }}>Status</Typography>
              <Chip
                label={previewStatus}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 600, fontSize: 11 }}
              />
            </Box>
          </Paper>

          {/* Tips */}
          <Paper sx={{ ...cardStyle, bgcolor: "#fff8e1", border: "1px solid #ffe082" }}>
            <Typography fontWeight={600} mb={1} fontSize={14}>💡 Tips</Typography>
            <Typography fontSize={12} color="text.secondary" lineHeight={1.8}>
              • Use high-contrast images for better visibility<br />
              • Keep titles under 60 characters<br />
              • Set an end date to auto-expire promotions<br />
              • Homepage Hero banners get the most visibility
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

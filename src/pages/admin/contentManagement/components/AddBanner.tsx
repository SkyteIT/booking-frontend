// src/pages/admin/contentManagement/components/AddBanner.tsx
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import { createBanner } from "../services/contentService";

const PLACEMENTS = [
  "Homepage Hero",
  "Homepage Banner",
  "Category Pages",
  "Search Results",
  "Checkout Page",
];

const cardStyle = {
  p: 3,
  borderRadius: 3,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  mb: 0,
};

export default function AddBanner() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    placement: "",
    linkUrl: "",
    startDate: "",
    endDate: "",
    status: true,
    displayOrder: "1",
    openInNewTab: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Banner title is required";
    if (!form.placement) newErrors.placement = "Placement is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      newErrors.endDate = "End date must be after start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await createBanner({
        title: form.title,
        description: form.description || undefined,
        linkUrl: form.linkUrl || undefined,
        placement: form.placement,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      navigate("/admin/content");
    } catch {
      setErrors((prev) => ({ ...prev, title: "Failed to save. Please try again." }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/admin/content");

  // Derive preview status label
  const previewStatus = form.status ? "Active" : "Inactive";
  const today = new Date().toISOString().split("T")[0];
  const isScheduled = form.startDate && form.startDate > today;

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleCancel} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>Add New Banner</Typography>
            <Typography variant="body2" color="text.secondary">
              Create a promotional banner for your platform
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
              <Box sx={{ bgcolor: "#e3f0fb", borderRadius: "50%", p: 0.8, display:"flex" }}>
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
              label="Description"
              placeholder="Short description shown below the banner title..."
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </Paper>

          {/* 2. Placement & Scheduling */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e8f5e9", borderRadius: "50%", p: 0.8, display:"flex" }}>
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
              value={form.placement}
              onChange={(e) => handleChange("placement", e.target.value)}
              error={!!errors.placement}
              helperText={errors.placement || "Where this banner will appear on the site"}
            >
              {PLACEMENTS.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
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

          {/* 3. Media Upload */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fff3e0", borderRadius: "50%", p: 0.8, display:"flex" }}>
                <Typography fontSize={18}>🖼</Typography>
              </Box>
              <Typography fontWeight={600}>3. Banner Image</Typography>
            </Box>

            {/* Upload zone */}
            <Box
              component="label"
              htmlFor="banner-image-input"
              sx={{
                border: "2px dashed #b0c4d8",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: imagePreview ? "transparent" : "#f8fafc",
                display: "block",
                mb: 2,
                "&:hover": { borderColor: "#0077B6", bgcolor: "#f0f7ff" },
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

            {imageName && (
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={imageName}
                  size="small"
                  onDelete={() => { setImagePreview(null); setImageName(null); }}
                />
              </Box>
            )}
          </Paper>

          {/* 4. Link & Behaviour */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fce4ec", borderRadius: "50%", p: 0.8, display:"flex" }}>
                <Typography fontSize={18}>🔗</Typography>
              </Box>
              <Typography fontWeight={600}>4. Link & Behaviour</Typography>
            </Box>

            <TextField
              label="Destination URL"
              placeholder="https://example.com/summer-sale"
              fullWidth
              sx={{ mb: 2 }}
              value={form.linkUrl}
              onChange={(e) => handleChange("linkUrl", e.target.value)}
              helperText="Leave empty if the banner is for display only"
            />

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

          {/* 5. Display Settings */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#ede7f6", borderRadius: "50%", p: 0.8, display:"flex" }}>
                <Typography fontSize={18}>⚙️</Typography>
              </Box>
              <Typography fontWeight={600}>5. Display Settings</Typography>
            </Box>

            <TextField
              label="Display Order"
              type="number"
              fullWidth
              value={form.displayOrder}
              onChange={(e) => handleChange("displayOrder", e.target.value)}
              helperText="Lower numbers appear first when multiple banners share a placement"
              inputProps={{ min: 1 }}
            />
          </Paper>
        </Box>

        {/* ── RIGHT COLUMN ── */}
        <Box display="flex" flexDirection="column" gap={2}>

          {/* Status card */}
          <Paper sx={cardStyle}>
            <Typography fontWeight={600} mb={2}>Status & Visibility</Typography>

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
              label={form.status ? "Active" : "Inactive"}
            />

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
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

          {/* Preview card */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #0077B6, #00B4D8)",
              color: "#fff",
            }}
          >
            <Typography fontWeight={600} mb={2}>Banner Preview</Typography>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography fontSize={13} sx={{ opacity: 0.8 }}>Title</Typography>
              <Typography fontSize={13} fontWeight={600}>
                {form.title || "—"}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography fontSize={13} sx={{ opacity: 0.8 }}>Placement</Typography>
              <Typography fontSize={13} fontWeight={600}>
                {form.placement || "—"}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography fontSize={13} sx={{ opacity: 0.8 }}>Duration</Typography>
              <Typography fontSize={13} fontWeight={600}>
                {form.startDate && form.endDate
                  ? `${form.startDate} → ${form.endDate}`
                  : "—"}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography fontSize={13} sx={{ opacity: 0.8 }}>Status</Typography>
              <Chip
                label={previewStatus}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.25)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 11,
                }}
              />
            </Box>
          </Paper>

          {/* Tips card */}
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
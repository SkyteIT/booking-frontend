// src/pages/admin/contentManagement/components/EditCategory.tsx
import { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Paper, MenuItem,
  FormControlLabel, Switch, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, updateCategoryFull } from "../services/contentService";

const cardStyle = {
  p: 3,
  borderRadius: 3,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  mb: 0,
};

const BOOKING_TYPES = ["Instant Confirmation", "Request to Confirm"];
const SERVICE_MODELS = ["Per Night", "Per Hour", "Per Person", "Per Day", "Fixed Price"];
const STATUS_OPTIONS = ["Active", "Inactive"];

interface EditCategoryProps {
  categoryId?: string;
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
}

export default function EditCategory({ categoryId, open, onClose, onSaved }: EditCategoryProps) {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = categoryId ?? params.id ?? "";

  const [form, setForm] = useState({
    name: "",
    description: "",
    bookingType: "",
    serviceModel: "",
    dateSelection: false,
    timeSlot: false,
    availabilityCalendar: false,
    commission: "15",
    platformFee: "",
    taxApplicable: false,
    icon: "",
    displayOrder: "1",
    featuredCategory: false,
    requiresApproval: false,
    status: "Active",
  });
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerName, setBannerName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCategoryById(id)
      .then((cat) => {
        if (!cat) return;
        setForm({
          name: cat.name ?? "",
          description: cat.description ?? "",
          bookingType: cat.bookingType ?? "",
          serviceModel: cat.serviceModel ?? "",
          dateSelection: cat.dateSelectionEnabled ?? false,
          timeSlot: cat.timeSlotEnabled ?? false,
          availabilityCalendar: cat.availabilityCalendarEnabled ?? false,
          commission: cat.defaultCommissionPercent ? String(cat.defaultCommissionPercent) : "15",
          platformFee: cat.platformServiceFee ? String(cat.platformServiceFee) : "",
          taxApplicable: cat.taxApplicable ?? false,
          icon: cat.icon ?? "",
          displayOrder: cat.displayOrder ? String(cat.displayOrder) : "1",
          featuredCategory: cat.isFeatured ?? false,
          requiresApproval: cat.requiresAdminApproval ?? false,
          status: cat.status ?? "Active",
        });
        if (cat.bannerImageUrl) setBannerPreview(cat.bannerImageUrl);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field: string, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setBannerPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Category name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateCategoryFull(id, {
        name: form.name,
        description: form.description || undefined,
        bookingType: form.bookingType || undefined,
        serviceModel: form.serviceModel || undefined,
        dateSelectionEnabled: form.dateSelection,
        timeSlotEnabled: form.timeSlot,
        availabilityCalendarEnabled: form.availabilityCalendar,
        defaultCommissionPercent: form.commission ? Number(form.commission) : undefined,
        platformServiceFee: form.platformFee ? Number(form.platformFee) : undefined,
        taxApplicable: form.taxApplicable,
        icon: form.icon || undefined,
        bannerImageUrl: bannerPreview || undefined,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : undefined,
        isFeatured: form.featuredCategory,
        requiresAdminApproval: form.requiresApproval,
        status: form.status,
      });
      if (onSaved) onSaved();
      else navigate("/admin/content");
    } catch {
      setErrors((p) => ({ ...p, name: "Failed to save. Please try again." }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else navigate("/admin/content");
  };

  const formContent = loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" py={8}>
      <CircularProgress />
    </Box>
  ) : (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: open ? "1fr" : "2fr 1fr", gap: 2, alignItems: "start" }}>
        {/* ── LEFT COLUMN ── */}
        <Box display="flex" flexDirection="column" gap={2}>
          {/* 1. Basic Info */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e3f0fb", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <CategoryIcon sx={{ fontSize: 18, color: "#0077B6" }} />
              </Box>
              <Typography fontWeight={600}>1. Basic Information</Typography>
            </Box>
            <TextField
              label="Category Name"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
            <TextField
              label="Icon (emoji or URL)"
              fullWidth
              value={form.icon}
              onChange={(e) => set("icon", e.target.value)}
              placeholder="🏨 or https://..."
            />
          </Paper>

          {/* 2. Booking Configuration */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e8f5e9", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>⚙️</Typography>
              </Box>
              <Typography fontWeight={600}>2. Booking Configuration</Typography>
            </Box>
            <TextField
              label="Booking Type"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={form.bookingType}
              onChange={(e) => set("bookingType", e.target.value)}
            >
              {BOOKING_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField
              label="Service Model"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={form.serviceModel}
              onChange={(e) => set("serviceModel", e.target.value)}
            >
              {SERVICE_MODELS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <FormControlLabel control={<Switch checked={form.dateSelection} onChange={(e) => set("dateSelection", e.target.checked)} />} label="Date Selection" />
              <FormControlLabel control={<Switch checked={form.timeSlot} onChange={(e) => set("timeSlot", e.target.checked)} />} label="Time Slot" />
              <FormControlLabel control={<Switch checked={form.availabilityCalendar} onChange={(e) => set("availabilityCalendar", e.target.checked)} />} label="Availability Calendar" />
            </Box>
          </Paper>

          {/* 3. Financial Settings */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fff3e0", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>💰</Typography>
              </Box>
              <Typography fontWeight={600}>3. Financial Settings</Typography>
            </Box>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Commission (%)"
                type="number"
                fullWidth
                value={form.commission}
                onChange={(e) => set("commission", e.target.value)}
              />
              <TextField
                label="Platform Fee ($)"
                type="number"
                fullWidth
                value={form.platformFee}
                onChange={(e) => set("platformFee", e.target.value)}
              />
            </Box>
            <FormControlLabel
              control={<Switch checked={form.taxApplicable} onChange={(e) => set("taxApplicable", e.target.checked)} />}
              label="Tax Applicable"
            />
          </Paper>

          {/* 4. Banner Image */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fce4ec", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>🖼️</Typography>
              </Box>
              <Typography fontWeight={600}>4. Banner Image</Typography>
            </Box>
            <Box
              component="label"
              htmlFor="edit-cat-banner-input"
              sx={{
                border: "2px dashed #b0c4d8",
                borderRadius: 2, p: 4,
                textAlign: "center", cursor: "pointer",
                bgcolor: bannerPreview ? "transparent" : "#f8fafc",
                display: "block", mb: 2,
                "&:hover": { borderColor: "#0077B6", bgcolor: "#f0f7ff" },
                transition: "all 0.2s",
              }}
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8, objectFit: "cover" }}
                />
              ) : (
                <Box>
                  <UploadIcon sx={{ fontSize: 36, color: "#90a4ae", mb: 1 }} />
                  <Typography color="text.secondary" fontSize={14}>Click to upload banner image</Typography>
                </Box>
              )}
              <input id="edit-cat-banner-input" hidden type="file" accept="image/*" onChange={handleBannerChange} />
            </Box>
            {bannerName && (
              <Chip label={bannerName} size="small" onDelete={() => { setBannerPreview(null); setBannerName(null); }} />
            )}
          </Paper>
        </Box>

        {/* ── RIGHT COLUMN ── */}
        {!open && (
          <Box display="flex" flexDirection="column" gap={2}>
            <Paper sx={cardStyle}>
              <Typography fontWeight={600} mb={2}>Status & Settings</Typography>
              <TextField
                label="Status"
                select
                fullWidth
                sx={{ mb: 2 }}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
              <TextField
                label="Display Order"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={form.displayOrder}
                onChange={(e) => set("displayOrder", e.target.value)}
              />
              <FormControlLabel
                control={<Switch checked={form.featuredCategory} onChange={(e) => set("featuredCategory", e.target.checked)} />}
                label="Featured Category"
              />
              <FormControlLabel
                control={<Switch checked={form.requiresApproval} onChange={(e) => set("requiresApproval", e.target.checked)} />}
                label="Requires Admin Approval"
              />
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff" }}>
              <Typography fontWeight={600} mb={2}>Category Preview</Typography>
              <Box textAlign="center" py={1}>
                <Typography fontSize={40}>{form.icon || "🏷️"}</Typography>
                <Typography fontWeight={800} fontSize={18} mt={1}>{form.name || "Category Name"}</Typography>
                <Chip
                  label={form.status}
                  size="small"
                  sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 600 }}
                />
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );

  if (open !== undefined) {
    return (
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Category</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {/* Status inside modal */}
          <Box mb={2} display="flex" gap={2}>
            <TextField
              label="Status"
              select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            >
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <FormControlLabel
              control={<Switch checked={form.featuredCategory} onChange={(e) => set("featuredCategory", e.target.checked)} />}
              label="Featured"
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
            sx={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleCancel} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>Edit Category</Typography>
            <Typography variant="body2" color="text.secondary">Update category details</Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ background: "linear-gradient(135deg,#6366F1,#4F46E5)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>
      {formContent}
    </Box>
  );
}
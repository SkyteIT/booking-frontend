// src/pages/admin/contentManagement/components/EditBanner.tsx
import { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate, useParams } from "react-router-dom";
import { getBannerById, updateBanner, PLACEMENT_OPTIONS, uploadBannerImage } from "../../../../services/bannerService";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

const cardStyle = {
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(15,27,45,0.06)",
  background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  mb: 0,
};

const getServerErrorMessage = (err: any, fallback: string) => {
  const responseData = err?.response?.data;
  const flattenedErrors =
    responseData?.errors && typeof responseData.errors === "object"
      ? Object.values(responseData.errors).flat().filter(Boolean).join(" ")
      : "";

  return (
    responseData?.detail ||
    flattenedErrors ||
    responseData?.error ||
    responseData?.message ||
    responseData?.title ||
    err?.message ||
    fallback
  );
};

interface EditBannerProps {
  bannerId?: string;
  open?: boolean;
  onClose?: () => void;
  onSaved?: () => void;
}

export default function EditBanner({ bannerId, open, onClose, onSaved }: EditBannerProps) {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = bannerId ?? params.id ?? "";

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    placement: "" as "" | "Home" | "Explore",
    startDate: "",
    endDate: "",
    status: true,
    actionUrl: "",
    openInNewTab: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageName, setImageName] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getBannerById(id)
      .then((banner) => {
        if (!banner) return;
        setForm({
          title: banner.title,
          subtitle: banner.description,
          placement: banner.placement,
          startDate: banner.startDate,
          endDate: banner.endDate,
          status: banner.status === "Active",
          actionUrl: banner.actionUrl ?? "",
          openInNewTab: banner.openInNewTab ?? false,
        });
        setImagePreview(banner.imageUrl || null);
        setImageUrl(banner.imageUrl || "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = async (file: File) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, imageUrl: "Only JPG/PNG files are allowed" }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: "File size must not exceed 2MB" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview((ev.target?.result as string) ?? null);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    setImageName(file.name);
    try {
      const uploadedUrl = await uploadBannerImage(file);
      setImageUrl(uploadedUrl);
      setErrors((prev) => ({ ...prev, imageUrl: "" }));
    } catch (err: any) {
      const serverMsg = getServerErrorMessage(err, "Failed to upload image.");
      setErrors((prev) => ({ ...prev, imageUrl: serverMsg }));
    } finally {
      setUploadingImage(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Banner title is required";
    if (!imageUrl.trim()) newErrors.imageUrl = "Banner image is required";
    if (imageUrl.trim().length > 500) newErrors.imageUrl = "Image URL must be 500 characters or less";
    if (form.placement === "") newErrors.placement = "Placement is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      newErrors.endDate = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateBanner(id, {
        title: form.title,
        subtitle: form.subtitle || undefined,
        imageUrl: imageUrl.trim(),
        placement: form.placement || "Home",
        startDate: form.startDate,
        endDate: form.endDate,
        status: form.status ? "Active" : "Inactive",
        actionUrl: form.actionUrl.trim() || undefined,
        openInNewTab: form.openInNewTab,
      });
      if (onSaved) onSaved();
      else navigate("/admin/content");
    } catch (err: any) {
      const serverMsg = getServerErrorMessage(err, "Failed to save. Please try again.");
      setErrors((prev) => ({ ...prev, imageUrl: serverMsg }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else navigate("/admin/content");
  };

  const previewPlacementLabel = PLACEMENT_OPTIONS.find((p) => p.value === form.placement)?.label ?? "—";
  const previewStatus = form.status ? "Active" : "Inactive";
  const today = new Date().toISOString().split("T")[0];
  const isScheduled = form.startDate && form.startDate > today;

  const formContent = loading ? (
    <LoadingSpinner fullScreen={false} py={8} />
  ) : (
    <Box sx={{ p: open ? 0 : 3, bgcolor: open ? "transparent" : "#f4f6f8", minHeight: open ? 0 : "100vh" }}>
      {!open && (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={handleCancel} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={700}>Edit Banner</Typography>
              <Typography variant="body2" color="text.secondary">Update banner details</Typography>
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
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: open ? "1fr" : "2fr 1fr", gap: 2, alignItems: "start" }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e3f0fb", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>🖼️</Typography>
              </Box>
              <Typography fontWeight={600}>1. Basic Information</Typography>
            </Box>
            <TextField
              label="Banner Title"
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
              fullWidth
              multiline
              rows={3}
              value={form.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </Paper>

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
              value={form.placement}
              onChange={(e) => handleChange("placement", e.target.value)}
              error={!!errors.placement}
              helperText={errors.placement}
            >
              {PLACEMENT_OPTIONS.map((p) => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
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

          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fff3e0", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>🖼</Typography>
              </Box>
              <Typography fontWeight={600}>3. Banner Image</Typography>
            </Box>

            <Box
              component="label"
              htmlFor="edit-banner-image-input"
              sx={{
                border: "2px dashed #b0c4d8",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                bgcolor: imagePreview ? "transparent" : "#f8fafc",
                display: "block",
                mb: 2,
                "&:hover": { borderColor: "#0077b6", bgcolor: "rgba(0,119,182,0.05)" },
                transition: "all 0.2s",
              }}
            >
              {uploadingImage ? (
                <Box>
                  <Typography fontSize={36} mb={1}>⏳</Typography>
                  <Typography color="text.secondary" fontSize={14}>
                    Uploading image...
                  </Typography>
                </Box>
              ) : imagePreview ? (
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
                    PNG, JPG up to 2MB
                  </Typography>
                </Box>
              )}
              <input
                id="edit-banner-image-input"
                hidden
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImageChange(file);
                  e.target.value = "";
                }}
              />
            </Box>
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
            {errors.imageUrl && (
              <Typography fontSize={12} color="error" sx={{ mt: 1 }}>
                {errors.imageUrl}
              </Typography>
            )}
          </Paper>

          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fce4ec", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <Typography fontSize={18}>🔗</Typography>
              </Box>
              <Typography fontWeight={600}>4. Link & Behaviour</Typography>
            </Box>
            <TextField
              label="Action URL"
              placeholder="https://example.com/promo"
              fullWidth
              sx={{ mb: 2 }}
              value={form.actionUrl}
              onChange={(e) => handleChange("actionUrl", e.target.value)}
              helperText="Where the banner takes people when clicked. Leave blank for a non-clickable banner."
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.openInNewTab}
                  onChange={(e) => handleChange("openInNewTab", e.target.checked)}
                  disabled={!form.actionUrl.trim()}
                />
              }
              label="Open link in new tab"
            />
          </Paper>
        </Box>

        {!open && (
          <Box display="flex" flexDirection="column" gap={2}>
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

            <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(160deg, #005a8d, #0077b6)", color: "#fff" }}>
              <Typography fontWeight={600} mb={2}>Banner Preview</Typography>
              {[
                { label: "Title", value: form.title || "—" },
                { label: "Placement", value: previewPlacementLabel },
                { label: "Duration", value: form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : "—" },
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
          </Box>
        )}
      </Box>
    </Box>
  );

  if (open !== undefined) {
    return (
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Edit Banner</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
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

  return formContent;
}

// src/pages/admin/contentManagement/components/AddCategory.tsx
import { useMemo, useState } from "react";
import {
  Box, Typography, TextField, Button, Paper, Switch,
  FormControlLabel, MenuItem, IconButton, Chip, InputAdornment,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SettingsIcon from "@mui/icons-material/Settings";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ImageIcon from "@mui/icons-material/Image";
import LockIcon from "@mui/icons-material/Lock";
import ExtensionIcon from "@mui/icons-material/Extension";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { useNavigate } from "react-router-dom";
import type { ListingType } from "../../../../services/Vendor/listingService";
import { createCategory } from "../services/contentService";
import { filterEmojiOptions } from "../utils/emojiOptions";

// ─── Types ───────────────────────────────────────────────
interface CustomField {
  id: number;
  type: string;
  label: string;
  required: boolean;
}

const LISTING_TYPES: ListingType[] = ["Hotel", "Restaurant", "Event", "CarRental", "Activity"];
const BOOKING_TYPES = ["Instant Confirmation", "Request to Confirm"];
const SERVICE_MODELS = ["Per Night", "Per Hour", "Per Person", "Per Day", "Fixed Price"];
const FIELD_TYPES    = ["Text", "Number", "Date", "Dropdown", "Checkbox", "File Upload"];
// Backend only accepts "Active"/"Inactive" (CreateCategoryDtoValidator) — no "Draft".
const STATUS_OPTIONS = ["Active", "Inactive"];

const cardStyle = {
  p: 3, borderRadius: 3,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

let fieldIdCounter = 1;

// ─── Main Component ───────────────────────────────────────
export default function AddCategory() {
  const navigate = useNavigate();

  // ── Form state ──
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "" as ListingType | "",
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
    softDelete: false,
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerName, setBannerName] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");
  const filteredEmojiOptions = useMemo(() => filterEmojiOptions(emojiSearch), [emojiSearch]);

  // ── Handlers ──
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

  const addField = () => {
    setCustomFields((p) => [
      ...p,
      { id: fieldIdCounter++, type: "Text", label: "", required: false },
    ]);
  };

  const updateField = (id: number, key: keyof CustomField, value: string | boolean) => {
    setCustomFields((p) =>
      p.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const removeField = (id: number) =>
    setCustomFields((p) => p.filter((f) => f.id !== id));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Category name is required";
    if (!form.type) e.type = "Select a listing type";
    if (!form.bookingType)  e.bookingType = "Select a booking type";
    if (!form.serviceModel) e.serviceModel = "Select a service model";
    if (Number(form.commission) < 0 || Number(form.commission) > 100)
      e.commission = "Must be 0–100%";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await createCategory({
        name: form.name,
        description: form.description || undefined,
        type: form.type as ListingType,
        bookingType: form.bookingType || undefined,
        serviceModel: form.serviceModel || undefined,
        dateSelectionEnabled: form.dateSelection,
        timeSlotEnabled: form.timeSlot,
        availabilityCalendarEnabled: form.availabilityCalendar,
        defaultCommissionPercent: Number(form.commission) || 15,
        platformServiceFee: form.platformFee ? Number(form.platformFee) : undefined,
        taxApplicable: form.taxApplicable,
        icon: form.icon || undefined,
        displayOrder: Number(form.displayOrder) || 1,
        isFeatured: form.featuredCategory,
        requiresAdminApproval: form.requiresApproval,
        status: form.status,
      });
      navigate("/admin/content");
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save. Please try again.";
      setErrors((p) => ({ ...p, name: serverMsg }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/admin/content");

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleCancel} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={700}>Add New Category</Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new booking category for your platform
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
            {saving ? "Saving..." : "Save Category"}
          </Button>
        </Box>
      </Box>

      {/* ── TWO-COLUMN GRID ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 2, alignItems: "start" }}>

        {/* ════ LEFT COLUMN ════ */}
        <Box display="flex" flexDirection="column" gap={2}>

          {/* 1. Basic Information */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e3f0fb", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <CategoryIcon sx={{ fontSize: 18, color: "#0077B6" }} />
              </Box>
              <Typography fontWeight={600}>1. Basic Information</Typography>
            </Box>

            <TextField
              label="Category Name"
              placeholder="e.g., Hotels, Car Rentals, Activities"
              fullWidth required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Listing Type"
              select fullWidth required
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
              error={!!errors.type}
              helperText={errors.type || "Which kind of listing can be created under this category"}
              sx={{ mb: 2 }}
            >
              {LISTING_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField
              label="Description"
              placeholder="Describe this category and what services it includes..."
              fullWidth multiline rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Paper>

          {/* 2. Category Configuration */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e8f5e9", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <SettingsIcon sx={{ fontSize: 18, color: "#2E7D32" }} />
              </Box>
              <Typography fontWeight={600}>2. Category Configuration</Typography>
            </Box>

            <TextField
              label="Booking Type"
              select fullWidth required
              value={form.bookingType}
              onChange={(e) => set("bookingType", e.target.value)}
              error={!!errors.bookingType}
              helperText={errors.bookingType}
              sx={{ mb: 2 }}
            >
              {BOOKING_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>

            <TextField
              label="Service Model"
              select fullWidth required
              value={form.serviceModel}
              onChange={(e) => set("serviceModel", e.target.value)}
              error={!!errors.serviceModel}
              helperText={errors.serviceModel}
              sx={{ mb: 2 }}
            >
              {SERVICE_MODELS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </TextField>

            {/* Feature toggles */}
            <Typography fontSize={13} color="text.secondary" mb={1}>
              Booking features
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {(
                [
                  { key: "dateSelection",        label: "Date Selection" },
                  { key: "timeSlot",             label: "Time Slot" },
                  { key: "availabilityCalendar", label: "Availability Calendar" },
                ] as { key: keyof typeof form; label: string }[]
              ).map(({ key, label }) => (
                <Button
                  key={key}
                  variant={form[key] ? "contained" : "outlined"}
                  size="small"
                  onClick={() => set(key as string, !form[key])}
                  sx={{
                    textTransform: "none", borderRadius: 2, fontSize: 13,
                    bgcolor: form[key] ? "#0077B6" : "transparent",
                    "&:hover": { bgcolor: form[key] ? "#005A8D" : undefined },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Paper>

          {/* 3. Pricing & Commission */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fff3e0", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <AttachMoneyIcon sx={{ fontSize: 18, color: "#EF6C00" }} />
              </Box>
              <Typography fontWeight={600}>3. Pricing & Commission Settings</Typography>
            </Box>

            <Box display="flex" gap={2} mb={1}>
              <TextField
                label="Default Commission (%)"
                type="number"
                fullWidth
                value={form.commission}
                onChange={(e) => set("commission", e.target.value)}
                error={!!errors.commission}
                helperText={errors.commission}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Platform Service Fee"
                type="number"
                fullWidth
                value={form.platformFee}
                onChange={(e) => set("platformFee", e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                inputProps={{ min: 0 }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.taxApplicable}
                  onChange={(e) => set("taxApplicable", e.target.checked)}
                />
              }
              label="Tax Applicable? — Enable tax calculation for this category"
            />
          </Paper>

          {/* 4. Media & Display Settings */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#fce4ec", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <ImageIcon sx={{ fontSize: 18, color: "#C2185B" }} />
              </Box>
              <Typography fontWeight={600}>4. Media & Display Settings</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <TextField
                size="small"
                fullWidth
                value={emojiSearch}
                onChange={(e) => setEmojiSearch(e.target.value)}
                placeholder="Search emoji or keyword"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                  endAdornment: emojiSearch ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setEmojiSearch("")}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                }}
                sx={{ maxWidth: 320 }}
              />
              <Typography fontSize={13} color="text.secondary">
                Choose a category emoji
              </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: 0.8, mb: 2 }}>
              {filteredEmojiOptions.map((option) => {
                const selected = form.icon === option.emoji;
                return (
                  <Box
                    key={option.emoji}
                    onClick={() => set("icon", option.emoji)}
                    title={`${option.label} ${option.keywords.join(", ")}`}
                    sx={{
                      height: 42,
                      borderRadius: "12px",
                      border: selected ? "2px solid #6366F1" : "1px solid #E2E8F0",
                      bgcolor: selected ? "#EEF2FF" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform .15s ease, border-color .15s ease, background .15s ease",
                      "&:hover": {
                        borderColor: "#6366F1",
                        bgcolor: "#EEF2FF",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Typography fontSize={22} lineHeight={1}>
                      {option.emoji}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {filteredEmojiOptions.length === 0 ? (
              <Typography fontSize={13} color="text.secondary" sx={{ mt: -0.5, mb: 2 }}>
                No emoji found for "{emojiSearch}".
              </Typography>
            ) : null}

            {form.icon && (
              <Box
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid #E2E8F0",
                  background: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Typography fontSize={13} color="text.secondary">
                  Selected:
                </Typography>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg,#6366F1,#4F46E5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography fontSize={24} lineHeight={1}>
                    {form.icon}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Banner upload */}
            <Typography fontSize={13} color="text.secondary" mb={0.8}>Banner Image</Typography>
            <Box
              component="label"
              htmlFor="category-banner-input"
              sx={{
                border: "2px dashed #b0c4d8", borderRadius: 2, p: 4,
                textAlign: "center", cursor: "pointer",
                bgcolor: bannerPreview ? "transparent" : "#f8fafc",
                display: "block", mb: 2,
                "&:hover": { borderColor: "#0077B6", bgcolor: "#f0f7ff" },
                transition: "all 0.2s",
              }}
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview} alt="preview"
                  style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 8, objectFit: "cover" }}
                />
              ) : (
                <Box>
                  <UploadIcon sx={{ fontSize: 34, color: "#90a4ae", mb: 1 }} />
                  <Typography color="text.secondary" fontSize={14}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography color="text.disabled" fontSize={12} mt={0.5}>
                    PNG, JPG up to 10MB
                  </Typography>
                </Box>
              )}
              <input
                id="category-banner-input" hidden type="file" accept="image/*"
                onChange={handleBannerChange}
              />
            </Box>

            {bannerName && (
              <Box mb={2}>
                <Chip
                  label={bannerName} size="small"
                  onDelete={() => { setBannerPreview(null); setBannerName(null); }}
                />
              </Box>
            )}

            <Box display="flex" gap={2} alignItems="center">
              <TextField
                label="Display Order"
                type="number"
                sx={{ width: 180 }}
                value={form.displayOrder}
                onChange={(e) => set("displayOrder", e.target.value)}
                inputProps={{ min: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.featuredCategory}
                    onChange={(e) => set("featuredCategory", e.target.checked)}
                  />
                }
                label="Featured Category?"
              />
            </Box>
          </Paper>

          {/* 5. Listing Control */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Box sx={{ bgcolor: "#fdecea", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <LockIcon sx={{ fontSize: 18, color: "#B91C1C" }} />
              </Box>
              <Typography fontWeight={600}>5. Listing Control</Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={form.requiresApproval}
                  onChange={(e) => set("requiresApproval", e.target.checked)}
                />
              }
              label="Requires Admin Approval?"
            />
            <Typography fontSize={12} color="text.secondary" ml={6.5} mt={-0.5}>
              Vendors must wait for approval before listings go live
            </Typography>
          </Paper>

          {/* 7. Custom Fields Builder */}
          <Paper sx={cardStyle}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ bgcolor: "#ede7f6", borderRadius: "50%", p: 0.8, display: "flex" }}>
                  <ExtensionIcon sx={{ fontSize: 18, color: "#673AB7" }} />
                </Box>
                <Typography fontWeight={600}>7. Custom Fields Builder</Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addField}
                sx={{ bgcolor: "#0077B6", "&:hover": { bgcolor: "#005A8D" }, textTransform: "none" }}
              >
                Add Field
              </Button>
            </Box>

            {customFields.length === 0 ? (
              <Box
                sx={{
                  border: "1px dashed #cdd5e0", borderRadius: 2, p: 3,
                  textAlign: "center", color: "text.secondary",
                }}
              >
                <Typography fontSize={13}>
                  No custom fields yet — click "Add Field" to create one
                </Typography>
              </Box>
            ) : (
              <Box display="flex" flexDirection="column" gap={1.5}>
                {customFields.map((field) => (
                  <Box
                    key={field.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "160px 1fr auto auto",
                      gap: 1.5, alignItems: "center",
                      p: 1.5, border: "1px solid #eef0f4", borderRadius: 2, bgcolor: "#fafbfc",
                    }}
                  >
                    <TextField
                      label="Field Type" select size="small"
                      value={field.type}
                      onChange={(e) => updateField(field.id, "type", e.target.value)}
                    >
                      {FIELD_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </TextField>

                    <TextField
                      label="Field Label" size="small"
                      placeholder="Enter field label"
                      value={field.label}
                      onChange={(e) => updateField(field.id, "label", e.target.value)}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, "required", e.target.checked)}
                        />
                      }
                      label={<Typography fontSize={12}>Required</Typography>}
                      sx={{ m: 0 }}
                    />

                    <IconButton
                      size="small" color="error"
                      onClick={() => removeField(field.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        {/* ════ RIGHT COLUMN ════ */}
        <Box display="flex" flexDirection="column" gap={2}>

          {/* 6. Status & Controls */}
          <Paper sx={cardStyle}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box sx={{ bgcolor: "#e8f5e9", borderRadius: "50%", p: 0.8, display: "flex" }}>
                <SettingsIcon sx={{ fontSize: 18, color: "#2E7D32" }} />
              </Box>
              <Typography fontWeight={600}>6. Status & Controls</Typography>
            </Box>

            <TextField
              label="Category Status"
              select fullWidth
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              sx={{ mb: 2 }}
            >
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>

            {/* Soft delete */}
            <Box
              sx={{
                p: 2, borderRadius: 2,
                bgcolor: form.softDelete ? "#fff3cd" : "#fff8e1",
                border: "1px solid #ffe082",
              }}
            >
              <Typography fontSize={13} mb={1} color="#7c5a00">
                Soft Delete - This category can be hidden without permanently removing data.
              </Typography>
              <Button
                size="small"
                variant={form.softDelete ? "contained" : "outlined"}
                color="warning"
                onClick={() => set("softDelete", !form.softDelete)}
                sx={{ textTransform: "none" }}
              >
                {form.softDelete ? "Soft Delete Enabled" : "Enable Soft Delete"}
              </Button>
            </Box>
          </Paper>

          {/* Live Preview */}
          <Paper
            sx={{
              p: 3, borderRadius: 3,
              background: "linear-gradient(135deg, #0077B6, #00B4D8)",
              color: "#fff",
            }}
          >
            <Typography fontWeight={600} mb={2}>Category Preview</Typography>

            {form.icon && (
              <Box
                sx={{
                  width: 52, height: 52, borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, mb: 1.5,
                }}
              >
                {form.icon}
              </Box>
            )}

            {[
              { label: "Name",       value: form.name || "—" },
              { label: "Type",       value: form.type || "—" },
              { label: "Booking",    value: form.bookingType || "—" },
              { label: "Model",      value: form.serviceModel || "—" },
              { label: "Commission", value: form.commission ? `${form.commission}%` : "—" },
              { label: "Listings",   value: "0" },
              { label: "Status",     value: form.status },
            ].map(({ label, value }) => (
              <Box key={label} display="flex" justifyContent="space-between" mb={0.8}>
                <Typography fontSize={13} sx={{ opacity: 0.8 }}>{label}</Typography>
                <Typography fontSize={13} fontWeight={600} sx={{ maxWidth: 130, textAlign: "right", wordBreak: "break-word" }}>
                  {value}
                </Typography>
              </Box>
            ))}

            <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
              {form.dateSelection && (
                <Chip label="Date" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11 }} />
              )}
              {form.timeSlot && (
                <Chip label="Time Slot" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11 }} />
              )}
              {form.availabilityCalendar && (
                <Chip label="Calendar" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11 }} />
              )}
              {form.featuredCategory && (
                <Chip label="Featured" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11 }} />
              )}
              {form.taxApplicable && (
                <Chip label="Tax" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11 }} />
              )}
              {form.requiresApproval && (
                <Chip label="Approval" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11 }} />
              )}
            </Box>
          </Paper>

          {/* Tips */}
          <Paper sx={{ ...cardStyle, bgcolor: "#fff8e1", border: "1px solid #ffe082" }}>
            <Typography fontWeight={600} mb={1} fontSize={14}>Tips</Typography>
            <Typography fontSize={12} color="text.secondary" lineHeight={1.8}>
              • Use clear, recognizable emoji<br />
              • "Instant Confirmation" is best for fixed-availability services<br />
              • Enable Availability Calendar for accommodation and rentals<br />
              • Custom fields help vendors provide category-specific info<br />
              • Re-adding a deleted category automatically restores its previous listings
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

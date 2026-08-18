// src/pages/admin/contentManagement/components/EditCategory.tsx
import { useMemo, useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Paper,
  FormControlLabel, Switch, IconButton, Chip, MenuItem, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate, useParams } from "react-router-dom";
import type { ListingType } from "../../../../services/Vendor/listingService";
import { getCategoryById, updateCategoryFull } from "../services/contentService";
import { filterEmojiOptions } from "../utils/emojiOptions";

const LISTING_TYPES: ListingType[] = ["Hotel", "Restaurant", "Event", "CarRental", "Activity"];

const cardStyle = {
  p: 3,
  borderRadius: 3,
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  mb: 0,
};

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
    icon: "",
    status: true,
    type: "" as ListingType | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [emojiSearch, setEmojiSearch] = useState("");
  const filteredEmojiOptions = useMemo(() => filterEmojiOptions(emojiSearch), [emojiSearch]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCategoryById(id)
      .then((cat) => {
        if (!cat) return;
        setForm({
          name: cat.name ?? "",
          description: "",
          icon: cat.icon ?? "",
          status: cat.status ?? true,
          type: cat.type ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field: string, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Category name is required";
    if (!form.type) errs.type = "Select a listing type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateCategoryFull(id, {
        name: form.name,
        description: form.description || undefined,
        icon: form.icon || undefined,
        status: form.status ? "Active" : "Inactive",
        type: form.type as ListingType,
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

  // ── Shared inner content (used in both modal + standalone) ──
  const innerContent = loading ? (
    <Box display="flex" justifyContent="center" alignItems="center" py={8}>
      <CircularProgress />
    </Box>
  ) : (
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
          fullWidth
          required
          sx={{ mb: 2 }}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Listing Type"
          select
          fullWidth
          required
          sx={{ mb: 2 }}
          value={form.type}
          onChange={(e) => set("type", e.target.value)}
          error={!!errors.type}
          helperText={errors.type || "Which kind of listing can be created under this category"}
        >
          {LISTING_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Paper>

      {/* 2. Category Emoji */}
      <Paper sx={cardStyle}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box sx={{ bgcolor: "#e8f5e9", borderRadius: "50%", p: 0.8, display: "flex" }}>
            <CategoryIcon sx={{ fontSize: 18, color: "#0077B6" }} />
          </Box>
          <Typography fontWeight={600}>2. Category Emoji</Typography>
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

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: 0.8 }}>
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
          <Typography fontSize={13} color="text.secondary" sx={{ mt: 1 }}>
            No emoji found for "{emojiSearch}".
          </Typography>
        ) : null}

        {form.icon && (
          <Box
            sx={{
              mt: 2,
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

      </Paper>

      <Paper sx={cardStyle}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box sx={{ bgcolor: "#fff3e0", borderRadius: "50%", p: 0.8, display: "flex" }}>
            <ToggleOnIcon sx={{ fontSize: 18, color: "#EF6C00" }} />
          </Box>
          <Typography fontWeight={600}>3. Status & Visibility</Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={form.status}
              onChange={(e) => set("status", e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#6366F1" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#6366F1" },
              }}
            />
          }
          label={form.status ? "Active" : "Inactive"}
        />
        <Box
          sx={{
            mt: 1.5, p: 2, borderRadius: 2,
            bgcolor: form.status ? "#eef2ff" : "#f5f5f5",
            border: `1px solid ${form.status ? "#c7d2fe" : "#e0e0e0"}`,
          }}
        >
          <Typography fontSize={13} color={form.status ? "#4338ca" : "#757575"}>
            {form.status
              ? "Category is active and visible to users"
              : "Category is hidden from users"}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );

  // ── MODAL mode (matches EditBanner / EditPromotion exactly) ──
  if (open !== undefined) {
    return (
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Category</DialogTitle>
        <DialogContent>{innerContent}</DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ bgcolor: "#6366F1", "&:hover": { bgcolor: "#4F46E5" } }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // ── STANDALONE page mode ──
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
            sx={{ bgcolor: "#6366F1", "&:hover": { bgcolor: "#4F46E5" } }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Box>

      {/* Two-column layout for standalone */}
      <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 2, alignItems: "start" }}>
        <Box>{innerContent}</Box>

        {/* Right column preview */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff" }}>
            <Typography fontWeight={600} mb={2}>Category Preview</Typography>
            {[
              { label: "Name",   value: form.name   || "—" },
              { label: "Type",   value: form.type   || "—" },
              { label: "Icon",   value: form.icon   || "—" },
            ].map((row) => (
              <Box key={row.label} display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography fontSize={13} sx={{ opacity: 0.8 }}>{row.label}</Typography>
                <Typography fontSize={row.label === "Icon" ? 20 : 13} fontWeight={600}>{row.value}</Typography>
              </Box>
            ))}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontSize={13} sx={{ opacity: 0.8 }}>Status</Typography>
              <Chip
                label={form.status ? "Active" : "Inactive"}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 600, fontSize: 11 }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

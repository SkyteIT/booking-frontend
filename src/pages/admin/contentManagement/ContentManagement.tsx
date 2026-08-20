// src/pages/admin/contentManagement/ContentManagement.tsx
import { useState, useMemo } from "react";
import {
  Box, Typography, Button, Grid, InputAdornment,
  TextField, ToggleButtonGroup, ToggleButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Slide, Alert,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import React from "react";
import { useNavigate } from "react-router-dom";

import SegmentedTabs from "../../../components/common/SegmentedTabs";
import CategoryCard from "./components/CategoryCard";
import BannerTable from "./components/BannerTable";
import PromotionTable from "./components/PromotionTable";
import EditBanner from "./components/EditBanner";
import EditPromotion from "./components/EditPromotion";
import EditCategory from "./components/EditCategory";
import { useContent } from "./hooks/useContent";

const SlideUp = React.forwardRef(function SlideUp(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TAB_ROUTES = ["/admin/categories/add", "/admin/banners/add", "/admin/promotions/add"];
const TABS = ["Categories", "Banners", "Promotions"];
const FILTERS = ["All", "Active", "Inactive"];

export default function ContentManagement() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);

  const [editBannerId, setEditBannerId] = useState<string | null>(null);
  const [deleteBannerId, setDeleteBannerId] = useState<string | null>(null);

  const [editPromotionId, setEditPromotionId] = useState<string | null>(null);
  const [deletePromotionId, setDeletePromotionId] = useState<string | null>(null);

  const { categories, banners, promotions, toggleCategory, removeCategory, removeBanner, removePromotion, refresh } = useContent();
  const navigate = useNavigate();

  const activeCount = categories.filter((c) => c.status).length;
  const inactiveCount = categories.filter((c) => !c.status).length;
  const totalListings = categories.reduce((sum, c) => sum + c.listings, 0);

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "All" ||
        (filter === "Active" && c.status) ||
        (filter === "Inactive" && !c.status);
      return matchSearch && matchFilter;
    });
  }, [categories, search, filter]);

  const categoryToDelete = categories.find((c) => String(c.id) === String(deleteId ?? ""));

  function handleDeleteClose() {
    setDeleteId(null);
    setDeleteError(null);
    setDeleteLoading(false);
  }

  async function handleDeleteConfirm() {
    if (deleteId === null) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await removeCategory(deleteId);
      handleDeleteClose();
    } catch (err: any) {
      // Surface backend error clearly — FK constraint = listings still linked
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "";
      const isFkError =
        serverMsg.toLowerCase().includes("reference") ||
        serverMsg.toLowerCase().includes("constraint") ||
        serverMsg.toLowerCase().includes("foreign key") ||
        err?.response?.status === 409;
      const msg = isFkError
        ? "Cannot delete: this category still has listings linked to it. Move or reassign the listings first, then try again."
        : serverMsg || "Failed to delete category. Please try again.";
      setDeleteError(msg);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleDeleteBannerConfirm() {
    if (deleteBannerId !== null) await removeBanner(deleteBannerId);
    setDeleteBannerId(null);
  }

  async function handleDeletePromotionConfirm() {
    if (deletePromotionId !== null) await removePromotion(deletePromotionId);
    setDeletePromotionId(null);
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        px: { xs: 2, md: 3.5 },
        py: { xs: 2, md: 3.5 },
        borderRadius: "28px",
        border: "1px solid rgba(15,27,45,0.06)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        background:
          "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(0,119,182,0.16), transparent 70%), linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.28) 100%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1600,
          mx: "auto",
        }}
      >

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} mb={3.5}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em", color: "#0F172A" }}
          >
            Content Management
          </Typography>
          <Typography sx={{ color: "#64748B", mt: 0.4, fontSize: 14 }}>
            Manage categories, banners, and promotional campaigns
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(TAB_ROUTES[tab])}
          sx={{
            borderRadius: "999px", px: 2.5, py: 1.2, fontSize: 14, fontWeight: 700,
            background: "linear-gradient(135deg, #0077b6 0%, #005a8d 100%)",
            boxShadow: "0 4px 14px rgba(0,119,182,0.32)", textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #005a8d 0%, #004a75 100%)",
              boxShadow: "0 6px 20px rgba(0,119,182,0.38)",
            },
          }}
        >
          Add New
        </Button>
      </Box>

      {/* ── Stat Cards (categories tab only) ── */}
      {tab === 0 && (
        <Grid container spacing={2} mb={3}>
          {[
            { label: "Total Categories", value: categories.length, color: "#0077b6", bg: "linear-gradient(135deg,#E0F2FE,#BAE6FD)", dot: "#0077b6" },
            { label: "Active", value: activeCount, color: "#10B981", bg: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", dot: "#10B981" },
            { label: "Inactive", value: inactiveCount, color: "#F59E0B", bg: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", dot: "#F59E0B" },
            { label: "Total Listings", value: totalListings, color: "#3B82F6", bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)", dot: "#3B82F6" },
          ].map((s) => (
            <Grid size={{ xs: 6, md: 3 }} key={s.label}>
              <Box sx={{
                background: s.bg, borderRadius: "16px", p: 2.2,
                border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "transform .2s", "&:hover": { transform: "translateY(-2px)" },
              }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: s.dot }} />
                  <Typography sx={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>{s.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Tabs ── */}
      <Box mb={3}>
        <SegmentedTabs
          options={TABS}
          value={TABS[tab]}
          onChange={(v) => setTab(TABS.indexOf(v))}
        />
      </Box>

      {/* ── Search + Filter + View (categories tab only) ── */}
      {tab === 0 && (
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1.5} mb={2.5}>
          <TextField
            size="small" placeholder="Search categories…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: "10px", background: "#fff", fontSize: 14 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                </InputAdornment>
              ),
            }}
          />
          <Box display="flex" gap={0.8}>
            {FILTERS.map((f) => (
              <Chip key={f} label={f} onClick={() => setFilter(f)} sx={{
                fontWeight: 600, fontSize: 13, borderRadius: "8px", border: "1px solid",
                borderColor: filter === f ? "#0077b6" : "#E2E8F0",
                background: filter === f ? "#E0F2FE" : "#fff",
                color: filter === f ? "#005a8d" : "#64748B",
                "&:hover": { background: "#E0F2FE", borderColor: "#0077b6" }, cursor: "pointer",
              }} />
            ))}
          </Box>
          <ToggleButtonGroup
            value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small"
            sx={{
              "& .MuiToggleButton-root": {
                border: "1px solid #E2E8F0", borderRadius: "8px !important",
                px: 1.2, color: "#94A3B8",
                "&.Mui-selected": { background: "#E0F2FE", color: "#005a8d", borderColor: "#0077b6" },
              },
              gap: 0.5,
            }}
          >
            <ToggleButton value="grid"><GridViewIcon sx={{ fontSize: 18 }} /></ToggleButton>
            <ToggleButton value="list"><ViewListIcon sx={{ fontSize: 18 }} /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* ── Category Grid / Empty State ── */}
      {tab === 0 && (
        filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10, background: "#fff", borderRadius: "20px", border: "1px dashed #CBD5E1" }}>
            <Typography fontSize={40}>🔍</Typography>
            <Typography fontWeight={700} color="#0F172A" mt={1}>No categories found</Typography>
            <Typography color="#94A3B8" fontSize={14} mt={0.5}>Try adjusting your search or filter</Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filtered.map((cat) => (
              <Grid size={viewMode === "grid" ? { xs: 12, sm: 6, md: 4 } : { xs: 12 }} key={cat.id}>
                <CategoryCard
                  category={cat} viewMode={viewMode}
                  onToggle={toggleCategory}
                  onDelete={(id) => setDeleteId(id)}
                  onEdit={(id) => setEditCategoryId(id)}
                />
              </Grid>
            ))}
          </Grid>
        )
      )}

      {tab === 1 && <BannerTable banners={banners} onEdit={(id) => setEditBannerId(id)} onDelete={(id) => setDeleteBannerId(id)} />}
      {tab === 2 && <PromotionTable promotions={promotions} onEdit={(id) => setEditPromotionId(id)} onDelete={(id) => setDeletePromotionId(id)} />}

      {/* ── Edit Category Modal ── */}
      <EditCategory
        categoryId={editCategoryId ?? undefined}
        open={editCategoryId !== null}
        onClose={() => setEditCategoryId(null)}
        onSaved={() => { setEditCategoryId(null); refresh(); }}
      />

      {/* ── Edit Banner Modal ── */}
      <EditBanner
        bannerId={editBannerId ?? undefined}
        open={editBannerId !== null}
        onClose={() => setEditBannerId(null)}
        onSaved={() => { setEditBannerId(null); refresh(); }}
      />

      {/* ── Edit Promotion Modal ── */}
      <EditPromotion
        promotionId={editPromotionId ?? undefined}
        open={editPromotionId !== null}
        onClose={() => setEditPromotionId(null)}
        onSaved={() => { setEditPromotionId(null); refresh(); }}
      />

      {/* ── Delete Banner Confirmation ── */}
      <Dialog open={deleteBannerId !== null} onClose={() => setDeleteBannerId(null)} TransitionComponent={SlideUp}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" } }}>
        <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 1 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
            <WarningAmberRoundedIcon sx={{ color: "#EF4444", fontSize: 30 }} />
          </Box>
          <Typography fontWeight={800} fontSize={18} color="#0F172A">Delete Banner</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <DialogContentText sx={{ color: "#64748B", fontSize: 14 }}>Are you sure you want to delete this banner? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 1.5, pb: 3, px: 3 }}>
          <Button fullWidth onClick={() => setDeleteBannerId(null)} sx={{ borderRadius: "10px", border: "1px solid #E2E8F0", color: "#64748B", fontWeight: 600, textTransform: "none", py: 1.1 }}>Cancel</Button>
          <Button fullWidth onClick={handleDeleteBannerConfirm} sx={{ borderRadius: "10px", background: "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", fontWeight: 700, textTransform: "none", py: 1.1 }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Promotion Confirmation ── */}
      <Dialog open={deletePromotionId !== null} onClose={() => setDeletePromotionId(null)} TransitionComponent={SlideUp}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" } }}>
        <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 1 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5 }}>
            <WarningAmberRoundedIcon sx={{ color: "#EF4444", fontSize: 30 }} />
          </Box>
          <Typography fontWeight={800} fontSize={18} color="#0F172A">Delete Promotion</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <DialogContentText sx={{ color: "#64748B", fontSize: 14 }}>Are you sure you want to delete this promotion? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 1.5, pb: 3, px: 3 }}>
          <Button fullWidth onClick={() => setDeletePromotionId(null)} sx={{ borderRadius: "10px", border: "1px solid #E2E8F0", color: "#64748B", fontWeight: 600, textTransform: "none", py: 1.1 }}>Cancel</Button>
          <Button fullWidth onClick={handleDeletePromotionConfirm} sx={{ borderRadius: "10px", background: "linear-gradient(135deg,#EF4444,#DC2626)", color: "#fff", fontWeight: 700, textTransform: "none", py: 1.1 }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Category Confirmation Dialog ── */}
      <Dialog
        open={deleteId !== null}
        onClose={handleDeleteClose}
        TransitionComponent={SlideUp}
        PaperProps={{ sx: { borderRadius: "20px", p: 1, maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" } }}
      >
        <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 1 }}>
          <Box sx={{
            width: 60, height: 60, borderRadius: "50%", background: "#FEF2F2",
            display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.5,
          }}>
            <WarningAmberRoundedIcon sx={{ color: "#EF4444", fontSize: 30 }} />
          </Box>
          <Typography fontWeight={800} fontSize={18} color="#0F172A">Delete Category</Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <DialogContentText sx={{ color: "#64748B", fontSize: 14 }}>
            Are you sure you want to delete{" "}
            <Box component="span" fontWeight={700} color="#0F172A">
              "{categoryToDelete?.name}"
            </Box>
            ?{" "}
            {(categoryToDelete?.listings ?? 0) > 0 ? (
              <>
                Its{" "}
                <Box component="span" fontWeight={700} color="#F59E0B">
                  {categoryToDelete?.listings} listing(s)
                </Box>{" "}
                will be parked safely and{" "}
                <Box component="span" fontWeight={700} color="#10B981">
                  automatically restored
                </Box>{" "}
                when you re-add a category with the same name.
              </>
            ) : (
              "This action cannot be undone."
            )}
          </DialogContentText>

          {deleteError && (
            <Alert severity="error" onClose={() => setDeleteError(null)}
              sx={{ mt: 2, textAlign: "left", borderRadius: "10px", fontSize: 13 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 1.5, pb: 3, px: 3 }}>
          <Button
            fullWidth onClick={handleDeleteClose} disabled={deleteLoading}
            sx={{
              borderRadius: "10px", border: "1px solid #E2E8F0",
              color: "#64748B", fontWeight: 600, textTransform: "none", py: 1.1,
              "&:hover": { background: "#F8FAFC" },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth onClick={handleDeleteConfirm} disabled={deleteLoading}
            sx={{
              borderRadius: "10px",
              background: "linear-gradient(135deg,#EF4444,#DC2626)",
              color: "#fff", fontWeight: 700, textTransform: "none", py: 1.1,
              boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg,#DC2626,#B91C1C)",
                boxShadow: "0 6px 20px rgba(239,68,68,0.45)",
              },
              "&.Mui-disabled": { background: "#E2E8F0", color: "#94A3B8", boxShadow: "none" },
            }}
          >
            {deleteLoading ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
}

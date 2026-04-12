// src/pages/admin/contentManagement/ContentManagement.tsx
import { useState, useMemo } from "react";
import {
  Box, Typography, Button, Paper, Grid, Card, CardContent,
  Switch, IconButton, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Avatar, LinearProgress, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Category SVG icons — matching the UI screenshot style
import HotelIcon from "@mui/icons-material/ApartmentOutlined";
import CarIcon from "@mui/icons-material/DirectionsCarOutlined";
import ActivityIcon from "@mui/icons-material/HikingOutlined";
import RestaurantIcon from "@mui/icons-material/RestaurantMenuOutlined";
import EventIcon from "@mui/icons-material/ConfirmationNumberOutlined";

import { useNavigate } from "react-router-dom";
import type { Category, Banner, Promotion } from "./types/contentType";
import {
  categories as initCategories,
  banners as initBanners,
  promotions as initPromotions,
} from "./data/mockData";

// ─── Per-category icon + colour config ───────────────────
const CAT_CONFIG: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  Hotels:         { icon: <HotelIcon sx={{ fontSize: 26 }} />,     bg: "#e3f0fb", color: "#1565c0" },
  "Car Rentals":  { icon: <CarIcon sx={{ fontSize: 26 }} />,       bg: "#e8f5e9", color: "#2e7d32" },
  Activities:     { icon: <ActivityIcon sx={{ fontSize: 26 }} />,  bg: "#fff8e1", color: "#f57f17" },
  Restaurants:    { icon: <RestaurantIcon sx={{ fontSize: 26 }} />,bg: "#fce4ec", color: "#c2185b" },
  "Event Tickets":{ icon: <EventIcon sx={{ fontSize: 26 }} />,     bg: "#ede7f6", color: "#6a1b9a" },
};
const DEFAULT_CAT = { icon: <HotelIcon sx={{ fontSize: 26 }} />, bg: "#f0f4f8", color: "#455a64" };

// ─── Placement chip colours ───────────────────────────────
const PLACEMENT_COLOR: Record<string, { bg: string; color: string }> = {
  "Homepage Hero":   { bg: "#e3f0fb", color: "#1565c0" },
  "Homepage Banner": { bg: "#e8f5e9", color: "#2e7d32" },
  "Category Pages":  { bg: "#fff3e0", color: "#e65100" },
};

// ─── Status styles ────────────────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Active:   { bg: "#e6f4ea", color: "#2e7d32" },
  Inactive: { bg: "#f5f5f5", color: "#9e9e9e" },
  Expired:  { bg: "#fdecea", color: "#c62828" },
  Draft:    { bg: "#fff8e1", color: "#f57f17" },
};

// ─── Confirm delete dialog ────────────────────────────────
function ConfirmDialog({
  open, label, onConfirm, onClose,
}: { open: boolean; label: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>{label}</strong>? This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", borderRadius: 2 }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ textTransform: "none", borderRadius: 2 }}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function ContentManagement() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  // live state
  const [categories, setCategories] = useState<Category[]>(initCategories);
  const [banners, setBanners]       = useState<Banner[]>(initBanners);
  const [promotions, setPromotions] = useState<Promotion[]>(initPromotions);

  // delete confirm
  type DelTarget = { id: number; label: string; kind: "cat" | "ban" | "promo" };
  const [delTarget, setDelTarget] = useState<DelTarget | null>(null);

  const confirmDelete = () => {
    if (!delTarget) return;
    if (delTarget.kind === "cat")   setCategories(p => p.filter(c => c.id !== delTarget.id));
    if (delTarget.kind === "ban")   setBanners(p => p.filter(b => b.id !== delTarget.id));
    if (delTarget.kind === "promo") setPromotions(p => p.filter(p2 => p2.id !== delTarget.id));
    setDelTarget(null);
  };

  const toggleCategory = (id: number) =>
    setCategories(p => p.map(c => c.id === id ? { ...c, status: !c.status } : c));

  const addPaths = ["/admin/categories/add", "/admin/banners/add", "/admin/promotions/add"];

  // ── Promotions helpers ──
  const promoRows = useMemo(() => promotions.map(promo => {
    const usagePct = promo.usageLimit
      ? Math.min(Math.round((promo.usageCount / promo.usageLimit) * 100), 100)
      : 100;
    const usageLabel = promo.usageLimit
      ? `${promo.usageCount}/${promo.usageLimit}`
      : `${promo.usageCount.toLocaleString()}/unlimited`;
    return { ...promo, usagePct, usageLabel };
  }), [promotions]);

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={0.5}>
            Content Management
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            Manage categories, banners, and promotional campaigns
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(addPaths[tab])}
          sx={{
            bgcolor: "#0077B6", "&:hover": { bgcolor: "#005A8D" },
            textTransform: "none", borderRadius: 2,
            px: 2.5, py: 1.2, fontSize: 14, fontWeight: 600,
          }}
        >
          Add New
        </Button>
      </Box>

      {/* ── Underline Tabs — exact match to UI screenshot ── */}
      <Box sx={{ borderBottom: "1px solid #e0e0e0", mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 44,
            "& .MuiTabs-indicator": { bgcolor: "#0077B6", height: 2.5 },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: 15,
              color: "#64748b",
              minHeight: 44,
              px: 0,
              mr: 4,
            },
            "& .Mui-selected": {
              color: "#0077B6 !important",
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Categories" disableRipple />
          <Tab label="Banners"    disableRipple />
          <Tab label="Promotions" disableRipple />
        </Tabs>
      </Box>

      {/* ══════════ CATEGORIES ══════════ */}
      {tab === 0 && (
        <Grid container spacing={2}>
          {categories.map((cat) => {
            const cfg = CAT_CONFIG[cat.name] ?? DEFAULT_CAT;
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: "1px solid #e8edf2",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                    bgcolor: "#fff",
                    "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.10)" },
                    transition: "box-shadow 0.2s",
                  }}
                >
                  <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>

                    {/* Top row: icon + name + actions */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box display="flex" gap={1.5} alignItems="center">
                        {/* Coloured icon box — matches screenshot style */}
                        <Box
                          sx={{
                            width: 48, height: 48, borderRadius: 2,
                            bgcolor: cfg.bg,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: cfg.color, flexShrink: 0,
                          }}
                        >
                          {cfg.icon}
                        </Box>

                        <Box>
                          <Typography fontWeight={700} fontSize={15} lineHeight={1.3}>
                            {cat.name}
                          </Typography>
                          <Typography fontSize={12} color="text.secondary" mt={0.2}>
                            {cat.listings} listings
                          </Typography>
                        </Box>
                      </Box>

                      {/* Edit / Delete icons — top-right, matching screenshot */}
                      <Box display="flex" alignItems="center" gap={0.2} ml={1}>
                        <IconButton
                          size="small"
                          sx={{ color: "#4a90e2", "&:hover": { bgcolor: "#e3f0fb" } }}
                        >
                          <EditIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#e53935", "&:hover": { bgcolor: "#fdecea" } }}
                          onClick={() => setDelTarget({ id: cat.id, label: cat.name, kind: "cat" })}
                        >
                          <DeleteIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ borderTop: "1px solid #f0f4f8", mt: 2, pt: 1.5 }} />

                    {/* Bottom row: status text + toggle */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography
                        fontSize={13}
                        fontWeight={600}
                        color={cat.status ? "#2e7d32" : "#9e9e9e"}
                      >
                        {cat.status ? "Active" : "Inactive"}
                      </Typography>
                      <Switch
                        checked={cat.status}
                        onChange={() => toggleCategory(cat.id)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#fff" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            bgcolor: "#0077B6", opacity: 1,
                          },
                          "& .MuiSwitch-track": { opacity: 1 },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          {categories.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box py={8} textAlign="center">
                <Typography color="text.secondary">No categories yet. Click "Add New" to create one.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* ══════════ BANNERS ══════════ */}
      {tab === 1 && (
        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #e8edf2" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                {["Banner", "Placement", "Duration", "Status", "Actions"].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: 13, color: "#64748b", py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map((banner) => {
                const pc = PLACEMENT_COLOR[banner.placement] ?? { bg: "#f0f0f0", color: "#555" };
                const sc = STATUS_STYLE[banner.status] ?? STATUS_STYLE.Inactive;
                return (
                  <TableRow key={banner.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar variant="rounded" sx={{ bgcolor: "#e8f0fe", width: 44, height: 44, borderRadius: 2 }}>
                          <ImageIcon sx={{ color: "#4a90e2", fontSize: 22 }} />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} fontSize={14}>{banner.title}</Typography>
                          <Typography fontSize={12} color="text.secondary">{banner.description}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={banner.placement} size="small"
                        sx={{ bgcolor: pc.bg, color: pc.color, fontWeight: 500, fontSize: 12 }} />
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={13}>{banner.startDate}</Typography>
                      <Typography fontSize={12} color="text.secondary">to {banner.endDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={banner.status} size="small"
                        sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 500, fontSize: 12 }} />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton size="small" sx={{ color: "#4a90e2", "&:hover": { bgcolor: "#e3f0fb" } }}>
                          <EditIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                        <IconButton size="small"
                          sx={{ color: "#e53935", "&:hover": { bgcolor: "#fdecea" } }}
                          onClick={() => setDelTarget({ id: banner.id, label: banner.title, kind: "ban" })}
                        >
                          <DeleteIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {banners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box py={6} textAlign="center">
                      <Typography color="text.secondary" fontSize={14}>No banners yet.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ══════════ PROMOTIONS ══════════ */}
      {tab === 2 && (
        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #e8edf2" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                {["Promo Code", "Type", "Value", "Usage", "Duration", "Status", "Actions"].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, fontSize: 13, color: "#64748b", py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {promoRows.map((promo) => {
                const sc = STATUS_STYLE[promo.status] ?? STATUS_STYLE.Draft;
                return (
                  <TableRow key={promo.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LocalOfferIcon sx={{ fontSize: 15, color: "#0077B6" }} />
                        <Typography fontWeight={700} fontSize={14} letterSpacing={0.6} fontFamily="monospace">
                          {promo.code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={13}>{promo.type}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700} fontSize={14} color="#0077B6">
                        {promo.type === "Percentage" ? `${promo.value}%` : `$${promo.value}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={12} mb={0.5}>{promo.usageLabel}</Typography>
                      <LinearProgress
                        variant="determinate" value={promo.usagePct}
                        sx={{
                          height: 6, borderRadius: 4, width: 100,
                          bgcolor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": { bgcolor: "#0077B6", borderRadius: 4 },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={13}>{promo.startDate}</Typography>
                      <Typography fontSize={12} color="text.secondary">to {promo.endDate}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={promo.status} size="small"
                        sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 500, fontSize: 12 }} />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <IconButton size="small" sx={{ color: "#4a90e2", "&:hover": { bgcolor: "#e3f0fb" } }}>
                          <EditIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                        <IconButton size="small"
                          sx={{ color: "#e53935", "&:hover": { bgcolor: "#fdecea" } }}
                          onClick={() => setDelTarget({ id: promo.id, label: promo.code, kind: "promo" })}
                        >
                          <DeleteIcon sx={{ fontSize: 17 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {promotions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box py={6} textAlign="center">
                      <Typography color="text.secondary" fontSize={14}>No promotions yet.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ── Confirm delete dialog ── */}
      <ConfirmDialog
        open={!!delTarget}
        label={delTarget?.label ?? ""}
        onConfirm={confirmDelete}
        onClose={() => setDelTarget(null)}
      />
    </Box>
  );
}

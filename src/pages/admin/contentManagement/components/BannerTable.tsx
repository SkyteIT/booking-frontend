// src/pages/admin/contentManagement/components/BannerTable.tsx
// Renders a MUI Table listing all banners with placement, duration, status chips,
// and edit / delete action buttons. Purely presentational — no local state.

import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Chip,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import type { Banner } from "../types/contentType";

interface Props {
  banners: Banner[];
  onEdit: (id: string) => void;   // Opens the EditBanner modal in the parent
  onDelete: (id: string) => void; // Opens the delete confirmation dialog in the parent
}

// Background colour per placement label — purely decorative
const placementColor: Record<string, string> = {
  Home: "#e3f0fb",
  Explore: "#e8f5e9",
  "Homepage Hero": "#e3f0fb",
  "Homepage Banner": "#e3f0fb",
  "Category Pages": "#e8f5e9",
};

export default function BannerTable({ banners, onEdit, onDelete }: Props) {
  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Table>
        {/* ── Column headers ── */}
        <TableHead>
          <TableRow sx={{ bgcolor: "#f9fafb" }}>
            <TableCell sx={{ fontWeight: 600 }}>Banner</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Placement</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id} hover>

              {/* ── Banner thumbnail + title / description ── */}
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  {/* Fallback avatar shown when no real image is available */}
                  <Avatar
                    variant="rounded"
                    sx={{ bgcolor: "#e8f0fe", width: 48, height: 48 }}
                  >
                    <ImageIcon sx={{ color: "#4a90e2" }} />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} fontSize={14}>
                      {banner.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontSize={12}>
                      {banner.description}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* ── Placement chip — colour keyed from placementColor map ── */}
              <TableCell>
                <Chip
                  label={banner.placement}
                  size="small"
                  sx={{
                    bgcolor: placementColor[banner.placement] ?? "#f0f0f0",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                />
              </TableCell>

              {/* ── Start / end dates ── */}
              <TableCell>
                <Typography fontSize={13}>{banner.startDate}</Typography>
                <Typography fontSize={12} color="text.secondary">
                  to {banner.endDate}
                </Typography>
              </TableCell>

              {/* ── Active / Inactive status chip ── */}
              <TableCell>
                <Chip
                  label={banner.status}
                  size="small"
                  sx={{
                    bgcolor: banner.status === "Active" ? "#e6f4ea" : "#f5f5f5",
                    color:   banner.status === "Active" ? "#2e7d32" : "#757575",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                />
              </TableCell>

              {/* ── Edit / Delete action buttons ── */}
              <TableCell>
                <Box display="flex" gap={0.5}>
                  <IconButton size="small" color="primary" onClick={() => onEdit(banner.id)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDelete(banner.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

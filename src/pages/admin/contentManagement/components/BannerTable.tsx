// src/pages/admin/contentManagement/components/BannerTable.tsx
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
}

const placementColor: Record<string, string> = {
  "Homepage Hero": "#e3f0fb",
  "Homepage Banner": "#e8f5e9",
  "Category Pages": "#fff3e0",
};

export default function BannerTable({ banners }: Props) {
  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Table>
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
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
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

              <TableCell>
                <Typography fontSize={13}>
                  {banner.startDate}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  to {banner.endDate}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={banner.status}
                  size="small"
                  sx={{
                    bgcolor: banner.status === "Active" ? "#e6f4ea" : "#f5f5f5",
                    color: banner.status === "Active" ? "#2e7d32" : "#757575",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                />
              </TableCell>

              <TableCell>
                <Box display="flex" gap={0.5}>
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error">
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

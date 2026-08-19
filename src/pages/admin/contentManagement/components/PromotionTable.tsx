// src/pages/admin/contentManagement/components/PromotionTable.tsx
import {Paper,Table,TableHead,TableRow,TableCell,TableBody,Typography,Chip,IconButton,Box,LinearProgress,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import type { Promotion } from "../types/contentType";

interface Props {
  promotions: Promotion[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<string, { bg: string; color: string }> = {
  Active:  { bg: "#e6f4ea", color: "#2e7d32" },
  Expired: { bg: "#f5f5f5", color: "#757575" },
  Draft:   { bg: "#fff8e1", color: "#f57f17" },
};

export default function PromotionTable({ promotions, onEdit, onDelete }: Props) {
  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f9fafb" }}>
            <TableCell sx={{ fontWeight: 600 }}>Promo Code</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Usage</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {promotions.map((promo) => {
            const usagePercent = promo.usageLimit
              ? Math.round((promo.usageCount / promo.usageLimit) * 100)
              : 100;
            const usageLabel = promo.usageLimit
              ? `${promo.usageCount}/${promo.usageLimit}`
              : `${promo.usageCount.toLocaleString()}/unlimited`;
            const style = statusStyles[promo.status] ?? statusStyles.Draft;

            return (
              <TableRow key={promo.id} hover>
                {/* Promo Code */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocalOfferIcon sx={{ fontSize: 16, color: "#4a90e2" }} />
                    <Typography fontWeight={700} fontSize={14} letterSpacing={0.5}>
                      {promo.code}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Type */}
                <TableCell>
                  <Typography fontSize={13}>{promo.type}</Typography>
                </TableCell>

                {/* Value */}
                <TableCell>
                  <Typography fontWeight={700} fontSize={14} color="primary">
                    {promo.type === "Percentage"
                      ? `${promo.value}%`
                      : `$${promo.value}`}
                  </Typography>
                </TableCell>

                {/* Usage with progress bar */}
                <TableCell>
                  <Typography fontSize={12} mb={0.5}>{usageLabel}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(usagePercent, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 4,
                      bgcolor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": { bgcolor: "#0077B6" },
                      width: 100,
                    }}
                  />
                </TableCell>

                {/* Duration */}
                <TableCell>
                  <Typography fontSize={13}>{promo.startDate}</Typography>
                  <Typography fontSize={12} color="text.secondary">
                    to {promo.endDate}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={promo.status}
                    size="small"
                    sx={{
                      bgcolor: style.bg,
                      color: style.color,
                      fontWeight: 500,
                      fontSize: 12,
                    }}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small" color="primary" onClick={() => onEdit(promo.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(promo.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
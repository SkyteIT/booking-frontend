// src/pages/admin/contentManagement/components/CategoryCard.tsx
import {
  Typography,
  Switch,
  IconButton,
  Box,
  Tooltip,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FlightIcon from "@mui/icons-material/Flight";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CategoryIcon from "@mui/icons-material/Category";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useNavigate } from "react-router-dom";

import type { Category } from "../types/contentType";

interface IconConfig {
  icon: React.ReactNode;
  color: string;
  bg: string;
  gradient: string;
}

const CATEGORY_ICON_MAP: Record<string, IconConfig> = {
  hotels: {
    icon: <HotelIcon sx={{ fontSize: 26 }} />,
    color: "#1565C0", bg: "#E3F2FD",
    gradient: "linear-gradient(135deg,#1565C0,#1976D2)",
  },
  "car rentals": {
    icon: <DirectionsCarIcon sx={{ fontSize: 26 }} />,
    color: "#6A1B9A", bg: "#F3E5F5",
    gradient: "linear-gradient(135deg,#6A1B9A,#8E24AA)",
  },
  activities: {
    icon: <LocalActivityIcon sx={{ fontSize: 26 }} />,
    color: "#2E7D32", bg: "#E8F5E9",
    gradient: "linear-gradient(135deg,#2E7D32,#388E3C)",
  },
  restaurants: {
    icon: <RestaurantIcon sx={{ fontSize: 26 }} />,
    color: "#E65100", bg: "#FFF3E0",
    gradient: "linear-gradient(135deg,#E65100,#F57C00)",
  },
  "event tickets": {
    icon: <ConfirmationNumberIcon sx={{ fontSize: 26 }} />,
    color: "#C62828", bg: "#FFEBEE",
    gradient: "linear-gradient(135deg,#C62828,#E53935)",
  },
  flights: {
    icon: <FlightIcon sx={{ fontSize: 26 }} />,
    color: "#00838F", bg: "#E0F7FA",
    gradient: "linear-gradient(135deg,#00838F,#00ACC1)",
  },
  tours: {
    icon: <BeachAccessIcon sx={{ fontSize: 26 }} />,
    color: "#F9A825", bg: "#FFFDE7",
    gradient: "linear-gradient(135deg,#F9A825,#FBC02D)",
  },
};

function getCategoryIcon(name: string): IconConfig {
  return (
    CATEGORY_ICON_MAP[name.toLowerCase()] ?? {
      icon: <CategoryIcon sx={{ fontSize: 26 }} />,
      color: "#546E7A",
      bg: "#ECEFF1",
      gradient: "linear-gradient(135deg,#546E7A,#607D8B)",
    }
  );
}

interface Props {
  category: Category;
  viewMode?: "grid" | "list";
  onToggle: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}

export default function CategoryCard({
  category,
  viewMode = "grid",
  onToggle,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const { icon, color, bg, gradient } = getCategoryIcon(category.name);

  if (viewMode === "list") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "#fff",
          borderRadius: "16px",
          p: 2,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          transition: "box-shadow .2s, transform .2s",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transform: "translateY(-1px)",
          },
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: gradient,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        {/* Name + listings */}
        <Box flex={1}>
          <Typography fontWeight={700} fontSize={15} color="#0F172A">
            {category.name}
          </Typography>
          <Typography fontSize={13} color="#94A3B8">
            {category.listings} listings
          </Typography>
        </Box>

        {/* Status chip */}
        <Chip
          label={category.status ? "Active" : "Inactive"}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: 12,
            borderRadius: "8px",
            background: category.status ? "#ECFDF5" : "#F8FAFC",
            color: category.status ? "#10B981" : "#94A3B8",
            border: `1px solid ${category.status ? "#A7F3D0" : "#E2E8F0"}`,
          }}
        />

        {/* Toggle */}
        <Switch
          checked={category.status}
          size="small"
          onChange={(e) => onToggle(String(category.id), e.target.checked)}
        />

        {/* Actions */}
        <Box display="flex" gap={0.5}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
              sx={{ color: "#6366F1", "&:hover": { background: "#EEF2FF" } }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete(String(category.id))}
              sx={{ color: "#EF4444", "&:hover": { background: "#FEF2F2" } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }

  // ── Grid card ──
  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "20px",
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow .25s, transform .25s",
        "&:hover": {
          boxShadow: `0 8px 30px ${color}25`,
          transform: "translateY(-3px)",
        },
        "&:hover .card-banner": {
          opacity: 1,
        },
      }}
    >
      {/* Coloured top banner */}
      <Box
        className="card-banner"
        sx={{
          height: 6,
          background: gradient,
          opacity: 0.7,
          transition: "opacity .25s",
        }}
      />

      <Box sx={{ p: 2.5 }}>
        {/* Top row: icon + actions */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          {/* Icon */}
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "14px",
              background: gradient,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 14px ${color}40`,
            }}
          >
            {icon}
          </Box>

          {/* Action buttons */}
          <Box display="flex" gap={0.5}>
            <Tooltip title="Edit category">
              <IconButton
                size="small"
                onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                sx={{
                  width: 32,
                  height: 32,
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  color: "#6366F1",
                  "&:hover": { background: "#EEF2FF", borderColor: "#6366F1" },
                }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete category">
              <IconButton
                size="small"
                onClick={() => onDelete(String(category.id))}
                sx={{
                  width: 32,
                  height: 32,
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  color: "#EF4444",
                  "&:hover": { background: "#FEF2F2", borderColor: "#EF4444" },
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Name */}
        <Typography fontWeight={800} fontSize={16} color="#0F172A" mb={0.5}>
          {category.name}
        </Typography>

        {/* Listings count */}
        <Box display="flex" alignItems="center" gap={0.6} mb={2.5}>
          <FormatListBulletedIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
          <Typography fontSize={13} color="#94A3B8" fontWeight={500}>
            {category.listings} listing{category.listings !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{ height: 1, background: "#F1F5F9", mx: -2.5, mb: 2 }} />

        {/* Status + toggle */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={category.status ? "Active" : "Inactive"}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              borderRadius: "8px",
              background: category.status ? "#ECFDF5" : "#F8FAFC",
              color: category.status ? "#10B981" : "#94A3B8",
              border: `1px solid ${category.status ? "#A7F3D0" : "#E2E8F0"}`,
            }}
          />
          <Switch
            checked={category.status}
            onChange={(e) => onToggle(String(category.id), e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#10B981" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                background: "#10B981",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
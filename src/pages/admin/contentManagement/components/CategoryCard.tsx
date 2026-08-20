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
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import type { Category } from "../types/contentType";

interface IconConfig {
  icon: React.ReactNode;
  color: string;
  bg: string;
  gradient: string;
}

const CATEGORY_ICON_MAP: Record<string, IconConfig> = {
  hotels: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🏨</span>,
    color: "#1565C0",
    bg: "#E3F2FD",
    gradient: "linear-gradient(135deg,#1565C0,#1976D2)",
  },
  "car rentals": {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🚗</span>,
    color: "#6A1B9A",
    bg: "#F3E5F5",
    gradient: "linear-gradient(135deg,#6A1B9A,#8E24AA)",
  },
  activities: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🎫</span>,
    color: "#2E7D32",
    bg: "#E8F5E9",
    gradient: "linear-gradient(135deg,#2E7D32,#388E3C)",
  },
  restaurants: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🍽️</span>,
    color: "#E65100",
    bg: "#FFF3E0",
    gradient: "linear-gradient(135deg,#E65100,#F57C00)",
  },
  "event tickets": {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🎟️</span>,
    color: "#C62828",
    bg: "#FFEBEE",
    gradient: "linear-gradient(135deg,#C62828,#E53935)",
  },
  flights: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>✈️</span>,
    color: "#00838F",
    bg: "#E0F7FA",
    gradient: "linear-gradient(135deg,#00838F,#00ACC1)",
  },
  tours: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🏖️</span>,
    color: "#F9A825",
    bg: "#FFFDE7",
    gradient: "linear-gradient(135deg,#F9A825,#FBC02D)",
  },
};

function getCategoryIcon(name: string): IconConfig {
  return (
    CATEGORY_ICON_MAP[name.toLowerCase()] ?? {
      icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🏷️</span>,
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
  onEdit: (id: string) => void;
}

export default function CategoryCard({
  category,
  viewMode = "grid",
  onToggle,
  onDelete,
  onEdit,
}: Props) {
  const fallbackIcon = getCategoryIcon(category.name);
  const { color, gradient } = fallbackIcon;
  const icon = category.icon?.trim() ? <Typography fontSize={26} lineHeight={1}>{category.icon}</Typography> : fallbackIcon.icon;
  const iconTileSx = {
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: `0 16px 30px ${color}22, inset 0 1px 0 rgba(255,255,255,0.7)`,
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.06) 42%, rgba(0,0,0,0.04) 100%)",
      pointerEvents: "none",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: "8px 10px auto 10px",
      height: "28%",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.55)",
      filter: "blur(6px)",
      pointerEvents: "none",
    },
  } as const;

  if (viewMode === "list") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
          backdropFilter: "blur(10px)",
          borderRadius: "22px",
          p: 2.75,
          border: "1px solid rgba(0,0,0,0.04)",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          transition: "box-shadow .3s ease, transform .3s ease, border-color .3s ease",
          "&:hover": {
            boxShadow: "0 16px 40px rgba(15,23,42,0.1)",
            transform: "translateY(-3px)",
            borderColor: "#CBD5E1",
          },
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "16px",
            background: gradient,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            ...iconTileSx,
          }}
        >
          {icon}
        </Box>

        <Box flex={1}>
          <Typography fontWeight={700} fontSize={15} color="#0F172A">
            {category.name}
          </Typography>
          <Typography fontSize={13} color="#94A3B8">
            {category.listings} listings
          </Typography>
        </Box>

        {category.type && (
          <Chip
            label={category.type}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 12,
              borderRadius: "8px",
              background: "#F1F5F9",
              color: "#475569",
              border: "1px solid #E2E8F0",
            }}
          />
        )}

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
          size="small"
          onChange={(e) => onToggle(String(category.id), e.target.checked)}
        />

        <Box display="flex" gap={0.5}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(String(category.id))}
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                color: "#2563EB",
                background: "#fff",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "#EFF6FF",
                  borderColor: "#2563EB",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete(String(category.id))}
              sx={{
                width: 38,
                height: 38,
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                color: "#DC2626",
                background: "#fff",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "#FEE2E2",
                  borderColor: "#DC2626",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(160deg, #FFFFFF 0%, #F0F8FE 100%)",
        backdropFilter: "blur(10px)",
        borderRadius: "24px",
        border: "1px solid rgba(0,0,0,0.04)",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        transition: "box-shadow .3s ease, transform .3s ease",
        "&:hover": {
          boxShadow: `0 18px 40px ${color}24`,
          transform: "translateY(-3px)",
        },
        "&:hover .card-banner": {
          opacity: 1,
        },
      }}
    >
      <Box
        className="card-banner"
        sx={{
          height: 8,
          background: gradient,
          opacity: 0.85,
          transition: "opacity .25s",
        }}
      />

      <Box sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
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
            ...iconTileSx,
          }}
          >
            {icon}
          </Box>

          <Box display="flex" gap={0.75}>
            <Tooltip title="Edit category">
              <IconButton
                size="small"
                onClick={() => onEdit(String(category.id))}
                sx={{
                  width: 38,
                  height: 38,
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  color: "#2563EB",
                  background: "#fff",
                  transition: "all 0.2s ease",
                  boxShadow: "0 6px 16px rgba(37,99,235,0.08)",
                  "&:hover": {
                    background: "#EFF6FF",
                    borderColor: "#2563EB",
                    transform: "translateY(-1px)",
                  },
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
                  width: 38,
                  height: 38,
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  color: "#DC2626",
                  background: "#fff",
                  transition: "all 0.2s ease",
                  boxShadow: "0 6px 16px rgba(220,38,38,0.08)",
                  "&:hover": {
                    background: "#FEE2E2",
                    borderColor: "#DC2626",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography fontWeight={800} fontSize={16} color="#0F172A" mb={0.5}>
          {category.name}
        </Typography>

        {category.type && (
          <Chip
            label={category.type}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 11,
              borderRadius: "8px",
              background: "#F1F5F9",
              color: "#475569",
              border: "1px solid #E2E8F0",
              mb: 1,
            }}
          />
        )}

        <Box display="flex" alignItems="center" gap={0.6} mb={2.5}>
          <FormatListBulletedIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
          <Typography fontSize={13} color="#94A3B8" fontWeight={500}>
            {category.listings} listing{category.listings !== 1 ? "s" : ""}
          </Typography>
        </Box>

        <Box sx={{ height: 1, background: "#F1F5F9", mx: -2.5, mb: 2 }} />

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

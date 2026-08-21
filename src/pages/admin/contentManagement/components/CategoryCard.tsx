// src/pages/admin/contentManagement/components/CategoryCard.tsx
import type { ReactNode } from "react";
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

import type { ListingType } from "../../../../services/Vendor/listingService";
import type { Category } from "../types/contentType";

interface IconConfig {
  icon: ReactNode;
  color: string;
  bg: string;
  gradient: string;
}

type TypeTheme = {
  gradient: string;
  solid: string;
  softBg: string;
  border: string;
  chipBg: string;
  chipColor: string;
  chipBorder: string;
};

const CATEGORY_CARD_THEME = {
  gradient: "linear-gradient(135deg,#0077b6,#4ea3d8 56%,#b6e4fb)",
  solid: "#0077b6",
  softBg: "#F7FBFF",
  border: "#CFE8F9",
  surface: "linear-gradient(160deg,#FFFFFF 0%,#F7FBFF 46%,#EEF7FD 100%)",
  shadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
  hoverShadow: "0 20px 50px rgba(0,119,182,0.16)",
  muted: "#5B728A",
} as const;

const CATEGORY_ICON_MAP: Record<string, IconConfig> = {
  hotels: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🏨</span>,
    color: "#0077b6",
    bg: "#E3F1FC",
    gradient: "linear-gradient(135deg,#0077b6,#4ea3d8)",
  },
  "car rentals": {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🚗</span>,
    color: "#0d5c8f",
    bg: "#DCEFFD",
    gradient: "linear-gradient(135deg,#0d5c8f,#0077b6)",
  },
  activities: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🎫</span>,
    color: "#4ea3d8",
    bg: "#EEF7FD",
    gradient: "linear-gradient(135deg,#4ea3d8,#7cc4eb)",
  },
  restaurants: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🍽️</span>,
    color: "#005f99",
    bg: "#D7ECFA",
    gradient: "linear-gradient(135deg,#005f99,#3b82f6)",
  },
  "event tickets": {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🎟️</span>,
    color: "#2563eb",
    bg: "#DBEAFE",
    gradient: "linear-gradient(135deg,#2563eb,#60a5fa)",
  },
  flights: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>✈️</span>,
    color: "#0077b6",
    bg: "#E3F1FC",
    gradient: "linear-gradient(135deg,#0077b6,#4ea3d8)",
  },
  tours: {
    icon: <span style={{ fontSize: 26, lineHeight: 1 }}>🏖️</span>,
    color: "#0d5c8f",
    bg: "#DCEFFD",
    gradient: "linear-gradient(135deg,#0d5c8f,#0077b6)",
  },
};

const LISTING_TYPE_THEME: Record<ListingType, TypeTheme> = {
  Hotel: {
    gradient: "linear-gradient(135deg,#0077b6,#4ea3d8)",
    solid: "#0077b6",
    softBg: "#E3F1FC",
    border: "#BAE6FD",
    chipBg: "#DBEAFE",
    chipColor: "#0077b6",
    chipBorder: "#93C5FD",
  },
  Restaurant: {
    gradient: "linear-gradient(135deg,#f59e0b,#f97316)",
    solid: "#f59e0b",
    softBg: "#FFFBEB",
    border: "#FCD34D",
    chipBg: "#FEF3C7",
    chipColor: "#B45309",
    chipBorder: "#FCD34D",
  },
  Activity: {
    gradient: "linear-gradient(135deg,#f9a8d4,#f472b6)",
    solid: "#f472b6",
    softBg: "#FDF2F8",
    border: "#FBCFE8",
    chipBg: "#FCE7F3",
    chipColor: "#BE185D",
    chipBorder: "#F9A8D4",
  },
  Event: {
    gradient: "linear-gradient(135deg,#94a3b8,#cbd5e1)",
    solid: "#94a3b8",
    softBg: "#F8FAFC",
    border: "#E2E8F0",
    chipBg: "#E2E8F0",
    chipColor: "#475569",
    chipBorder: "#CBD5E1",
  },
  CarRental: {
    gradient: "linear-gradient(135deg,#8b5cf6,#a855f7)",
    solid: "#8b5cf6",
    softBg: "#F5F3FF",
    border: "#DDD6FE",
    chipBg: "#EDE9FE",
    chipColor: "#6D28D9",
    chipBorder: "#C4B5FD",
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

function getListingTypeTheme(type?: ListingType | null): TypeTheme {
  if (!type) {
    return {
      gradient: "linear-gradient(135deg,#0077b6,#4ea3d8)",
      solid: "#0077b6",
      softBg: "#E3F1FC",
      border: "#BFDBFE",
      chipBg: "#E0F2FE",
      chipColor: "#0077b6",
      chipBorder: "#93C5FD",
    };
  }

  return LISTING_TYPE_THEME[type] ?? LISTING_TYPE_THEME.Hotel;
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
  const typeTheme = getListingTypeTheme(category.type);
  const { chipBg, chipColor, chipBorder } = typeTheme;
  const { solid, gradient, border, surface, shadow, hoverShadow, muted } = CATEGORY_CARD_THEME;
  const icon = category.icon?.trim() ? (
    <Typography fontSize={26} lineHeight={1}>
      {category.icon}
    </Typography>
  ) : fallbackIcon.icon;

  const iconTileSx = {
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    border: "1px solid rgba(255,255,255,0.6)",
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
          background: surface,
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          p: 2.5,
          border: `1px solid ${border}`,
          boxShadow: shadow,
          position: "relative",
          overflow: "hidden",
          transition: "box-shadow .25s ease, transform .25s ease, border-color .25s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(0,119,182,0.08), transparent 35%), linear-gradient(180deg, rgba(255,255,255,0.55), transparent 40%)",
            pointerEvents: "none",
          },
          "&:hover": {
            boxShadow: hoverShadow,
            transform: "translateY(-4px)",
            borderColor: "#7CC4EB",
          },
        }}
      >
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: "18px",
            background: gradient,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 12px 24px rgba(0,119,182,0.18)",
            ...iconTileSx,
          }}
        >
          {icon}
        </Box>

        <Box flex={1} minWidth={0} position="relative">
          <Box display="flex" alignItems="center" gap={1} mb={0.4}>
            <Typography
              fontWeight={800}
              fontSize={15.5}
              color="#0F172A"
              noWrap
              sx={{ letterSpacing: "-0.01em" }}
            >
              {category.name}
            </Typography>
            {category.status ? (
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10B981", flexShrink: 0 }} />
            ) : (
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#94A3B8", flexShrink: 0 }} />
            )}
          </Box>
          <Typography fontSize={13} color={muted} noWrap>
            {category.description || `${category.listings} listing${category.listings !== 1 ? "s" : ""}`}
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
              background: chipBg,
              color: chipColor,
              border: `1px solid ${chipBorder}`,
            }}
          />
        )}

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={category.status ? "Active" : "Inactive"}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              borderRadius: "999px",
              background: category.status ? "#ECFDF5" : "#F8FAFC",
              color: category.status ? "#047857" : "#64748B",
              border: `1px solid ${category.status ? "#A7F3D0" : "#E2E8F0"}`,
            }}
          />
          <Switch
            checked={category.status}
            size="small"
            onChange={(e) => onToggle(String(category.id), e.target.checked)}
          />
        </Box>

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
        background: surface,
        backdropFilter: "blur(10px)",
        borderRadius: "28px",
        border: `1px solid ${border}`,
        overflow: "hidden",
        boxShadow: shadow,
        transition: "box-shadow .25s ease, transform .25s ease, border-color .25s ease",
        position: "relative",
        "&:hover": {
          boxShadow: hoverShadow,
          transform: "translateY(-4px)",
          borderColor: "#7CC4EB",
        },
        "&:hover .card-banner": {
          opacity: 1,
        },
      }}
    >
      <Box
        className="card-banner"
        sx={{
          height: 10,
          background: gradient,
          opacity: 0.9,
          transition: "opacity .25s",
        }}
      />

      <Box sx={{ p: 2.75 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2.25} mb={2.25}>
          <Box
            sx={{
              width: 62,
              height: 62,
              borderRadius: "18px",
              background: gradient,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 12px 24px ${solid}22`,
              flexShrink: 0,
              ...iconTileSx,
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography fontWeight={800} fontSize={17} color="#0F172A" mb={0.4} sx={{ letterSpacing: "-0.02em" }}>
          {category.name}
        </Typography>

        <Typography
          fontSize={13}
          color={muted}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 36,
            mb: 1.5,
          }}
        >
          {category.description || "A category used to organize listings and presentation in the content management module."}
        </Typography>

        {category.type && (
          <Chip
            label={category.type}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 11,
              borderRadius: "8px",
              background: chipBg,
              color: chipColor,
              border: `1px solid ${chipBorder}`,
              mb: 1,
            }}
          />
        )}

        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1.5} mb={2.25}>
          <Box display="flex" alignItems="center" gap={0.6}>
          <FormatListBulletedIcon sx={{ fontSize: 14, color: "#94A3B8" }} />
          <Typography fontSize={13} color="#94A3B8" fontWeight={500}>
            {category.listings} listing{category.listings !== 1 ? "s" : ""}
          </Typography>
          </Box>
          <Chip
            label={category.status ? "Active" : "Inactive"}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: 12,
              borderRadius: "999px",
              background: category.status ? "#ECFDF5" : "#F8FAFC",
              color: category.status ? "#047857" : "#64748B",
              border: `1px solid ${category.status ? "#A7F3D0" : "#E2E8F0"}`,
            }}
          />
        </Box>

        <Box sx={{ height: 1, background: "linear-gradient(90deg, rgba(0,119,182,0.18), rgba(148,163,184,0.15), rgba(0,119,182,0.06))", mx: -2.75, mb: 2.25 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Switch
            checked={category.status}
            onChange={(e) => onToggle(String(category.id), e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#0077b6" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                background: "#0077b6",
              },
            }}
          />
          <Box display="flex" gap={0.5}>
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
      </Box>
    </Box>
  );
}

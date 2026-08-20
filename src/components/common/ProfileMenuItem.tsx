// Shared profile-dropdown row - icon + label, tinted by an accent color,
// used by every portal's navbar menu so they all read as one design
// instead of each navbar rolling its own MenuItem styling.
import { Box, MenuItem } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ComponentProps, ElementType, ReactNode } from "react";

type ProfileMenuItemProps = Omit<ComponentProps<typeof MenuItem>, "children"> & {
  icon: ReactNode;
  label: string;
  accent: string;
  component?: ElementType;
  to?: string;
};

export default function ProfileMenuItem({ icon, label, accent, sx, ...rest }: ProfileMenuItemProps) {
  return (
    <MenuItem
      {...rest}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.1,
        borderRadius: "10px",
        px: 1,
        py: 0.7,
        mb: 0.25,
        fontSize: "0.84rem",
        fontWeight: 500,
        color: accent,
        "&:hover": { backgroundColor: alpha(accent, 0.08) },
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 22,
          height: 22,
          display: "grid",
          placeItems: "center",
          color: accent,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      {label}
    </MenuItem>
  );
}

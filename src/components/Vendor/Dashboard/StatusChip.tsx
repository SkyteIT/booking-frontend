import { Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

type Props = {
  label: string;
  category: string;
};

function getStyles(category: string, theme: Theme) {
  switch (category) {
    case "Pending":
      return {
        bg: alpha(theme.palette.warning.main, 0.12),
        color: theme.palette.warning.dark,
        border: alpha(theme.palette.warning.main, 0.3),
      };
    case "Confirmed":
      return {
        bg: alpha(theme.palette.success.main, 0.12),
        color: theme.palette.success.dark,
        border: alpha(theme.palette.success.main, 0.3),
      };
    case "Cancelled":
      return {
        bg: alpha(theme.palette.error.main, 0.12),
        color: theme.palette.error.dark,
        border: alpha(theme.palette.error.main, 0.3),
      };
    default:
      return {
        bg: alpha(theme.palette.text.primary, 0.06),
        color: theme.palette.text.secondary,
        border: theme.palette.divider,
      };
  }
}

export default function StatusChip({ label, category }: Props) {
  const theme = useTheme();
  const s = getStyles(category, theme);

  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.4,
        fontSize: 12,
        fontWeight: 500, // 🔥 softer than 600
        borderRadius: "999px",
        bgcolor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`, // 🔥 adds structure
        display: "inline-block",
        lineHeight: 1.2,
      }}
    >
      {label}
    </Box>
  );
}
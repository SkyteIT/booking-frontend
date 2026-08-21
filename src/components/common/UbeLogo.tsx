// Shared "orbit" logo mark - a ring, a center dot, and a tilted ellipse
// standing in for an orbit path, with a quarter-turn spin on hover. Was
// only ever hand-coded inline in CustomerNavbar; VendorNavbar used a
// static PNG instead. Extracted so every portal's navbar renders the same
// mark instead of two different logos.
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";


type UbeLogoProps = {
  to?: string;
  subtitle?: string;
  size?: number;
  // For use on dark/photo backgrounds (e.g. the auth pages' hero) where
  // the default theme.palette.text.* colors would be unreadable.
  light?: boolean;
};

export default function UbeLogo({ to = "/", subtitle, size = 32, light = false }: UbeLogoProps) {
  const theme = useTheme();

  return (
    <Box
      component={Link}
      to={to}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        flexShrink: 0,
        "&:hover .ube-logo-ring": { transform: "rotate(90deg)" },
      }}
    >
      <Box
        className="ube-logo-ring"
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "2px solid",
          borderColor: "primary.main",
          display: "grid",
          placeItems: "center",
          position: "relative",
          transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
          flexShrink: 0,
        }}
      >
        <Box sx={{ width: size * 0.25, height: size * 0.25, borderRadius: "50%", backgroundColor: "primary.main" }} />
        <Box
          sx={{
            position: "absolute",
            inset: "-6px",
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.35),
            borderRadius: "50%",
            transform: "rotateX(65deg)",
          }}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "100",
            fontWeight: 700,
            color: light ? "#fff" : "text.primary",
            letterSpacing: "0.03em",
            lineHeight: 1.2,
          }}
        >
          UBE <Typography component="span" sx={{ fontWeight: 400, color: "primary.main" }}>.</Typography>
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontSize: "0.6rem",
              fontWeight: 500,
              color: light ? "rgba(255,255,255,0.75)" : "text.secondary",
              lineHeight: 1,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

import { Box, Typography } from "@mui/material";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function VendorManagementHeader({
  title = "Vendor Management",
  subtitle = "Review vendor applications with server-side search, status filtering, sorting, and paging.",
}: Props) {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}
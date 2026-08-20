import { Box, Typography } from "@mui/material";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function VendorManagementHeader({
  title = "Vendor Management",
  subtitle = "Review vendor applications ",
}: Props) {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "-0.01em" }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}
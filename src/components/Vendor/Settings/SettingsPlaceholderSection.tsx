import { Box, Typography } from "@mui/material";

type SettingsPlaceholderSectionProps = {
  description: string;
};

export default function SettingsPlaceholderSection({ description }: SettingsPlaceholderSectionProps) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        px: 2,
        py: 4,
        textAlign: "center",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          mb: 0.5,
        }}
      >
        Coming soon
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
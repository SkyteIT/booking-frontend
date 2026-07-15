import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  helperText?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  helperText,
}: StatCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.2s ease",

        "&:hover": {
          boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          {/* 🔹 Text */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {title}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 0.5,
                fontWeight: 600,
                letterSpacing: -0.2,
              }}
            >
              {value}
            </Typography>

            {helperText && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                {helperText}
              </Typography>
            )}
          </Box>

          {/* 🔹 Icon bubble */}
          <Box
            sx={(t) => ({
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(t.palette.primary.main, 0.08),
              color: "primary.main",
              flexShrink: 0,
            })}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
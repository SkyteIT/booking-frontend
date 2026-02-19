import { Card, CardContent, Stack, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  helperText?: string;
};

export default function StatCard({ title, value, icon, helperText }: StatCardProps) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 700 }}>
              {value}
            </Typography>
            {helperText ? (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {helperText}
              </Typography>
            ) : null}
          </Box>

          {/* Icon bubble */}
          <Box
            sx={(t) => ({
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: t.palette.secondary.light, // from your theme
              color: "#0077b6",
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

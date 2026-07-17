import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const sectionLabels: Record<string, string> = {
  dashboard: "Dashboard",
  users: "User Management",
  vendors: "Vendor Management",
  bookings: "Booking Oversight",
  disputes: "Disputes & Refunds",
  finance: "Finance & Payments",
  content: "Content Management",
  reports: "Reports & Analytics",
  notifications: "Notifications",
  settings: "Settings",
};

export default function AdminSectionPlaceholder() {
  const { section = "dashboard" } = useParams();
  const title = sectionLabels[section] ?? section;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography color="text.secondary">
            This section is routed correctly and can be expanded into a full admin screen.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
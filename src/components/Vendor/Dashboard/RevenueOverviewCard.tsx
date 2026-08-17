import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { VendorBookingDto } from "../../Bookings/BookingTypes";

type Props = {
  bookings: VendorBookingDto[];
};

type RevenuePoint = {
  day: string;
  revenue: number;
};

export default function RevenueOverviewCard({ bookings }: Props) {
  const chartData = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((acc: RevenuePoint[], b) => {
      const day = new Date(b.startDateTime).toLocaleDateString("en-US", {
        weekday: "short",
      });

      const existing = acc.find((d) => d.day === day);

      if (existing) {
        existing.revenue += b.totalAmount;
      } else {
        acc.push({
          day,
          revenue: b.totalAmount,
        });
      }

      return acc;
    }, []);

  const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  chartData.sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day));

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* 🔹 Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Revenue overview
          </Typography>
        </Stack>

        {/* 🔹 Empty state */}
        {chartData.length === 0 ? (
          <Box
            sx={(t) => ({
              height: 250,
              borderRadius: 2,
              border: `1px solid ${t.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: t.palette.text.secondary,
            })}
          >
            <Typography variant="body2">No revenue data yet</Typography>
          </Box>
        ) : (
          <Box
            sx={(t) => ({
              height: 260,
              borderRadius: 2,
              border: `1px solid ${t.palette.divider}`,
              bgcolor: t.palette.background.paper,
              px: 1,
              py: 1.5,
            })}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                {/* 🔹 X Axis */}
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                {/* 🔹 Y Axis */}
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />

                {/* 🔹 Tooltip */}
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                  cursor={{
                    stroke: "#2563EB",
                    strokeOpacity: 0.2,
                  }}
                />

                {/* 🔹 Line */}
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

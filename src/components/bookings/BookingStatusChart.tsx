import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import theme from "../../theme/theme";

const COLORS = [theme.palette.warning.main, theme.palette.info.main, theme.palette.error.main];

export default function BookingStatusChart({ bookings }: any) {
  const data = [
    {
      name: "Pending",
      value: bookings.filter((b: any) => b.status === "Pending").length,
    },
    {
      name: "Confirmed",
      value: bookings.filter((b: any) => b.status === "Confirmed").length,
    },
    {
      name: "Rejected",
      value: bookings.filter((b: any) => b.status === "Rejected").length,
    },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Booking Status
        </Typography>

        {total === 0 ? (
          <Box
            sx={(t) => ({
              height: 220,
              borderRadius: 2,
              border: `1px solid ${t.palette.divider}`,
              display: "grid",
              placeItems: "center",
            })}
          >
            <Typography variant="body2" color="text.secondary">
              No booking data for this range.
            </Typography>
          </Box>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <Stack spacing={1} sx={{ mt: 1 }}>
              {data.map((item, index) => (
                <Stack
                  key={item.name}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: COLORS[index],
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {item.name}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {item.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
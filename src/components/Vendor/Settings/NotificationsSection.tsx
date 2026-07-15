import { Box, Divider, Stack, Switch, Typography } from "@mui/material";

const groups = {
  Bookings: ["New booking requests", "Booking confirmations", "Cancellations"],
  Payments: ["Payment received", "Payout processed", "Payment failed"],
  Reviews: ["New reviews", "Review responses"],
  Account: ["Security alerts", "Account updates"],
};

export default function NotificationsSection() {
  return (
    <Box>
      <Stack spacing={3}>

        {Object.entries(groups).map(([group, items]) => (
          <Box key={group}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>{group}</Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Stack spacing={1.5}>
              {items.map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
              
                  }}
                >
                  <Typography>{item}</Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Stack alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Switch size="small" defaultChecked />
                    </Stack>
                    <Stack alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Push
                      </Typography>
                      <Switch size="small" />
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}

        <Divider />
      </Stack>
    </Box>
  );
}

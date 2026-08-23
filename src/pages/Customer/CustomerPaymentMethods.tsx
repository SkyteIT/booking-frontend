import { Alert, Box, Paper, Typography } from "@mui/material";
import CustomerPageLayout from "./CustomerPageLayout";

export default function CustomerPaymentMethods() {
  return (
    <CustomerPageLayout
      title="Payment Methods"
      subtitle="Manage the payment methods associated with your customer account."
    >
      <Box sx={{ display: "grid", gap: 2 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: "18px",
            border: "1px solid rgba(15,27,45,0.06)",
            boxShadow: "0 12px 32px rgba(15,27,45,0.06)",
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={1}>
            Payment methods
          </Typography>
          <Alert severity="info" sx={{ borderRadius: "12px" }}>
            Payment method management is not connected in this frontend yet. Use checkout to add a card for a booking.
          </Alert>
        </Paper>
      </Box>
    </CustomerPageLayout>
  );
}

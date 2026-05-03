import { Alert, Box, TextField, Typography } from "@mui/material";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import type { PayoutForm } from "./types";

type PayoutSettingsSectionProps = {
  form: PayoutForm;
  onFieldChange: (field: keyof PayoutForm, value: string) => void;
};

export default function PayoutSettingsSection({
  form,
  onFieldChange,
}: PayoutSettingsSectionProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Alert severity="info">
        Your bank details are securely stored and used to transfer funds to your account.
      </Alert>
      {/* Linked account info */}
      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <CreditCardOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Linked bank account
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          ****1234 · {form.bankName || "Bank not connected"}
        </Typography>
      </Box>

      {/* Form */}
      <TextField
        label="Bank name"
        value={form.bankName}
        onChange={(e) => onFieldChange("bankName", e.target.value)}
        fullWidth
        size="small"
        margin="dense"
        InputLabelProps={{
          sx: {
            color: "text.secondary",
            "&.Mui-focused": { color: "text.primary" },
          },
        }}
      />

      <TextField
        label="Account holder name"
        value={form.accountHolderName}
        onChange={(e) => onFieldChange("accountHolderName", e.target.value)}
        fullWidth
        size="small"
        margin="dense"
        InputLabelProps={{
          sx: {
            color: "text.secondary",
            "&.Mui-focused": { color: "text.primary" },
          },
        }}
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
        <TextField
          label="Account number"
          value={form.accountNumber}
          onChange={(e) => onFieldChange("accountNumber", e.target.value)}
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{
            sx: {
              color: "text.secondary",
              "&.Mui-focused": { color: "text.primary" },
            },
          }}
        />

        <TextField
          label="Branch"
          value={form.branch}
          onChange={(e) => onFieldChange("branch", e.target.value)}
          fullWidth
          size="small"
          margin="dense"
          InputLabelProps={{
            sx: {
              color: "text.secondary",
              "&.Mui-focused": { color: "text.primary" },
            },
          }}
        />
      </Box>
    </Box>
  );
}
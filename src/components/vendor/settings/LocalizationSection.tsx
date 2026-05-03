import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import type { LocalizationForm } from "./types";

type LocalizationSectionProps = {
  form: LocalizationForm;
  onFieldChange: (field: keyof LocalizationForm, value: string) => void;
};

const inputLabelSx = {
  color: "text.secondary",
  "&.Mui-focused": { color: "text.primary" },
};

export default function LocalizationSection({ form, onFieldChange }: LocalizationSectionProps) {
  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
          >
            <PublicOutlinedIcon />
            Localization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set your language, timezone, and regional preferences
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          <TextField
            label="Language"
            size="small"
            fullWidth
            margin="dense"
            value={form.language}
            onChange={(e) => onFieldChange("language", e.target.value)}
            InputLabelProps={{ sx: inputLabelSx }}
          />
          <TextField
            label="Timezone"
            size="small"
            fullWidth
            margin="dense"
            value={form.timeZone}
            onChange={(e) => onFieldChange("timeZone", e.target.value)}
            InputLabelProps={{ sx: inputLabelSx }}
          />
          <TextField
            label="Currency"
            size="small"
            fullWidth
            margin="dense"
            value={form.currency}
            onChange={(e) => onFieldChange("currency", e.target.value)}
            InputLabelProps={{ sx: inputLabelSx }}
          />
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button variant="contained">Save Changes</Button>
        </Box>
      </Stack>
    </Box>
  );
}

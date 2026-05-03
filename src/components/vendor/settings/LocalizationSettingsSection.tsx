import { Box, Stack, TextField } from "@mui/material";
import type { LocalizationForm } from "./types";

type LocalizationSectionProps = {
  form: LocalizationForm;
  onFieldChange: (field: keyof LocalizationForm, value: string) => void;
};

const inputLabelSx = {
  color: "text.secondary",
  "&.Mui-focused": { color: "text.primary" },
};

export default function LocalizationSettingsSection({ form, onFieldChange }: LocalizationSectionProps) {
  return (
    <Box>
      <Stack spacing={3}>

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

       
      </Stack>
    </Box>
  );
}

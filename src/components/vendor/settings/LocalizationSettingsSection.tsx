import { Box, Stack, TextField } from "@mui/material";
import type { LocalizationForm } from "./types";

type LocalizationSectionProps = {
  form: LocalizationForm;
  onFieldChange: (field: keyof LocalizationForm, value: string) => void;
  errors?: Record<string, string>;
};

const inputLabelSx = {
  color: "text.secondary",
  "&.Mui-focused": { color: "text.primary" },
};

export default function LocalizationSettingsSection({ form, onFieldChange, errors = {} }: LocalizationSectionProps) {
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
            error={!!errors.language}
            helperText={errors.language}
            InputLabelProps={{ sx: inputLabelSx }}
          />
          <TextField
            label="Timezone"
            size="small"
            fullWidth
            margin="dense"
            value={form.timeZone}
            onChange={(e) => onFieldChange("timeZone", e.target.value)}
            error={!!errors.timeZone}
            helperText={errors.timeZone}
            InputLabelProps={{ sx: inputLabelSx }}
          />
          <TextField
            label="Currency"
            size="small"
            fullWidth
            margin="dense"
            value={form.currency}
            onChange={(e) => onFieldChange("currency", e.target.value)}
            error={!!errors.currency}
            helperText={errors.currency}
            InputLabelProps={{ sx: inputLabelSx }}
          />
        </Stack>

       
      </Stack>
    </Box>
  );
}

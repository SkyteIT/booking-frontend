import { Box, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { formatTimeAmPm, normalizeTimeValue } from "./timeOptions";

interface Props {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  size?: "small" | "medium";
}

export default function AmPmTimeField({
  label,
  value,
  onChange,
  error,
  helperText,
  size,
}: Props) {
  const formatted = formatTimeAmPm(value);
  const [timeText, setTimeText] = useState(formatted.split(" ")[0] ?? "");
  const [period, setPeriod] = useState<"AM" | "PM">(
    formatted.endsWith("PM") ? "PM" : "AM",
  );

  useEffect(() => {
    const next = formatTimeAmPm(value);
    setTimeText(next.split(" ")[0] ?? "");
    setPeriod(next.endsWith("PM") ? "PM" : "AM");
  }, [value]);

  const commit = (nextTime: string, nextPeriod: "AM" | "PM") => {
    const normalized = normalizeTimeValue(`${nextTime} ${nextPeriod}`);
    if (normalized) onChange(normalized);
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        fullWidth
        size={size}
        label={label}
        value={timeText}
        placeholder="hh:mm"
        inputProps={{ inputMode: "numeric" }}
        error={error}
        helperText={helperText}
        onChange={(event) => {
          const next = event.target.value.replace(/[^0-9:]/g, "").slice(0, 5);
          setTimeText(next);
          commit(next, period);
        }}
      />
      <TextField
        select
        size={size}
        value={period}
        onChange={(event) => {
          const next = event.target.value as "AM" | "PM";
          setPeriod(next);
          commit(timeText, next);
        }}
        sx={{ width: 100 }}
      >
        <MenuItem value="AM">AM</MenuItem>
        <MenuItem value="PM">PM</MenuItem>
      </TextField>
    </Box>
  );
}

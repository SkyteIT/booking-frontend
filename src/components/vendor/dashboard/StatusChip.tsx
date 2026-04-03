import { Chip } from "@mui/material";

type Props = {
  label: string;
  category: "Pending" | "Confirmed" | "Cancelled" | "Completed" | "Unknown";
};

export default function StatusChip({ label, category }: Props) {
  const styles = {
    Confirmed: {
      bgcolor: "#E9F9EF",
      color: "#1B7A3A",
    },
    Pending: {
      bgcolor: "#FFF6D9",
      color: "#8A5A00",
    },
    Cancelled: {
      bgcolor: "#FDE2E2",
      color: "#B91C1C",
    },
    Completed: {
      bgcolor: "#E6F4FF",
      color: "#1D4ED8",
    },
    Unknown: {
      bgcolor: "#F3F4F6",
      color: "#374151",
    },
  } as const;

  const sx = styles[category] ?? styles.Unknown;

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        borderRadius: 999,
        fontWeight: 700,
        ...sx,
      }}
    />
  );
}

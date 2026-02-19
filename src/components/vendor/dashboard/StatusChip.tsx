import { Chip } from "@mui/material";

type Props = {
  status: "Confirmed" | "Pending" | "Cancelled";
};

export default function StatusChip({ status }: Props) {
  const map = {
    Confirmed: { label: "Confirmed", sx: { bgcolor: "#E9F9EF", color: "#1B7A3A" } },
    Pending: { label: "Pending", sx: { bgcolor: "#FFF6D9", color: "#8A5A00" } },
    Cancelled: { label: "Cancelled", sx: { bgcolor: "#FDE2E2", color: "#B91C1C" } },
  } as const;

  return (
    <Chip
      label={map[status].label}
      size="small"
      sx={{ borderRadius: 999, fontWeight: 700, ...map[status].sx }}
    />
  );
}

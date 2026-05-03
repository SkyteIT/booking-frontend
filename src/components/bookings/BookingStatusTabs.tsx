import { Tabs, Tab } from "@mui/material";


export type BookingStatusFilter = "All" | "Pending" | "Confirmed" | "Cancelled";

type Props = {
  value: BookingStatusFilter;
  onChange: (value: BookingStatusFilter) => void;
};

const tabs: BookingStatusFilter[] = ["All", "Pending", "Confirmed", "Cancelled"];

export default function BookingsStatusTabs({ value, onChange }: Props) {
  return (
    <Tabs
      value={value}
      onChange={(_, next) => onChange(next)}
      sx={{
        borderBottom: "1px solid #E5E7EB",
        px: 2,
        "& .MuiTab-root": {
          textTransform: "none",
          fontWeight: 600,
          minHeight: 44,
          px: 2,
        },
        "& .MuiTabs-indicator": {
          height: 3,
          borderRadius: 3,
        },
      }}
    >
      {tabs.map((t) => (
        <Tab key={t} label={t} value={t} />
      ))}
    </Tabs>
  );
}
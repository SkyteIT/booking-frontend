import { Tabs, Tab, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

export type BookingStatusFilter =
  | "All"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

type Props = {
  value: BookingStatusFilter;
  onChange: (value: BookingStatusFilter) => void;
};

const tabs: BookingStatusFilter[] = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function BookingsStatusTabs({ value, onChange }: Props) {
  return (
    // glassy container
    <Box
      sx={{
        display: "inline-flex",
        p: 0.5,
        borderRadius: 999,
        bgcolor: "rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <Tabs
        value={value}
        onChange={(_, next) => onChange(next)}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          minHeight: 40,

          "& .MuiTabs-flexContainer": {
            gap: 4,
          },
        }}
      >
        {tabs.map((t) => {
          const isActive = value === t;

          return (
            <Tab
              key={t}
              label={t}
              value={t}
              sx={(theme) => ({
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                minHeight: 36,
                px: 1.5,
                borderRadius: 999,

                transition:
                  "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",

                ...(isActive
                  ? {
                      bgcolor: "white",
                      color: theme.palette.primary.main,
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.08)",
                    }
                  : {
                      color: theme.palette.text.secondary,

                      "&:hover": {
                        color: theme.palette.primary.main,
                        bgcolor: alpha(
                          theme.palette.primary.main,
                          0.08
                        ),
                        transform: "translateY(-1px)",
                      },
                    }),
              })}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
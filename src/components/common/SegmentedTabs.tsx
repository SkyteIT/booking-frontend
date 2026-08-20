// Shared pill/segmented-control tab style - the same treatment as the
// vendor Bookings page's status tabs, standardized here so every tab-like
// selector in the app (Settings sections, Notifications filters, status
// filters) looks like one design system instead of three different ones.
import { Tabs, Tab, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface SegmentedTabsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  // Override the displayed label per option when it needs to differ from
  // the value itself (e.g. value "booking" shown as "Bookings").
  labels?: Partial<Record<T, string>>;
}

export default function SegmentedTabs<T extends string>({ options, value, onChange, labels }: SegmentedTabsProps<T>) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        // A Stack/flex parent's default alignItems: "stretch" overrides
        // inline-flex's own content-based width, forcing this to fill the
        // parent's full width instead of hugging its tabs - pin it so this
        // stays a compact pill in every context, not just some.
        alignSelf: "flex-start",
        p: 0.4,
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
          minHeight: 32,
          "& .MuiTabs-flexContainer": { gap: 2 },
        }}
      >
        {options.map((opt) => {
          const isActive = value === opt;
          return (
            <Tab
              key={opt}
              label={labels?.[opt] ?? opt}
              value={opt}
              sx={(theme) => ({
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.78rem",
                minHeight: 30,
                px: 1.25,
                borderRadius: 999,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(isActive
                  ? {
                      bgcolor: "white",
                      color: theme.palette.primary.main,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }
                  : {
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
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

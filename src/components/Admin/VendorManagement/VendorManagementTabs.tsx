import { Tabs, Tab, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import theme from "../../../theme/theme";

export type VendorManagementTab = "pending" | "approved" | "rejected";

type Props = {
  value: VendorManagementTab;
  onChange: (value: VendorManagementTab) => void;
};

const tabs: Array<{ value: VendorManagementTab; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function VendorManagementTabs({ value, onChange }: Props) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        p: 0.5,
        borderRadius: 999,

        // 🔥 soft background container
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
        {tabs.map((tab) => {
          const isActive = value === tab.value;

          return (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                minHeight: 36,
                px: 2,
                borderRadius: 999,

                transition: "all 0.25s ease",

                ...(isActive
                  ? {
                      bgcolor: "white",
                      color: "primary.main",

                      boxShadow: "0 4px 12px " + alpha(theme.palette.primary.main, 0.2),
                    }
                  : {
                      color: "text.secondary",
                      "&:hover": {
                        color: "text.primary",
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }),
              }}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
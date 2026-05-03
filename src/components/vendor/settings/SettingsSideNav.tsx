import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { SettingSection } from "./types";
import { settingTabs } from "./settingsConfig";

type SettingsSideNavProps = {
  activeSection: SettingSection;
  onSectionChange: (section: SettingSection) => void;
};

export default function SettingsSideNav({
  activeSection,
  onSectionChange,
}: SettingsSideNavProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <List disablePadding>
          {settingTabs.map((item) => {
            const active = item.key === activeSection;

            return (
              <ListItemButton
                key={item.key}
                onClick={() => onSectionChange(item.key)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  px: 2,
                  py: 1,

                  // Minimal background
                  bgcolor: active
                    ? (theme) => alpha(theme.palette.primary.main, 0.08) : "transparent",

                  // Text color
                  color: active ? "text.primary" : "text.secondary",

                  // Smooth feel
                  transition: "all 0.2s ease",

                  "&:hover": {
                    bgcolor: (theme) =>
                      alpha(theme.palette.primary.main, 0.06),
                  },
                }}
              >
                {/* Left indicator line */}
                {active && (
                  <Box
                    sx={{
                      width: 3,
                      height: 20,
                      bgcolor: "primary.main",
                      borderRadius: 2,
                      mr: 1.5,
                    }}
                  />
                )}

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: active ? 500 : 400,
                    color: "inherit",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
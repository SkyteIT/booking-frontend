// Shared style objects used across filter sidebar subcomponents.
// Keeping styles centralized avoids repeating same button/title styles.
export const filterTitleSx = {
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  mb: 1.4,
  color: "text.secondary",
};

export const optionButtonBaseSx = {
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: "10px",
  px: 1.4,
  py: 0.85,
  fontSize: "0.85rem",
  fontWeight: 500,
  gap: 0.5,
};

export const getOptionButtonStateSx = (selected: boolean) => ({
  color: selected ? "primary.main" : "text.secondary",
  backgroundColor: selected ? "rgba(0,119,182,0.08)" : "transparent",
  fontWeight: selected ? 600 : 500,
  "&:hover": {
    backgroundColor: selected ? "rgba(0,119,182,0.12)" : "action.hover",
    color: selected ? "primary.main" : "text.primary",
  },
});

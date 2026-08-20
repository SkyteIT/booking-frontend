// Shared style objects used across filter sidebar subcomponents.
// Keeping styles centralized avoids repeating same button/title styles.
export const filterTitleSx = {
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  mb: 1.1,
  color: "text.secondary",
};

export const ratingButtonsContainerSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
};

export const ratingButtonBaseSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textTransform: "none",
  borderRadius: "999px",
  fontSize: "0.82rem",
  fontWeight: 500,
  px: 1.4,
  py: 0.65,
  minWidth: "auto",
  minHeight: "34px",
  gap: 0.5,
  lineHeight: 1.2,
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

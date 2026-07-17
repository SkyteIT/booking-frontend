// Shared style objects used across filter sidebar subcomponents.
// Keeping styles centralized avoids repeating same button/title styles.
export const filterTitleSx = {
  fontSize: "0.78rem",
  fontWeight: 700,
  mb: 1.2,
  color: "#1E293B",
};

export const optionButtonBaseSx = {
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: "8px",
  px: 1.4,
  py: 0.95,
  fontSize: "0.82rem",
  fontWeight: 500,
};

export const getOptionButtonStateSx = (selected: boolean) => ({
  color: selected ? "#0B79B8" : "#64748B",
  backgroundColor: selected ? "#D9ECFA" : "transparent",
  "&:hover": {
    backgroundColor: selected ? "#D9ECFA" : "#F8FAFC",
  },
});

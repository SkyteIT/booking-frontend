// Offer section: a single toggle to narrow results to listings with an
// active, customer-facing offer running right now.
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Box, Button, Typography } from "@mui/material";
import { filterTitleSx } from "./styles";

interface OfferFilterSectionProps {
  hasOffer?: boolean;
  onToggleHasOffer: () => void;
}

const OfferFilterSection = ({ hasOffer, onToggleHasOffer }: OfferFilterSectionProps) => {
  return (
    <>
      <Typography sx={filterTitleSx}>Offers</Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
        <Button
          onClick={onToggleHasOffer}
          startIcon={<LocalOfferIcon sx={{ fontSize: "0.85rem", color: hasOffer ? "#fff" : "#E85D3D" }} />}
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            fontSize: "0.82rem",
            fontWeight: hasOffer ? 600 : 500,
            px: 1.6,
            py: 0.75,
            minWidth: "auto",
            border: "1px solid",
            borderColor: hasOffer ? "primary.main" : "divider",
            backgroundColor: hasOffer ? "primary.main" : "background.paper",
            color: hasOffer ? "#fff" : "text.secondary",
            boxShadow: hasOffer ? "none" : "0 1px 2px rgba(17,24,39,0.04)",
            "&:hover": {
              backgroundColor: hasOffer ? "primary.dark" : "action.hover",
              borderColor: hasOffer ? "primary.dark" : "divider",
            },
          }}
        >
          On offer only
        </Button>
      </Box>
    </>
  );
};

export default OfferFilterSection;

import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import type { ListingCard } from "./type";

type Props = {
  listings: ListingCard[];
  value: string; // selected listingId
  onChange: (listingId: string) => void;
};

export default function ListingSelector({ listings, value, onChange }: Props) {
  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
        Select Listing
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 1.5,
        }}
      >
        {listings.map((l) => {
          const selected = l.id === value;

          return (
            <ButtonBase
              key={l.id}
              onClick={() => onChange(l.id)}
              sx={(t) => ({
                textAlign: "left",
                width: "100%",
                borderRadius: 2,
                p: 2,
                border: "2px solid",
                borderColor: selected ? t.palette.primary.main : t.palette.divider,
                bgcolor: selected ? "rgba(37,99,235,0.06)" : "#fff",
                boxShadow: selected ? "0px 6px 16px rgba(0,0,0,0.08)" : "none",
                transition: "all .15s ease",
                "&:hover": {
                  borderColor: t.palette.primary.main,
                  bgcolor: "rgba(37,99,235,0.04)",
                },
              })}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ fontWeight: 700 }}>{l.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {l.bookedCount} booked • {l.blockedCount} blocked
                </Typography>
              </Stack>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
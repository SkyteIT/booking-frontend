import { Box, ButtonBase, Stack, Typography } from "@mui/material";

type Props = {
  listings: {
    id: string;
    name: string;
    bookedCount: number;
    blockedCount: number;
  }[];

  selectedListingId: string | null;
  onSelectListing: (id: string) => void;
};

export default function ListingSelector({
  listings,
  selectedListingId,
  onSelectListing,
}: Props) {
  return (
    <Box>
      {/* Title */}
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: "#6B7280",
          mb: 1.5,
        }}
      >
        Select Listing
      </Typography>

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 1.5,
        }}
      >
        {listings.map((l) => {
          const selected = l.id === selectedListingId;

          return (
            <ButtonBase
              key={l.id}
              onClick={() => onSelectListing(l.id)}
              sx={{
                width: "100%",
                borderRadius: 3,
                p: 2,
                textAlign: "left",

                border: "1px solid",
                borderColor: selected ? "#0077b6" : "#E5E7EB",
                backgroundColor: selected ? "#F9FAFB" : "#fff",
                boxShadow: selected ? "0 6px 20px rgba(0,0,0,0.05)" : "none",

                transition: "all 0.2s ease",

                "&:hover": {
                  borderColor: "#0077b6",
                  backgroundColor: "#F9FAFB",
                  transform: "scale(1.01)",
                  
                },
              }}
            >
              <Stack spacing={0.5}>
                
                {/* Listing Name */}
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#111827",
                  }}
                >
                  {l.name}
                </Typography>

                {/* Meta Info */}
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#6B7280",
                  }}
                >
                  {l.bookedCount} booked · {l.blockedCount} blocked
                </Typography>

              </Stack>
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
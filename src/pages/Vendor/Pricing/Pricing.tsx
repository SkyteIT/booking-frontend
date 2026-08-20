import { Box, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SnackbarAlert from "../../../components/common/SnackbarAlert";
import ListingOffersPanel from "../../../components/Vendor/Pricing/ListingOffersPanel";
import SeasonalPricingPanel from "../../../components/Vendor/Pricing/SeasonalPricingPanel";
import { getVendorListings, type ListingResponse } from "../../../services/Vendor/listingService";

export default function Pricing() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  useEffect(() => {
    getVendorListings()
      .then((data) => {
        setListings(data);
        if (data.length > 0) setSelectedListingId((current) => current || data[0].id);
      })
      .catch(() => setSnack({ open: true, message: "Failed to load your listings.", severity: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const showError = (msg: string) => setSnack({ open: true, message: msg, severity: "error" });
  const showSuccess = (msg: string) => setSnack({ open: true, message: msg, severity: "success" });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "baseline",
            gap: "2px",
          }}
        >
          Pricing &amp; Promotions
          <Box component="span" sx={{ width: 8, height: 8, borderRadius: "3px", backgroundColor: "primary.main", display: "inline-block", ml: 0.5 }} />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set seasonal rate rules and post customer-facing offers for your listings.
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
          background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
        }}
      >
        <CardContent>
          {loading ? (
            <Typography color="text.secondary">Loading your listings...</Typography>
          ) : listings.length === 0 ? (
            <Typography color="text.secondary">You don't have any listings yet.</Typography>
          ) : (
            <TextField
              select
              label="Listing"
              size="small"
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(e.target.value)}
              sx={{ minWidth: 280 }}
            >
              {listings.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.title}
                </MenuItem>
              ))}
            </TextField>
          )}
        </CardContent>
      </Card>

      {listings.length > 0 && (
        <>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Seasonal Pricing
              </Typography>
              <SeasonalPricingPanel
                listingId={selectedListingId || null}
                onError={showError}
                onSuccess={showSuccess}
              />
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              background: "linear-gradient(160deg, #FFFFFF 0%, #E3F1FC 100%)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Offers
              </Typography>
              <ListingOffersPanel
                listingId={selectedListingId || null}
                onError={showError}
                onSuccess={showSuccess}
              />
            </CardContent>
          </Card>
        </>
      )}

      <SnackbarAlert
        open={snack.open}
        message={snack.message}
        severity={snack.severity}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </Stack>
  );
}

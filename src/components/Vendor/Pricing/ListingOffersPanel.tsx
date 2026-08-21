import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  createListingOffer,
  deleteListingOffer,
  getListingOffers,
  type ListingOfferDto,
  type OfferDiscountType,
} from "../../../services/Vendor/listingOfferService";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import LoadingSpinner from "../../common/LoadingSpinner";

type Props = {
  listingId: string | null;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const emptyForm = {
  title: "",
  description: "",
  hasDiscount: false,
  discountType: "PercentageDiscount" as OfferDiscountType,
  discountValue: "",
  startDate: "",
  endDate: "",
};

export default function ListingOffersPanel({ listingId, onError, onSuccess }: Props) {
  const [offers, setOffers] = useState<ListingOfferDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    try {
      const data = await getListingOffers(listingId);
      setOffers(data);
    } catch (err) {
      onError(getApiErrorMessage(err, "Failed to load offers."));
    } finally {
      setLoading(false);
    }
  }, [listingId, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!listingId) return;
    if (!form.title.trim() || !form.startDate || !form.endDate) {
      onError("Please fill in a title, start date, and end date.");
      return;
    }
    if (form.hasDiscount && !form.discountValue) {
      onError("Please enter a discount value, or turn off the discount toggle for a perk-only offer.");
      return;
    }
    setSaving(true);
    try {
      await createListingOffer(listingId, {
        title: form.title.trim(),
        description: form.description.trim(),
        discountType: form.hasDiscount ? form.discountType : undefined,
        discountValue: form.hasDiscount ? Number(form.discountValue) : undefined,
        startDate: form.startDate,
        endDate: form.endDate,
      });
      onSuccess("Offer created.");
      setForm(emptyForm);
      await load();
    } catch (err) {
      onError(getApiErrorMessage(err, "Failed to create offer."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (offerId: string) => {
    if (!listingId) return;
    try {
      await deleteListingOffer(listingId, offerId);
      onSuccess("Offer removed.");
      await load();
    } catch (err) {
      onError(getApiErrorMessage(err, "Failed to remove offer."));
    }
  };

  if (!listingId) {
    return <Typography color="text.secondary">Select a listing to manage its offers.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Post a customer-facing offer — a perk ("Free airport pickup with every booking"), a
        discount, or both. Shown on your listing and as a badge across the site while it's running.
        The dates are a book-by window (customers must book within this range to get it), not the
        stay dates.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
          <TextField
            label="Title"
            size="small"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <TextField
            label="Description"
            size="small"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "auto auto 1fr" }, gap: 1.5, alignItems: "center" }}>
          <TextField
            label="Book by (start)"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
          />
          <TextField
            label="Book by (end)"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Chip
            label={form.hasDiscount ? "Includes a discount" : "Perk only, no discount"}
            color={form.hasDiscount ? "primary" : "default"}
            onClick={() => setForm((f) => ({ ...f, hasDiscount: !f.hasDiscount }))}
            sx={{ cursor: "pointer" }}
          />
          {form.hasDiscount && (
            <>
              <TextField
                select
                label="Discount type"
                size="small"
                value={form.discountType}
                onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as OfferDiscountType }))}
                sx={{ minWidth: 170 }}
              >
                <MenuItem value="PercentageDiscount">Percentage</MenuItem>
                <MenuItem value="FixedAmountDiscount">Fixed amount</MenuItem>
              </TextField>
              <TextField
                label={form.discountType === "PercentageDiscount" ? "Percent off" : "Amount off"}
                type="number"
                size="small"
                value={form.discountValue}
                onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                sx={{ maxWidth: 140 }}
              />
            </>
          )}
          <Button variant="contained" disabled={saving} onClick={handleCreate} sx={{ textTransform: "none", ml: "auto", borderRadius: "999px" }}>
            {saving ? "Adding..." : "Add offer"}
          </Button>
        </Box>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Book-by window</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <LoadingSpinner fullScreen={false} size={22} py={2} />
              </TableCell>
            </TableRow>
          ) : offers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No offers yet.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            offers.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{o.title}</Typography>
                  {o.description && (
                    <Typography variant="caption" color="text.secondary">{o.description}</Typography>
                  )}
                </TableCell>
                <TableCell>{o.startDate} &ndash; {o.endDate}</TableCell>
                <TableCell>
                  {o.discountType === "PercentageDiscount"
                    ? `${o.discountValue}% off`
                    : o.discountType === "FixedAmountDiscount"
                    ? `${o.discountValue} off`
                    : "Perk only"}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="error" onClick={() => handleDelete(o.id)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Stack>
  );
}

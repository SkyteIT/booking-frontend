import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import type { UseFormRegister } from "react-hook-form";
import type { CategoryDto } from "../../../../services/Vendor/listingService";
import type { ListingFormData } from "../../../../utils/types";
import type {
  ListRow,
  GridConfig,
  TimeSlotConfig,
  UnitsMode,
} from "./BookableUnitsSection";
import type { OptionGroupRow } from "./OptionGroupsSection";
import { formatTimeAmPm } from "./timeOptions";

interface ReviewStepProps {
  data: ListingFormData;
  categories: CategoryDto[];
  register: UseFormRegister<ListingFormData>;
  unitsMode: UnitsMode;
  listRows: ListRow[];
  gridConfig: GridConfig;
  timeSlotConfig: TimeSlotConfig;
  optionGroups: OptionGroupRow[];
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
  pendingImageCount: number;
}

function unitsSummary(
  mode: UnitsMode,
  listRows: ListRow[],
  gridConfig: GridConfig,
  timeSlotConfig: TimeSlotConfig,
): string {
  if (mode === "none")
    return "No bookable units configured — this listing is booked as a whole.";
  if (mode === "list") {
    const named = listRows.filter((r) => r.name.trim());
    return named.length > 0
      ? `${named.length} unit(s): ${named.map((r) => r.name).join(", ")}`
      : "List mode selected, but no units named yet.";
  }
  if (mode === "grid") {
    const rows = Number(gridConfig.rows) || 0;
    const columns = Number(gridConfig.columns) || 0;
    return rows > 0 && columns > 0
      ? `${rows * columns} seats will be generated (${rows} rows × ${columns} columns).`
      : "Grid mode selected, but rows/columns not set.";
  }
  return `Time slots from ${formatTimeAmPm(timeSlotConfig.startTime)} to ${formatTimeAmPm(timeSlotConfig.endTime)}, every ${timeSlotConfig.slotDurationMinutes} min, capacity ${timeSlotConfig.capacityPerSlot} per slot.`;
}

export default function ReviewStep({
  data,
  categories,
  register,
  unitsMode,
  listRows,
  gridConfig,
  timeSlotConfig,
  optionGroups,
  onSubmit,
  isSubmitting,
  isEditMode,
  pendingImageCount,
}: ReviewStepProps) {
  const categoryName =
    categories.find((c) => c.id === data.categoryId)?.name ?? data.category;
  const imageCount = (data.images?.length ?? 0) + pendingImageCount;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {data.title || "Untitled Listing"}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {data.location || "No location specified"}
        </Typography>
        <Chip label={categoryName} color="primary" size="small" />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {data.description || "No description provided."}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Base Price
            </Typography>
            <Typography
              variant="h6"
              color="primary.main"
              sx={{ fontWeight: 700 }}
            >
              LKR {data.price || 0}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Bookable Units
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {unitsSummary(unitsMode, listRows, gridConfig, timeSlotConfig)}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Option Groups
      </Typography>
      {(() => {
        const named = optionGroups.filter((g) => g.name.trim());
        if (named.length === 0) {
          return (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No option groups configured.
            </Typography>
          );
        }
        return (
          <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {named.map((group, i) => {
              const values = group.values.filter((v) => v.name.trim());
              return (
                <Box
                  key={i}
                  sx={{
                    px: 1.5,
                    py: 1,
                    border: "1px solid #E2E8F0",
                    borderRadius: 2,
                    minWidth: 180,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {group.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {values.length > 0
                      ? values.map((v) => v.name).join(", ")
                      : "No values yet"}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        );
      })()}

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Images
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {imageCount > 0
          ? `${imageCount} image(s) provided.`
          : "No images provided yet."}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Cancellation Policy
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={2}
        placeholder="e.g. Free cancellation within 24 hours"
        {...register("cancellationPolicy")}
        sx={{ mb: 3 }}
      />

      <Button
        type="button"
        variant="contained"
        disabled={isSubmitting}
        onClick={onSubmit}
        sx={{
          borderRadius: "10px",
          px: 4,
          backgroundColor: "#0F5A8A",
          "&:hover": { backgroundColor: "#0C4A73" },
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : isEditMode ? (
          "Update Listing"
        ) : (
          "Publish Listing"
        )}
      </Button>
    </Box>
  );
}

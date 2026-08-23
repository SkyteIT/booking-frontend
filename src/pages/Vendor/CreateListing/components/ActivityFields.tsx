// src/pages/vendor/CreateListing/components/ActivityFields.tsx — UPDATED
import CheckIcon from "@mui/icons-material/Check";
import { Box, TextField, Typography, Chip, Stack } from "@mui/material";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface ActivityFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

const includedServices = [
  "Guide",
  "Equipment",
  "Meals",
  "Transportation",
  "Accommodation",
  "Insurance",
  "Photos/Videos",
  "Refreshments",
];

const ActivityFields = ({ register, control, errors }: ActivityFieldsProps) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 700, color: "#0F5A8A" }}
      >
        Activity Details
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}
      >
        <TextField
          fullWidth
          label="Activity Type"
          placeholder="e.g., Scuba Diving, City Tour"
          {...register("activityType", {
            required: "Activity type is required",
          })}
          error={!!errors.activityType}
          helperText={errors.activityType?.message}
        />
        <TextField
          fullWidth
          type="number"
          label="Duration (Hours)"
          placeholder="e.g., 2"
          {...register("duration", {
            required: "Duration is required",
            min: { value: 1, message: "Duration must be at least 1 hour" },
          })}
          error={!!errors.duration}
          helperText={errors.duration?.message}
        />
        <TextField
          fullWidth
          type="number"
          label="Ticket Price per Booking"
          placeholder="e.g., 5000"
          {...register("activityPrice", {
            required: "Ticket price is required",
            min: { value: 0, message: "Price cannot be negative" },
          })}
          error={!!errors.activityPrice}
          helperText={errors.activityPrice?.message}
        />
        <TextField
          fullWidth
          type="number"
          label="Min Group Size"
          defaultValue={1}
          {...register("minGroupSize")}
        />
        <TextField
          fullWidth
          type="number"
          label="Max Group Size"
          defaultValue={15}
          {...register("maxGroupSize")}
        />
        <TextField
          fullWidth
          type="number"
          label="Minimum Age"
          defaultValue={18}
          {...register("minAge")}
        />
        <TextField
          fullWidth
          type="number"
          label="Maximum Age"
          defaultValue={65}
          {...register("maxAge")}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          Included Services
        </Typography>
        <Controller
          name="includedServices"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ gap: 1 }}
            >
              {includedServices.map((item) => {
                const selected = field.value?.includes(item) ?? false;
                return (
                  <Chip
                    key={item}
                    label={item}
                    icon={selected ? <CheckIcon /> : undefined}
                    clickable
                    variant={selected ? "filled" : "outlined"}
                    aria-pressed={selected}
                    sx={selectableChipSx(selected)}
                    onClick={() => {
                      const newValue = field.value?.includes(item)
                        ? field.value.filter((v: string) => v !== item)
                        : [...(field.value ?? []), item];
                      field.onChange(newValue);
                    }}
                  />
                );
              })}
            </Stack>
          )}
        />
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Safety Requirements"
        sx={{ mb: 3 }}
        {...register("safetyRequirements")}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Availability Schedule"
        placeholder="E.g., Available Monday–Saturday, 9AM–5PM..."
        {...register("availabilitySchedule")}
      />
    </Box>
  );
};

const selectableChipSx = (selected: boolean) => ({
  fontWeight: selected ? 700 : 500,
  borderColor: selected ? "#0F5A8A" : "rgba(15, 90, 138, 0.35)",
  backgroundColor: selected ? "#0F5A8A" : "#fff",
  color: selected ? "#fff" : "#0F5A8A",
  boxShadow: selected ? "0 3px 10px rgba(15, 90, 138, 0.28)" : "none",
  "& .MuiChip-icon": { color: selected ? "#fff" : "inherit" },
  "&:hover": {
    backgroundColor: selected ? "#0C4A73" : "rgba(15, 90, 138, 0.08)",
  },
});

export default ActivityFields;

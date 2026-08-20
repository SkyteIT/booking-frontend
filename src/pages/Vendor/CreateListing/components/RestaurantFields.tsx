// src/pages/vendor/CreateListing/components/RestaurantFields.tsx
import { Box, TextField, Typography, Chip, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface RestaurantFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

const tableTypes = [
  "2-Seater",
  "4-Seater",
  "6-Seater",
  "Private Room",
  "Outdoor",
  "Bar Seating",
] as const;

const RestaurantFields = ({
  register,
  control,
  errors,
}: RestaurantFieldsProps) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 700, color: "#0F5A8A" }}
      >
        Restaurant Details
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}
      >
        <TextField
          fullWidth
          label="Cuisine Type"
          placeholder="e.g., Italian, Continental"
          {...register("cuisineType", {
            required: "Cuisine type is required",
          })}
          error={!!errors.cuisineType}
          helperText={errors.cuisineType?.message}
        />

        <TextField
          fullWidth
          type="number"
          label="Seating Capacity"
          defaultValue={50}
          {...register("seatingCapacity", {
            required: "Capacity is required",
          })}
          error={!!errors.seatingCapacity}
          helperText={errors.seatingCapacity?.message}
        />

        <TextField
          fullWidth
          type="number"
          label="Average Cost per Person"
          placeholder="e.g., 2000"
          {...register("averageCost", {
            required: "Average cost is required",
            valueAsNumber: true,
            min: { value: 1, message: "Average cost must be greater than 0" },
          })}
          error={!!errors.averageCost}
          helperText={errors.averageCost?.message}
        />

        <TextField
          fullWidth
          type="time"
          label="Opening Time"
          InputLabelProps={{ shrink: true }}
          {...register("openingTime", { required: true })}
          error={!!errors.openingTime}
        />

        <TextField
          fullWidth
          type="time"
          label="Closing Time"
          InputLabelProps={{ shrink: true }}
          {...register("closingTime", { required: true })}
          error={!!errors.closingTime}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          Table Types
        </Typography>

        <Controller
          name="tableTypes"
          control={control}
          defaultValue={[] as ListingFormData["tableTypes"]}
          render={({ field }) => (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ gap: 1 }}
            >
              {tableTypes.map((type) => {
                const selected = (field.value ?? []).includes(type);
                return (
                  <Chip
                    key={type}
                    label={type}
                    clickable
                    variant={selected ? "filled" : "outlined"}
                    color={selected ? "primary" : "default"}
                    onClick={() => {
                      const current = field.value ?? [];
                      const newValue = current.includes(type)
                        ? current.filter((v) => v !== type)
                        : [...current, type];

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
        label="Reservation Rules"
        placeholder="E.g., Reservations must be made at least 2 hours in advance..."
        {...register("reservationRules")}
        error={!!errors.reservationRules}
        helperText={errors.reservationRules?.message}
      />
    </Box>
  );
};

export default RestaurantFields;

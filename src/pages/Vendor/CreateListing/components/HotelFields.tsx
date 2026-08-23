import { Box, TextField, Typography, Chip, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface HotelFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

const roomTypes = [
  "Single Room",
  "Double Room",
  "Suite",
  "Deluxe Room",
] as const;
const amenities = [
  "WiFi",
  "Parking",
  "Pool",
  "Gym",
  "Restaurant",
  "Spa",
  "Room Service",
  "Air Conditioning",
] as const;

export default function HotelFields({
  register,
  control,
  errors,
}: HotelFieldsProps) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 700, color: "#0F5A8A" }}
      >
        Hotel Details
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}
      >
        <TextField
          fullWidth
          label="Property Type"
          placeholder="e.g., Resort, Boutique Hotel"
          {...register("propertyType")}
          error={!!errors.propertyType}
          helperText={errors.propertyType?.message}
        />

        <TextField
          fullWidth
          type="number"
          label="Number of Rooms"
          defaultValue={10}
          {...register("numberOfRooms")}
          error={!!errors.numberOfRooms}
          helperText={errors.numberOfRooms?.message}
        />

        <TextField
          fullWidth
          type="time"
          label="Check-in Time"
          InputLabelProps={{ shrink: true }}
          {...register("checkInTime")}
        />

        <TextField
          fullWidth
          type="time"
          label="Check-out Time"
          InputLabelProps={{ shrink: true }}
          {...register("checkOutTime")}
        />

        <TextField
          fullWidth
          label="Primary Room Type"
          placeholder="e.g., Deluxe"
          {...register("roomType")}
        />

        <TextField
          fullWidth
          type="number"
          label="Price per Night (LKR)"
          placeholder="e.g., 25000"
          {...register("pricePerNight", {
            required: "Price per night is required",
            valueAsNumber: true,
            min: { value: 1, message: "Price must be greater than 0" },
          })}
          error={!!errors.pricePerNight}
          helperText={errors.pricePerNight?.message}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          Room Types
        </Typography>

        <Controller
          name="roomTypes"
          control={control}
          defaultValue={[] as ListingFormData["roomTypes"]}
          rules={{ validate: (v) => (v && v.length > 0) || "Select at least one room type" }}
          render={({ field }) => (
            <>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1 }}
              >
                {roomTypes.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    clickable
                    variant={field.value?.includes(type) ? "filled" : "outlined"}
                    color={field.value?.includes(type) ? "primary" : "default"}
                    onClick={() => {
                      const current = field.value ?? [];
                      field.onChange(
                        current.includes(type)
                          ? current.filter((v) => v !== type)
                          : [...current, type],
                      );
                    }}
                  />
                ))}
              </Stack>
              {errors.roomTypes && (
                <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                  {errors.roomTypes.message}
                </Typography>
              )}
            </>
          )}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          Amenities
        </Typography>

        <Controller
          name="amenities"
          control={control}
          defaultValue={[] as ListingFormData["amenities"]}
          rules={{ validate: (v) => (v && v.length > 0) || "Select at least one amenity" }}
          render={({ field }) => (
            <>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1 }}
              >
                {amenities.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    clickable
                    variant={field.value?.includes(item) ? "filled" : "outlined"}
                    color={field.value?.includes(item) ? "primary" : "default"}
                    onClick={() => {
                      const current = field.value ?? [];
                      field.onChange(
                        current.includes(item)
                          ? current.filter((v) => v !== item)
                          : [...current, item],
                      );
                    }}
                  />
                ))}
              </Stack>
              {errors.amenities && (
                <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                  {errors.amenities.message}
                </Typography>
              )}
            </>
          )}
        />
      </Box>

      <TextField
        fullWidth
        label="Cancellation Policy"
        placeholder="e.g., Free cancellation within 24 hours"
        {...register("cancellationPolicy")}
      />
    </Box>
  );
}

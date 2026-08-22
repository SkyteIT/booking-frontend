import CheckIcon from "@mui/icons-material/Check";
import { Box, TextField, Typography, Chip, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";
import AmPmTimeField from "./AmPmTimeField";

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

        <Controller
          name="checkInTime"
          control={control}
          render={({ field }) => (
            <AmPmTimeField
              label="Check-in Time"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="checkOutTime"
          control={control}
          render={({ field }) => (
            <AmPmTimeField
              label="Check-out Time"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <TextField
          fullWidth
          label="Primary Room Type"
          placeholder="e.g., Deluxe"
          {...register("roomType")}
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
          rules={{
            validate: (v) =>
              (v && v.length > 0) || "Select at least one room type",
          }}
          render={({ field }) => (
            <>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1 }}
              >
                {roomTypes.map((type) => {
                  const selected = field.value?.includes(type) ?? false;
                  return (
                    <Chip
                      key={type}
                      label={type}
                      icon={selected ? <CheckIcon /> : undefined}
                      clickable
                      variant={selected ? "filled" : "outlined"}
                      aria-pressed={selected}
                      sx={selectableChipSx(selected)}
                      onClick={() => {
                        const current = field.value ?? [];
                        field.onChange(
                          current.includes(type)
                            ? current.filter((v) => v !== type)
                            : [...current, type],
                        );
                      }}
                    />
                  );
                })}
              </Stack>
              {errors.roomTypes && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 1 }}
                >
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
          rules={{
            validate: (v) =>
              (v && v.length > 0) || "Select at least one amenity",
          }}
          render={({ field }) => (
            <>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ gap: 1 }}
              >
                {amenities.map((item) => {
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
                        const current = field.value ?? [];
                        field.onChange(
                          current.includes(item)
                            ? current.filter((v) => v !== item)
                            : [...current, item],
                        );
                      }}
                    />
                  );
                })}
              </Stack>
              {errors.amenities && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 1 }}
                >
                  {errors.amenities.message}
                </Typography>
              )}
            </>
          )}
        />
      </Box>
    </Box>
  );
}

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

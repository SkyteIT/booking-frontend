// src/pages/vendor/CreateListing/components/CarRentalFields.tsx
import { Box, TextField, Typography, Card, CardContent } from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormRegister, Control, FieldErrors } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface CarRentalFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

// CreateListingRequestValidator (backend) requires Brand, Model,
// Transmission, FuelType, AvailabilityStatus (all NotEmpty) and
// SeatCount > 0 for every car-rental listing - Model and SeatCount
// previously had no input anywhere on this form, so every car-rental
// listing failed backend validation with a 400 regardless of what the
// vendor filled in.

const insuranceOptions = [
  { label: "Basic Insurance", price: "Included" },
  { label: "Premium Insurance", price: "$25/day" },
  { label: "Full Coverage", price: "$45/day" },
] as const;

const CarRentalFields = ({ register, control, errors }: CarRentalFieldsProps) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 700, color: "#0F5A8A" }}
      >
        Car Rental Details
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}
      >
        <TextField
          fullWidth
          label="Brand"
          placeholder="e.g., Toyota"
          {...register("brand", { required: "Brand is required" })}
          error={!!errors.brand}
          helperText={errors.brand?.message}
        />
        <TextField
          fullWidth
          label="Model"
          placeholder="e.g., Corolla"
          {...register("model", { required: "Model is required" })}
          error={!!errors.model}
          helperText={errors.model?.message}
        />
        <TextField
          fullWidth
          label="Vehicle Type"
          placeholder="e.g., Sedan, SUV"
          {...register("vehicleType")}
        />
        <TextField
          fullWidth
          type="number"
          label="Seat Count"
          placeholder="e.g., 5"
          {...register("seatCountCar", {
            required: "Seat count is required",
            valueAsNumber: true,
            min: { value: 1, message: "Seat count must be greater than 0" },
          })}
          error={!!errors.seatCountCar}
          helperText={errors.seatCountCar?.message}
        />
        <TextField
          fullWidth
          label="Transmission"
          placeholder="e.g., Automatic, Manual"
          {...register("transmission")}
        />
        <TextField
          fullWidth
          label="Fuel Type"
          placeholder="e.g., Gasoline, Electric"
          {...register("fuelType")}
        />
        <TextField
          fullWidth
          type="number"
          label="Year"
          defaultValue={2024}
          {...register("year" as const)}
        />
        <TextField
          fullWidth
          type="number"
          label="Daily Rate ($)"
          defaultValue={99}
          {...register("dailyRate" as const)}
        />
        <TextField
          fullWidth
          type="number"
          label="Hourly Rate ($)"
          defaultValue={15}
          {...register("hourlyRate" as const)}
        />
        <TextField
          fullWidth
          label="Pickup Location"
          placeholder="123 Main St, City"
          {...register("pickupLocation")}
        />
        <TextField
          fullWidth
          label="Return Location"
          placeholder="Same as pickup"
          {...register("returnLocation")}
        />
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
        Insurance Options
      </Typography>

      <Controller
        name="insuranceOptions"
        control={control}
        defaultValue="Basic Insurance"
        render={({ field }) => (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {insuranceOptions.map((option) => (
              <Card
                key={option.label}
                variant="outlined"
                sx={{
                  cursor: "pointer",
                  borderRadius: "12px",
                  borderColor:
                    field.value === option.label ? "primary.main" : "divider",
                  backgroundColor:
                    field.value === option.label ? "#F0F7FF" : "transparent",
                  "&:hover": { borderColor: "primary.main" },
                }}
                onClick={() => field.onChange(option.label)}
              >
                <CardContent
                  sx={{
                    py: "12px !important",
                    px: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {option.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    {option.price}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      />
    </Box>
  );
};

export default CarRentalFields;

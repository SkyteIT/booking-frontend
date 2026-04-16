// src/pages/vendor/CreateListing/components/CarRentalFields.tsx
import { Box, TextField, Typography, Card, CardContent } from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormRegister, Control } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface CarRentalFieldsProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: any;
}

const insuranceOptions = [
  { label: "Basic Insurance", price: "Included" },
  { label: "Premium Insurance", price: "$25/day" },
  { label: "Full Coverage", price: "$45/day" },
];

const CarRentalFields = ({ register, control }: CarRentalFieldsProps) => {
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
          label="Vehicle Type"
          placeholder="e.g., Sedan, SUV"
          {...register("vehicleType", { required: "Vehicle type is required" })}
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
          {...register("year")}
        />
        <TextField
          fullWidth
          type="number"
          label="Daily Rate ($)"
          defaultValue={99}
          {...register("dailyRate")}
        />
        <TextField
          fullWidth
          type="number"
          label="Hourly Rate ($)"
          defaultValue={15}
          {...register("hourlyRate")}
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
        render={({ field }: { field: any }) => (
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

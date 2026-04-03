// src/pages/vendor/CreateListing/components/RestaurantFields.tsx
import { Box, TextField, Typography, Chip, Stack } from "@mui/material";
import { UseFormRegister, Control, Controller } from "react-hook-form";

interface RestaurantFieldsProps {
    register: UseFormRegister<any>;
    control: Control<any>;
    errors: any;
}

const tableTypes = ["2-Seater", "4-Seater", "6-Seater", "Private Room", "Outdoor", "Bar Seating"];

const RestaurantFields = ({ register, control, errors }: RestaurantFieldsProps) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0F5A8A" }}>
                Restaurant Details
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Cuisine Type"
                    placeholder="e.g., Italian, Continental"
                    {...register("cuisineType", { required: "Cuisine type is required" })}
                    error={!!errors.cuisineType}
                    helperText={errors.cuisineType?.message}
                />
                <TextField
                    fullWidth
                    type="number"
                    label="Seating Capacity"
                    defaultValue={50}
                    {...register("seatingCapacity", { required: "Capacity is required" })}
                    error={!!errors.seatingCapacity}
                    helperText={errors.seatingCapacity?.message}
                />
                <TextField
                    fullWidth
                    type="time"
                    label="Opening Time"
                    InputLabelProps={{ shrink: true }}
                    {...register("openingTime", { required: true })}
                />
                <TextField
                    fullWidth
                    type="time"
                    label="Closing Time"
                    InputLabelProps={{ shrink: true }}
                    {...register("closingTime", { required: true })}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Table Types
                </Typography>
                <Controller
                    name="tableTypes"
                    control={control}
                    defaultValue={[]}
                    render={({ field }: { field: any }) => (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                            {tableTypes.map((type) => (
                                <Chip
                                    key={type}
                                    label={type}
                                    clickable
                                    variant={field.value.includes(type) ? "filled" : "outlined"}
                                    color={field.value.includes(type) ? "primary" : "default"}
                                    onClick={() => {
                                        const newValue = field.value.includes(type)
                                            ? field.value.filter((v: string) => v !== type)
                                            : [...field.value, type];
                                        field.onChange(newValue);
                                    }}
                                />
                            ))}
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
            />
        </Box>
    );
};

export default RestaurantFields;

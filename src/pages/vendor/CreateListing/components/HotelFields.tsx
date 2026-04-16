// src/pages/vendor/CreateListing/components/HotelFields.tsx
import { Box, TextField, Typography, Chip, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormRegister, Control } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface HotelFieldsProps {
    register: UseFormRegister<ListingFormData>;
    control: Control<ListingFormData>;
    errors: any;
}

const roomTypes = ["Single Room", "Double Room", "Suite", "Deluxe Room"];
const amenities = ["WiFi", "Parking", "Pool", "Gym", "Restaurant", "Spa", "Room Service", "Air Conditioning"];

const HotelFields = ({ register, control, errors }: HotelFieldsProps) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0F5A8A" }}>
                Hotel Details
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Property Type"
                    placeholder="e.g., Resort, Boutique Hotel"
                    {...register("propertyType", { required: "Property type is required" })}
                    error={!!errors.propertyType}
                    helperText={errors.propertyType?.message}
                />
                <TextField
                    fullWidth
                    type="number"
                    label="Number of Rooms"
                    defaultValue={10}
                    {...register("numberOfRooms", { required: "Number of rooms is required" })}
                    error={!!errors.numberOfRooms}
                    helperText={errors.numberOfRooms?.message}
                />
                <TextField
                    fullWidth
                    type="time"
                    label="Check-in Time"
                    InputLabelProps={{ shrink: true }}
                    {...register("checkInTime", { required: true })}
                />
                <TextField
                    fullWidth
                    type="time"
                    label="Check-out Time"
                    InputLabelProps={{ shrink: true }}
                    {...register("checkOutTime", { required: true })}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Room Types
                </Typography>
                <Controller
                    name="roomTypes"
                    control={control}
                    defaultValue={[]}
                    render={({ field }: { field: any }) => (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                            {roomTypes.map((type) => (
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

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Amenities
                </Typography>
                <Controller
                    name="amenities"
                    control={control}
                    defaultValue={[]}
                    render={({ field }: { field: any }) => (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                            {amenities.map((item) => (
                                <Chip
                                    key={item}
                                    label={item}
                                    clickable
                                    variant={field.value.includes(item) ? "filled" : "outlined"}
                                    color={field.value.includes(item) ? "primary" : "default"}
                                    onClick={() => {
                                        const newValue = field.value.includes(item)
                                            ? field.value.filter((v: string) => v !== item)
                                            : [...field.value, item];
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
                label="Cancellation Policy"
                placeholder="Enter policy details"
                {...register("cancellationPolicy")}
            />
        </Box>
    );
};

export default HotelFields;

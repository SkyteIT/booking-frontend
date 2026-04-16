// src/pages/vendor/CreateListing/components/ActivityFields.tsx
import { Box, TextField, Typography, Chip, Stack } from "@mui/material";
import { Controller } from "react-hook-form";
import type { UseFormRegister, Control } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface ActivityFieldsProps {
    register: UseFormRegister<ListingFormData>;
    control: Control<ListingFormData>;
    errors: any;
}

const includedServices = ["Guide", "Equipment", "Meals", "Transportation", "Accommodation", "Insurance", "Photos/Videos", "Refreshments"];

const ActivityFields = ({ register, control, errors }: ActivityFieldsProps) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: "#0F5A8A" }}>
                Activity Details
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Activity Type"
                    placeholder="e.g., Scuba Diving, City Tour"
                    {...register("activityType", { required: "Activity type is required" })}
                    error={!!errors.activityType}
                    helperText={errors.activityType?.message}
                />
                <TextField
                    fullWidth
                    label="Duration"
                    placeholder="e.g., 2 hours, Full Day"
                    {...register("duration", { required: "Duration is required" })}
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
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
                    render={({ field }: { field: any }) => (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                            {includedServices.map((item) => (
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

export default ActivityFields;

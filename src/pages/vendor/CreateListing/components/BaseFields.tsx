// src/pages/vendor/CreateListing/components/BaseFields.tsx
import { useEffect, useState } from "react";
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress } from "@mui/material";
import type { UseFormRegister, Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";
import { fetchCategories, type ApiCategory } from "../../../../services/categoryService";

interface BaseFieldsProps {
    register: UseFormRegister<any>;
    control: Control<any>;
    errors: any;
}

const BaseFields = ({ register, control, errors }: BaseFieldsProps) => {
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        fetchCategories()
            .then((data) => setCategories(data.filter((c) => c.isActive)))
            .catch(() => setCategories([]))
            .finally(() => setLoadingCategories(false));
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Listing Title */}
            <TextField
                fullWidth
                label="Listing Title"
                placeholder="e.g., Luxury Beachfront Hotel"
                {...register("title", { required: "Title is required" })}
                error={!!errors.title}
                helperText={errors.title?.message}
            />

            {/* Location */}
            <TextField
                fullWidth
                label="Location"
                placeholder="e.g., Miami Beach, FL"
                {...register("location", { required: "Location is required" })}
                error={!!errors.location}
                helperText={errors.location?.message}
            />

            {/* Category — loaded from DB */}
            <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="category-label">Category</InputLabel>
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }: { field: any }) => (
                        <Select
                            labelId="category-label"
                            label="Category"
                            {...field}
                            endAdornment={
                                loadingCategories ? (
                                    <CircularProgress size={18} sx={{ mr: 2 }} />
                                ) : null
                            }
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.name}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.category && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.category.message}
                    </Typography>
                )}
            </FormControl>

            {/* Image Upload */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Listing Images
                </Typography>
                <Box
                    sx={{
                        border: "2px dashed",
                        borderColor: "divider",
                        borderRadius: "12px",
                        p: 4,
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": { borderColor: "primary.main", backgroundColor: "action.hover" },
                    }}
                >
                    <CloudUploadIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        Click or drag images to upload (0/10)
                    </Typography>
                    <input
                        type="file"
                        multiple
                        hidden
                        accept="image/*"
                        {...register("images")}
                    />
                </Box>

                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "#F0F7FF",
                        borderRadius: "8px",
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                    }}
                >
                    <InfoIcon sx={{ color: "#0077B6", fontSize: 20, mt: 0.2 }} />
                    <Typography variant="caption" color="text.secondary">
                        Minimum 1200×800px. First image is cover photo. Supported formats: JPG, PNG, WebP. Max 5MB per image.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default BaseFields;

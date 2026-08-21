import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { ListingFormData } from "../../../../utils/types";

interface ImagesStepProps {
  register: UseFormRegister<ListingFormData>;
  control: Control<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const readImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export default function ImagesStep({ control }: ImagesStepProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add listing photos from your device. The first image is used as the cover photo.
      </Typography>
      <Controller
        name="images"
        control={control}
        defaultValue={[]}
        render={({ field, fieldState }) => (
          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
              sx={{ borderRadius: 2 }}
            >
              Add images
              <input
                hidden
                type="file"
                accept="image/*"
                multiple
                onChange={async (event) => {
                  const files = Array.from(event.target.files ?? []);
                  const oversized = files.find((file) => file.size > MAX_IMAGE_SIZE);
                  if (oversized) {
                    alert(`${oversized.name} is larger than 10 MB.`);
                    event.target.value = "";
                    return;
                  }

                  const selectedImages = await Promise.all(files.map(readImage));
                  field.onChange([...(field.value ?? []), ...selectedImages]);
                  event.target.value = "";
                }}
              />
            </Button>

            {fieldState.error && (
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                {fieldState.error.message}
              </Typography>
            )}

            {(field.value?.length ?? 0) > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 2,
                  mt: 3,
                }}
              >
                {field.value.map((image, index) => (
                  <Box key={`${image.slice(0, 40)}-${index}`} sx={{ position: "relative" }}>
                    <Box
                      component="img"
                      src={image}
                      alt={`Listing preview ${index + 1}`}
                      sx={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 2 }}
                    />
                    <IconButton
                      aria-label={`Remove image ${index + 1}`}
                      size="small"
                      onClick={() => field.onChange(field.value.filter((_, itemIndex) => itemIndex !== index))}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        bgcolor: "background.paper",
                        boxShadow: 1,
                        "&:hover": { bgcolor: "error.light", color: "error.contrastText" },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                    {index === 0 && (
                      <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                        Cover photo
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      />
    </Box>
  );
}

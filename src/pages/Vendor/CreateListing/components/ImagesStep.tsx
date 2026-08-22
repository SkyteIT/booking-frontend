import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";

interface ImagesStepProps {
  existingImages: string[];
  onRemoveExisting: (url: string) => void;
  newFiles: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveNewFile: (index: number) => void;
}

const MAX_IMAGES = 10;

export default function ImagesStep({
  existingImages,
  onRemoveExisting,
  newFiles,
  onAddFiles,
  onRemoveNewFile,
}: ImagesStepProps) {
  const previews = useMemo(() => newFiles.map((file) => URL.createObjectURL(file)), [newFiles]);

  // Object URLs are only freed on unmount/change - not revoking them would
  // leak memory for a form a vendor keeps adding/removing photos on.
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  const totalCount = existingImages.length + newFiles.length;
  const remainingSlots = Math.max(0, MAX_IMAGES - totalCount);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (picked.length === 0) return;
    onAddFiles(picked.slice(0, remainingSlots));
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload up to {MAX_IMAGES} photos (JPG, PNG, or WebP, max 5MB each). The first photo is used as the cover.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {existingImages.map((url) => (
          <Box key={url} sx={{ position: "relative", width: 120, height: 90 }}>
            <Box
              component="img"
              src={url}
              alt="Listing photo"
              sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
            />
            <IconButton
              size="small"
              onClick={() => onRemoveExisting(url)}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "error.light" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {previews.map((url, index) => (
          <Box key={url} sx={{ position: "relative", width: 120, height: 90 }}>
            <Box
              component="img"
              src={url}
              alt="New listing photo"
              sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
            />
            <IconButton
              size="small"
              onClick={() => onRemoveNewFile(index)}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "error.light" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadOutlinedIcon />}
        disabled={remainingSlots === 0}
        sx={{ textTransform: "none", fontWeight: 500, borderRadius: "10px" }}
      >
        {totalCount === 0 ? "Upload photos" : "Add more photos"}
        <input hidden type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileInput} />
      </Button>

      {remainingSlots === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Maximum of {MAX_IMAGES} photos reached.
        </Typography>
      )}
    </Box>
  );
}

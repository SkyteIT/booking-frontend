// Displays the hero image with a thumbnail strip below, driven entirely by
// the listing's real `images` array — no fabricated/derived crops.
import { Box } from "@mui/material";
import { useState } from "react";
import type { Listing } from "../../../Search/utils/types";

interface ImageGalleryProps {
  listing: Listing;
}

const ImageGallery = ({ listing }: ImageGalleryProps) => {
  const images = listing.images;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      {/* Hero Image */}
      <Box
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          height: { xs: 260, sm: 400, md: 460 },
          position: "relative",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          component="img"
          src={images[activeIndex]}
          alt={listing.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s ease",
          }}
        />
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)`,
            gap: "10px",
            mt: "10px",
          }}
        >
          {images.map((img, i) => (
            <Box
              key={img + i}
              onClick={() => setActiveIndex(i)}
              sx={{
                height: { xs: 64, sm: 84 },
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                border: "2px solid",
                borderColor: activeIndex === i ? "primary.main" : "transparent",
                opacity: activeIndex === i ? 1 : 0.6,
                transition: "all 0.2s ease",
                "&:hover": { opacity: 1 },
              }}
            >
              <Box
                component="img"
                src={img}
                alt={`${listing.title} ${i + 1}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageGallery;

// Displays the hero image with thumbnail strip below.
// Active thumbnail is highlighted; clicking switches the main image.
import { Box } from "@mui/material";
import { useState } from "react";
import type { Listing } from "../../../Search/utils/types";

// Extra side images derived from the listing's single image using Unsplash params.
// In a real API these would be separate image URLs from the listing object.
const buildGallery = (image: string): string[] => [
  image,
  image.replace("w=900", "w=400&crop=entropy"),
  image.replace("w=900", "w=400&crop=faces"),
  image.replace("w=900", "w=400&crop=top"),
];

interface ImageGalleryProps {
  listing: Listing;
}

const ImageGallery = ({ listing }: ImageGalleryProps) => {
  const images = buildGallery(listing.image);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      {/* Hero Image */}
      <Box
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          height: { xs: 240, sm: 380, md: 440 },
          position: "relative",
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "8px",
          mt: "8px",
        }}
      >
        {images.slice(1).map((img, i) => (
          <Box
            key={i}
            onClick={() => setActiveIndex(i + 1)}
            sx={{
              height: { xs: 72, sm: 100 },
              borderRadius: "12px",
              overflow: "hidden",
              cursor: "pointer",
              outline: activeIndex === i + 1 ? "3px solid" : "none",
              outlineColor: "primary.main",
              opacity: activeIndex === i + 1 ? 1 : 0.65,
              transition: "all 0.2s ease",
              "&:hover": { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={img}
              alt={`${listing.title} ${i + 2}`}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImageGallery;
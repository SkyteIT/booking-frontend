// Displays the hero image with a thumbnail strip below, driven entirely by
// the listing's real `images` array — no fabricated/derived crops.
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import type { Listing } from "../../../Search/utils/types";

interface ImageGalleryProps {
  listing: Listing;
  category?: string;
}

const ImageGallery = ({ listing, category }: ImageGalleryProps) => {
  const images = listing.images;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      {/* Hero Image */}
      <Box
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          height: { xs: 280, sm: 420, md: 480 },
          position: "relative",
          boxShadow: "0 20px 48px rgba(15,27,45,0.18)",
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

        {/* Gradient overlay - matches the landing page's card treatment,
            keeps the badges below legible against any photo. */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(15,27,45,0.78) 0%, rgba(15,27,45,0.32) 32%, rgba(15,27,45,0.02) 55%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {category && (
          <Box
            sx={{
              position: "absolute",
              left: 20,
              bottom: 20,
              px: 1.75,
              py: 0.75,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.16)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {category}
            </Typography>
          </Box>
        )}

        {images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              right: 20,
              bottom: 20,
              px: 1.5,
              py: 0.6,
              borderRadius: "999px",
              backgroundColor: "rgba(15,27,45,0.5)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "0.78rem" }}>
              {activeIndex + 1} / {images.length}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)`,
            gap: "12px",
            mt: "12px",
          }}
        >
          {images.map((img, i) => (
            <Box
              key={img + i}
              onClick={() => setActiveIndex(i)}
              sx={{
                height: { xs: 68, sm: 88 },
                borderRadius: "14px",
                overflow: "hidden",
                cursor: "pointer",
                border: "2px solid",
                borderColor: activeIndex === i ? "primary.main" : "transparent",
                opacity: activeIndex === i ? 1 : 0.6,
                boxShadow: activeIndex === i ? "0 6px 16px rgba(0,119,182,0.28)" : "none",
                transform: activeIndex === i ? "translateY(-2px)" : "none",
                transition: "all 0.2s ease",
                "&:hover": { opacity: 1, transform: "translateY(-2px)" },
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

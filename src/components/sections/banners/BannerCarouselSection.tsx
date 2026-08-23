import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import {
  Alert,
  Box,
  Container,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePlacementBanners } from "../../../hooks/usePlacementBanners";
import type { BannerPlacement } from "../../../services/bannerService";

type BannerCarouselSectionProps = {
  placement?: BannerPlacement;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showHeader?: boolean;
};

const AUTO_ROTATE_MS = 4500;

const BannerSkeleton = ({ height }: { height: number }) => (
  <Paper
    elevation={0}
    sx={{
      width: "100%",
      height,
      borderRadius: { xs: "20px", md: "28px" },
      overflow: "hidden",
      border: "1px solid rgba(15, 23, 42, 0.08)",
      background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(241,247,252,0.98) 100%)",
      boxShadow: "0 14px 36px rgba(15, 23, 42, 0.08)",
      position: "relative",
    }}
  >
    <Skeleton variant="rectangular" sx={{ width: "100%", height: "100%" }} />
    <Box sx={{ position: "absolute", left: 28, bottom: 28, width: "45%" }}>
      <Skeleton width="55%" height={14} sx={{ mb: 1 }} />
      <Skeleton width="90%" height={28} />
    </Box>
  </Paper>
);

export default function BannerCarouselSection({
  placement,
  title,
  subtitle,
  compact = false,
  showHeader = true,
}: BannerCarouselSectionProps) {
  const { banners, loading, error } = usePlacementBanners(placement);
  const [activeIndex, setActiveIndex] = useState(0);
  // Auto-rotate pauses the moment someone's mouse, finger, or keyboard
  // focus is on the banner - it should never slide out from under a
  // person who's actually reading it or about to click it.
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [placement, banners.length]);

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [banners.length, isPaused]);

  const activeBanner = useMemo(() => {
    if (banners.length === 0) return null;
    return banners[activeIndex] ?? banners[0];
  }, [activeIndex, banners]);

  const hasMultipleSlides = banners.length > 1;
  const bannerHeight = compact ? { xs: 200, md: 260 } : { xs: 260, md: 360 };

  const goToSlide = (index: number) => {
    if (banners.length === 0) return;
    const normalizedIndex = ((index % banners.length) + banners.length) % banners.length;
    setActiveIndex(normalizedIndex);
  };

  if (!loading && !error && banners.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        py: compact ? { xs: 1, md: 1.5 } : { xs: 2, md: 3 },
        background: "linear-gradient(180deg, rgba(8, 24, 43, 0.012) 0%, rgba(17, 115, 212, 0.024) 100%)",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: { xs: 1.5, sm: 2.5, md: 3 }, width: "100%", mx: "auto" }}
      >
        {showHeader && (title || subtitle) ? (
          <Box sx={{ mb: 2 }}>
            {placement ? (
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "primary.main",
                  mb: 0.5,
                }}
              >
                {placement}
              </Typography>
            ) : null}
            {title ? (
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  fontSize: { xs: "1.35rem", md: "1.75rem" },
                  color: "text.primary",
                  mb: subtitle ? 0.35 : 0,
                }}
              >
                {title}
              </Typography>
            ) : null}
            {subtitle ? (
              <Typography sx={{ color: "text.secondary", maxWidth: 720, lineHeight: 1.6, fontSize: "0.95rem" }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
        ) : null}

        {loading ? (
          <BannerSkeleton height={typeof bannerHeight.md === "number" ? bannerHeight.md : 300} />
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "16px", mx: "auto", width: "100%" }}>
            {error}
          </Alert>
        ) : activeBanner ? (
          <Box
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={(e) => {
              if (!containerRef.current?.contains(e.relatedTarget as Node)) setIsPaused(false);
            }}
            onTouchStart={() => setIsPaused(true)}
            sx={{
              position: "relative",
              width: "100%",
              height: bannerHeight,
              mx: "auto",
              overflow: "hidden",
              borderRadius: { xs: "20px", md: "28px" },
              border: "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "0 20px 48px rgba(6, 34, 64, 0.22)",
              background: "linear-gradient(160deg, #062038 0%, #0a3a63 45%, #0077b6 100%)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: `${Math.max(1, banners.length) * 100}%`,
                height: "100%",
                transform: `translateX(-${activeIndex * (100 / Math.max(1, banners.length))}%)`,
                transition: "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              }}
            >
              {banners.map((banner) => (
                <Box
                  key={banner.id}
                  {...(banner.actionUrl
                    ? {
                        component: "a",
                        href: banner.actionUrl,
                        target: banner.openInNewTab ? "_blank" : undefined,
                        rel: banner.openInNewTab ? "noopener noreferrer" : undefined,
                      }
                    : {})}
                  sx={{
                    position: "relative",
                    flex: `0 0 ${100 / Math.max(1, banners.length)}%`,
                    minWidth: `${100 / Math.max(1, banners.length)}%`,
                    height: "100%",
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: banner.actionUrl ? "pointer" : "default",
                  }}
                >
                  {/* Full-bleed image */}
                  {banner.imageUrl ? (
                    <Box
                      component="img"
                      src={banner.imageUrl}
                      alt=""
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <PhotoOutlinedIcon sx={{ fontSize: 44 }} />
                    </Box>
                  )}

                  {/* Scrim - darkens the lower half so the overlaid text stays
                      legible against any photo, without flattening the image
                      with an opaque panel. */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(0deg, rgba(4,16,30,0.88) 0%, rgba(4,16,30,0.5) 38%, rgba(4,16,30,0.05) 68%, rgba(4,16,30,0) 100%)",
                    }}
                  />

                  {/* Copy, overlaid bottom-left */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: { xs: 0, md: "18%" },
                      bottom: 0,
                      p: { xs: 2.5, sm: 3.5, md: 5 },
                      color: "#fff",
                    }}
                  >
                    {banner.bannerType ? (
                      <Typography
                        sx={{
                          display: "inline-block",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "#fff",
                          bgcolor: "rgba(255,255,255,0.16)",
                          border: "1px solid rgba(255,255,255,0.28)",
                          borderRadius: "999px",
                          px: 1.4,
                          py: 0.4,
                          mb: 1.4,
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        {banner.bannerType}
                      </Typography>
                    ) : null}

                    <Typography
                      sx={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        fontSize: { xs: "1.5rem", sm: "1.9rem", md: "2.6rem" },
                        lineHeight: 1.05,
                        color: "#fff",
                        textShadow: "0 2px 18px rgba(0,0,0,0.35)",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {banner.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1,
                        maxWidth: 520,
                        color: "rgba(255,255,255,0.88)",
                        fontSize: { xs: "0.88rem", sm: "0.95rem", md: "1.08rem" },
                        lineHeight: 1.55,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      {banner.description}
                    </Typography>

                    {banner.actionUrl ? (
                      <Box
                        sx={{
                          mt: { xs: 1.75, md: 2.5 },
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.75,
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "#fff",
                          bgcolor: "rgba(255,255,255,0.14)",
                          border: "1px solid rgba(255,255,255,0.32)",
                          borderRadius: "999px",
                          px: 2,
                          py: 0.9,
                          backdropFilter: "blur(8px)",
                          transition: "background-color 160ms ease, transform 160ms ease",
                        }}
                      >
                        Explore
                        <ArrowOutwardIcon sx={{ fontSize: "1rem" }} />
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              ))}
            </Box>

            {hasMultipleSlides ? (
              <>
                <IconButton
                  onClick={() => goToSlide(activeIndex - 1)}
                  aria-label="Previous banner"
                  sx={{
                    position: "absolute",
                    left: { xs: 8, md: 16 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(4,16,30,0.32)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(10px)",
                    "&:hover": { bgcolor: "rgba(4,16,30,0.5)" },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  onClick={() => goToSlide(activeIndex + 1)}
                  aria-label="Next banner"
                  sx={{
                    position: "absolute",
                    right: { xs: 8, md: 16 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(4,16,30,0.32)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(10px)",
                    "&:hover": { bgcolor: "rgba(4,16,30,0.5)" },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>

                <Box
                  sx={{
                    position: "absolute",
                    right: { xs: 16, md: 28 },
                    bottom: { xs: 16, md: 24 },
                    display: "flex",
                    alignItems: "center",
                    gap: 0.9,
                  }}
                >
                  {banners.map((banner, index) => (
                    <Box
                      key={banner.id}
                      component="button"
                      type="button"
                      aria-label={`Go to banner ${index + 1}`}
                      onClick={() => goToSlide(index)}
                      sx={{
                        width: activeIndex === index ? 22 : 8,
                        height: 8,
                        p: 0,
                        border: 0,
                        borderRadius: 999,
                        cursor: "pointer",
                        transition: "all 220ms ease",
                        backgroundColor: activeIndex === index ? "#fff" : "rgba(255,255,255,0.4)",
                      }}
                    />
                  ))}
                </Box>
              </>
            ) : null}
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}

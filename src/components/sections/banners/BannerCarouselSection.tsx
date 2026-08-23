import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Alert,
  Box,
  Container,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { usePlacementBanners } from "../../../hooks/usePlacementBanners";
import type { BannerPlacement } from "../../../services/bannerService";

type BannerCarouselSectionProps = {
  placement?: BannerPlacement;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showHeader?: boolean;
};

const AUTO_ROTATE_MS = 2000;

const BannerSkeleton = () => (
  <Paper
    elevation={0}
    sx={{
      width: "100%",
      mx: "auto",
      borderRadius: { xs: "18px", md: "24px" },
      overflow: "hidden",
      border: "1px solid rgba(15, 23, 42, 0.08)",
      background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(241,247,252,0.98) 100%)",
      boxShadow: "0 14px 36px rgba(15, 23, 42, 0.08)",
    }}
  >
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.15fr" }, gap: 0 }}>
      <Skeleton variant="rectangular" sx={{ minHeight: { xs: 34, md: 30 }, borderRadius: "12px" }} />
      <Box sx={{ p: { xs: 0.8, sm: 1, md: 1.15 }, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Skeleton width="38%" height={10} />
        <Skeleton width="80%" height={18} />
        <Skeleton width="62%" height={10} />
      </Box>
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

  useEffect(() => {
    setActiveIndex(0);
  }, [placement, banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  const activeBanner = useMemo(() => {
    if (banners.length === 0) return null;
    return banners[activeIndex] ?? banners[0];
  }, [activeIndex, banners]);

  const hasMultipleSlides = banners.length > 1;

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
        py: compact ? { xs: 0.35, md: 0.4 } : { xs: 0.6, md: 0.8 },
        background: "linear-gradient(180deg, rgba(8, 24, 43, 0.012) 0%, rgba(17, 115, 212, 0.024) 100%)",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: { xs: 1.5, sm: 2.5, md: 3 }, width: "100%", mx: "auto" }}
      >
        {showHeader && (title || subtitle) ? (
          <Box sx={{ mb: 1.5 }}>
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
          <BannerSkeleton />
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: "16px", mx: "auto", width: "100%" }}>
            {error}
          </Alert>
        ) : activeBanner ? (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              mx: "auto",
              overflow: "hidden",
              borderRadius: { xs: "18px", md: "24px" },
              border: "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "0 14px 36px rgba(15, 23, 42, 0.12)",
              background:
                "linear-gradient(135deg, rgba(10, 26, 45, 0.98) 0%, rgba(14, 57, 92, 0.96) 44%, rgba(17, 115, 212, 0.95) 100%)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: `${Math.max(1, banners.length) * 100}%`,
                transform: `translateX(-${activeIndex * (100 / Math.max(1, banners.length))}%)`,
                transition: "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)",
                "@media (prefers-reduced-motion: reduce)": {
                  transition: "none",
                },
              }}
            >
              {banners.map((banner) => (
                <Box
                key={banner.id}
                sx={{
                    flex: `0 0 ${100 / Math.max(1, banners.length)}%`,
                    minWidth: `${100 / Math.max(1, banners.length)}%`,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "0.95fr 1.05fr" },
                    alignItems: "stretch",
                    minHeight: 150,
                    height: 150,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      background: "rgba(255,255,255,0.08)",
                      minHeight: { xs: 120, md: "100%" },
                      overflow: "hidden",
                    }}
                  >
                    {banner.imageUrl ? (
                      <Box
                        component="img"
                        src={banner.imageUrl}
                        alt={banner.title}
                        sx={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          objectPosition: "center",
                          background: "rgba(255,255,255,0.04)",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "grid",
                          placeItems: "center",
                          color: "#fff",
                        }}
                      >
                        <PhotoOutlinedIcon sx={{ fontSize: 32, opacity: 0.7 }} />
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      px: { xs: 1.25, sm: 1.5, md: 2.2 },
                      py: { xs: 1.1, md: 1.4 },
                      color: "#fff",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        letterSpacing: "-0.035em",
                        fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                        lineHeight: 1.04,
                        color: "#fff",
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
                        mt: 0.7,
                        color: "rgba(255,255,255,0.9)",
                        fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1.05rem" },
                        lineHeight: 1.5,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 4,
                      }}
                    >
                      {banner.description}
                    </Typography>
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
                    left: { xs: 6, md: 10 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(10px)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.24)" },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  onClick={() => goToSlide(activeIndex + 1)}
                  aria-label="Next banner"
                  sx={{
                    position: "absolute",
                    right: { xs: 6, md: 10 },
                    top: "50%",
                    transform: "translateY(-50%)",
                    bgcolor: "rgba(255,255,255,0.14)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(10px)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.24)" },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>

                <Box
                  sx={{
                    position: "absolute",
                    left: "50%",
                    bottom: 10,
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    px: 1.2,
                    py: 0.7,
                    borderRadius: 999,
                    bgcolor: "rgba(7, 20, 35, 0.38)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
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
                        width: activeIndex === index ? 18 : 8,
                        height: 8,
                        p: 0,
                        border: 0,
                        borderRadius: 999,
                        cursor: "pointer",
                        transition: "all 220ms ease",
                        backgroundColor: activeIndex === index ? "#fff" : "rgba(255,255,255,0.45)",
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

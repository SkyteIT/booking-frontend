// src/components/sections/landing/HowItWorksSection.tsx
import { Box, Container, Typography, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";

const steps = [
  {
    id: 1,
    icon: <SearchIcon sx={{ fontSize: "2rem", color: "#ffffff" }} />,
    title: "Search & Discover",
    description:
      "Browse thousands of listings across hotels, restaurants, events, activities, and rentals in your area or anywhere in the world.",
  },
  {
    id: 2,
    icon: <EventAvailableIcon sx={{ fontSize: "2rem", color: "#ffffff" }} />,
    title: "Choose & Book",
    description:
      "Select your preferred listing, pick your dates, and complete your booking instantly with our secure and easy checkout process.",
  },
  {
    id: 3,
    icon: <ThumbUpAltIcon sx={{ fontSize: "2rem", color: "#ffffff" }} />,
    title: "Enjoy & Review",
    description:
      "Enjoy your experience and share your feedback. Your reviews help others make better decisions and improve our community.",
  },
];

const HowItWorksSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
          <Typography
            variant="body2"
            sx={{
              color: "#2563EB",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.8rem",
              mb: 1,
            }}
          >
            Simple Process
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              mb: 1.5,
            }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 480,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            Get started in just three simple steps and enjoy seamless booking
            experiences every time.
          </Typography>
        </Box>

        {/* Steps */}
        <Grid container spacing={4} alignItems="flex-start">
          {steps.map((step, index) => (
            <Grid key={step.id} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                {/* Connector Line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute",
                      top: 36,
                      left: "calc(50% + 48px)",
                      width: "calc(100% - 96px)",
                      height: "2px",
                      backgroundColor: "#DBEAFE",
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Step Number + Icon */}
                <Box
                  sx={{
                    position: "relative",
                    mb: 3,
                    zIndex: 1,
                  }}
                >
                  {/* Outer Ring */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "16px", // ← changed from "50%"
                      backgroundColor: "#DBEAFE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Inner Square */}
                    <Box
                      sx={{
                        width: 65,
                        height: 65,
                        borderRadius: "12px", // ← changed from "80%"
                        background:
                          "linear-gradient(180deg, #0077B6 0%, #00B4D8 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {step.icon}
                    </Box>
                  </Box>

                  {/* Step Number Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "#FF6B2C",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #ffffff",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ffffff",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {step.id}
                    </Typography>
                  </Box>
                </Box>

                {/* Title */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "1.1rem",
                    mb: 1.5,
                  }}
                >
                  {step.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.8,
                    fontSize: "0.9rem",
                    maxWidth: 280,
                    mx: "auto",
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;

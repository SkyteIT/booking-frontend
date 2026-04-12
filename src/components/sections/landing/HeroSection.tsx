// src/components/sections/landing/HeroSection.tsx
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [search, setSearch] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const hasValue = [search, location, date, guests].some(
      (value) => value.trim().length > 0,
    );

    if (!hasValue) {
      return;
    }

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("q", search.trim());
    }
    if (location.trim()) {
      params.set("location", location.trim());
    }
    if (date.trim()) {
      params.set("date", date.trim());
    }
    if (guests.trim()) {
      params.set("guests", guests.trim());
    }

    navigate({
      pathname: "/search",
      search: params.toString(),
    });
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #F8FAFC 0%, rgba(126, 188, 200, 0.2) 50%, #F8FAFC 100%)",
        minHeight: { xs: "auto", md: "calc(100vh - 64px) " },
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left — Text + Search */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ pr: { md: 4 } }}>
              {/* Headline */}
              <Typography
                variant="h1"
                sx={{
                  color: "#0F172A",
                  fontWeight: 800,
                  fontSize: { xs: "2.25rem", sm: "2.75rem", md: "3.25rem" },
                  lineHeight: 1.15,
                  mb: 2.5,
                }}
              >
                Book hotels, restaurants, events, activities and rentals
                <Box component="span" sx={{ color: "#0077B6" }}>
                  {" "}
                  —instantly.
                </Box>
              </Typography>

              {/* Subtext */}
              <Typography
                variant="body1"
                sx={{
                  color: "#64748B",
                  fontSize: { xs: "0.95rem", md: "1rem" },
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 420,
                }}
              >
                Discover and book amazing experiences from thousands of verified
                vendors. Your perfect adventure is just a click away.
              </Typography>

              {/* Search Card */}
              <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={0}
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  p: 2,
                  boxShadow: "0px 4px 24px rgba(0,0,0,0.08)",
                  maxWidth: 480,
                }}
              >
                {/* Search Input Row */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 1.5,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  {/* Search Field */}
                  <TextField
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#F8FAFC",
                        fontSize: "0.875rem",
                        "& fieldset": { borderColor: "#E2E8F0" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{ fontSize: "1rem", color: "#94A3B8" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Location, Date, Guests Row */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 1.5,
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                  }}
                >
                  {/* Location */}
                  <TextField
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    size="small"
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#F8FAFC",
                        fontSize: "0.875rem",
                        "& fieldset": { borderColor: "#E2E8F0" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon
                            sx={{ fontSize: "1rem", color: "#94A3B8" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Date */}
                  <TextField
                    placeholder="mm/dd"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    size="small"
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#F8FAFC",
                        fontSize: "0.875rem",
                        "& fieldset": { borderColor: "#E2E8F0" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon
                            sx={{ fontSize: "1rem", color: "#94A3B8" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Guests */}
                  <TextField
                    placeholder="Guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    size="small"
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#F8FAFC",
                        fontSize: "0.875rem",
                        "& fieldset": { borderColor: "#E2E8F0" },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleIcon
                            sx={{ fontSize: "1rem", color: "#94A3B8" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Search Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<SearchIcon />}
                  sx={{
                    backgroundColor: "#0077B6",
                    color: "#ffffff",
                    borderRadius: "10px",
                    py: 1.25,
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#005A8D",
                      boxShadow: "none",
                    },
                  }}
                >
                  Search
                </Button>
              </Paper>
            </Box>
          </Grid>

          {/* Right — Image with Rating Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "20px",
                overflow: "hidden",
                border: "14px solid #ffffff",
                boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.04)", // optional outer glow
              }}
            >
              {/* Main Image */}
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1761377197584-2eed555e2b0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5JTIwdHJhdmVsZXIlMjBtb2Rlcm58ZW58MXx8fHwxNzcwNzc0ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Booking experience"
                sx={{
                  width: "100%",
                  height: { xs: 280, md: 420 },
                  objectFit: "cover",
                  borderRadius: "14px",
                  display: "block",
                }}
              />

              {/* Rating Card Overlay */}
              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  px: 2.5,
                  py: 1.5,
                  textAlign: "center",
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                  minWidth: 80,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  <StarIcon sx={{ color: "#0077B6", fontSize: "1.1rem" }} />
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.4rem",
                      color: "#0F172A",
                      lineHeight: 1,
                    }}
                  >
                    4.8
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#64748B",
                    mt: 0.5,
                    fontWeight: 500,
                  }}
                >
                  Rating
                </Typography>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;

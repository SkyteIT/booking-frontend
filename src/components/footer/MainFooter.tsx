// src/components/footer/MainFooter.tsx
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import SendIcon from "@mui/icons-material/Send";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  Link,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import icon from "../../assets/icons/icon2.png";

const footerLinks = {
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Partners", href: "#" },
  ],
  Listings: [
    { label: "Hotels", href: "#" },
    { label: "Restaurants", href: "#" },
    { label: "Events", href: "#" },
    { label: "Activities", href: "#" },
    { label: "Car Rentals", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: <FacebookIcon fontSize="small" />, href: "#", label: "Facebook" },
  { icon: <TwitterIcon fontSize="small" />, href: "#", label: "Twitter" },
  { icon: <InstagramIcon fontSize="small" />, href: "#", label: "Instagram" },
  { icon: <LinkedInIcon fontSize="small" />, href: "#", label: "LinkedIn" },
  { icon: <YouTubeIcon fontSize="small" />, href: "#", label: "YouTube" },
];

const contactInfo = [
  {
    icon: <EmailIcon sx={{ fontSize: "1rem", color: "#60A5FA" }} />,
    text: "support@ube.com",
  },
  {
    icon: <PhoneIcon sx={{ fontSize: "1rem", color: "#60A5FA" }} />,
    text: "+94 123 456 789",
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: "1rem", color: "#60A5FA" }} />,
    text: "123 Main Street, Colombo, Sri Lanka",
  },
];

const MainFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0F172A",
        color: "#ffffff",
        pt: { xs: 6, md: 10 },
        pb: 0,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1 — Brand + Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2.5,
              }}
            >
              <Box>
                <img src={icon} alt="UBE" style={{ width: 40, height: 40}} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#0077b6",
                  letterSpacing: "-0.02em",
                }}
              >
                  UBE
              </Typography>
            </Box>

            {/* Brand Description */}
            <Typography
              variant="body2"
              sx={{
                color: "#94A3B8",
                lineHeight: 1.8,
                fontSize: "0.875rem",
                mb: 3,
                maxWidth: 300,
              }}
            >
              The all-in-one platform to discover, book, and manage hotels,
              restaurants, events, activities, and rentals — instantly.
            </Typography>

            {/* Contact Info */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}
            >
              {contactInfo.map((item) => (
                <Box
                  key={item.text}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  {item.icon}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#94A3B8",
                      fontSize: "0.875rem",
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  size="small"
                  sx={{
                    color: "#94A3B8",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    width: 36,
                    height: 36,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#0077b6",
                      color: "#ffffff",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Columns 2, 3, 4 — Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={category}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  mb: 2.5,
                  letterSpacing: "0.02em",
                }}
              >
                {category}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.25,
                }}
              >
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    underline="none"
                    sx={{
                      color: "#94A3B8",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      transition: "color 0.2s ease",
                      width: "fit-content",
                      "&:hover": {
                        color: "#60A5FA",
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Column 5 — Newsletter */}
          <Grid size={{ xs: 12, sm: 8, md: 2 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                color: "#ffffff",
                fontSize: "0.95rem",
                mb: 2.5,
                letterSpacing: "0.02em",
              }}
            >
              Newsletter
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#94A3B8",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                mb: 2,
              }}
            >
              Subscribe to get the latest deals and updates directly to your
              inbox.
            </Typography>

            {/* Email Input */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <TextField
                placeholder="Your email address"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#64748B", fontSize: "1rem" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.1)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.25)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#0077b6",
                    },
                  },
                  "& input::placeholder": {
                    color: "#64748B",
                    opacity: 1,
                  },
                }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon sx={{ fontSize: "1rem" }} />}
                fullWidth
                sx={{
                  backgroundColor: "#0077b6",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  py: 1.1,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#0077a8",
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mt: 6 }} />
        <Box
          sx={{
            py: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#64748B", fontSize: "0.8rem" }}
          >
            © {new Date().getFullYear()} UBE. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    color: "#64748B",
                    fontSize: "0.8rem",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#60A5FA" },
                  }}
                >
                  {item}
                </Link>
              ),
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MainFooter;

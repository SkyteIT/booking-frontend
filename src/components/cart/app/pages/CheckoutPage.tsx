import { CheckCircle } from '@mui/icons-material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Divider,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../context/useAuth';
import { checkoutSchema } from '../../../../utils/validationSchemas';
import { zodErrorToFieldErrors } from '../../../../utils/zodUtils';
import ToastAlert from '../../../common/ToastAlert';
import { useCart } from '../contexts/CartContext';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(0,119,182,0.04)',
    '&.Mui-focused': { backgroundColor: 'transparent' },
  },
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedCart, getSelectedTotal } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    specialRequests: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBookingToast, setShowBookingToast] = useState(false);

  useEffect(() => {
    // Reached directly via URL rather than the Cart page's own guarded
    // button - same check, applied again here so this page is never
    // reachable unauthenticated regardless of entry point.
    if (!isAuthenticated) {
      navigate('/login?next=/cart');
      return;
    }
    // Nothing selected (or nothing left in the cart at all) - there's
    // nothing to check out, so send the user back to select something.
    if (selectedCart.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, selectedCart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      setErrors(zodErrorToFieldErrors(result.error));
      return false;
    }
    setErrors({});
    return true;
  };

  const handleContinueToPayment = () => {
    if (validate()) {
      sessionStorage.setItem('checkoutData', JSON.stringify(formData));
      setShowBookingToast(true);
    }
  };

  const handleBookingToastClose = () => {
    setShowBookingToast(false);
    navigate('/payment');
  };

  // Matches what PaymentPage (and the backend's CheckoutAsync) actually
  // charges - no tax or service fee is added anywhere server-side, so
  // showing fabricated ones here just contradicted the very next screen.
  const subtotal = getSelectedTotal();
  const total = subtotal;
  const currency = selectedCart[0]?.currency ?? 'LKR';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        backgroundImage:
          'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(0,119,182,0.16), transparent 70%)',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container maxWidth="lg" sx={{ flex: 1, pt: 16, pb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            letterSpacing: '-0.02em',
            fontSize: { xs: '2rem', md: '2.4rem' },
            mb: 4,
            display: 'flex',
            alignItems: 'baseline',
            gap: '2px',
          }}
        >
          Checkout
          <Box component="span" sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: 'primary.main', ml: 0.5 }} />
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Main Form */}
          <Box sx={{ flex: 1 }}>
            {/* Contact Information */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: '20px', boxShadow: '0 12px 32px rgba(15,27,45,0.06)' }}>
              <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 3 }}>
                Contact Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Phone
                  </Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlinedIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Billing Address */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: '20px', boxShadow: '0 12px 32px rgba(15,27,45,0.06)' }}>
              <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 3 }}>
                Billing Address
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Street Address
                  </Typography>
                  <TextField
                    fullWidth
                    name="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnOutlinedIcon sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    City
                  </Typography>
                  <TextField
                    fullWidth
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    State/Province
                  </Typography>
                  <TextField
                    fullWidth
                    name="state"
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleInputChange}
                    error={!!errors.state}
                    helperText={errors.state}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    ZIP Code
                  </Typography>
                  <TextField
                    fullWidth
                    name="zipCode"
                    placeholder="10001"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                    sx={fieldSx}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Country
                  </Typography>
                  <TextField fullWidth name="country" value={formData.country} onChange={handleInputChange} sx={fieldSx} />
                </Grid>
              </Grid>
            </Paper>

            {/* Special Requests */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: '20px', boxShadow: '0 12px 32px rgba(15,27,45,0.06)' }}>
              <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 3 }}>
                Special Requests
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={4}
                name="specialRequests"
                placeholder="Any special requests or requirements?"
                value={formData.specialRequests}
                onChange={handleInputChange}
                sx={fieldSx}
              />
            </Paper>

            {/* Terms Agreement */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: '20px', boxShadow: '0 12px 32px rgba(15,27,45,0.06)' }}>
              <FormControlLabel
                control={<Checkbox name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} />}
                label={
                  <Typography variant="body2">
                    I agree to the Terms of Service and Privacy Policy. I understand that all bookings
                    are subject to availability and confirmation.
                  </Typography>
                }
              />
              {errors.agreeToTerms && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                  {errors.agreeToTerms}
                </Typography>
              )}
            </Paper>
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', lg: 380 } }}>
            <Paper
              sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(15,27,45,0.12)',
                position: { lg: 'sticky' },
                top: { lg: 128 },
              }}
            >
              <Box sx={{ background: 'linear-gradient(160deg, #005a8d, #0077b6)', px: 3, py: 2.5 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>
                  ORDER SUMMARY
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                  {currency} {total.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Items ({selectedCart.length})
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {currency} {subtotal.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2.5 }} />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleContinueToPayment}
                  disabled={showBookingToast}
                  sx={{
                    borderRadius: '999px',
                    textTransform: 'none',
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    mb: 2,
                    color: '#fff',
                    background: 'linear-gradient(160deg, #005a8d, #0077b6)',
                    '&:hover': {
                      background: 'linear-gradient(160deg, #004a75, #005a8d)',
                      boxShadow: '0 12px 28px rgba(0,119,182,0.32)',
                    },
                  }}
                >
                  Continue to Payment
                </Button>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: '1rem', color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                      Free cancellation up to 24 hours
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: '1rem', color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                      Instant confirmation
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: '1rem', color: 'success.main' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                      Secure payment processing
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      <ToastAlert
        open={showBookingToast}
        onClose={handleBookingToastClose}
        severity="success"
        duration={1800}
        message={`${selectedCart.length} booking${selectedCart.length === 1 ? '' : 's'} ready. Taking you to secure payment...`}
      />
    </Box>
  );
};

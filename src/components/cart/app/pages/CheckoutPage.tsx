import React, { useState, useEffect } from 'react';
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
  Alert,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
//import { Footer } from '../components/Footer';
//import { toast } from 'sonner';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, getCartItemsCount } = useCart();

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

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validate()) {
      // Store form data in sessionStorage
      sessionStorage.setItem('checkoutData', JSON.stringify(formData));
      navigate('/payment');
    } else {
      //toast.error('Please fill in all required fields correctly');
      alert('Please fill in all required fields correctly');
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const serviceFee = 25;
  const total = subtotal + tax + serviceFee;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        {/* Header */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Checkout
        </Typography>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Main Form */}
          <Box sx={{ flex: 1 }}>
            {/* Contact Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
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
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1, color: '#94A3B8' }}>
                          👤
                        </Box>
                      ),
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
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1, color: '#94A3B8' }}>
                          👤
                        </Box>
                      ),
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
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1, color: '#94A3B8' }}>
                          ✉️
                        </Box>
                      ),
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
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1, color: '#94A3B8' }}>
                          📞
                        </Box>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Billing Address */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
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
                    InputProps={{
                      startAdornment: (
                        <Box component="span" sx={{ mr: 1, color: '#94A3B8' }}>
                          📍
                        </Box>
                      ),
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
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    Country
                  </Typography>
                  <TextField
                    fullWidth
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}

                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Special Requests */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
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
              />
            </Paper>

            {/* Terms Agreement */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                  />
                }
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
            <Paper sx={{ p: 3, position: { lg: 'sticky' }, top: { lg: 80 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Items
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Tax
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${tax.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Service Fee
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${serviceFee.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0891B2' }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleContinueToPayment}
                sx={{
                  bgcolor: '#0891B2',
                  '&:hover': { bgcolor: '#0E7490' },
                  textTransform: 'none',
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Continue to Payment
              </Button>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: '1rem', color: '#10B981' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                    Free cancellation up to 24 hours
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: '1rem', color: '#10B981' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                    Instant confirmation
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: '1rem', color: '#10B981' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                    Secure payment processing
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/*<Footer />*/}
    </Box>
  );
};

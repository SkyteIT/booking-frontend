import { Lock, CreditCard } from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  TextField,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { isAxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { checkout } from '../../../../services/Customer/checkoutService';
import { useCart } from '../contexts/CartContext';
//import { Footer } from '../components/Footer';
//import { toast } from 'sonner';





export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCart, getSelectedTotal, removeCartItems } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    // Check if checkout data exists
    const checkoutData = sessionStorage.getItem('checkoutData');
    if (!checkoutData) {
      navigate('/cart');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === 'cardNumber') {
      const numbersOnly = value.replace(/\D/g, '');
      formattedValue = numbersOnly.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    if (name === 'cardName') {
    formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
  }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + ' / ' + formattedValue.slice(2, 4);
      }
      if (value.length > 7) return;
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData({
      ...paymentData,
      [name]: formattedValue,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!paymentData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (!paymentData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPayment = async () => {
    if (!validate()) {
      //toast.error('Please fill in all payment details correctly');
      alert('Please fill in all required fields correctly');
      return;
    }

    setCheckoutError(null);
    setIsProcessing(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      const items = selectedCart.map((item) => ({
        listingId: item.id,
        quantity: item.quantity,
        startDateTime: item.startDate,
        endDateTime: item.endDate,
        listingUnitId: item.listingUnitId ?? null,
      }));

      const result = await checkout(items, idempotencyKey);

      sessionStorage.setItem('orderData', JSON.stringify(result));
      // Only remove the lines that were actually just checked out - any
      // unselected cart lines stay put for a later checkout.
      removeCartItems(selectedCart);
      navigate('/confirmation');
    } catch (err) {
      // All-or-nothing on the backend: nothing was booked or charged, so
      // the cart stays untouched and the user can adjust and retry.
      const serverMsg = isAxiosError(err)
        ? (err.response?.data as { error?: string; message?: string } | undefined)?.error ??
          (err.response?.data as { error?: string; message?: string } | undefined)?.message
        : undefined;
      setCheckoutError(serverMsg ?? (err instanceof Error ? err.message : 'Checkout failed. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  // No backend tax/fee concept exists - this is the cart's own client-side
  // estimate (price * quantity * days per item), the real total (which may
  // differ per category's pricing unit / per-unit price overrides) is
  // computed server-side during checkout and shown on the confirmation page.
  const total = getSelectedTotal();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Container maxWidth="md" sx={{ flex: 1, py: 6 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#E0F2FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <Lock sx={{ fontSize: 40, color: '#0891B2' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Payment Information
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your payment is secure and encrypted
          </Typography>
        </Box>

        {/* Payment Form */}
        <Paper sx={{ p: 4, maxWidth: 500, margin: '0 auto' }}>
          {/* Secure Payment Banner */}
          <Alert
            icon={<Lock />}
            severity="info"
            sx={{
              mb: 3,
              bgcolor: '#E0F2FE',
              color: '#0C4A6E',
              '& .MuiAlert-icon': {
                color: '#0891B2',
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Secure Payment
            </Typography>
            <Typography variant="caption">
              All transactions are encrypted and secure
            </Typography>
          </Alert>

          {checkoutError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {checkoutError}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            {/* Card Number */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Card Number
              </Typography>
              <TextField
                fullWidth
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                InputProps={{
                  startAdornment: (
                    <CreditCard sx={{ mr: 1, color: '#94A3B8', fontSize: 20 }} />
                  ),
                }}
              />
            </Grid>

            {/* Cardholder Name */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Cardholder Name
              </Typography>
              <TextField
                fullWidth
                name="cardName"
                placeholder="John Doe"
                value={paymentData.cardName}
                onChange={handleInputChange}
                error={!!errors.cardName}
                helperText={errors.cardName}
              />
            </Grid>

            {/* Expiry Date & CVV */}
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                Expiry Date
              </Typography>
              <TextField
                fullWidth
                name="expiryDate"
                placeholder="MM / YY"
                value={paymentData.expiryDate}
                onChange={handleInputChange}
                error={!!errors.expiryDate}
                helperText={errors.expiryDate}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                CVV
              </Typography>
              <TextField
                fullWidth
                name="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={handleInputChange}
                error={!!errors.cvv}
                helperText={errors.cvv}
                type="password"
              />
            </Grid>
          </Grid>

          {/* Amount to Pay */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: '#F8FAFC',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Amount to pay
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0891B2' }}>
              ${total.toFixed(2)}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
            Estimated total — final amount is confirmed after payment
          </Typography>

          {/* Confirm Payment Button */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            sx={{
              bgcolor: '#0891B2',
              '&:hover': { bgcolor: '#0E7490' },
              textTransform: 'none',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              mt: 3,
            }}
          >
            {isProcessing ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />
                Processing...
              </>
            ) : (
              <>
                <Lock sx={{ mr: 1, fontSize: 20 }} />
                Confirm Payment
              </>
            )}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
            By confirming payment, you agree to our terms and conditions
          </Typography>

          {/* Payment Methods */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              We accept
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  border: '1px solid #E2E8F0',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                VISA
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  border: '1px solid #E2E8F0',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                MC
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  border: '1px solid #E2E8F0',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                AMEX
              </Box>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  border: '1px solid #E2E8F0',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                DISC
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/*<Footer />*/}
    </Box>
  );
};

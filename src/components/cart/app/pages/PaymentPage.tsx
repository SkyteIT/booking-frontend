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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { checkout } from '../../../../services/Customer/checkoutService';
import ToastAlert from '../../../common/ToastAlert';
import { getApiErrorMessage } from '../../../../utils/getApiErrorMessage';
import { paymentSchema } from '../../../../utils/validationSchemas';
import { zodErrorToFieldErrors } from '../../../../utils/zodUtils';
import { useCart } from '../contexts/CartContext';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(0,119,182,0.04)',
    '&.Mui-focused': { backgroundColor: 'transparent' },
  },
};

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
    const result = paymentSchema.safeParse(paymentData);
    if (!result.success) {
      setErrors(zodErrorToFieldErrors(result.error));
      return false;
    }
    setErrors({});
    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validate()) return;

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
        optionValueIds: item.optionValueIds ?? null,
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
      setCheckoutError(getApiErrorMessage(err, 'Checkout failed. Please try again.'));
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
      <Container maxWidth="md" sx={{ flex: 1, pt: 16, pb: 8 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(160deg, #005a8d, #0077b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
              boxShadow: '0 12px 28px rgba(0,119,182,0.32)',
            }}
          >
            <Lock sx={{ fontSize: 36, color: '#fff' }} />
          </Box>
          <Typography variant="h3" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 1, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            Payment Information
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your payment is secure and encrypted
          </Typography>
        </Box>

        {/* Payment Form */}
        <Paper sx={{ p: 4, maxWidth: 500, margin: '0 auto', borderRadius: '24px', boxShadow: '0 20px 48px rgba(15,27,45,0.1)' }}>
          {/* Secure Payment Banner */}
          <Alert
            icon={<Lock />}
            severity="info"
            sx={{
              mb: 3,
              borderRadius: '14px',
              bgcolor: 'rgba(0,119,182,0.08)',
              color: 'primary.dark',
              '& .MuiAlert-icon': { color: 'primary.main' },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Secure Payment
            </Typography>
            <Typography variant="caption">
              All transactions are encrypted and secure
            </Typography>
          </Alert>

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
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: <CreditCard sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />,
                  },
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
                sx={fieldSx}
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
                sx={fieldSx}
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
                sx={fieldSx}
              />
            </Grid>
          </Grid>

          {/* Amount to Pay */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'rgba(0,119,182,0.06)',
              borderRadius: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Amount to pay
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
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
              borderRadius: '999px',
              textTransform: 'none',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              mt: 3,
              color: '#fff',
              background: 'linear-gradient(160deg, #005a8d, #0077b6)',
              '&:hover': {
                background: 'linear-gradient(160deg, #004a75, #005a8d)',
                boxShadow: '0 12px 28px rgba(0,119,182,0.32)',
              },
              '&.Mui-disabled': { color: 'rgba(255,255,255,0.7)', background: 'rgba(0,119,182,0.4)' },
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
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
              {['VISA', 'MC', 'AMEX', 'DISC'].map((brand) => (
                <Box
                  key={brand}
                  sx={{
                    px: 2,
                    py: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                  }}
                >
                  {brand}
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      </Container>

      <ToastAlert
        open={!!checkoutError}
        onClose={() => setCheckoutError(null)}
        severity="error"
        message={checkoutError ?? ""}
      />
    </Box>
  );
};

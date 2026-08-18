import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Divider,
} from '@mui/material';
import { CheckCircle, Download, Email, CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import type { CheckoutResultDto } from '../../../../services/Customer/checkoutService';
//import { Footer } from '../components/Footer';

function readOrderData(): CheckoutResultDto | null {
  const data = sessionStorage.getItem('orderData');
  return data ? JSON.parse(data) : null;
}

export const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const [result] = useState<CheckoutResultDto | null>(readOrderData);

  useEffect(() => {
    if (!result) {
      navigate('/cart');
    }
  }, [navigate, result]);

  if (!result) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalPaid = result.payments.reduce((sum, p) => sum + p.amount, 0);
  const currency = result.payments[0]?.currency ?? result.bookings[0]?.currency ?? 'LKR';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Container maxWidth="md" sx={{ flex: 1, py: 6 }}>
        {/* Success Icon */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <CheckCircle sx={{ fontSize: 50, color: '#10B981' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Booking Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {result.bookings.length > 1
              ? `${result.bookings.length} bookings have been created`
              : 'Your booking has been successfully created'}
          </Typography>
        </Box>

        {/* Order Details */}
        <Paper sx={{ p: 4, mb: 3 }}>
          {/* Your Bookings */}
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Your Bookings
          </Typography>

          {result.bookings.map((booking, index) => (
            <Box
              key={booking.bookingId}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                py: 2,
                borderBottom: index !== result.bookings.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#0891B2' }}>
                  {booking.bookingNumber}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {booking.listingTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  {formatDate(booking.startDateTime)} - {formatDate(booking.endDateTime)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    mt: 0.5,
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    bgcolor: booking.status === 'Confirmed' ? '#DCFCE7' : '#FEF3C7',
                    color: booking.status === 'Confirmed' ? '#166534' : '#92400E',
                    fontWeight: 600,
                  }}
                >
                  {booking.status === 'Confirmed' ? 'Confirmed' : 'Awaiting vendor confirmation'}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0891B2' }}>
                {booking.currency} {booking.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #E2E8F0' }}>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Total Paid
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0891B2' }}>
                {currency} {totalPaid.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Next Steps */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Next Steps
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Email sx={{ color: '#0891B2', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Check Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We've sent a confirmation email with all the details to your registered email address
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CalendarMonth sx={{ color: '#0891B2', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Add to Calendar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Don't forget to add your booking dates to your calendar so you don't miss anything!
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Download sx={{ color: '#0891B2', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Download Your Vouchers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download and print your booking vouchers for easy check-in
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/customer/bookings')}
            sx={{
              textTransform: 'none',
              px: 4,
              borderColor: '#E2E8F0',
              color: '#64748B',
              fontWeight: 600,
            }}
          >
            Go to My Bookings
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              sessionStorage.removeItem('checkoutData');
              sessionStorage.removeItem('orderData');
              navigate('/');
            }}
            sx={{
              bgcolor: '#0891B2',
              '&:hover': { bgcolor: '#0E7490' },
              textTransform: 'none',
              px: 4,
              fontWeight: 600,
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Support */}
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Need help? Contact our support team at{' '}
          <Box component="span" sx={{ color: '#0891B2', fontWeight: 600 }}>
            support@ube.com
          </Box>
        </Typography>
      </Container>

      {/*<Footer />*/}
    </Box>
  );
};

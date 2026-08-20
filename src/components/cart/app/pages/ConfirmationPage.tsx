import { CheckCircle, Download, Email, CalendarMonth } from '@mui/icons-material';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Divider,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { CheckoutResultDto } from '../../../../services/Customer/checkoutService';

function readOrderData(): CheckoutResultDto | null {
  const data = sessionStorage.getItem('orderData');
  return data ? JSON.parse(data) : null;
}

const NEXT_STEPS = [
  {
    icon: Email,
    title: 'Check Your Email',
    desc: "We've sent a confirmation email with all the details to your registered email address",
  },
  {
    icon: CalendarMonth,
    title: 'Add to Calendar',
    desc: "Don't forget to add your booking dates to your calendar so you don't miss anything!",
  },
  {
    icon: Download,
    title: 'Download Your Vouchers',
    desc: 'Download and print your booking vouchers for easy check-in',
  },
];

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
        {/* Success Icon */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(16,185,129,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <CheckCircle sx={{ fontSize: 44, color: 'success.main' }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '2px',
            }}
          >
            Booking Confirmed!
            <Box component="span" sx={{ width: 8, height: 8, borderRadius: '3px', backgroundColor: 'success.main', ml: 0.5 }} />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {result.bookings.length > 1
              ? `${result.bookings.length} bookings have been created`
              : 'Your booking has been successfully created'}
          </Typography>
        </Box>

        {/* Order Details */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: '20px', boxShadow: '0 12px 32px rgba(15,27,45,0.06)' }}>
          <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 2 }}>
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
                borderBottom: index !== result.bookings.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
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
                    mt: 0.75,
                    px: 1.25,
                    py: 0.3,
                    borderRadius: '999px',
                    bgcolor: booking.status === 'Confirmed' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.14)',
                    color: booking.status === 'Confirmed' ? 'success.dark' : '#92400E',
                    fontWeight: 600,
                  }}
                >
                  {booking.status === 'Confirmed' ? 'Confirmed' : 'Awaiting vendor confirmation'}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {booking.currency} {booking.totalAmount.toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Total Paid
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {currency} {totalPaid.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {/* Next Steps */}
        <Paper sx={{ p: 4, mb: 3, borderRadius: '20px', boxShadow: '0 12px 32px rgba(15,27,45,0.06)' }}>
          <Typography variant="h6" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 3 }}>
            Next Steps
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {NEXT_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <Box key={step.title} sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      bgcolor: 'rgba(0,119,182,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ color: 'primary.main', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
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
              borderRadius: '999px',
              borderColor: 'divider',
              color: 'text.secondary',
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
              textTransform: 'none',
              px: 4,
              borderRadius: '999px',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(160deg, #005a8d, #0077b6)',
              '&:hover': {
                background: 'linear-gradient(160deg, #004a75, #005a8d)',
                boxShadow: '0 12px 28px rgba(0,119,182,0.32)',
              },
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Support */}
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Need help? Contact our support team at{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
            support@ube.com
          </Box>
        </Typography>
      </Container>
    </Box>
  );
};

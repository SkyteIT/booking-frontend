import { ShoppingCartOutlined } from '@mui/icons-material';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';

export const CartEmptyState: React.FC = () => {
  const navigate = useNavigate();

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
      <Container maxWidth="sm" sx={{ flex: 1, pt: 16, pb: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '24px', boxShadow: '0 20px 48px rgba(15,27,45,0.1)' }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              mx: 'auto',
              mb: 3,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(0,119,182,0.08)',
            }}
          >
            <ShoppingCartOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Typography variant="h5" sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, mb: 1 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start exploring and add items to your cart
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              background: 'linear-gradient(160deg, #005a8d, #0077b6)',
              borderRadius: '999px',
              textTransform: 'none',
              fontWeight: 700,
              px: 4,
              py: 1.25,
              boxShadow: '0 12px 28px rgba(0,119,182,0.32)',
            }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default CartEmptyState;

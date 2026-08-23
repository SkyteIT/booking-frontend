import { CreditCard, Lock } from '@mui/icons-material';
import { Alert, Box, Button, Divider, Paper, Typography } from '@mui/material';
import React from 'react';

interface CartOrderSummaryProps {
  currency: string;
  subtotal: number;
  selectedCount: number;
  onCheckout: () => void;
}

export const CartOrderSummary: React.FC<CartOrderSummaryProps> = ({
  currency,
  subtotal,
  selectedCount,
  onCheckout,
}) => {
  return (
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
          {currency} {subtotal.toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* This matches CheckoutAsync's total exactly - no tax or service
            fee is added at checkout, so showing fabricated ones here would
            let the cart display a different amount than what's charged. */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal ({selectedCount} {selectedCount === 1 ? 'item' : 'items'})
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {currency} {subtotal.toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {selectedCount === 0 && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: '14px' }}>
            Select at least one item to check out.
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onCheckout}
          disabled={selectedCount === 0}
          sx={{
            borderRadius: '999px',
            textTransform: 'none',
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            mb: 2,
            color: '#fff',
            background: selectedCount > 0 ? 'linear-gradient(160deg, #005a8d, #0077b6)' : undefined,
            '&:hover': {
              background: selectedCount > 0 ? 'linear-gradient(160deg, #004a75, #005a8d)' : undefined,
              boxShadow: selectedCount > 0 ? '0 12px 28px rgba(0,119,182,0.32)' : 'none',
            },
            '&.Mui-disabled': { color: 'rgba(15,27,45,0.4)' },
          }}
        >
          {selectedCount > 0 ? `Proceed to Checkout (${selectedCount})` : 'Proceed to Checkout'}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Lock sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
            Secure payment processing
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCard sx={{ fontSize: '1rem', color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
            100% money-back guarantee
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CartOrderSummary;

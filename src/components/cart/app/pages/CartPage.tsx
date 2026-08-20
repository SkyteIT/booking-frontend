import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Checkbox, Container, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../context/useAuth';
import SegmentedTabs from '../../../common/SegmentedTabs';
import CartEmptyState from '../components/Cart/CartEmptyState';
import CartItemCard from '../components/Cart/CartItemCard';
import CartOrderSummary from '../components/Cart/CartOrderSummary';
import { useCart } from '../contexts/CartContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cart,
    removeFromCart,
    updateCartItem,
    selectedCart,
    isItemSelected,
    toggleItemSelected,
    selectAllItems,
    deselectAllItems,
    getSelectedTotal,
  } = useCart();
  const [activeTab, setActiveTab] = useState('All');

  const handleCheckout = () => {
    if (selectedCart.length === 0) return;
    // Same guard PriceCard already uses before adding to cart - checkout
    // itself needs a real account too, and failing fast here (before the
    // guest fills out two pages of forms) beats letting the backend 401
    // on the final "Confirm Payment" click.
    if (!isAuthenticated) {
      navigate('/login?next=/cart');
      return;
    }
    navigate('/checkout');
  };

  // Same gap as CartContext's canBookMultiple: no "allows multiple" flag
  // exists on the real admin-managed Category yet, so this still matches
  // literal names. See .claude/BACKEND-TODO-cart.md.
  const canIncreaseQuantity = (category: string) => category !== 'hotel' && category !== 'car';

  // Order summary reflects only the selected lines - the whole point of
  // selection is to check out a subset, so the total shown must match
  // what checkout will actually charge.
  const subtotal = getSelectedTotal();
  const tax = subtotal * 0.1;
  const serviceFee = selectedCart.length > 0 ? 25 : 0;
  const total = subtotal + tax + serviceFee;
  const allSelected = cart.length > 0 && selectedCart.length === cart.length;

  // Tabs are derived from whatever real categories are actually in the
  // cart (item.category now comes straight from the admin-managed category
  // list, see CartContext's BookingItem) instead of a fixed hardcoded set.
  const cartCategories = Array.from(new Set(cart.map((item) => item.category)));
  const categories = ['All', ...cartCategories];
  const filteredCart = activeTab === 'All' ? cart : cart.filter((item) => item.category === activeTab);

  if (cart.length === 0) {
    return <CartEmptyState />;
  }

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
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
              fontSize: { xs: '2rem', md: '2.4rem' },
              display: 'flex',
              alignItems: 'baseline',
              gap: '2px',
            }}
          >
            Booking Cart
            <Box
              component="span"
              sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: 'primary.main', ml: 0.5 }}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select bookings to proceed to checkout
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <SegmentedTabs options={categories} value={activeTab} onChange={setActiveTab} />
        </Box>

        {/* Select all / selection count - checkout only acts on what's checked below */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Checkbox
            checked={allSelected}
            indeterminate={selectedCart.length > 0 && !allSelected}
            onChange={(e) => (e.target.checked ? selectAllItems() : deselectAllItems())}
          />
          <Typography variant="body2" color="text.secondary">
            {selectedCart.length} of {cart.length} selected
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            {filteredCart.map((item) => (
              <CartItemCard
                key={item.id + item.startDate + item.endDate}
                item={item}
                selected={isItemSelected(item)}
                onToggleSelected={() => toggleItemSelected(item)}
                onRemove={() => removeFromCart(item.id)}
                onQuantityChange={(q) => updateCartItem(item.id, q, item.startDate, item.endDate)}
                canIncreaseQuantity={canIncreaseQuantity(item.category)}
              />
            ))}

            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600, borderRadius: '999px', mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>

          <Box sx={{ width: { xs: '100%', lg: 380 } }}>
            <CartOrderSummary
              subtotal={subtotal}
              tax={tax}
              serviceFee={serviceFee}
              total={total}
              selectedCount={selectedCart.length}
              onCheckout={handleCheckout}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { Delete, Remove, Add, ArrowBack, Lock, CreditCard } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
//import { Footer } from '../components/Footer';

const categoryColors: Record<string, string> = {
  hotel: '#E91E63',
  car: '#2196F3',
  activity: '#4CAF50',
  equipment: '#FF9800',
};

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItem, getCartTotal, getCartItemsCount } = useCart();
  const [activeTab, setActiveTab] = useState(0);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const canIncreaseQuantity = (category: string) => {
    return category !== 'hotel' && category !== 'car';
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const serviceFee = 25;
  const total = subtotal + tax + serviceFee;

  const categories = ['All', 'Hotels', 'Cars', 'Activities', 'Transfers', 'Restaurants', 'Events'];
  
const getFilteredCart = () => {
  if (activeTab === 0) return cart; // "All" tab
  const categoryMap: Record<number, string> = {
    1: 'hotel',
    2: 'car',
    3: 'activity',
    4: 'transfer',
    5: 'restaurant',
    6: 'event',
  };
  const selectedCategory = categoryMap[activeTab];
  return cart.filter(item => item.category === selectedCategory);
};

const filteredCart = getFilteredCart();



  if (cart.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        <Container maxWidth="xl" sx={{ flex: 1, py: 6 }}>
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start exploring and add items to your cart
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#0891B2',
                '&:hover': { bgcolor: '#0E7490' },
                textTransform: 'none',
                px: 4,
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Container>
        {/*<Footer />*/}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Booking Cart
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select bookings to proceed to checkout
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            {categories.map((cat, idx) => (
              <Tab
                key={cat}
                label={cat}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Cart Items */}
          <Box sx={{ flex: 1 }}>
            
            {filteredCart.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  pr:6,
                  mb: 2,
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <IconButton
                  onClick={() => removeFromCart(item.id)}
                  sx={{
                    position: 'absolute',
                    top: 18,
                    right: 8,
                    color: '#64748B',
                  }}
                >
                  <Delete />
                </IconButton>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Image */}
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 120,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />

                  {/* Details */}
                  <Box sx={{ flex: 1 }}>
                    <Chip
                      label={item.category.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: categoryColors[item.category] || '#757575',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        height: 20,
                        mb: 1,
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      📅 {formatDate(item.startDate)} - {formatDate(item.endDate)} (
                      {calculateDays(item.startDate, item.endDate)} nights)
                    </Typography>
                  </Box>

                  {/* Quantity & Price */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    {canIncreaseQuantity(item.category) ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid #E2E8F0',
                          borderRadius: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1), item.startDate, item.endDate)}
                          sx={{ color: '#64748B' }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography sx={{ px: 2, minWidth: 30, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateCartItem(item.id, item.quantity + 1, item.startDate, item.endDate)}
                          sx={{ color: '#64748B' }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ height: 36 }} />
                    )}

                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0891B2' }}>
                      ${item.totalPrice}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}

            {/* Continue Shopping */}
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{
                textTransform: 'none',
                color: '#64748B',
                mt: 2,
              }}
            >
              Continue Shopping
            </Button>
          </Box>

          {/* Order Summary */}
          <Box sx={{ width: { xs: '100%', lg: 380 } }}>
            <Paper sx={{ p: 3, position: { lg: 'sticky' }, top: { lg: 80 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Tax (10%)
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
                onClick={handleCheckout}
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
                Proceed to Checkout
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Lock sx={{ fontSize: '1rem', color: '#64748B' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                  Secure payment processing
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCard sx={{ fontSize: '1rem', color: '#64748B' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.813rem' }}>
                  100% money-back guarantee
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>

      {/*<Footer />*/}
    </Box>
  );
};

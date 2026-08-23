import { Add, Delete, Remove } from '@mui/icons-material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { Box, Checkbox, Chip, IconButton, Paper, Typography } from '@mui/material';
import React from 'react';
import type { CartItem } from '../../contexts/CartContext';

// A curated accent per category - varied on purpose (a cart mixes item
// types), but drawn from one harmonious palette instead of clashing
// stock MUI colors.
const CATEGORY_COLORS: Record<string, string> = {
  hotel: '#0077b6',
  car: '#7C3AED',
  activity: '#059669',
  equipment: '#D97706',
};
const categoryColorFor = (category: string) => CATEGORY_COLORS[category] || '#64748B';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const calculateDays = (startDate: string, endDate: string) => {
  const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
};

interface CartItemCardProps {
  item: CartItem;
  selected: boolean;
  onToggleSelected: () => void;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
  // Same gap as CartContext's canBookMultiple: no "allows multiple" flag
  // exists on the real admin-managed Category yet, so this still matches
  // literal names. See .claude/BACKEND-TODO-cart.md.
  canIncreaseQuantity: boolean;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  selected,
  onToggleSelected,
  onRemove,
  onQuantityChange,
  canIncreaseQuantity,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        pr: 6,
        mb: 2,
        position: 'relative',
        borderRadius: '20px',
        boxShadow: '0 12px 32px rgba(15,27,45,0.06)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 16px 40px rgba(15,27,45,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <IconButton
        onClick={onRemove}
        sx={{
          position: 'absolute',
          top: 18,
          right: 8,
          color: '#94A3B8',
          '&:hover': { color: 'error.main', bgcolor: 'rgba(220,38,38,0.08)' },
        }}
      >
        <Delete />
      </IconButton>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Checkbox
          checked={selected}
          onChange={onToggleSelected}
          sx={{ alignSelf: 'flex-start', mt: -0.5, ml: -1 }}
        />

        <Box
          component="img"
          src={item.image}
          alt={item.name}
          sx={{ width: 120, height: 90, objectFit: 'cover', borderRadius: '14px' }}
        />

        <Box sx={{ flex: 1 }}>
          <Chip
            label={item.category.toUpperCase()}
            size="small"
            sx={{
              bgcolor: categoryColorFor(item.category),
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              height: 22,
              borderRadius: '999px',
              mb: 1,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {item.location}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
            <CalendarMonthOutlinedIcon sx={{ fontSize: '1rem' }} />
            <Typography variant="body2">
              {formatDate(item.startDate)} - {formatDate(item.endDate)} ({calculateDays(item.startDate, item.endDate)} nights)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {canIncreaseQuantity ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '999px',
                bgcolor: 'rgba(0,119,182,0.04)',
              }}
            >
              <IconButton
                size="small"
                onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
                sx={{ color: 'text.secondary' }}
              >
                <Remove fontSize="small" />
              </IconButton>
              <Typography sx={{ px: 1.5, minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
                {item.quantity}
              </Typography>
              <IconButton size="small" onClick={() => onQuantityChange(item.quantity + 1)} sx={{ color: 'primary.main' }}>
                <Add fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ height: 36 }} />
          )}

          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {item.currency} {item.totalPrice}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CartItemCard;

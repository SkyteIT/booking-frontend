import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
//import { CartItem as CartItemType, canBookMultiple } from '../contexts/CartContext';
import { canBookMultiple } from '../contexts/CartContext';
import type { CartItem as CartItemType } from '../contexts/CartContext';
import SnackbarAlert from '../../../common/SnackbarAlert';



interface CartItemProps {
  item: CartItemType;
  onUpdate: (id: string, quantity: number, startDate: string, endDate: string) => void;
  onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [startDate, setStartDate] = useState(item.startDate);
  const [endDate, setEndDate] = useState(item.endDate);
  const [errorMessage, setErrorMessage] = useState('');

  const allowsMultiple = canBookMultiple(item.category);

  const handleSave = () => {
    if (new Date(endDate) <= new Date(startDate)) {
      setErrorMessage('End date must be after start date');
      return;
    }
    onUpdate(item.id, allowsMultiple ? quantity : 1, startDate, endDate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setQuantity(item.quantity);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setIsEditing(false);
  };

  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    onUpdate(item.id, newQty, item.startDate, item.endDate);
  };

  const calculateDays = () => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 1, sm: 1.5 },
        py: 1.5,
        borderBottom: '1px solid #ddd',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      {/* Compact Thumbnail */}
      <Box
        component="img"
        src={item.image}
        alt={item.name}
        sx={{
          width: { xs: 50, sm: 60 },
          height: { xs: 50, sm: 60 },
          objectFit: 'cover',
          borderRadius: 0.5,
          border: '1px solid #ddd',
          flexShrink: 0,
        }}
      />

      {/* Item Info */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            fontSize: { xs: '0.813rem', sm: '0.875rem' },
            mb: 0.25,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.name}
        </Typography>

        {/* Price (mobile only) */}
        <Typography
          variant="body2"
          sx={{
            display: { xs: 'block', sm: 'none' },
            fontWeight: 700,
            color: '#B12704',
            fontSize: '0.875rem',
            mb: 0.5,
          }}
        >
          ${item.totalPrice.toFixed(2)}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', fontSize: '0.75rem', mb: 0.5 }}
        >
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)} • ${item.price}{' '}
          {item.priceUnit}
        </Typography>

        {!isEditing ? (
          <>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: '0.75rem', mb: 0.5 }}
            >
              {formatDate(item.startDate)} - {formatDate(item.endDate)} ({calculateDays()}d)
            </Typography>

            {/* Action Links */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mt: 0.5 }}>
              {allowsMultiple && (
                <>
                  <FormControl size="small" sx={{ minWidth: 60 }}>
                    <Select
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number(e.target.value))}
                      sx={{
                        fontSize: '0.75rem',
                        height: 24,
                        '& .MuiSelect-select': { py: 0.25, pr: 3 },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                      }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1} sx={{ fontSize: '0.75rem', py: 0.5 }}>
                          Qty: {i + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ borderLeft: '1px solid #ddd', height: 14 }} />
                </>
              )}

              <Link
                component="button"
                variant="caption"
                onClick={() => setIsEditing(true)}
                sx={{
                  textDecoration: 'none',
                  color: '#007185',
                  fontSize: '0.75rem',
                  '&:hover': { textDecoration: 'underline', color: '#C7511F' },
                }}
              >
                Edit dates
              </Link>

              <Box sx={{ borderLeft: '1px solid #ddd', height: 14 }} />

              <Link
                component="button"
                variant="caption"
                onClick={() => onRemove(item.id)}
                sx={{
                  textDecoration: 'none',
                  color: '#007185',
                  fontSize: '0.75rem',
                  '&:hover': { textDecoration: 'underline', color: '#C7511F' },
                }}
              >
                Delete
              </Link>
            </Box>
          </>
        ) : (
          <Box sx={{ mt: 0.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <TextField
                label="Start"
                type="date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': { fontSize: '0.75rem', height: 28 },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                }}
              />
              <TextField
                label="End"
                type="date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': { fontSize: '0.75rem', height: 28 },
                  '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                size="small"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  py: 0.25,
                  px: 1.5,
                  minHeight: 24,
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                size="small"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  py: 0.25,
                  px: 1.5,
                  minHeight: 24,
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Price on Right (desktop only) */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'block' },
          textAlign: 'right',
          flexShrink: 0,
          minWidth: 70,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#B12704', fontSize: '1rem' }}>
          ${item.totalPrice.toFixed(2)}
        </Typography>
      </Box>
      <SnackbarAlert
        open={Boolean(errorMessage)}
        message={errorMessage}
        severity="error"
        onClose={() => setErrorMessage('')}
      />
    </Box>
  );
};
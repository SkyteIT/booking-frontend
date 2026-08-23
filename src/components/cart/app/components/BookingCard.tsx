import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
} from '@mui/material';
import { Add, DirectionsCar, Hotel, Build, Category } from '@mui/icons-material';
import { canBookMultiple } from '../contexts/CartContext';
import type { BookingItem } from '../contexts/CartContext';
import SnackbarAlert from '../../../common/SnackbarAlert';

interface BookingCardProps {
  item: BookingItem;
  onAddToCart: (item: BookingItem, quantity: number, startDate: string, endDate: string) => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'car':
      return <DirectionsCar />;
    case 'hotel':
      return <Hotel />;
    case 'tool':
      return <Build />;
    default:
      return <Category />;
  }
};

export const BookingCard: React.FC<BookingCardProps> = ({ item, onAddToCart }) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const allowsMultiple = canBookMultiple(item.category);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddToCart = () => {
    if (new Date(endDate) <= new Date(startDate)) {
      setErrorMessage('End date must be after start date');
      return;
    }
    onAddToCart(item, allowsMultiple ? quantity : 1, startDate, endDate);
    // Reset to defaults
    setQuantity(1);
    setStartDate(today);
    setEndDate(tomorrow);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={item.image}
        alt={item.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              icon={<CategoryIcon category={item.category} />}
              label={item.category.toUpperCase()}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Typography variant="h6" component="h2" gutterBottom>
            {item.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
          <Typography variant="h5" color="primary" fontWeight="bold">
            ${item.price}
            <Typography component="span" variant="body2" color="text.secondary">
              {' '}
              {item.priceUnit}
            </Typography>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {allowsMultiple && (
            <TextField
              label="Quantity"
              type="number"
              size="small"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1 }}
              fullWidth
            />
          )}
          <TextField
            label="Start Date"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddToCart}
            fullWidth
            size="large"
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
      <SnackbarAlert
        open={Boolean(errorMessage)}
        message={errorMessage}
        severity="error"
        onClose={() => setErrorMessage('')}
      />
    </Card>
  );
};
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { useCart } from '../contexts/CartContext';
import { BookingCard } from '../components/BookingCard';
import { mockBookingItems } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'car', 'hotel', 'tool'];

  const filteredItems =
    selectedCategory === 'all'
      ? mockBookingItems
      : mockBookingItems.filter((item) => item.category === selectedCategory);

  return (
    <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Book Anything, Anytime
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Discover and book cars, hotels, tools, and more. All in one place.
        </Typography>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="All Items" value="all" />
          <Tab label="Cars" value="car" />
          <Tab label="Hotels" value="hotel" />
          <Tab label="Tools & Equipment" value="tool" />
        </Tabs>
      </Box>

      {/* Items Grid */}
      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
            <BookingCard item={item} onAddToCart={addToCart} />
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No items found in this category
          </Typography>
        </Box>
      )}
    </Container>
  );
};

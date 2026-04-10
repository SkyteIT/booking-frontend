import React from 'react';
import { Box, Container, Typography, Grid, Link, TextField, Button } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';

export const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: '#0F172A',
        color: '#fff',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#0891B2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>UBE</Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7 }}>
              United Booking Engine (UBE) is the leading marketplace for travel and local services. Discover, compare, and book the best experiences across the globe.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Link href="#" sx={{ color: '#fff' }}>
                <Facebook />
              </Link>
              <Link href="#" sx={{ color: '#fff' }}>
                <Twitter />
              </Link>
              <Link href="#" sx={{ color: '#fff' }}>
                <LinkedIn />
              </Link>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>
                About Us
              </Link>
              <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Careers
              </Link>
              <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Partners
              </Link>
              <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Blog
              </Link>
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Help Center
              </Link>
              <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Safety Center
              </Link>
              <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Community
              </Link>
              <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Terms of Service
              </Link>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              Subscribe to get the latest travel updates and exclusive offers directly to your inbox.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Your email address"
                size="small"
                sx={{
                  flex: 1,
                  bgcolor: '#1E293B',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: '#334155',
                    },
                    '&:hover fieldset': {
                      borderColor: '#475569',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#0891B2',
                  '&:hover': { bgcolor: '#0E7490' },
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.813rem' }}>
            © 2024 United Booking Engine Inc. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.813rem' }}>
              Privacy Policy
            </Link>
            <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.813rem' }}>
              Terms & Conditions
            </Link>
            <Link href="#" sx={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.813rem' }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

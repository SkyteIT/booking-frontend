import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  People,
  CalendarMonth,
  AttachMoney,
} from '@mui/icons-material';
//import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
//import MainFooter from '../../components/footer/MainFooter';

export const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$124,563',
      change: '+12.5%',
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: '#0891B2',
      bgColor: '#E0F2FE',
    },
    {
      title: 'Total Users',
      value: '8,549',
      change: '+8.2%',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
    {
      title: 'Active Bookings',
      value: '1,234',
      change: '+15.3%',
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    {
      title: 'Growth Rate',
      value: '23.5%',
      change: '+4.1%',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
  ];

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's what's happening with your platform today.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: stat.bgColor,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>
                    {stat.change} from last month
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Recent Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Activity feed coming soon...
          </Typography>
        </Paper>
      </Box>

      
    </Box>
  );
};

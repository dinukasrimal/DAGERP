import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import {
  Assignment,
  Factory,
  Inventory,
  AttachMoney,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Orders',
      value: '156',
      change: '+12%',
      icon: <Assignment sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      lightGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    },
    {
      title: 'In Production',
      value: '42',
      change: '+8%',
      icon: <Factory sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      lightGradient: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
    },
    {
      title: 'Inventory Items',
      value: '1,234',
      change: '+15%',
      icon: <Inventory sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      lightGradient: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
    },
    {
      title: 'Total Revenue',
      value: '$125,450',
      change: '+23%',
      icon: <AttachMoney sx={{ fontSize: 32 }} />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      lightGradient: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening at your factory today.
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            sx={{ 
              position: 'relative',
              overflow: 'visible',
              background: stat.lightGradient,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Icon with gradient background */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: 20,
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  background: stat.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                }}
              >
                {stat.icon}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'success.main', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  ↗ {stat.change} from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Content Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 4,
      }}>
        {/* Recent Orders */}
        <Card sx={{ p: 0 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Orders
              </Typography>
              <Typography variant="body2" color="primary.main" sx={{ cursor: 'pointer', fontWeight: 500 }}>
                View All
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              minHeight: 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Order tracking and management will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Production Status */}
        <Card sx={{ p: 0 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Production Status
              </Typography>
              <Typography variant="body2" color="primary.main" sx={{ cursor: 'pointer', fontWeight: 500 }}>
                View Details
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              minHeight: 200,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Current production status and alerts will be shown here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Quick Actions
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 2,
          }}>
            {[
              { label: 'New Order', icon: '📝' },
              { label: 'Check Inventory', icon: '📦' },
              { label: 'Production Report', icon: '📊' },
              { label: 'Settings', icon: '⚙️' },
            ].map((action, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {action.icon}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {action.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
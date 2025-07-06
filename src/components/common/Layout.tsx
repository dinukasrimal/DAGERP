import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assignment,
  Style,
  Build,
  AttachMoney,
  ShoppingCart,
  Inventory,
  Factory,
  Assessment,
  Search as SearchIcon,
  Notifications,
  Settings,
  Person,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/', category: 'main' },
  { text: 'Orders', icon: <Assignment />, path: '/orders', category: 'operations' },
  { text: 'Styles', icon: <Style />, path: '/styles', category: 'operations' },
  { text: 'BOM', icon: <Build />, path: '/bom', category: 'operations' },
  { text: 'Budget', icon: <AttachMoney />, path: '/budget', category: 'finance' },
  { text: 'Purchase', icon: <ShoppingCart />, path: '/purchase', category: 'finance' },
  { text: 'Inventory', icon: <Inventory />, path: '/inventory', category: 'warehouse' },
  { text: 'Production', icon: <Factory />, path: '/production', category: 'warehouse' },
  { text: 'Reports', icon: <Assessment />, path: '/reports', category: 'analytics' },
];

const categories = {
  main: 'Overview',
  operations: 'Operations',
  finance: 'Finance',
  warehouse: 'Warehouse',
  analytics: 'Analytics',
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          G
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Garment ERP
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Factory Management
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 2, py: 1 }}>
        {Object.entries(categories).map(([categoryKey, categoryName]) => {
          const categoryItems = menuItems.filter(item => item.category === categoryKey);
          
          return (
            <Box key={categoryKey} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 1,
                  display: 'block',
                  fontWeight: 600,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem',
                }}
              >
                {categoryName}
              </Typography>
              <List sx={{ py: 0 }}>
                {categoryItems.map((item) => (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={location.pathname === item.path}
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        px: 2,
                        py: 1.5,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: '#ffffff',
                          '& .MuiListItemIcon-root': {
                            color: '#ffffff',
                          },
                          '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          },
                        },
                        '&:hover': {
                          backgroundColor: alpha('#6366f1', 0.08),
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: location.pathname === item.path ? 600 : 500,
                          fontSize: '0.875rem',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          );
        })}
      </Box>

      {/* User Section */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 2, bgcolor: alpha('#6366f1', 0.05) }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
            <Person />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              John Doe
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Manager
            </Typography>
          </Box>
          <IconButton size="small">
            <Settings fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Search Bar */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                backgroundColor: alpha('#000', 0.04),
                '&:hover': {
                  backgroundColor: alpha('#000', 0.08),
                },
                marginLeft: 0,
                width: { xs: '100%', sm: 'auto' },
                minWidth: 300,
              }}
            >
              <Box
                sx={{
                  padding: '0 16px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </Box>
              <InputBase
                placeholder="Search orders, styles, inventory..."
                sx={{
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: '12px 16px 12px 48px',
                    transition: 'width 0.2s',
                    width: { xs: '100%', md: '300px' },
                    '&:focus': {
                      width: { md: '400px' },
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              color="inherit"
              onClick={toggleDarkMode}
              sx={{
                '&:hover': {
                  backgroundColor: alpha('#6366f1', 0.08),
                },
              }}
            >
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  John Doe
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Branch Manager
                </Typography>
              </Box>
              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                JD
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        <Box sx={{ mt: 2 }} className="fade-in">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
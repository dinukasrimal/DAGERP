import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { SalesOrder, OrderStatus } from '../../types';
import { OrderService } from '../../services/orderService';

interface ViewOrderDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
}

const ViewOrderDialog: React.FC<ViewOrderDialogProps> = ({
  open,
  onClose,
  orderId,
}) => {
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      loadOrder();
    }
  }, [open, orderId]);

  const loadOrder = async () => {
    if (!orderId) return;
    
    try {
      setLoading(true);
      const orderData = await OrderService.getById(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'APPROVED':
        return 'info';
      case 'IN_PRODUCTION':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Order Details
          </Typography>
          {order && (
            <Chip
              label={order.status.replace('_', ' ')}
              color={getStatusColor(order.status)}
              sx={{ fontWeight: 500, textTransform: 'capitalize' }}
            />
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : order ? (
          <Box sx={{ mt: 2 }}>
            {/* Order Header */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Order Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Order Number:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {order.orderNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Order Date:
                        </Typography>
                        <Typography variant="body2">
                          {formatDate(order.orderDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Amount:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          {formatCurrency(order.totalAmount)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Customer Information
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Customer:
                        </Typography>
                        <Typography variant="body2">
                          {order.customer?.name || `Customer ${order.customerId}`}
                        </Typography>
                      </Box>
                      {order.customer?.email && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Email:
                          </Typography>
                          <Typography variant="body2">
                            {order.customer.email}
                          </Typography>
                        </Box>
                      )}
                      {order.customer?.phone && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Phone:
                          </Typography>
                          <Typography variant="body2">
                            {order.customer.phone}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Order Styles */}
            {order.styles && order.styles.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Styles
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Style</TableCell>
                          <TableCell>Pack Configuration</TableCell>
                          <TableCell>Unit Price</TableCell>
                          <TableCell>Color Details</TableCell>
                          <TableCell>Size Details</TableCell>
                          <TableCell>Summary</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.styles.map((orderStyle, index) => {
                          const totalPacks = orderStyle.sizeAllocations?.reduce((sum: number, size: any) => sum + size.quantity, 0) || 0;
                          const totalPieces = totalPacks * orderStyle.packConfiguration * (orderStyle.colorAllocations?.length || 1);
                          const styleTotal = totalPieces * orderStyle.unitPrice;
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {orderStyle.style?.styleCode || 'Unknown'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {orderStyle.style?.styleName || 'Unknown Style'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold">
                                  {orderStyle.packConfiguration} pieces/pack
                                </Typography>
                              </TableCell>
                              <TableCell>{formatCurrency(orderStyle.unitPrice)}/pack</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  {orderStyle.colorAllocations?.map((color: any, colorIndex: number) => (
                                    <Box key={colorIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip
                                        label={color.color}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                      <Typography variant="caption" color="text.secondary">
                                        {color.packQuantity} packs assigned
                                      </Typography>
                                    </Box>
                                  )) || <Typography variant="body2" color="text.secondary">No colors assigned</Typography>}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  {orderStyle.sizeAllocations?.map((size: any, sizeIndex: number) => (
                                    <Box key={sizeIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip
                                        label={size.size}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                      />
                                      <Typography variant="caption" color="text.secondary">
                                        {size.quantity} packs = {size.quantity * orderStyle.packConfiguration} pieces
                                      </Typography>
                                    </Box>
                                  )) || <Typography variant="body2" color="text.secondary">No sizes assigned</Typography>}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Total Packs: {totalPacks}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Total Pieces: {totalPieces}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Colors: {orderStyle.colorAllocations?.length || 0}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight="bold" color="primary.main">
                                  {formatCurrency(styleTotal)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Order not found
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewOrderDialog;
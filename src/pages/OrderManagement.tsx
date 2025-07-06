import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Build,
  CheckCircle,
} from '@mui/icons-material';
import { SalesOrder, OrderStatus } from '../types';
import CreateOrderDialog from '../components/orders/CreateOrderDialog';
import ViewOrderDialog from '../components/orders/ViewOrderDialog';
import EditOrderDialog from '../components/orders/EditOrderDialog';
import { OrderService } from '../services/orderService';

const OrderManagement: React.FC = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orderData = await OrderService.getAll();
      setOrders(orderData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockOrders: SalesOrder[] = [
    {
      id: '1',
      orderNumber: 'SO-2025-001',
      customerId: '1',
      orderDate: new Date('2025-01-15'),
      totalAmount: 25000,
      status: 'PENDING' as OrderStatus,
      branchId: '1',
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
      purchaseOrders: [],
      styles: [],
    },
    {
      id: '2',
      orderNumber: 'SO-2025-002',
      customerId: '2',
      orderDate: new Date('2025-01-16'),
      totalAmount: 45000,
      status: 'IN_PRODUCTION' as OrderStatus,
      branchId: '1',
      createdAt: new Date('2025-01-16'),
      updatedAt: new Date('2025-01-16'),
      purchaseOrders: [],
      styles: [],
    },
  ];

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

  const handleCreateOrder = () => {
    setOpenCreateDialog(true);
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOpenViewDialog(true);
  };

  const handleEditOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setOpenEditDialog(true);
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      setLoading(true);
      await OrderService.updateStatus(orderId, 'APPROVED');
      console.log('Order approved successfully');
      await loadOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error approving order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error approving order: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBOM = (orderId: string) => {
    // Generate a simple BOM report for the order
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      alert('Order not found');
      return;
    }

    // Create a simple BOM text report
    let bomReport = `BILL OF MATERIALS\n`;
    bomReport += `===================\n`;
    bomReport += `Order Number: ${order.orderNumber}\n`;
    bomReport += `Customer: ${order.customer?.name || `Customer ${order.customerId}`}\n`;
    bomReport += `Order Date: ${order.orderDate.toLocaleDateString()}\n`;
    bomReport += `Total Amount: $${order.totalAmount.toLocaleString()}\n\n`;
    
    if (order.styles && order.styles.length > 0) {
      bomReport += `STYLES:\n`;
      bomReport += `--------\n`;
      order.styles.forEach((style, index) => {
        bomReport += `${index + 1}. Style: ${style.style?.styleCode || 'Unknown'} - ${style.style?.styleName || 'Unknown Style'}\n`;
        bomReport += `   Pack Configuration: ${style.packConfiguration}\n`;
        bomReport += `   Unit Price: $${style.unitPrice}\n`;
        
        if (style.colorAllocations && style.colorAllocations.length > 0) {
          bomReport += `   Colors: ${style.colorAllocations.map((c: any) => `${c.color} (${c.packQuantity} packs)`).join(', ')}\n`;
        }
        
        if (style.sizeAllocations && style.sizeAllocations.length > 0) {
          bomReport += `   Sizes: ${style.sizeAllocations.map((s: any) => `${s.size}: ${s.quantity} packs`).join(', ')}\n`;
        }
        
        const totalPacks = style.sizeAllocations?.reduce((sum: number, size: any) => sum + size.quantity, 0) || 0;
        const totalPieces = totalPacks * style.packConfiguration * (style.colorAllocations?.length || 1);
        const styleTotal = totalPieces * style.unitPrice;
        bomReport += `   Total Pieces: ${totalPieces}\n`;
        bomReport += `   Style Total: $${styleTotal.toFixed(2)}\n\n`;
      });
    }

    // Download as text file
    const blob = new Blob([bomReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOM_${order.orderNumber}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`BOM generated for order ${order.orderNumber}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Order Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and track all your sales orders in one place
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateOrder}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Create New Order
          </Button>
        </Box>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        {[
          {
            title: 'Total Orders',
            value: orders.length > 0 ? orders.length : mockOrders.length,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            lightBg: 'rgba(102, 126, 234, 0.1)',
          },
          {
            title: 'Pending Orders',
            value: (orders.length > 0 ? orders : mockOrders).filter(o => o.status === 'PENDING').length,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            lightBg: 'rgba(240, 147, 251, 0.1)',
          },
          {
            title: 'In Production',
            value: (orders.length > 0 ? orders : mockOrders).filter(o => o.status === 'IN_PRODUCTION').length,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            lightBg: 'rgba(79, 172, 254, 0.1)',
          },
          {
            title: 'Total Value',
            value: `$${(orders.length > 0 ? orders : mockOrders).reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}`,
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            lightBg: 'rgba(67, 233, 123, 0.1)',
          },
        ].map((stat, index) => (
          <Card 
            key={index}
            sx={{
              background: stat.lightBg,
              border: 'none',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: stat.gradient,
                  opacity: 0.1,
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                {stat.title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Orders Table */}
      <Card>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your sales orders and track their progress
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>
                  Order Number
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>
                  Order Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>
                  Customer
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>
                  Total Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', borderBottom: '2px solid', borderColor: 'divider' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(orders.length > 0 ? orders : mockOrders).map((order, index) => (
                <TableRow 
                  key={order.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.04)',
                    },
                    '& td': {
                      borderBottom: index === mockOrders.length - 1 ? 'none' : '1px solid',
                      borderColor: 'divider',
                      py: 2,
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {order.orderNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.orderDate.toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.customer?.name || `Customer ${order.customerId}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${order.totalAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.replace('_', ' ')}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleViewOrder(order.id)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'primary.50' },
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleEditOrder(order.id)}
                        sx={{
                          color: 'secondary.main',
                          '&:hover': { backgroundColor: 'secondary.50' },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      {order.status === 'PENDING' && (
                        <IconButton 
                          size="small"
                          onClick={() => handleApproveOrder(order.id)}
                          sx={{
                            color: 'success.main',
                            '&:hover': { backgroundColor: 'success.50' },
                          }}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton 
                        size="small"
                        onClick={() => handleGenerateBOM(order.id)}
                        sx={{
                          color: 'info.main',
                          '&:hover': { backgroundColor: 'info.50' },
                        }}
                      >
                        <Build fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CreateOrderDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSubmit={async (orderData) => {
          try {
            setLoading(true);
            console.log('Creating order with data:', orderData);
            
            const result = await OrderService.create({
              orderNumber: orderData.orderNumber,
              customerId: orderData.customerId,
              supplierReference: orderData.supplierReference,
              orderDate: orderData.orderDate.toISOString().split('T')[0],
              deliveryDate: orderData.deliveryDate?.toISOString().split('T')[0],
              totalAmount: orderData.totalAmount,
              status: orderData.status,
              branchId: orderData.branchId,
              styles: orderData.styles
            });
            
            console.log('Order created successfully!', result);
            setOpenCreateDialog(false);
            await loadOrders(); // Refresh the orders list
          } catch (error) {
            console.error('Error creating order:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Error creating order: ${errorMessage}. Please check the console for details.`);
          } finally {
            setLoading(false);
          }
        }}
      />

      <ViewOrderDialog
        open={openViewDialog}
        onClose={() => {
          setOpenViewDialog(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
      />

      <EditOrderDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedOrderId(null);
        }}
        orderId={selectedOrderId}
        onSubmit={async (orderData) => {
          try {
            setLoading(true);
            console.log('Updating order with data:', orderData);
            
            if (selectedOrderId) {
              await OrderService.update(selectedOrderId, {
                customerId: orderData.customerId,
                supplierReference: orderData.supplierReference,
                orderDate: orderData.orderDate.toISOString().split('T')[0],
                deliveryDate: orderData.deliveryDate?.toISOString().split('T')[0],
                totalAmount: orderData.totalAmount,
                status: orderData.status,
                branchId: orderData.branchId,
              });
              
              console.log('Order updated successfully!');
              setOpenEditDialog(false);
              setSelectedOrderId(null);
              await loadOrders(); // Refresh the orders list
            }
          } catch (error) {
            console.error('Error updating order:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Error updating order: ${errorMessage}. Please check the console for details.`);
          } finally {
            setLoading(false);
          }
        }}
      />
    </Box>
  );
};

export default OrderManagement;
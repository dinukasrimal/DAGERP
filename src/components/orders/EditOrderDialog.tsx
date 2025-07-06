import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Fab,
  CircularProgress,
} from '@mui/material';
import {
  Delete,
  PersonAdd,
  Edit,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Customer, Style, SalesOrder, OrderStatus } from '../../types';
import AddCustomerDialog from './AddCustomerDialog';
import AddStyleDialog from './AddStyleDialog';
import StyleConfigurationDialog from './StyleConfigurationDialog';
import { CustomerService } from '../../services/customerService';
import { StyleService } from '../../services/styleService';
import { OrderService, OrderStyleConfiguration } from '../../services/orderService';

interface EditOrderDialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string | null;
  onSubmit: (orderData: {
    orderNumber: string;
    customerId: string;
    supplierReference?: string;
    orderDate: Date;
    deliveryDate?: Date;
    totalAmount: number;
    status: string;
    branchId: string;
    styles: OrderStyleConfiguration[];
  }) => void;
}

interface EditOrderFormData {
  orderNumber: string;
  supplierReference: string;
  customerId: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
  styles: OrderStyleConfiguration[];
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
  open,
  onClose,
  orderId,
  onSubmit,
}) => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddStyle, setShowAddStyle] = useState(false);
  const [showStyleConfig, setShowStyleConfig] = useState(false);
  const [selectedStyleForConfig, setSelectedStyleForConfig] = useState<Style | null>(null);
  const [editingStyleIndex, setEditingStyleIndex] = useState<number | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const { control, handleSubmit, reset, watch, setValue } = useForm<EditOrderFormData>({
    defaultValues: {
      orderNumber: '',
      supplierReference: '',
      customerId: '',
      orderDate: '',
      deliveryDate: '',
      status: 'PENDING',
      styles: [],
    },
  });

  useEffect(() => {
    if (open && orderId) {
      loadOrderData();
      loadCustomers();
      loadStyles();
    }
  }, [open, orderId]);

  const loadOrderData = async () => {
    if (!orderId) return;
    
    try {
      setInitialLoading(true);
      const order = await OrderService.getById(orderId);
      if (order) {
        reset({
          orderNumber: order.orderNumber,
          supplierReference: order.supplierReference || '',
          customerId: order.customerId,
          orderDate: order.orderDate.toISOString().split('T')[0],
          deliveryDate: order.deliveryDate ? order.deliveryDate.toISOString().split('T')[0] : '',
          status: order.status,
          styles: order.styles?.map(style => ({
            styleId: style.styleId,
            packQuantity: style.packConfiguration,
            unitPrice: style.unitPrice,
            colors: style.colorAllocations?.map(c => ({ color: c.color, packs: c.packQuantity })) || [],
            sizes: style.sizeAllocations?.map(s => ({ size: s.size, quantity: s.quantity })) || [],
          })) || [],
        });
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const customerData = await CustomerService.getAll();
      setCustomers(customerData);
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([
        { id: '6dd5abc5-bff1-4eb9-ad62-a1f5fa8387c1', name: 'ABC Fashion Ltd', email: 'abc@fashion.com', phone: '123-456-7890', address: '123 Main St', createdAt: new Date(), updatedAt: new Date() },
        { id: '49cbcfe5-5891-4613-a76e-4532b6b8e84d', name: 'XYZ Garments', email: 'xyz@garments.com', phone: '098-765-4321', address: '456 Oak Ave', createdAt: new Date(), updatedAt: new Date() },
      ]);
    }
  };

  const loadStyles = async () => {
    try {
      const styleData = await StyleService.getAll();
      setStyles(styleData);
    } catch (error) {
      console.error('Error loading styles:', error);
      setStyles([
        { id: 'b483c7c4-581b-4975-abde-7525abd4fbee', styleCode: 'ST-001', styleName: 'Classic T-Shirt', description: 'Basic cotton t-shirt', availableSizes: ['S', 'M', 'L', 'XL'], availableColors: ['Red', 'Blue', 'Green', 'White'], createdAt: new Date(), updatedAt: new Date() },
        { id: 'e7f5a1f8-931f-4829-a82f-ec3fdc624476', styleCode: 'ST-002', styleName: 'Polo Shirt', description: 'Cotton polo shirt', availableSizes: ['S', 'M', 'L', 'XL', 'XXL'], availableColors: ['Navy', 'White', 'Gray', 'Black'], createdAt: new Date(), updatedAt: new Date() },
      ]);
    }
  };

  const watchedStyles = watch('styles') || [];

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCustomer = await CustomerService.create(customerData);
      setCustomers([...customers, newCustomer]);
      setValue('customerId', newCustomer.id);
    } catch (error) {
      console.error('Error creating customer:', error);
      const tempCustomer: Customer = {
        id: `temp-${Date.now()}`,
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCustomers([...customers, tempCustomer]);
      setValue('customerId', tempCustomer.id);
    }
  };

  const handleAddStyle = async (styleData: Omit<Style, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newStyle = await StyleService.create(styleData);
      setStyles([...styles, newStyle]);
      setSelectedStyleForConfig(newStyle);
      setShowStyleConfig(true);
    } catch (error) {
      console.error('Error creating style:', error);
      const tempStyle: Style = {
        id: `temp-${Date.now()}`,
        ...styleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setStyles([...styles, tempStyle]);
      setSelectedStyleForConfig(tempStyle);
      setShowStyleConfig(true);
    }
  };

  const handleStyleSelection = (styleId: string) => {
    if (styleId === 'ADD_NEW') {
      setShowAddStyle(true);
    } else {
      const style = styles.find(s => s.id === styleId);
      if (style) {
        setSelectedStyleForConfig(style);
        setShowStyleConfig(true);
      }
    }
  };

  const handleStyleConfiguration = (configuration: any) => {
    const newStyleConfig: OrderStyleConfiguration = {
      styleId: configuration.styleId,
      packQuantity: configuration.packQuantity,
      unitPrice: configuration.unitPrice,
      colors: configuration.colors.map((c: any) => ({ color: c.color, packs: c.packs })),
      sizes: configuration.sizes.map((s: any) => ({ size: s.size, quantity: s.quantity })),
    };
    
    if (editingStyleIndex !== null) {
      // Update existing style
      const updatedStyles = [...watchedStyles];
      updatedStyles[editingStyleIndex] = newStyleConfig;
      setValue('styles', updatedStyles);
      setEditingStyleIndex(null);
    } else {
      // Add new style
      setValue('styles', [...watchedStyles, newStyleConfig]);
    }
  };

  const handleEditStyle = (index: number) => {
    const styleToEdit = watchedStyles[index];
    const style = getStyleById(styleToEdit.styleId);
    if (style) {
      setSelectedStyleForConfig(style);
      setEditingStyleIndex(index);
      setShowStyleConfig(true);
    }
  };

  const removeStyle = (index: number) => {
    const updatedStyles = watchedStyles.filter((_, i) => i !== index);
    setValue('styles', updatedStyles);
  };

  const getStyleById = (styleId: string) => {
    return styles.find(s => s.id === styleId);
  };

  const onSubmitForm = (data: EditOrderFormData) => {
    const totalAmount = data.styles.reduce((sum, style) => {
      const totalPacks = style.sizes.reduce((qSum, size) => qSum + size.quantity, 0);
      const totalPieces = totalPacks * style.packQuantity * style.colors.length;
      return sum + (totalPieces * style.unitPrice);
    }, 0);

    const orderData = {
      orderNumber: data.orderNumber,
      customerId: data.customerId,
      supplierReference: data.supplierReference,
      orderDate: new Date(data.orderDate),
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
      totalAmount,
      status: data.status,
      branchId: '5836a11a-908c-4e43-a089-add4819e0824',
      styles: data.styles,
    };

    onSubmit(orderData);
  };

  const getStyleOptions = () => {
    return [
      ...styles.map(style => ({ 
        id: style.id, 
        label: `${style.styleCode} - ${style.styleName}`,
        value: style.id
      })),
      { id: 'ADD_NEW', label: '+ Add New Style', value: 'ADD_NEW' }
    ];
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'IN_PRODUCTION', label: 'In Production' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Edit Sales Order</DialogTitle>
      <DialogContent>
        {initialLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="orderNumber"
                  control={control}
                  rules={{ required: 'Order number is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Order Number"
                      fullWidth
                      disabled
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="supplierReference"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Supplier Reference"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="orderDate"
                  control={control}
                  rules={{ required: 'Order date is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Order Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name="deliveryDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Delivery Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Controller
                  name="customerId"
                  control={control}
                  rules={{ required: 'Customer is required' }}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      options={customers}
                      getOptionLabel={(option) => option.name}
                      value={customers.find(c => c.id === field.value) || null}
                      onChange={(_, value) => field.onChange(value?.id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Customer"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                      sx={{ flexGrow: 1 }}
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: 'Status is required' }}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      options={statusOptions}
                      getOptionLabel={(option) => option.label}
                      value={statusOptions.find(s => s.value === field.value) || null}
                      onChange={(_, value) => field.onChange(value?.value || 'PENDING')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Status"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                      sx={{ minWidth: 200 }}
                    />
                  )}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Order Styles</Typography>
              <Autocomplete
                options={getStyleOptions()}
                getOptionLabel={(option) => option.label}
                value={null}
                onChange={(_, value) => {
                  if (value) {
                    handleStyleSelection(value.value);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Style" size="small" sx={{ minWidth: 200 }} />
                )}
              />
            </Box>

            {watchedStyles.map((orderStyle, styleIndex) => {
              const selectedStyle = getStyleById(orderStyle.styleId);
              return (
                <Card key={styleIndex} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {selectedStyle ? `${selectedStyle.styleCode} - ${selectedStyle.styleName}` : 'Unknown Style'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditStyle(styleIndex)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => removeStyle(styleIndex)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Pack Quantity: {orderStyle.packQuantity}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Unit Price: ${orderStyle.unitPrice}/pack
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Packs: {orderStyle.sizes.reduce((sum, size) => sum + size.quantity, 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Pieces: {orderStyle.sizes.reduce((sum, size) => sum + size.quantity, 0) * orderStyle.packQuantity * orderStyle.colors.length}
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight="bold">
                          Style Total: ${((orderStyle.sizes.reduce((sum, size) => sum + size.quantity, 0) * orderStyle.packQuantity * orderStyle.colors.length) * orderStyle.unitPrice).toFixed(2)}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Colors
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {orderStyle.colors.map((colorAllocation) => (
                            <Chip
                              key={colorAllocation.color}
                              label={`${colorAllocation.color} (${colorAllocation.packs} packs)`}
                              color="primary"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Sizes & Quantities (Packs)
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {orderStyle.sizes.map((sizeAllocation) => (
                            <Chip
                              key={sizeAllocation.size}
                              label={`${sizeAllocation.size}: ${sizeAllocation.quantity} packs`}
                              color="secondary"
                              size="small"
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" color="primary.main">
            Order Total: ${watchedStyles.reduce((sum, style) => {
              const totalPacks = style.sizes.reduce((qSum, size) => qSum + size.quantity, 0);
              const totalPieces = totalPacks * style.packQuantity * style.colors.length;
              return sum + (totalPieces * style.unitPrice);
            }, 0).toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmitForm)} variant="contained" disabled={loading}>
            Update Order
          </Button>
        </Box>
      </DialogActions>
      
      <AddCustomerDialog
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onAdd={handleAddCustomer}
      />
      
      <AddStyleDialog
        open={showAddStyle}
        onClose={() => setShowAddStyle(false)}
        onAdd={handleAddStyle}
      />
      
      <StyleConfigurationDialog
        open={showStyleConfig}
        onClose={() => {
          setShowStyleConfig(false);
          setEditingStyleIndex(null);
        }}
        onSave={handleStyleConfiguration}
        selectedStyle={selectedStyleForConfig}
        existingConfiguration={editingStyleIndex !== null ? {
          styleId: watchedStyles[editingStyleIndex]?.styleId || '',
          packQuantity: watchedStyles[editingStyleIndex]?.packQuantity || 1,
          unitPrice: watchedStyles[editingStyleIndex]?.unitPrice || 0,
          colors: watchedStyles[editingStyleIndex]?.colors || [],
          sizes: watchedStyles[editingStyleIndex]?.sizes || [],
        } : undefined}
      />
    </Dialog>
  );
};

export default EditOrderDialog;
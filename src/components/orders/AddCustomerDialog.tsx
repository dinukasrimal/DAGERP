import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Customer } from '../../types';

interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const { control, handleSubmit, reset } = useForm<CustomerFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CustomerFormData) => {
    onAdd(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Customer</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Customer name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Customer Name"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address'
                }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Address"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Add Customer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog;
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface AddRawMaterialDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (material: RawMaterialData) => void;
}

interface RawMaterialData {
  code: string;
  name: string;
  planUnit: string;
  purchaseUnit: string;
  conversionFactor: number;
  category: string;
}

const AddRawMaterialDialog: React.FC<AddRawMaterialDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<RawMaterialData>({
    defaultValues: {
      code: '',
      name: '',
      planUnit: 'MTR',
      purchaseUnit: 'MTR',
      conversionFactor: 1,
      category: 'Fabric',
    },
  });

  const watchedCategory = watch('category');
  const watchedName = watch('name');

  const unitOptions = [
    'MTR', 'YRD', 'KG', 'GM', 'LTR', 'ML', 'PCS', 'SET', 'PAIR', 'DOZEN', 'CONE', 'ROLL'
  ];

  const categoryOptions = [
    'Fabric',
    'Thread',
    'Button',
    'Zipper',
    'Label',
    'Elastic',
    'Lining',
    'Interfacing',
    'Accessories',
    'Packaging',
    'Other'
  ];

  const categoryPrefixes = {
    'Fabric': 'FAB',
    'Thread': 'THR',
    'Button': 'BTN',
    'Zipper': 'ZIP',
    'Label': 'LAB',
    'Elastic': 'ELA',
    'Lining': 'LIN',
    'Interfacing': 'INT',
    'Accessories': 'ACC',
    'Packaging': 'PKG',
    'Other': 'OTH'
  };

  // Auto-generate material code when category or name changes
  React.useEffect(() => {
    if (watchedCategory && watchedName) {
      const prefix = categoryPrefixes[watchedCategory as keyof typeof categoryPrefixes];
      const namePart = watchedName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .substring(0, 3);
      const timestamp = Date.now().toString().slice(-3);
      const generatedCode = `${prefix}-${namePart}${timestamp}`;
      setValue('code', generatedCode);
    }
  }, [watchedCategory, watchedName, setValue]);

  const onSubmit = async (data: RawMaterialData) => {
    try {
      setLoading(true);
      onAdd(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding raw material:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Add New Raw Material</Typography>
        <Typography variant="body2" color="text.secondary">
          Define planning unit and purchase unit with conversion factor
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Material Code:</strong> Auto-generated based on category and name
          <br />
          <strong>Plan Unit:</strong> Unit used for consumption planning (e.g., MTR for fabric consumption)
          <br />
          <strong>Purchase Unit:</strong> Unit in which material is purchased (e.g., YRD for fabric rolls)
          <br />
          <strong>Conversion Factor:</strong> How many plan units = 1 purchase unit
        </Alert>

        <Box component="form" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categoryOptions.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Material name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Material Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    placeholder="Cotton Fabric 160GSM"
                  />
                )}
              />
            </Box>

            <Controller
              name="code"
              control={control}
              rules={{ 
                required: 'Material code is required'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Material Code (Auto-Generated)"
                  fullWidth
                  disabled
                  error={!!errors.code}
                  helperText={errors.code?.message || 'Generated automatically based on category and name'}
                  placeholder="Will be generated automatically"
                />
              )}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
              Unit Configuration
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="planUnit"
                control={control}
                rules={{ required: 'Plan unit is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.planUnit}>
                    <InputLabel>Plan Unit</InputLabel>
                    <Select {...field} label="Plan Unit">
                      {unitOptions.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="purchaseUnit"
                control={control}
                rules={{ required: 'Purchase unit is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.purchaseUnit}>
                    <InputLabel>Purchase Unit</InputLabel>
                    <Select {...field} label="Purchase Unit">
                      {unitOptions.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="conversionFactor"
                control={control}
                rules={{ 
                  required: 'Conversion factor is required',
                  min: { value: 0.01, message: 'Must be greater than 0' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Conversion Factor"
                    type="number"
                    fullWidth
                    error={!!errors.conversionFactor}
                    helperText={errors.conversionFactor?.message || '1 Purchase Unit = ? Plan Units'}
                    inputProps={{ min: 0.01, step: 0.01 }}
                  />
                )}
              />
            </Box>

            <Alert severity="warning" sx={{ mt: 1 }}>
              <strong>Example:</strong> If you buy fabric in yards but plan consumption in meters:
              <br />
              Plan Unit: MTR, Purchase Unit: YRD, Conversion Factor: 0.914
              <br />
              (1 yard = 0.914 meters)
            </Alert>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRawMaterialDialog;
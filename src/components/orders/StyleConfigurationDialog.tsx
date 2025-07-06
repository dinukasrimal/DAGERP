import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Autocomplete,
  Chip,
  Card,
  CardContent,
  IconButton,
  Divider,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Style } from '../../types';

interface StyleConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (configuration: StyleConfiguration) => void;
  selectedStyle: Style | null;
  existingConfiguration?: StyleConfiguration;
}

interface StyleConfiguration {
  styleId: string;
  packQuantity: number;
  unitPrice: number;
  colors: ColorAllocation[];
  sizes: SizeAllocation[];
}

interface ColorAllocation {
  color: string;
  packs: number;
}

interface SizeAllocation {
  size: string;
  quantity: number;
}

interface ConfigFormData {
  packQuantity: number;
  unitPrice: number;
  colors: ColorAllocation[];
  sizes: SizeAllocation[];
}

const StyleConfigurationDialog: React.FC<StyleConfigurationDialogProps> = ({
  open,
  onClose,
  onSave,
  selectedStyle,
  existingConfiguration,
}) => {
  const [availableColors, setAvailableColors] = useState<string[]>(['Red', 'Blue', 'Green', 'White', 'Navy', 'Gray', 'Black']);
  const [availableSizes, setAvailableSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'XXL']);

  const { control, handleSubmit, reset, watch, setValue } = useForm<ConfigFormData>({
    defaultValues: {
      packQuantity: 1,
      unitPrice: 0,
      colors: [],
      sizes: [],
    },
  });

  const watchedPackQuantity = watch('packQuantity') || 1;
  const watchedColors = watch('colors') || [];
  const watchedSizes = watch('sizes') || [];

  useEffect(() => {
    if (selectedStyle) {
      setAvailableColors(selectedStyle.availableColors);
      setAvailableSizes(selectedStyle.availableSizes);
    }
  }, [selectedStyle]);

  useEffect(() => {
    if (open && existingConfiguration) {
      // Load existing configuration data
      reset({
        packQuantity: existingConfiguration.packQuantity,
        unitPrice: existingConfiguration.unitPrice,
        colors: existingConfiguration.colors,
        sizes: existingConfiguration.sizes,
      });
    } else if (open && !existingConfiguration) {
      // Reset to default values for new configuration
      reset({
        packQuantity: 1,
        unitPrice: 0,
        colors: [],
        sizes: [],
      });
    }
  }, [open, existingConfiguration, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: ConfigFormData) => {
    if (!selectedStyle) return;
    
    const configuration: StyleConfiguration = {
      styleId: selectedStyle.id,
      packQuantity: data.packQuantity,
      unitPrice: data.unitPrice,
      colors: data.colors,
      sizes: data.sizes,
    };
    
    onSave(configuration);
    reset();
    onClose();
  };

  const addNewColor = (color: string) => {
    if (color && !availableColors.includes(color)) {
      setAvailableColors([...availableColors, color]);
    }
  };

  const addNewSize = (size: string) => {
    if (size && !availableSizes.includes(size)) {
      setAvailableSizes([...availableSizes, size]);
    }
  };

  const addColor = (color: string) => {
    const currentColors = watchedColors;
    if (!currentColors.find(c => c.color === color)) {
      const newColor: ColorAllocation = {
        color,
        packs: 1,
      };
      setValue('colors', [...currentColors, newColor]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    const updatedColors = watchedColors.filter(c => c.color !== colorToRemove);
    setValue('colors', updatedColors);
  };

  const updateColorPacks = (color: string, packs: number) => {
    const updatedColors = watchedColors.map(c => 
      c.color === color ? { ...c, packs } : c
    );
    setValue('colors', updatedColors);
  };

  const addSize = (size: string) => {
    const currentSizes = watchedSizes;
    if (!currentSizes.find(s => s.size === size)) {
      const newSize: SizeAllocation = {
        size,
        quantity: 0,
      };
      setValue('sizes', [...currentSizes, newSize]);
    }
  };

  const removeSize = (sizeToRemove: string) => {
    const updatedSizes = watchedSizes.filter(s => s.size !== sizeToRemove);
    setValue('sizes', updatedSizes);
  };

  const updateSizeQuantity = (size: string, quantity: number) => {
    const updatedSizes = watchedSizes.map(s => 
      s.size === size ? { ...s, quantity } : s
    );
    setValue('sizes', updatedSizes);
  };

  const getTotalAllocatedPacks = () => {
    return watchedColors.reduce((sum, color) => sum + color.packs, 0);
  };

  const getTotalSizePacks = () => {
    return watchedSizes.reduce((sum, size) => sum + size.quantity, 0);
  };

  const getTotalPieces = () => {
    const totalPacks = getTotalSizePacks();
    const totalColors = watchedColors.length;
    const packConfiguration = watchedPackQuantity;
    return totalPacks * packConfiguration * totalColors;
  };

  if (!selectedStyle) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {existingConfiguration ? 'Edit' : 'Configure'} Style: {selectedStyle.styleCode} - {selectedStyle.styleName}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="packQuantity"
                control={control}
                rules={{ required: 'Pack quantity is required', min: { value: 1, message: 'Pack quantity must be at least 1' } }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Number of Packs"
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 1 }}
                  />
                )}
              />
              <Controller
                name="unitPrice"
                control={control}
                rules={{ required: 'Unit price is required', min: { value: 0, message: 'Unit price must be positive' } }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Unit Price per Pack"
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{ startAdornment: '$' }}
                  />
                )}
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Color Allocation (Total Packs Required: {watchedPackQuantity})
              </Typography>
              
              {watchedColors.map((colorAllocation, index) => (
                <Card key={colorAllocation.color} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip label={colorAllocation.color} color="primary" sx={{ minWidth: 80 }} />
                      <TextField
                        label="Packs"
                        type="number"
                        value={colorAllocation.packs}
                        onChange={(e) => updateColorPacks(colorAllocation.color, parseInt(e.target.value) || 0)}
                        size="small"
                        inputProps={{ min: 0 }}
                        sx={{ width: 100 }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeColor(colorAllocation.color)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              <Autocomplete
                options={availableColors.filter(c => !watchedColors.find(wc => wc.color === c))}
                value={null}
                onChange={(_, value) => {
                  if (value) {
                    addColor(value);
                  }
                }}
                freeSolo
                onInputChange={(_, newValue) => {
                  if (newValue && newValue.length > 0 && !availableColors.includes(newValue)) {
                    addNewColor(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Add Color" size="small" />
                )}
                key={watchedColors.length}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Allocated Packs: {getTotalAllocatedPacks()} / {watchedPackQuantity}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Size & Quantity Allocation
              </Typography>
              
              {watchedSizes.map((sizeAllocation, index) => (
                <Card key={sizeAllocation.size} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip label={sizeAllocation.size} color="secondary" sx={{ minWidth: 60 }} />
                      <TextField
                        label="Packs"
                        type="number"
                        value={sizeAllocation.quantity}
                        onChange={(e) => updateSizeQuantity(sizeAllocation.size, parseInt(e.target.value) || 0)}
                        size="small"
                        inputProps={{ min: 0 }}
                        sx={{ width: 120 }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeSize(sizeAllocation.size)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              <Autocomplete
                options={availableSizes.filter(s => !watchedSizes.find(ws => ws.size === s))}
                value={null}
                onChange={(_, value) => {
                  if (value) {
                    addSize(value);
                  }
                }}
                freeSolo
                onInputChange={(_, newValue) => {
                  if (newValue && newValue.length > 0 && !availableSizes.includes(newValue)) {
                    addNewSize(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Add Size" size="small" />
                )}
                key={watchedSizes.length}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total Packs: {getTotalSizePacks()} | Total Pieces: {getTotalPieces()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          {existingConfiguration ? 'Update Configuration' : 'Save Configuration'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StyleConfigurationDialog;
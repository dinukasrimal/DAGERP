import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Style } from '../../types';

interface AddStyleDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (style: Omit<Style, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

interface StyleFormData {
  styleCode: string;
  styleName: string;
  availableSizes: string[];
  availableColors: string[];
}

const AddStyleDialog: React.FC<AddStyleDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [availableSizes, setAvailableSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'XXL']);
  const [availableColors, setAvailableColors] = useState<string[]>(['Red', 'Blue', 'Green', 'White', 'Navy', 'Gray', 'Black']);
  
  const { control, handleSubmit, reset, watch, setValue } = useForm<StyleFormData>({
    defaultValues: {
      styleCode: '',
      styleName: '',
      availableSizes: [],
      availableColors: [],
    },
  });

  const watchedSizes = watch('availableSizes') || [];
  const watchedColors = watch('availableColors') || [];

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: StyleFormData) => {
    const styleData = {
      ...data,
      description: '', // Default empty description since field was removed
    };
    onAdd(styleData);
    reset();
    onClose();
  };

  const addNewSize = (size: string) => {
    if (size && !availableSizes.includes(size)) {
      setAvailableSizes([...availableSizes, size]);
    }
  };

  const addNewColor = (color: string) => {
    if (color && !availableColors.includes(color)) {
      setAvailableColors([...availableColors, color]);
    }
  };

  const handleSizeChange = (event: any, value: string[]) => {
    setValue('availableSizes', value);
  };

  const handleColorChange = (event: any, value: string[]) => {
    setValue('availableColors', value);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Style</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="styleCode"
                control={control}
                rules={{ required: 'Style code is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Style Code"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="styleName"
                control={control}
                rules={{ required: 'Style name is required' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Style Name"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Box>
            
            <Box>
              <Autocomplete
                multiple
                options={availableSizes}
                value={watchedSizes}
                onChange={handleSizeChange}
                freeSolo
                onInputChange={(_, newValue) => {
                  if (newValue && newValue.length > 0) {
                    addNewSize(newValue);
                  }
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Available Sizes"
                    placeholder="Select or add sizes"
                  />
                )}
              />
            </Box>
            
            <Box>
              <Autocomplete
                multiple
                options={availableColors}
                value={watchedColors}
                onChange={handleColorChange}
                freeSolo
                onInputChange={(_, newValue) => {
                  if (newValue && newValue.length > 0) {
                    addNewColor(newValue);
                  }
                }}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Available Colors"
                    placeholder="Select or add colors"
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Add Style
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStyleDialog;
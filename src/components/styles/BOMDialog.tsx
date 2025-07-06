import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Delete,
  Save,
  Cancel,
  Build,
  CheckCircle,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { Style } from '../../types';

interface BOMDialogProps {
  open: boolean;
  onClose: () => void;
  style: Style | null;
  onBOMSaved: (styleId: string) => void;
}

interface BOMItem {
  id: string;
  materialCode: string;
  materialName: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  notes?: string;
}

interface BOMFormData {
  items: BOMItem[];
  notes: string;
}

const BOMDialog: React.FC<BOMDialogProps> = ({
  open,
  onClose,
  style,
  onBOMSaved,
}) => {
  const [items, setItems] = useState<BOMItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, setValue, watch } = useForm<BOMFormData>({
    defaultValues: {
      items: [],
      notes: '',
    },
  });

  const [newItem, setNewItem] = useState<Partial<BOMItem>>({
    materialCode: '',
    materialName: '',
    description: '',
    quantity: 1,
    unit: 'PCS',
    unitCost: 0,
    supplier: '',
    notes: '',
  });

  const unitOptions = [
    'PCS', 'MTR', 'YRD', 'KG', 'GM', 'LTR', 'ML', 'SET', 'PAIR', 'DOZEN'
  ];

  const mockMaterials = [
    { code: 'FAB-001', name: 'Cotton Fabric 160GSM', unit: 'MTR', cost: 12.50 },
    { code: 'THR-001', name: 'Polyester Thread', unit: 'MTR', cost: 0.05 },
    { code: 'BTN-001', name: 'Plastic Button 15mm', unit: 'PCS', cost: 0.15 },
    { code: 'ZIP-001', name: 'Metal Zipper 20cm', unit: 'PCS', cost: 1.25 },
    { code: 'LAB-001', name: 'Woven Label', unit: 'PCS', cost: 0.35 },
    { code: 'ELA-001', name: 'Elastic Band 10mm', unit: 'MTR', cost: 0.08 },
  ];

  const loadBOMData = () => {
    const savedBOM = localStorage.getItem(`bom_${style?.id}`);
    if (savedBOM) {
      const bomData = JSON.parse(savedBOM);
      setItems(bomData.items || []);
      setValue('items', bomData.items || []);
      setValue('notes', bomData.notes || '');
    } else {
      setItems([]);
      setValue('items', []);
      setValue('notes', '');
    }
  };

  useEffect(() => {
    if (open && style) {
      loadBOMData();
    }
  }, [open, style, setValue]);

  const handleAddItem = () => {
    if (!newItem.materialCode || !newItem.materialName || !newItem.quantity) {
      return;
    }

    const item: BOMItem = {
      id: `item-${Date.now()}`,
      materialCode: newItem.materialCode || '',
      materialName: newItem.materialName || '',
      description: newItem.description || '',
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'PCS',
      unitCost: newItem.unitCost || 0,
      totalCost: (newItem.quantity || 1) * (newItem.unitCost || 0),
      supplier: newItem.supplier || '',
      notes: newItem.notes || '',
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    setValue('items', updatedItems);

    setNewItem({
      materialCode: '',
      materialName: '',
      description: '',
      quantity: 1,
      unit: 'PCS',
      unitCost: 0,
      supplier: '',
      notes: '',
    });
    setShowAddForm(false);
  };


  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    setValue('items', updatedItems);
  };

  const handleMaterialSelect = (material: any) => {
    if (material) {
      setNewItem({
        ...newItem,
        materialCode: material.code,
        materialName: material.name,
        unit: material.unit,
        unitCost: material.cost,
      });
    }
  };

  const getTotalCost = () => {
    return items.reduce((sum, item) => sum + item.totalCost, 0);
  };

  const handleSave = async () => {
    if (!style) return;

    try {
      setLoading(true);
      
      const bomData = {
        styleId: style.id,
        items: items,
        notes: watch('notes'),
        totalCost: getTotalCost(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(`bom_${style.id}`, JSON.stringify(bomData));
      onBOMSaved(style.id);
      onClose();
    } catch (error) {
      console.error('Error saving BOM:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowAddForm(false);
    setNewItem({
      materialCode: '',
      materialName: '',
      description: '',
      quantity: 1,
      unit: 'PCS',
      unitCost: 0,
      supplier: '',
      notes: '',
    });
    onClose();
  };

  if (!style) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Build color="primary" />
          <Box>
            <Typography variant="h6">
              Bill of Materials (BOM) - {style.styleCode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {style.styleName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Define the materials and quantities required to manufacture one unit of this style.
          </Alert>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {items.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Materials
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">
                  ${getTotalCost().toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Cost per Unit
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" color="warning.main">
                  {items.filter(item => item.unitCost === 0).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Items Without Cost
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Divider sx={{ my: 3 }} />

          {showAddForm && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add New Material
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  <Autocomplete
                    options={mockMaterials}
                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                    onChange={(_, value) => handleMaterialSelect(value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Material" size="small" />
                    )}
                  />
                  <TextField
                    label="Material Code"
                    value={newItem.materialCode}
                    onChange={(e) => setNewItem({...newItem, materialCode: e.target.value})}
                    size="small"
                  />
                  <TextField
                    label="Material Name"
                    value={newItem.materialName}
                    onChange={(e) => setNewItem({...newItem, materialName: e.target.value})}
                    size="small"
                  />
                  <TextField
                    label="Quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                  <Autocomplete
                    options={unitOptions}
                    value={newItem.unit}
                    onChange={(_, value) => setNewItem({...newItem, unit: value || 'PCS'})}
                    renderInput={(params) => (
                      <TextField {...params} label="Unit" size="small" />
                    )}
                  />
                  <TextField
                    label="Unit Cost"
                    type="number"
                    value={newItem.unitCost}
                    onChange={(e) => setNewItem({...newItem, unitCost: parseFloat(e.target.value) || 0})}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{ startAdornment: '$' }}
                  />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleAddItem}
                    disabled={!newItem.materialCode || !newItem.materialName}
                    startIcon={<Save />}
                  >
                    Add Material
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowAddForm(false)}
                    startIcon={<Cancel />}
                  >
                    Cancel
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Materials List</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowAddForm(true)}
              disabled={showAddForm}
            >
              Add Material
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Material Code</TableCell>
                  <TableCell>Material Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>Unit Cost</TableCell>
                  <TableCell>Total Cost</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Chip label={item.materialCode} size="small" color="primary" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.materialName}
                      </Typography>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Chip label={item.unit} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${item.unitCost.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        ${item.totalCost.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        No materials added yet. Click "Add Material" to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {items.length > 0 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" align="right">
                Total BOM Cost: ${getTotalCost().toFixed(2)}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="BOM Notes"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Add any additional notes or specifications for this BOM..."
                />
              )}
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || items.length === 0}
          startIcon={loading ? <Build /> : <CheckCircle />}
        >
          {loading ? 'Saving...' : 'Save BOM'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BOMDialog;
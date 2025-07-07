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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Build,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Add,
  Delete,
  Edit,
  ExpandMore,
  Settings,
} from '@mui/icons-material';
import { Style } from '../../types';
import AddRawMaterialDialog from './AddRawMaterialDialog';

interface BOMDialogProps {
  open: boolean;
  onClose: () => void;
  style: Style | null;
  onBOMSaved: (styleId: string) => void;
}

interface RawMaterial {
  id: string;
  code: string;
  name: string;
  planUnit: string;
  purchaseUnit: string;
  conversionFactor: number;
  category: string;
}

interface BOMEntry {
  id: string;
  materialId: string;
  material: RawMaterial;
  planningType: 'general' | 'sizewise' | 'colorwise' | 'sizecolor';
  consumptions: ConsumptionEntry[];
  subMaterials: SubMaterial[];
  notes: string;
}

interface BOMPlan {
  id: string;
  styleId: string;
  bomEntries: BOMEntry[];
  totalCost: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ConsumptionEntry {
  id: string;
  size?: string;
  color?: string;
  consumption: number;
  unit: string;
  cost?: number;
}

interface SubMaterial {
  id: string;
  mainMaterialId: string;
  code: string;
  name: string;
  prefixes: {
    style: boolean;
    size: boolean;
    color: boolean;
  };
  size?: string;
  color?: string;
}

const BOMDialog: React.FC<BOMDialogProps> = ({
  open,
  onClose,
  style,
  onBOMSaved,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bomEntries, setBomEntries] = useState<BOMEntry[]>([]);
  const [currentEditingEntry, setCurrentEditingEntry] = useState<BOMEntry | null>(null);
  const [tempPlanningType, setTempPlanningType] = useState<'general' | 'sizewise' | 'colorwise' | 'sizecolor'>('general');
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [notes, setNotes] = useState('');
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [openAddMaterial, setOpenAddMaterial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedConsumptions, setSelectedConsumptions] = useState<{[key: string]: string}>({});

  const steps = [
    'BOM Overview',
    'Add/Edit Materials',
    'Configure Consumption',
    'Sub Materials Setup',
    'Review & Save'
  ];

  useEffect(() => {
    if (open) {
      loadRawMaterials();
      loadExistingBOM();
      setActiveStep(0);
    }
  }, [open, style]);

  const loadRawMaterials = () => {
    const saved = localStorage.getItem('rawMaterials');
    if (saved) {
      setRawMaterials(JSON.parse(saved));
    } else {
      setRawMaterials([
        {
          id: 'rm-001',
          code: 'FAB-COT001',
          name: 'Cotton Fabric 160GSM',
          planUnit: 'MTR',
          purchaseUnit: 'YRD',
          conversionFactor: 1.094,
          category: 'Fabric',
        },
        {
          id: 'rm-002',
          code: 'THR-POL002',
          name: 'Polyester Thread',
          planUnit: 'MTR',
          purchaseUnit: 'CONE',
          conversionFactor: 5000,
          category: 'Thread',
        },
        {
          id: 'rm-003',
          code: 'BTN-PLA003',
          name: 'Plastic Button 15mm',
          planUnit: 'PCS',
          purchaseUnit: 'GROSS',
          conversionFactor: 144,
          category: 'Button',
        },
      ]);
    }
  };

  const loadExistingBOM = () => {
    if (!style) return;
    const saved = localStorage.getItem(`bom_plan_${style.id}`);
    if (saved) {
      const bomPlan: BOMPlan = JSON.parse(saved);
      setBomEntries(bomPlan.bomEntries || []);
      setNotes(bomPlan.notes || '');
    }
  };

  const handleAddRawMaterial = (materialData: Omit<RawMaterial, 'id'>) => {
    const newMaterial: RawMaterial = {
      id: `rm-${Date.now()}`,
      ...materialData,
    };
    const updatedMaterials = [...rawMaterials, newMaterial];
    setRawMaterials(updatedMaterials);
    localStorage.setItem('rawMaterials', JSON.stringify(updatedMaterials));
    setOpenAddMaterial(false);
  };

  const handleAddBOMEntry = () => {
    if (!selectedMaterial) return;

    const newEntry: BOMEntry = {
      id: `entry-${Date.now()}`,
      materialId: selectedMaterial.id,
      material: selectedMaterial,
      planningType: tempPlanningType,
      consumptions: [],
      subMaterials: [],
      notes: '',
    };

    // Generate consumption entries based on planning type
    const consumptions = generateConsumptionEntries(tempPlanningType, selectedMaterial);
    newEntry.consumptions = consumptions;

    setBomEntries([...bomEntries, newEntry]);
    setSelectedMaterial(null);
    setTempPlanningType('general');
  };

  const generateConsumptionEntries = (planningType: string, material: RawMaterial): ConsumptionEntry[] => {
    if (!style) return [];

    const entries: ConsumptionEntry[] = [];

    switch (planningType) {
      case 'general':
        entries.push({
          id: 'general-1',
          consumption: 0,
          unit: material.planUnit,
        });
        break;
      case 'sizewise':
        style.availableSizes.forEach(size => {
          entries.push({
            id: `size-${size}`,
            size,
            consumption: 0,
            unit: material.planUnit,
          });
        });
        break;
      case 'colorwise':
        style.availableColors.forEach(color => {
          entries.push({
            id: `color-${color}`,
            color,
            consumption: 0,
            unit: material.planUnit,
          });
        });
        break;
      case 'sizecolor':
        style.availableSizes.forEach(size => {
          style.availableColors.forEach(color => {
            entries.push({
              id: `${size}-${color}`,
              size,
              color,
              consumption: 0,
              unit: material.planUnit,
            });
          });
        });
        break;
    }

    return entries;
  };

  const updateConsumption = (entryId: string, consumptionId: string, consumption: number) => {
    setBomEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              consumptions: entry.consumptions.map(c =>
                c.id === consumptionId ? { ...c, consumption } : c
              )
            }
          : entry
      )
    );
  };

  const generateSubMaterials = (entry: BOMEntry): SubMaterial[] => {
    if (!style) return [];

    const subs: SubMaterial[] = [];
    const { material, planningType } = entry;

    switch (planningType) {
      case 'general':
        subs.push({
          id: `sub-${material.id}-general`,
          mainMaterialId: material.id,
          code: material.code,
          name: material.name,
          prefixes: { style: false, size: false, color: false },
        });
        break;
      case 'sizewise':
        style.availableSizes.forEach(size => {
          subs.push({
            id: `sub-${material.id}-${size}`,
            mainMaterialId: material.id,
            code: `${material.code}-${size}`,
            name: `${material.name} - ${size}`,
            prefixes: { style: false, size: true, color: false },
            size,
          });
        });
        break;
      case 'colorwise':
        style.availableColors.forEach(color => {
          subs.push({
            id: `sub-${material.id}-${color}`,
            mainMaterialId: material.id,
            code: `${material.code}-${color}`,
            name: `${material.name} - ${color}`,
            prefixes: { style: false, size: false, color: true },
            color,
          });
        });
        break;
      case 'sizecolor':
        style.availableSizes.forEach(size => {
          style.availableColors.forEach(color => {
            subs.push({
              id: `sub-${material.id}-${size}-${color}`,
              mainMaterialId: material.id,
              code: `${material.code}-${size}-${color}`,
              name: `${material.name} - ${size} ${color}`,
              prefixes: { style: false, size: true, color: true },
              size,
              color,
            });
          });
        });
        break;
    }

    return subs;
  };

  const updateSubMaterialPrefix = (entryId: string, subId: string, prefix: 'style' | 'size' | 'color', value: boolean) => {
    setBomEntries(prev =>
      prev.map(entry => {
        if (entry.id === entryId) {
          const updatedSubMaterials = entry.subMaterials.map(sub => {
            if (sub.id === subId) {
              const updatedPrefixes = { ...sub.prefixes, [prefix]: value };
              
              let newCode = entry.material.code;
              let newName = entry.material.name;
              
              if (updatedPrefixes.style) {
                newCode += `-${style?.styleCode}`;
                newName += ` - ${style?.styleCode}`;
              }
              if (updatedPrefixes.size && sub.size) {
                newCode += `-${sub.size}`;
                newName += ` - ${sub.size}`;
              }
              if (updatedPrefixes.color && sub.color) {
                newCode += `-${sub.color}`;
                newName += ` - ${sub.color}`;
              }
              
              return {
                ...sub,
                prefixes: updatedPrefixes,
                code: newCode,
                name: newName,
              };
            }
            return sub;
          });
          
          return { ...entry, subMaterials: updatedSubMaterials };
        }
        return entry;
      })
    );
  };

  const toggleAllPrefixes = (entryId: string, prefix: 'style' | 'size' | 'color', value: boolean) => {
    setBomEntries(prev =>
      prev.map(entry => {
        if (entry.id === entryId) {
          const updatedSubMaterials = entry.subMaterials.map(sub => {
            const updatedPrefixes = { ...sub.prefixes, [prefix]: value };
            
            let newCode = entry.material.code;
            let newName = entry.material.name;
            
            if (updatedPrefixes.style) {
              newCode += `-${style?.styleCode}`;
              newName += ` - ${style?.styleCode}`;
            }
            if (updatedPrefixes.size && sub.size) {
              newCode += `-${sub.size}`;
              newName += ` - ${sub.size}`;
            }
            if (updatedPrefixes.color && sub.color) {
              newCode += `-${sub.color}`;
              newName += ` - ${sub.color}`;
            }
            
            return {
              ...sub,
              prefixes: updatedPrefixes,
              code: newCode,
              name: newName,
            };
          });
          
          return { ...entry, subMaterials: updatedSubMaterials };
        }
        return entry;
      })
    );
  };

  const removeBOMEntry = (entryId: string) => {
    setBomEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const getSelectedConsumption = (entryId: string) => {
    const selectedId = selectedConsumptions[entryId];
    if (!selectedId) return null;
    
    const entry = bomEntries.find(e => e.id === entryId);
    return entry?.consumptions.find(c => c.id === selectedId) || null;
  };

  const applyConsumptionToAll = (entryId: string) => {
    const selectedConsumption = getSelectedConsumption(entryId);
    if (!selectedConsumption || selectedConsumption.consumption <= 0) return;

    setBomEntries(prev =>
      prev.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            consumptions: entry.consumptions.map(consumption => ({
              ...consumption,
              consumption: selectedConsumption.consumption
            }))
          };
        }
        return entry;
      })
    );
  };

  const applyConsumptionToSizes = (entryId: string) => {
    const selectedConsumption = getSelectedConsumption(entryId);
    if (!selectedConsumption || selectedConsumption.consumption <= 0 || !selectedConsumption.size) return;

    setBomEntries(prev =>
      prev.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            consumptions: entry.consumptions.map(consumption => {
              // Apply to all entries that have the same size
              if (consumption.size === selectedConsumption.size) {
                return { ...consumption, consumption: selectedConsumption.consumption };
              }
              return consumption;
            })
          };
        }
        return entry;
      })
    );
  };

  const applyConsumptionToColors = (entryId: string) => {
    const selectedConsumption = getSelectedConsumption(entryId);
    if (!selectedConsumption || selectedConsumption.consumption <= 0 || !selectedConsumption.color) return;

    setBomEntries(prev =>
      prev.map(entry => {
        if (entry.id === entryId) {
          return {
            ...entry,
            consumptions: entry.consumptions.map(consumption => {
              // Apply to all entries that have the same color
              if (consumption.color === selectedConsumption.color) {
                return { ...consumption, consumption: selectedConsumption.consumption };
              }
              return consumption;
            })
          };
        }
        return entry;
      })
    );
  };

  const handleGenerateAllSubMaterials = () => {
    setBomEntries(prev =>
      prev.map(entry => ({
        ...entry,
        subMaterials: generateSubMaterials(entry)
      }))
    );
  };

  const handleNext = () => {
    if (activeStep === 2) {
      handleGenerateAllSubMaterials();
    }
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSave = async () => {
    if (!style) return;

    try {
      setLoading(true);
      
      const bomPlan: BOMPlan = {
        id: `bom-${style.id}`,
        styleId: style.id,
        bomEntries,
        totalCost: 0, // Calculate based on consumptions and costs
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(`bom_plan_${style.id}`, JSON.stringify(bomPlan));
      onBOMSaved(style.id);
      onClose();
    } catch (error) {
      console.error('Error saving BOM:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setBomEntries([]);
    setCurrentEditingEntry(null);
    setSelectedMaterial(null);
    setTempPlanningType('general');
    setNotes('');
    onClose();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              BOM Overview
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              Create a comprehensive Bill of Materials with multiple raw materials. Each material can have its own planning approach.
            </Alert>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current BOM Materials ({bomEntries.length})
                </Typography>
                
                {bomEntries.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No materials added yet. Use the next step to add materials.
                  </Typography>
                ) : (
                  <List>
                    {bomEntries.map((entry, index) => (
                      <ListItem key={entry.id}>
                        <ListItemText
                          primary={`${entry.material.code} - ${entry.material.name}`}
                          secondary={`Planning: ${entry.planningType} | ${entry.consumptions.length} consumption entries`}
                        />
                        <ListItemSecondaryAction>
                          <Chip 
                            label={entry.planningType} 
                            size="small" 
                            color="primary"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Add/Manage Materials
            </Typography>
            
            {/* Add New Material Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add New Material to BOM
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Autocomplete
                    options={rawMaterials.filter(rm => !bomEntries.find(entry => entry.materialId === rm.id))}
                    getOptionLabel={(option) => `${option.code} - ${option.name}`}
                    value={selectedMaterial}
                    onChange={(_, value) => setSelectedMaterial(value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Raw Material" fullWidth />
                    )}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => setOpenAddMaterial(true)}
                  >
                    Add New Material
                  </Button>
                </Box>

                {selectedMaterial && (
                  <Box>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1">{selectedMaterial.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Code: {selectedMaterial.code} | Category: {selectedMaterial.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Plan Unit: {selectedMaterial.planUnit} | Purchase Unit: {selectedMaterial.purchaseUnit}
                        </Typography>
                      </CardContent>
                    </Card>

                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                      <FormLabel component="legend">Planning Type for {selectedMaterial.name}</FormLabel>
                      <RadioGroup
                        value={tempPlanningType}
                        onChange={(e) => setTempPlanningType(e.target.value as any)}
                      >
                        <FormControlLabel
                          value="general"
                          control={<Radio />}
                          label="General - Single consumption"
                        />
                        <FormControlLabel
                          value="sizewise"
                          control={<Radio />}
                          label="Size-wise - Different per size"
                        />
                        <FormControlLabel
                          value="colorwise"
                          control={<Radio />}
                          label="Color-wise - Different per color"
                        />
                        <FormControlLabel
                          value="sizecolor"
                          control={<Radio />}
                          label="Size & Color-wise - Different per combination"
                        />
                      </RadioGroup>
                    </FormControl>

                    <Button
                      variant="contained"
                      onClick={handleAddBOMEntry}
                      startIcon={<Add />}
                    >
                      Add to BOM
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Current Materials List */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Materials in BOM
                </Typography>
                
                {bomEntries.map((entry) => (
                  <Card key={entry.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1">
                            {entry.material.code} - {entry.material.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Planning: {entry.planningType} | Consumption entries: {entry.consumptions.length}
                          </Typography>
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => removeBOMEntry(entry.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configure Consumption for Each Material
            </Typography>
            
            {bomEntries.map((entry) => (
              <Accordion key={entry.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">
                    {entry.material.code} - {entry.material.name} ({entry.planningType})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Apply Section */}
                  <Card sx={{ mb: 3, bgcolor: 'rgba(25, 118, 210, 0.04)' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Apply Selected Consumption
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => applyConsumptionToAll(entry.id)}
                          disabled={!selectedConsumptions[entry.id]}
                        >
                          Apply to All
                        </Button>
                        {entry.planningType.includes('size') && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => applyConsumptionToSizes(entry.id)}
                            disabled={!selectedConsumptions[entry.id] || !getSelectedConsumption(entry.id)?.size}
                          >
                            Apply to Same Size
                          </Button>
                        )}
                        {entry.planningType.includes('color') && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => applyConsumptionToColors(entry.id)}
                            disabled={!selectedConsumptions[entry.id] || !getSelectedConsumption(entry.id)?.color}
                          >
                            Apply to Same Color
                          </Button>
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Select a row (radio button), enter consumption value, then click apply button to copy to related entries
                      </Typography>
                    </CardContent>
                  </Card>

                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">Select</TableCell>
                          {entry.planningType.includes('size') && <TableCell>Size</TableCell>}
                          {entry.planningType.includes('color') && <TableCell>Color</TableCell>}
                          <TableCell>Consumption</TableCell>
                          <TableCell>Unit</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {entry.consumptions.map((consumption) => (
                          <TableRow 
                            key={consumption.id}
                            sx={{
                              bgcolor: selectedConsumptions[entry.id] === consumption.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                            }}
                          >
                            <TableCell padding="checkbox">
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={selectedConsumptions[entry.id] === consumption.id}
                                    onChange={() => setSelectedConsumptions(prev => ({
                                      ...prev,
                                      [entry.id]: consumption.id
                                    }))}
                                    size="small"
                                  />
                                }
                                label=""
                                sx={{ margin: 0 }}
                              />
                            </TableCell>
                            {entry.planningType.includes('size') && (
                              <TableCell>
                                {consumption.size ? (
                                  <Chip label={consumption.size} size="small" color="primary" />
                                ) : '-'}
                              </TableCell>
                            )}
                            {entry.planningType.includes('color') && (
                              <TableCell>
                                {consumption.color ? (
                                  <Chip label={consumption.color} size="small" color="secondary" />
                                ) : '-'}
                              </TableCell>
                            )}
                            <TableCell>
                              <TextField
                                type="number"
                                value={consumption.consumption}
                                onChange={(e) => updateConsumption(entry.id, consumption.id, parseFloat(e.target.value) || 0)}
                                size="small"
                                inputProps={{ min: 0, step: 0.01 }}
                                sx={{ width: 100 }}
                              />
                            </TableCell>
                            <TableCell>{consumption.unit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configure Sub Materials & Prefixes
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Sub materials are generated based on each material's planning type. Configure prefixes to customize codes.
            </Alert>
            
            {bomEntries.map((entry) => (
              <Accordion key={entry.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">
                    {entry.material.name} Sub Materials ({entry.subMaterials.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Bulk Select Controls */}
                  <Card sx={{ mb: 3, bgcolor: 'rgba(76, 175, 80, 0.04)' }}>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Bulk Prefix Controls
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: 100, fontWeight: 500 }}>
                            Style Prefix:
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => toggleAllPrefixes(entry.id, 'style', true)}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => toggleAllPrefixes(entry.id, 'style', false)}
                          >
                            Unselect All
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: 100, fontWeight: 500 }}>
                            Size Prefix:
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => toggleAllPrefixes(entry.id, 'size', true)}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => toggleAllPrefixes(entry.id, 'size', false)}
                          >
                            Unselect All
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ minWidth: 100, fontWeight: 500 }}>
                            Color Prefix:
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => toggleAllPrefixes(entry.id, 'color', true)}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => toggleAllPrefixes(entry.id, 'color', false)}
                          >
                            Unselect All
                          </Button>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Quickly select or unselect all prefixes for this material
                      </Typography>
                    </CardContent>
                  </Card>

                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Generated Code</TableCell>
                          <TableCell>Material Name</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              Style Prefix
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              Size Prefix
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              Color Prefix
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {entry.subMaterials.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {sub.code}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {sub.name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <input
                                    type="checkbox"
                                    checked={sub.prefixes.style}
                                    onChange={(e) => updateSubMaterialPrefix(entry.id, sub.id, 'style', e.target.checked)}
                                  />
                                }
                                label=""
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <input
                                    type="checkbox"
                                    checked={sub.prefixes.size}
                                    onChange={(e) => updateSubMaterialPrefix(entry.id, sub.id, 'size', e.target.checked)}
                                  />
                                }
                                label=""
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                control={
                                  <input
                                    type="checkbox"
                                    checked={sub.prefixes.color}
                                    onChange={(e) => updateSubMaterialPrefix(entry.id, sub.id, 'color', e.target.checked)}
                                  />
                                }
                                label=""
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Complete BOM
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>BOM Summary</Typography>
                <Typography variant="body2">Total Materials: {bomEntries.length}</Typography>
                <Typography variant="body2">Total Consumption Entries: {bomEntries.reduce((sum, entry) => sum + entry.consumptions.length, 0)}</Typography>
                <Typography variant="body2">Total Sub Materials: {bomEntries.reduce((sum, entry) => sum + entry.subMaterials.length, 0)}</Typography>
              </CardContent>
            </Card>

            {bomEntries.map((entry) => (
              <Card key={entry.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{entry.material.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Planning: {entry.planningType} | Consumptions: {entry.consumptions.length} | Sub Materials: {entry.subMaterials.length}
                  </Typography>
                </CardContent>
              </Card>
            ))}

            <TextField
              label="BOM Notes"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add overall BOM notes..."
            />
          </Box>
        );

      default:
        return null;
    }
  };

  if (!style) return null;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Build color="primary" />
            <Box>
              <Typography variant="h6">
                Multi-Material BOM Planning - {style.styleCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {style.styleName} | {bomEntries.length} materials configured
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box sx={{ minHeight: 500 }}>
            {renderStepContent()}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Box sx={{ flex: 1 }} />
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForward />}
              disabled={activeStep === 1 && bomEntries.length === 0}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || bomEntries.length === 0}
              startIcon={<CheckCircle />}
            >
              {loading ? 'Saving...' : 'Save Complete BOM'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <AddRawMaterialDialog
        open={openAddMaterial}
        onClose={() => setOpenAddMaterial(false)}
        onAdd={handleAddRawMaterial}
      />
    </>
  );
};

export default BOMDialog;
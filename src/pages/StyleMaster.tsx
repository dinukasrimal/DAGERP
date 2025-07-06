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
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Build,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { Style } from '../types';
import { StyleService } from '../services/styleService';
import AddStyleDialog from '../components/orders/AddStyleDialog';
import BOMDialog from '../components/styles/BOMDialog';

const StyleMaster: React.FC = () => {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openBOMDialog, setOpenBOMDialog] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [styleBOMs, setStyleBOMs] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    loadStyles();
    loadStyleBOMs();
  }, []);

  const loadStyles = async () => {
    try {
      setLoading(true);
      const styleData = await StyleService.getAll();
      setStyles(styleData);
    } catch (error) {
      console.error('Error loading styles:', error);
      // Show fallback styles if service fails
      setStyles([
        {
          id: 'b483c7c4-581b-4975-abde-7525abd4fbee',
          styleCode: 'ST-001',
          styleName: 'Classic T-Shirt',
          description: 'Basic cotton t-shirt',
          availableSizes: ['S', 'M', 'L', 'XL'],
          availableColors: ['Red', 'Blue', 'Green', 'White'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'e7f5a1f8-931f-4829-a82f-ec3fdc624476',
          styleCode: 'ST-002',
          styleName: 'Polo Shirt',
          description: 'Cotton polo shirt',
          availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
          availableColors: ['Navy', 'White', 'Gray', 'Black'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadStyleBOMs = () => {
    // Load BOM status for each style from localStorage
    const savedBOMs = localStorage.getItem('styleBOMs');
    if (savedBOMs) {
      setStyleBOMs(JSON.parse(savedBOMs));
    }
  };

  const handleAddStyle = async (styleData: Omit<Style, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await StyleService.create(styleData);
      setOpenAddDialog(false);
      await loadStyles();
    } catch (error) {
      console.error('Error creating style:', error);
      // Add to local state even if service fails
      const newStyle: Style = {
        id: `temp-${Date.now()}`,
        ...styleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setStyles([...styles, newStyle]);
      setOpenAddDialog(false);
    }
  };

  const handleOpenBOM = (styleId: string) => {
    setSelectedStyleId(styleId);
    setOpenBOMDialog(true);
  };

  const handleBOMSaved = (styleId: string) => {
    const updatedBOMs = { ...styleBOMs, [styleId]: true };
    setStyleBOMs(updatedBOMs);
    localStorage.setItem('styleBOMs', JSON.stringify(updatedBOMs));
    setOpenBOMDialog(false);
    setSelectedStyleId(null);
  };

  const getSelectedStyle = () => {
    return styles.find(s => s.id === selectedStyleId) || null;
  };

  const getStylesWithBOM = () => {
    return Object.values(styleBOMs).filter(Boolean).length;
  };

  const getStylesWithoutBOM = () => {
    return styles.length - getStylesWithBOM();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Style Master
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage styles created in order management and their Bill of Materials (BOM)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAddDialog(true)}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Create New Style
        </Button>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {styles.length}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Total Styles
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {getStylesWithBOM()}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Styles with BOM
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {getStylesWithoutBOM()}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Styles without BOM
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Alert for styles without BOM */}
      {getStylesWithoutBOM() > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>{getStylesWithoutBOM()} styles</strong> don't have a BOM configured. 
          Click the BOM button to add materials and costs.
        </Alert>
      )}

      {/* Styles Table */}
      <Card>
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Styles from Order Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Styles created in order management with BOM management capabilities
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Style Code
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Style Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Available Colors
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Available Sizes
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    BOM Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {styles.map((style, index) => (
                  <TableRow 
                    key={style.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.04)',
                      },
                      '& td': {
                        borderBottom: index === styles.length - 1 ? 'none' : '1px solid',
                        borderColor: 'divider',
                        py: 2,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {style.styleCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {style.styleName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {style.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {style.availableColors.slice(0, 3).map((color) => (
                          <Chip
                            key={color}
                            label={color}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                        {style.availableColors.length > 3 && (
                          <Chip
                            label={`+${style.availableColors.length - 3}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {style.availableSizes.slice(0, 4).map((size) => (
                          <Chip
                            key={size}
                            label={size}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        ))}
                        {style.availableSizes.length > 4 && (
                          <Chip
                            label={`+${style.availableSizes.length - 4}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {styleBOMs[style.id] ? (
                        <Chip
                          icon={<CheckCircle />}
                          label="BOM Created"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      ) : (
                        <Chip
                          icon={<Warning />}
                          label="No BOM"
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={styleBOMs[style.id] ? "Edit BOM" : "Create BOM"}>
                        <Button
                          variant={styleBOMs[style.id] ? "contained" : "outlined"}
                          color={styleBOMs[style.id] ? "success" : "primary"}
                          size="small"
                          onClick={() => handleOpenBOM(style.id)}
                          startIcon={<Build />}
                          sx={{
                            minWidth: 100,
                            fontWeight: 500,
                          }}
                        >
                          BOM
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {styles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                        No styles found. Create styles in order management to see them here.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Add Style Dialog */}
      <AddStyleDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onAdd={handleAddStyle}
      />

      {/* BOM Dialog */}
      <BOMDialog
        open={openBOMDialog}
        onClose={() => {
          setOpenBOMDialog(false);
          setSelectedStyleId(null);
        }}
        style={getSelectedStyle()}
        onBOMSaved={handleBOMSaved}
      />
    </Box>
  );
};

export default StyleMaster;
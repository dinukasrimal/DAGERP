import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const InventoryManagement: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory Management
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Inventory & GRN Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Inventory management module will be implemented here. Features include:
        </Typography>
        <ul>
          <li>GRN (Goods Receipt Note) functionality</li>
          <li>Barcode generation and printing</li>
          <li>Roll/bundle management for fabrics</li>
          <li>Individual roll tracking with quantities</li>
          <li>Support for different units (KG, Meters, Pieces)</li>
          <li>Return goods handling</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default InventoryManagement;
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const BOMManagement: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        BOM Management
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Bill of Materials Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          BOM management module will be implemented here. Features include:
        </Typography>
        <ul>
          <li>BOM creation against Sales Orders</li>
          <li>Size-specific, color-specific, and combination BOM items</li>
          <li>Dual unit system (Plan Unit vs Purchase Unit)</li>
          <li>Sub-material creation with prefix system</li>
          <li>Automatic quantity calculations</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default BOMManagement;
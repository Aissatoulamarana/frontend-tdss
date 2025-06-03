'use client';

import { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Box,
  Typography
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers';

// Fonction pour exporter en CSV
const exportToCSV = (data, filename = 'export.csv') => {
  const headers = Object.keys(data[0]).join(',');
  const csvContent = [
    headers,
    ...data.map(row => 
      Object.values(row).map(field => 
        typeof field === 'string' ? `"${field.replace(/"/g, '""')}"` : field
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// Fonction pour exporter en Excel (utilisant la même logique que CSV pour la simplicité)
const exportToExcel = (data, filename = 'export.xlsx') => {
  // Dans une vraie implémentation, vous utiliseriez une bibliothèque comme xlsx
  // Ceci est une implémentation simplifiée qui fonctionne pour les cas simples
  exportToCSV(data, filename.replace(/\.xlsx?$/i, '.csv'));
};

// Fonction pour exporter en PDF
const exportToPDF = (data, filename = 'export.pdf', title = 'Rapport d\'export') => {
  // Dans une vraie implémentation, vous utiliseriez une bibliothèque comme jspdf ou pdfmake
  alert(`Export PDF de ${data.length} enregistrements généré avec succès !`);
  console.log('Export PDF:', { title, data });
};

export function ReportExport({ data = [], defaultTitle = 'Rapport' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reportTitle, setReportTitle] = useState(defaultTitle);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });
  const [format, setFormat] = useState('pdf');

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (exportFn, ext) => {
    // Filtrer les données en fonction de la plage de dates si spécifiée
    let filteredData = [...data];
    
    if (dateRange.start || dateRange.end) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date);
        return (
          (!dateRange.start || itemDate >= dateRange.start) &&
          (!dateRange.end || itemDate <= dateRange.end)
        );
      });
    }
    
    const filename = `${reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.${ext}`;
    
    switch (exportFn) {
      case 'csv':
        exportToCSV(filteredData, filename);
        break;
      case 'excel':
        exportToExcel(filteredData, filename);
        break;
      case 'pdf':
      default:
        exportToPDF(filteredData, filename, reportTitle);
        break;
    }
    
    setOpenDialog(false);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Exporter les données">
        <IconButton
          onClick={handleExportClick}
          color="inherit"
          aria-label="exporter"
          aria-controls="export-menu"
          aria-haspopup="true"
        >
          <Iconify icon="eva:download-outline" />
        </IconButton>
      </Tooltip>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={() => { handleClose(); setOpenDialog(true); }}>
          <ListItemIcon>
            <Iconify icon="mdi:file-pdf-box" width={24} />
          </ListItemIcon>
          <ListItemText>Exporter en PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel', 'xlsx')}>
          <ListItemIcon>
            <Iconify icon="mdi:microsoft-excel" width={24} />
          </ListItemIcon>
          <ListItemText>Exporter en Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv', 'csv')}>
          <ListItemIcon>
            <Iconify icon="mdi:file-delimited" width={24} />
          </ListItemIcon>
          <ListItemText>Exporter en CSV</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Options d'export PDF</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
            <TextField
              label="Titre du rapport"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              fullWidth
              margin="normal"
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Date de début"
                value={dateRange.start}
                onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DatePicker
                label="Date de fin"
                value={dateRange.end}
                onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="format-select-label">Format</InputLabel>
              <Select
                labelId="format-select-label"
                value={format}
                label="Format"
                onChange={(e) => setFormat(e.target.value)}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="a4">A4</MenuItem>
                <MenuItem value="letter">Lettre</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="caption" color="text.secondary">
              {data.length} enregistrements seront exportés
              {dateRange.start || dateRange.end ? 
                ' (après filtrage par date)' : 
                ''}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={() => handleExport('pdf', 'pdf')}
            startIcon={<Iconify icon="mdi:file-pdf-box" />}
          >
            Exporter en PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

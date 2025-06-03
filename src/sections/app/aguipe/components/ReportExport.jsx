'use client';

/* eslint-disable import/no-extraneous-dependencies */

import { useState, useEffect } from 'react';
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
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fDate } from 'src/utils/format-time';

// Fonction pour formater les données pour l'export
const formatDataForExport = (data) => data.map((row) => {
  const formattedRow = {};
  Object.entries(row).forEach(([key, value]) => {
    // Formater les dates
    formattedRow[key] = value instanceof Date 
      ? fDate(value, 'dd/MM/yyyy HH:mm')
      : value;
  });
  return formattedRow;
});

// Fonction pour exporter en CSV
const exportToCSV = (data, filename = 'export.csv') => {
  try {
    // Formater les données
    const formattedData = formatDataForExport(data);
    
    // Créer le contenu CSV
    const headers = Object.keys(formattedData[0] || {});
    const csvContent = [
      headers.join(','),
      ...formattedData.map((row) => headers
        .map((field) => {
          const value = row[field];
          // Échapper les guillemets et les retours à la ligne
          const escaped = String(value ?? '').replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
      )
    ].join('\n');

    // Créer et déclencher le téléchargement
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    return false;
  }
};

// Fonction pour exporter en Excel
const exportToExcel = (data, filename = 'export.xlsx') => {
  try {
    // Formater les données
    const formattedData = formatDataForExport(data);
    
    // Créer un nouveau classeur
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);
    
    // Ajouter la feuille au classeur
    XLSX.utils.book_append_sheet(wb, ws, 'Données');
    
    // Générer le fichier Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Télécharger le fichier
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error);
    return false;
  }
};

// Fonction pour formater une date en chaîne lisible
const formatDateForExport = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('fr-FR');
  } catch (e) {
    console.error('Erreur de formatage de date:', e);
    return '';
  }
};

// Fonction pour exporter en PDF
const exportToPDF = (data, filename = 'export.pdf', dateRange = {}) => {
  try {
    // Formater les données
    const formattedData = data.map(item => {
      const formattedItem = {};
      Object.entries(item).forEach(([key, value]) => {
        // Convertir les dates en chaînes lisibles
        if (key.toLowerCase().includes('date') && value) {
          formattedItem[key] = formatDateForExport(value);
        } else {
          formattedItem[key] = value !== null && value !== undefined ? String(value) : '';
        }
      });
      return formattedItem;
    });

    // Créer un nouveau document PDF
    /* eslint-disable-next-line new-cap */
    const doc = new jsPDF();
    
    // Titre du document
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Rapport d\'export', 14, 22);
    
    // Sous-titre avec date
    doc.setFontSize(11);
    doc.setTextColor(100);
    
    let subtitle = `Généré le ${new Date().toLocaleDateString('fr-FR')}`;
    if (dateRange.start || dateRange.end) {
      const start = dateRange.start ? formatDateForExport(dateRange.start) : 'début';
      const end = dateRange.end ? formatDateForExport(dateRange.end) : 'aujourd\'hui';
      subtitle = `${subtitle} | Période: ${start} - ${end}`;
    }
    
    doc.text(subtitle, 14, 30);
    
    // Vérifier s'il y a des données à afficher
    if (formattedData.length === 0) {
      doc.setFontSize(12);
      doc.text('Aucune donnée à afficher', 14, 50);
      doc.save(filename);
      return true;
    }
    
    // Préparer les en-têtes du tableau
    const headers = Object.keys(formattedData[0] || {}).map(key => ({
      header: key,
      dataKey: key
    }));
    
    // Préparer les données du tableau
    const tableData = formattedData.map(row => 
      headers.map(header => row[header.dataKey] || '')
    );
    
    // Ajouter le tableau avec jspdf-autotable
    autoTable(doc, {
      head: [headers.map(h => h.header)],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineWidth: 0.1,
        overflow: 'linebreak',
        cellWidth: 'wrap',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 40 },
      didDrawPage: (data) => {
        // En-tête de page
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${data.pageNumber}`, 
          data.settings.margin.left, 
          doc.internal.pageSize.height - 10
        );
      }
    });
    
    // Enregistrer le PDF
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    return false;
  }
};

// Fonction pour formater une date pour le filtre
const formatDateForFilter = (date) => {
  if (!date) return null;
  try {
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d;
  } catch (e) {
    console.error('Erreur de formatage de date pour le filtre:', e);
    return null;
  }
};

export function ReportExport({ data = [], defaultTitle = 'Rapport' }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [reportTitle, setReportTitle] = useState(defaultTitle);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });
  const [format, setFormat] = useState('pdf');
  const [columns, setColumns] = useState([]);
  
  // Initialiser les colonnes disponibles
  useEffect(() => {
    if (data && data.length > 0) {
      const firstItem = data[0];
      const availableColumns = Object.keys(firstItem).map(key => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        selected: true
      }));
      setColumns(availableColumns);
    }
  }, [data]);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (exportType) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      setExportError('Aucune donnée à exporter');
      return;
    }
    
    try {
      setIsExporting(true);
      setExportError(null);
      
      // Filtrer les données en fonction de la plage de dates
      const filteredData = data.filter(item => {
        if (!dateRange?.start && !dateRange?.end) return true;
        
        try {
          const itemDate = item.date ? formatDateForFilter(item.date) : null;
          if (!itemDate) return false;
          
          const startDate = dateRange?.start ? formatDateForFilter(dateRange.start) : null;
          const endDate = dateRange?.end ? formatDateForFilter(dateRange.end) : null;
          
          // Réinitialiser les heures pour la comparaison
          if (startDate) startDate.setHours(0, 0, 0, 0);
          if (endDate) endDate.setHours(23, 59, 59, 999);
          
          return (
            (!startDate || itemDate >= startDate) &&
            (!endDate || itemDate <= endDate)
          );
        } catch (error) {
          console.error('Erreur lors du filtrage des dates:', error);
          return false;
        }
      });
      
      if (filteredData.length === 0) {
        throw new Error('Aucune donnée ne correspond aux critères de filtrage');
      }
      
      // Filtrer les colonnes sélectionnées
      const selectedColumns = columns.filter(col => col.selected).map(col => col.id);
      const filteredColumns = selectedColumns.length > 0 
        ? selectedColumns 
        : columns.map(col => col.id);
      
      // Filtrer les données pour ne garder que les colonnes sélectionnées
      const exportData = filteredData.map(item => {
        const filteredItem = {};
        filteredColumns.forEach(col => {
          if (item[col] !== undefined) {
            // Formater les dates pour l'export
            if (col.toLowerCase().includes('date') && item[col]) {
              filteredItem[col] = formatDateForExport(item[col]);
            } else {
              filteredItem[col] = item[col];
            }
          }
        });
        return filteredItem;
      });
      
      // Exporter selon le type
      let success = false;
      const exportFn = exportType.toLowerCase();
      const exportFilename = `export_${new Date().toISOString().split('T')[0]}.${exportFn}`;
      
      if (exportFn === 'csv') {
        success = exportToCSV(exportData, exportFilename);
      } else if (exportFn === 'xlsx') {
        success = exportToExcel(exportData, exportFilename);
      } else if (exportFn === 'pdf') {
        success = exportToPDF(exportData, exportFilename, dateRange);
      } else {
        throw new Error(`Format d'export non supporté: ${exportType}`);
      }
      
      if (!success) {
        throw new Error(`Échec de l'export ${exportFn.toUpperCase()}`);
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setExportError(error.message || 'Une erreur est survenue lors de l\'export');
    } finally {
      setIsExporting(false);
    }
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

      <Dialog open={openDialog} onClose={() => !isExporting && setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Options d'export</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {exportError && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setExportError(null)}>
                {exportError}
              </Alert>
            )}
            
            <TextField
              label="Titre du rapport"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              fullWidth
              margin="normal"
              disabled={isExporting}
            />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Période
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <DatePicker
                  label="Date de début"
                  value={dateRange.start}
                  onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: 'small',
                      disabled: isExporting
                    } 
                  }}
                />
                <DatePicker
                  label="Date de fin"
                  value={dateRange.end}
                  onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true,
                      size: 'small',
                      disabled: isExporting
                    } 
                  }}
                />
              </Box>
            </Box>
            
            {columns.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Colonnes à inclure
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 1,
                  maxHeight: 200,
                  overflowY: 'auto',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}>
                  {columns.map((column) => (
                    <Box key={column.id} sx={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        id={`col-${column.id}`}
                        checked={column.selected}
                        onChange={() => {
                          setColumns(columns.map(col => 
                            col.id === column.id 
                              ? { ...col, selected: !col.selected } 
                              : col
                          ));
                        }}
                        disabled={isExporting}
                        style={{ marginRight: 8 }}
                      />
                      <label htmlFor={`col-${column.id}`} style={{ fontSize: '0.875rem' }}>
                        {column.label}
                      </label>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="format-select-label">Format d'export</InputLabel>
              <Select
                labelId="format-select-label"
                value={format}
                label="Format d'export"
                onChange={(e) => setFormat(e.target.value)}
                disabled={isExporting}
                size="small"
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                <MenuItem value="csv">CSV (.csv)</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ 
              bgcolor: 'background.paper', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <Typography variant="body2" color="text.secondary">
                <strong>{data.length}</strong> enregistrements disponibles
                {dateRange.start || dateRange.end ? (
                  <span>
                    <br />
                    <strong>{data.filter(item => {
                      const itemDate = item.date ? new Date(item.date) : null;
                      if (!itemDate) return false;
                      const start = dateRange.start ? new Date(dateRange.start.setHours(0, 0, 0, 0)) : null;
                      const end = dateRange.end ? new Date(dateRange.end.setHours(23, 59, 59, 999)) : null;
                      return (
                        (!start || itemDate >= start) &&
                        (!end || itemDate <= end)
                      );
                    }).length}</strong> après filtrage par date
                  </span>
                ) : null}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            disabled={isExporting}
            color="inherit"
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={() => handleExport(format, format === 'excel' ? 'xlsx' : format === 'csv' ? 'csv' : 'pdf')}
            disabled={isExporting || data.length === 0}
            startIcon={
              isExporting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Iconify 
                  icon={
                    format === 'pdf' ? 'mdi:file-pdf-box' : 
                    format === 'excel' ? 'mdi:microsoft-excel' : 
                    'mdi:file-delimited'
                  } 
                />
              )
            }
          >
            {isExporting ? 'Export en cours...' : `Exporter en ${format.toUpperCase()}`}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={!!exportError}
        autoHideDuration={6000}
        onClose={() => setExportError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setExportError(null)} severity="error" sx={{ width: '100%' }}>
          {exportError}
        </Alert>
      </Snackbar>
    </>
  );
}

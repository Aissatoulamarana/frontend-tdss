import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  CircularProgress,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

const EXPORT_OPTIONS = [
  { value: 'pdf', label: 'PDF Document', icon: 'vscode-icons:file-type-pdf2' },
  { value: 'csv', label: 'CSV (Comma Separated)', icon: 'vscode-icons:file-type-csv' },
  { value: 'excel', label: 'Excel Spreadsheet', icon: 'vscode-icons:file-type-excel' },
  { value: 'zip', label: 'Archive ZIP', icon: 'vscode-icons:file-type-zip' },
];

export function ExportDialog({ open, onClose, onExport, isExporting = false }) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const handleExport = () => {
    onExport(selectedFormat);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Exporter le rapport</DialogTitle>

      <DialogContent dividers>
        <List sx={{ pt: 0 }}>
          {EXPORT_OPTIONS.map((option) => (
            <ListItem key={option.value} disablePadding>
              <ListItemButton
                onClick={() => setSelectedFormat(option.value)}
                selected={selectedFormat === option.value}
              >
                <ListItemIcon>
                  <Radio
                    checked={selectedFormat === option.value}
                    value={option.value}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemIcon>
                  <Iconify icon={option.icon} width={24} />
                </ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isExporting}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={isExporting}
          startIcon={
            isExporting ? <CircularProgress size={20} /> : <Iconify icon="eva:download-fill" />
          }
        >
          {isExporting ? 'Export en cours...' : 'Exporter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Typography,
  Divider,
  Stack,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function ColumnSelectorDialog({ open, onClose, columns, selectedColumns, onApply }) {
  const [localSelected, setLocalSelected] = useState(selectedColumns);

  const handleToggle = useCallback((columnKey) => {
    setLocalSelected((prev) => {
      if (prev.includes(columnKey)) {
        return prev.filter((key) => key !== columnKey);
      }
      return [...prev, columnKey];
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setLocalSelected(columns.map((col) => col.key));
  }, [columns]);

  const handleDeselectAll = useCallback(() => {
    setLocalSelected([]);
  }, []);

  const handleApply = useCallback(() => {
    onApply(localSelected);
    onClose();
  }, [localSelected, onApply, onClose]);

  const handleCancel = useCallback(() => {
    setLocalSelected(selectedColumns);
    onClose();
  }, [selectedColumns, onClose]);

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="eva:options-2-outline" width={24} />
          <Typography variant="h6">Sélectionner les colonnes</Typography>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon="eva:checkmark-square-2-fill" />}
              onClick={handleSelectAll}
            >
              Tout sélectionner
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon="eva:close-square-fill" />}
              onClick={handleDeselectAll}
            >
              Tout désélectionner
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {localSelected.length} colonne{localSelected.length !== 1 ? 's' : ''} sélectionnée
          {localSelected.length !== 1 ? 's' : ''}
        </Typography>

        <FormGroup>
          {columns.map((column) => (
            <FormControlLabel
              key={column.key}
              control={
                <Checkbox
                  checked={localSelected.includes(column.key)}
                  onChange={() => handleToggle(column.key)}
                />
              }
              label={column.label}
            />
          ))}
        </FormGroup>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Annuler
        </Button>
        <Button onClick={handleApply} variant="contained" disabled={localSelected.length === 0}>
          Appliquer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

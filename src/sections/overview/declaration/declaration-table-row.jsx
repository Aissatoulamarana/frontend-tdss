import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

export function DeclarationTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  onValidateRow,
  onFactureRow,
  onRejetRow,
}) {
  // Pour la suppression
  const deleteConfirm = useBoolean();
  // Pour la validation (exemple)
  const validateConfirm = useBoolean();
  // Pour la facturation (exemple)
  const factureConfirm = useBoolean();

  // Pour le dialogue de rejet
  const [openRejetDialog, setOpenRejetDialog] = useState(false);
  const [motifRejet, setMotifRejet] = useState('');

  const popover = usePopover();

  // Handler pour le rejet, après validation du motif
  const handleConfirmRejet = () => {
    onRejetRow(motifRejet); // On passe le motif en paramètre
    setMotifRejet('');
    setOpenRejetDialog(false);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
          />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.reference}
                </Typography>
              }
            />
          </Stack>
        </TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell>{row.employee_count}</TableCell>
        <TableCell>
          <ListItemText
            primary={fDate(row.created_on)}
            secondary={fTime(row.created_on)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>
        <TableCell>{fCurrency(row.total_amount)}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'validée' && 'success') ||
              (row.status === 'soumise' && 'info') ||
              (row.status === 'brouillon' && 'warning') ||
              (row.status === 'rejetée' && 'error') ||
              'default'
            }
          >
            {row.status}
          </Label>
        </TableCell>
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            Voir
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Modifier
          </MenuItem>

          {!['validée', 'facturée', 'rejetée'].includes(row.status) && (
            <MenuItem
              onClick={() => {
                validateConfirm.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="mdi:check-bold" />
              Valider
            </MenuItem>
          )}

          {!['rejetée', 'facturée', 'validée'].includes(row.status) && (
            <MenuItem
              onClick={() => {
                setOpenRejetDialog(true);
                popover.onClose();
              }}
            >
              <Iconify icon="material-symbols:cancel" />
              Rejeter
            </MenuItem>
          )}

          {!['facturée', 'rejetée', 'brouillon', 'soumise'].includes(row.status) && (
            <MenuItem
              onClick={() => {
                factureConfirm.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="mdi:credit-card" />
              Facturer
            </MenuItem>
          )}

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              deleteConfirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* Boîte de dialogue de confirmation pour la suppression */}
      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title="Supprimer"
        content="Voulez-vous vraiment supprimer ?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteConfirm.onTrue(); // Pour fermer le dialogue
              onDeleteRow(); // Appelle la fonction de suppression
            }}
          >
            Supprimer
          </Button>
        }
      />

      {/* Exemple de boîte de dialogue de confirmation pour la validation */}
      <ConfirmDialog
        open={validateConfirm.value}
        onClose={validateConfirm.onFalse}
        title="Valider"
        content="Voulez-vous vraiment valider cette déclaration ?"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              validateConfirm.onFalse();
              onValidateRow();
            }}
          >
            Valider
          </Button>
        }
      />

      {/* Exemple de boîte de dialogue de confirmation pour la facturation */}
      <ConfirmDialog
        open={factureConfirm.value}
        onClose={factureConfirm.onFalse}
        title="Facturer"
        content="Voulez-vous vraiment facturer cette déclaration ?"
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              factureConfirm.onFalse();
              onFactureRow();
            }}
          >
            Facturer
          </Button>
        }
      />

      {/* Dialogue personnalisé pour le rejet avec motif */}
      <ConfirmDialog
        open={openRejetDialog}
        onClose={() => setOpenRejetDialog(false)}
        title="Rejeter"
        content={
          <TextField
            fullWidth
            label="Motif du rejet"
            multiline
            rows={3}
            value={motifRejet}
            onChange={(e) => setMotifRejet(e.target.value)}
          />
        }
        action={
          <Button
            variant="contained"
            color="error"
            disabled={!motifRejet.trim()}
            onClick={() => {
              // On passe le motif au parent via onRejetRow
              onRejetRow(motifRejet);
              setMotifRejet('');
              setOpenRejetDialog(false);
            }}
          >
            Rejeter
          </Button>
        }
      />

    </>
  );
}

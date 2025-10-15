'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

export function TableRowComPermit({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onViewRow,
  onValidateRow,
  onRejetRow,
  onSubmitRow,
  visibleColumns,
}) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  const validateConfirm = useBoolean();

  const rejetConfirm = useBoolean();
  const submitConfirm = useBoolean();
  const editConfirm = useBoolean();

  const [motifRejet, setMotifRejet] = useState('');

  const handleConfirmRejet = () => {
    onRejetRow(motifRejet); // On passe le motif en paramètre
    setMotifRejet('');
    rejetConfirm.onFalse();
  };

  const statusLabels = {
    unsubmitted: 'non soumise',
    submitted: 'soumise',
    rejected: 'rejetée',
    validated: 'validée',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'unsubmitted':
        return 'warning';
      case 'submitted':
        return 'info';
      case 'rejected':
        return 'error';
      case 'validated':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        tabIndex={-1}
        onClick={onViewRow}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <TableCell padding="checkbox">
          {/* <Checkbox id={row.slug} checked={selected} onClick={onSelectRow} /> */}
        </TableCell>

        {visibleColumns.includes('number') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.number}</TableCell>
        )}

        {visibleColumns.includes('reference') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.reference}</TableCell>
        )}

        {visibleColumns.includes('passport') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.passport_number}</TableCell>
        )}

        {visibleColumns.includes('name') && (
          <TableCell>
            <ListItemText
              primary={row?.first}
              secondary={row?.last}
              slotProps={{
                primary: { typography: 'body2', noWrap: true },
                secondary: { mt: 0.5, component: 'span', typography: 'caption' },
              }}
            />
          </TableCell>
        )}
        {visibleColumns.includes('phone') && <TableCell>{row.phone}</TableCell>}

        {visibleColumns.includes('sexe') && <TableCell>{row.sexe}</TableCell>}

        {visibleColumns.includes('country') && <TableCell>{row.country}</TableCell>}

        {visibleColumns.includes('function') && <TableCell>{row.function}</TableCell>}

        {visibleColumns.includes('entreprise') && <TableCell>{row.company}</TableCell>}

        {visibleColumns.includes('type') && <TableCell>{row.permis}</TableCell>}

        {visibleColumns.includes('statut') && (
          <TableCell>
            <Label variant="soft" color={getStatusColor(row.status)}>
              {statusLabels[row.status] || 'Inconnu'}
            </Label>
          </TableCell>
        )}
        <TableCell>
          <Stack direction="row" alignItems="center">
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={(e) => {
                e.stopPropagation(); // Empêche la propagation vers le TableRow
                popover.onOpen(e); // Passe l'événement à la fonction onOpen
              }}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {row.status === 'unsubmitted' && (
            <MenuItem
              onClick={() => {
                submitConfirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon="mdi:check-bold" />
              Soumettre
            </MenuItem>
          )}

          {row.status === 'submitted' && (
            <MenuItem
              onClick={() => {
                validateConfirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'success.main' }}
            >
              <Iconify icon="solar:check-bold" />
              Valider
            </MenuItem>
          )}

          {row.status === 'submitted' && (
            <MenuItem
              onClick={() => {
                rejetConfirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:check-bold" />
              Rejeter
            </MenuItem>
          )}

          {/* <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Supprimer
          </MenuItem> */}
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Etes vous sur de vouloir supprimer?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Supprimer
          </Button>
        }
      />

      <ConfirmDialog
        open={submitConfirm.value}
        onClose={submitConfirm.onFalse}
        title="Soumettre"
        content="Etes vous sur de vouloir soumettre ce dossier?"
        action={
          <Button variant="contained" color="success" onClick={onSubmitRow}>
            Soumettre
          </Button>
        }
      />

      <ConfirmDialog
        open={validateConfirm.value}
        onClose={validateConfirm.onFalse}
        title="Valider"
        content="Etes vous sur de vouloir valider ce dossier?"
        action={
          <Button variant="contained" color="success" onClick={onValidateRow}>
            Valider
          </Button>
        }
      />

      <ConfirmDialog
        open={rejetConfirm.value}
        onClose={rejetConfirm.onFalse}
        title="Rejeter"
        content={
          <TextField
            fullWidth
            label="Motif du rejet"
            multiline
            rows={3}
            value={motifRejet}
            onChange={(e) => setMotifRejet(e.target.value)}
            sx={{ mt: 1 }}
          />
        }
        action={
          <Button variant="contained" color="error" onClick={handleConfirmRejet}>
            Rejeter
          </Button>
        }
      />
    </>
  );
}

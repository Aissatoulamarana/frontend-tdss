import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

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
  const confirm = useBoolean();

  const popover = usePopover();

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
                  {row.declaration_number}
                </Typography>
              }
            />
          </Stack>
        </TableCell>

        <TableCell>{row.items_count}</TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.create_date)}
            secondary={fTime(row.create_date)}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell>{fCurrency(row.montant_facture)}</TableCell>

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
                onValidateRow();
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
                onRejetRow();
                popover.onClose();
              }}
            >
              <Iconify icon="material-symbols:cancel" />
              Rejetter
            </MenuItem>
          )}

          {!['facturée', 'rejetée', 'brouillon', 'soumise'].includes(row.status) && (
            <MenuItem
              onClick={() => {
                onFactureRow();
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
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Voulez-vous vraiment supprimer?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onTrue(); // Ferme la boîte de dialogue
              onDeleteRow(); // Appelle la fonction de suppression
            }}
          >
            Supprimer
          </Button>
        }
      />
    </>
  );
}
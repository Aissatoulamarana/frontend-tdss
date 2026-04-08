import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { getPenaltyStatusLabel, getPenaltyTypeLabel } from './penalite-filter-options';

// ----------------------------------------------------------------------

const STATUS_COLOR = {
  OPEN: 'warning',
  BILLED: 'success',
  PAID: 'success',
  CANCELLED: 'error',
  CANCELED: 'error',
  CLOSED: 'default',
};

function formatPenaltyAmount(amount, currencySign) {
  if (amount === null || amount === undefined || amount === '') {
    return '-';
  }

  const parsedAmount = Number(amount);

  if (Number.isNaN(parsedAmount)) {
    return [amount, currencySign].filter(Boolean).join(' ');
  }

  return [fNumber(parsedAmount), currencySign].filter(Boolean).join(' ');
}

export function PenaliteTableRow({ row, onBillRow, onCancelRow }) {
  const popover = usePopover();

  const displayName = row.company || row.employee_name || row.reference || 'P';
  const status = row.status?.toUpperCase() || '';
  const isOpen = status === 'OPEN';
  const isCancelled = ['CANCELLED', 'CANCELED'].includes(status);

  return (
    <>
      <TableRow hover>
        {/* Selection multiple desactivee pour l'instant, faute d'API bulk.
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.slug}`, 'aria-label': 'Row checkbox' }}
          />
        </TableCell>
        */}

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={displayName}>{displayName.charAt(0).toUpperCase()}</Avatar>

            <Typography variant="body2" noWrap>
              {row.reference || '-'}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{getPenaltyTypeLabel(row.type) || '-'}</TableCell>
        <TableCell>{row.company || '-'}</TableCell>
        <TableCell>{row.employee_name || '-'}</TableCell>
        <TableCell>{formatPenaltyAmount(row.amount, row.currency_sign)}</TableCell>
        <TableCell>{row.currency_sign || '-'}</TableCell>

        <TableCell>
          <Label variant="soft" color={STATUS_COLOR[status] || 'default'}>
            {getPenaltyStatusLabel(status) || '-'}
          </Label>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.created_on) || '-'}
            secondary={fTime(row.created_on) || '-'}
            slotProps={{
              primary: { typography: 'body2', noWrap: true },
              secondary: { mt: 0.5, component: 'span', typography: 'caption' },
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.infraction_date) || '-'}
            secondary={fTime(row.infraction_date) || '-'}
            slotProps={{
              primary: { typography: 'body2', noWrap: true },
              secondary: { mt: 0.5, component: 'span', typography: 'caption' },
            }}
          />
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
            disabled={!onBillRow || !isOpen}
            onClick={() => {
              onBillRow?.();
              popover.onClose();
            }}
          >
            <Iconify icon="mdi:credit-card" />
            Facturer
          </MenuItem>

          <MenuItem
            disabled={!onCancelRow || isCancelled}
            onClick={() => {
              onCancelRow?.();
              popover.onClose();
            }}
            sx={{ color: isCancelled ? 'text.disabled' : 'error.main' }}
          >
            <Iconify icon="solar:close-circle-bold" />
            Annuler
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

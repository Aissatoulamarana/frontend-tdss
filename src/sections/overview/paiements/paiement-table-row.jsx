import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PaiementTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const confirm = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} onClick={onViewRow} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox">
          {/* <Checkbox
            checked={selected}
            onClick={onSelectRow}
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
          /> */}
        </TableCell>
        <TableCell>{row.reference}</TableCell>


        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">


            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.numero_facture}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={onViewRow}
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                />
              }
            />
          </Stack>
        </TableCell>
        {/* <TableCell>{row.declaration_number}</TableCell> */}



        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">


            <ListItemText
              disableTypography
              primary={
                <Typography variant="body2" noWrap>
                  {row.payment_method}
                </Typography>
              }
              secondary={
                <Link
                  noWrap
                  variant="body2"
                  onClick={onViewRow}
                  sx={{ color: 'text.disabled', cursor: 'pointer' }}
                >


                </Link>
              }
            />
          </Stack>
        </TableCell>
        <TableCell>{row.payer}</TableCell>

        <TableCell>
          <ListItemText
            primary={
              <Typography variant='body2'>
                {`GNF ${row.amount}`}
              </Typography>
            }
            secondary={
              <Typography variant='body2'>
                {row.montantGnf}
              </Typography>
            } />

        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.date_paiement)}
            secondary={fTime(row.date_paiement)}
            slotProps={{
              primary: { typography: 'body2', noWrap: true },
              secondary: { mt: 0.5, component: 'span', typography: 'caption' }
            }} />
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
        </MenuList>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Payer"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Payer
          </Button>
        }
      />
    </>
  );
}
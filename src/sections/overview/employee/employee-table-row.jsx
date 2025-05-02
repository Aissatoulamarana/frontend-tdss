import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';


import { useBoolean } from 'src/hooks/use-boolean';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

// import { ClientQuickEditForm } from './client-quick-edit-form';

// ----------------------------------------------------------------------

export function EmployeeTableRow({
    row,
    selected,
    onViewRow,


}) {


    const popover = usePopover();



    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1} onClick={onViewRow} sx={{
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'action.hover',
                },
            }}>
                <TableCell padding="checkbox">

                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.reference}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.passport_number}</TableCell>
                <TableCell>
                    <Stack spacing={2} direction="row" alignItems="center">

                        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                            <Link color="inherit" onClick={onViewRow} sx={{ cursor: 'pointer' }} underline="hover">
                                {row.last}
                            </Link>
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                {row.first}
                            </Box>
                        </Stack>
                    </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.declaration_count}</TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.phone}</TableCell>


                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.job}</TableCell>


                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <IconButton
                            color={popover.open ? 'inherit' : 'default'}
                            onClick={(e) => {
                                e.stopPropagation(); // Empêche la propagation vers le TableRow
                                popover.onOpen(e);   // Passe l'événement à la fonction onOpen
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


        </>
    );
}
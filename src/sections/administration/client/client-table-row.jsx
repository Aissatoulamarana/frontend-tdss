import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';


import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

import { ClientQuickEditForm } from './client-quick-edit-form';

// ----------------------------------------------------------------------

export function ClientTableRow({
    row,
    selected,
    onEditRow,
    onSelectRow,
    onDeleteRow,
    onViewRow,
    onUpdateRow,

}) {
    const confirm = useBoolean();

    const popover = usePopover();

    const quickEdit = useBoolean();

    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1} onClick={onViewRow} sx={{
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'action.hover',
                },
            }}>
                <TableCell padding="checkbox">
                    {/* <Checkbox id={row.slug} checked={selected} onClick={onSelectRow} /> */}
                </TableCell>

                <TableCell>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <Avatar alt={row?.name} src={row.picture} />

                        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                            <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }} underline="hover">
                                {row.name}
                            </Link>
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                {row.email}
                            </Box>
                        </Stack>
                    </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.type}</TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.contact}</TableCell>


                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.location}</TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={
                            (row.status === 'ON' && 'success') ||
                            (row.status === 'pending' && 'warning') ||
                            (row.status === 'banned' && 'error') ||
                            'default'
                        }
                    >
                        {row.status === 'ON' ? 'Actif' : row.status === 'pending' ? 'En attente' : row.status === 'banned' ? 'Banni' : row.status}
                    </Label>
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Quick Edit" placement="top" arrow>
                            <IconButton
                                color={quickEdit.value ? 'inherit' : 'default'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    quickEdit.onTrue(e);
                                }}
                            >
                                <Iconify icon="solar:pen-bold" />
                            </IconButton>
                        </Tooltip>

                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={(e) => {
                            e.stopPropagation(); // Empêche la propagation vers le TableRow
                            popover.onOpen(e);   // Passe l'événement à la fonction onOpen
                        }}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow>


            <ClientQuickEditForm currentClient={row} open={quickEdit.value} onClose={quickEdit.onFalse} onUpdateRow={onUpdateRow} />

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuList>
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
        </>
    );
}
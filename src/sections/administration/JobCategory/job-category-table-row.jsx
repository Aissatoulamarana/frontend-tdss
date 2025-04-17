import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
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

import { JobCategoryQuickEditForm } from './job-category-quick-edit-form';

// ----------------------------------------------------------------------

export function JobCategoryTableRow({
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
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                <TableCell padding="checkbox">
                    {/* <Checkbox id={row.slug} checked={selected} onClick={onSelectRow} /> */}
                </TableCell>

                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                        <Link color="inherit" onClick={onViewRow} sx={{ cursor: 'pointer' }} underline="hover">
                            {row.name}
                        </Link>
                    </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.permit}</TableCell>

                {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.status}</TableCell> */}

                <TableCell >
                    <Label
                        variant="soft"
                        color={
                            (row.status === 'ON' && 'success') ||
                            (row.status === 'OFF' && 'error') ||
                            'default'
                        }
                    >
                        {row.status === 'ON' ? 'Actif' : 'Inactif'}
                    </Label>
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Quick Edit" placement="top" arrow>
                            <IconButton
                                color={quickEdit.value ? 'inherit' : 'default'}
                                onClick={quickEdit.onTrue}
                            >
                                <Iconify icon="solar:pen-bold" />
                            </IconButton>
                        </Tooltip>

                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                    </Stack>
                </TableCell>
            </TableRow>


            <JobCategoryQuickEditForm currentJobCategory={row} open={quickEdit.value} onClose={quickEdit.onFalse} onUpdateRow={onUpdateRow} />

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
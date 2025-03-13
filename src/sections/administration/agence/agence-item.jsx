import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';
// import Avatar from '@mui/material/Avatar';

// ----------------------------------------------------------------------

export function AgenceItem({ agence, onView, onEdit, onDelete }) {
    const popover = usePopover();

    return (
        <>
            <Card sx={{ position: 'relative', p: 2 }}>
                {/* Options du Popover */}
                <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Iconify icon="eva:more-vertical-fill" />
                </IconButton>

                <Stack sx={{ p: 3, pb: 2 }}>
                    {/* Nom de l'agence */}
                    <ListItemText
                        sx={{ mb: 1 }}
                        primary={agence.name}
                        secondary={agence.region.name}
                        primaryTypographyProps={{ typography: 'subtitle1', fontWeight: 600 }}
                        secondaryTypographyProps={{
                            mt: 1,
                            component: 'span',
                            typography: 'caption',
                            color: 'text.disabled',
                        }}
                    />

                    {/* Manager
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Manager
                    </Typography> */}

                    {/* Avatar et Infos du manager */}
                    {/* <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar
                            alt={agence?.manager_by?.first_name}
                            src={agence?.manager_by?.picture}
                            variant="rounded"
                            sx={{ width: 48, height: 48 }}
                        />
                        <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                <Iconify width={16} icon="solar:user-rounded-bold" />
                                {agence?.manager_by?.first_name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Iconify icon="ic:baseline-email" width={16} />
                                <Typography variant="caption" color="text.secondary">
                                    {agence?.manager_by?.email}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Iconify icon="akar-icons:phone" width={16} />
                                <Typography variant="caption" color="text.secondary">
                                    {agence?.manager_by?.phone}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack> */}

                </Stack>

                <Divider sx={{ borderStyle: 'dashed', my: 2 }} />
            </Card>

            {/* Popover des actions */}
            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            onEdit();
                        }}
                    >
                        <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
                        Modifier
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            popover.onClose();
                            onDelete();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
                        Supprimer
                    </MenuItem>
                </MenuList>
            </CustomPopover>
        </>
    );
}
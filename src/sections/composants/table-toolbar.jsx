import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useCallback } from 'react';

import { usePopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function TableToolbar({ filters, options, onResetPage }) {
    const popover = usePopover();

    const handleFilterName = useCallback(
        (event) => {
            onResetPage();
            filters?.setState({ name: event.target.value });
        },
        [filters, onResetPage]
    );

    const handleFilterRole = useCallback(
        (event) => {
            const newValue =
                typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

            onResetPage();
            filters?.setState({ profil: newValue });
        },
        [filters, onResetPage]
    );

    return (
        <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
        >
            {/* <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
                <InputLabel htmlFor="permission-filter-role-select-label">Profile</InputLabel>
                <Select
                    multiple
                    value={filters?.state?.profil}
                    onChange={handleFilterRole}
                    input={<OutlinedInput label="Role" />}
                    renderValue={(selected) => selected?.map((value) => value).join(', ')}
                    inputProps={{ id: 'permission-filter-role-select-label' }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                >
                    {options?.roles?.map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={filters?.state?.role?.includes(option)}
                            />
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}

            <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                <TextField
                    fullWidth
                    value={filters?.state?.name}
                    onChange={handleFilterName}
                    placeholder="recherche..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                    }}
                />


            </Stack>
        </Stack>
    );
}

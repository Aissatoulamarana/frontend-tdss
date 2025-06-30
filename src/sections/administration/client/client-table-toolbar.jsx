import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useCallback, useState } from 'react';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function ClientTableToolbar({ filters, options, onResetPage }) {
  const popover = usePopover();

  const [inputValue, setInputValue] = useState('');

  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      filters?.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        const { value } = event.target;

        if (filters.state.name !== value) {
          onResetPage();
          filters.setState({ name: event.target.value });
        }
      }
    },
    [filters, onResetPage]
  );

  const handleFilterLocation = useCallback(
    (event) => {
      onResetPage();
      filters?.setState({ location: event.target.value });
    },
    [filters, onResetPage]
  );

  const handleFilterRole = useCallback(
    (event) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters?.setState({ type: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="user-filter-role-select-label">Type</InputLabel>
          <Select
            // multiple
            value={filters.state.type}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Type" />}
            // renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'user-filter-role-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240, padding: 1 } } }}
          >
            {options?.roles?.map((option) => (
              <MenuItem key={option.slug} value={option.code}>
                {/* <Checkbox
                                    disableRipple
                                    size="small"
                                    checked={filters?.state?.type?.includes(option)}
                                /> */}
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="user-filter-location-select-label">Région</InputLabel>
          <Select
            // multiple
            value={filters.state.location}
            onChange={handleFilterLocation}
            input={<OutlinedInput label="Région" />}
            // renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'user-filter-location-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240, padding: 1 } } }}
          >
            {options?.regions?.map((option) => (
              <MenuItem key={option.slug} value={option.code}>
                {/* <Checkbox
                                    disableRipple
                                    size="small"
                                    checked={filters?.state?.location?.includes(option)}
                                /> */}
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyUp}
            placeholder="recherche par nom..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        {/* <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Imprimer
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Importer
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Exporter
          </MenuItem>
        </MenuList> */}
      </CustomPopover>
    </>
  );
}

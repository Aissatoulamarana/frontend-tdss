'use client';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------

export function DeclarationTableToolbar({ filters, options, dateError, onResetPage, setSelectedFilter, selectedFilter }) {
  const popover = usePopover();
  const [titleInput, setTitleInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');



  const handleSelectFilter = (filterType) => {
    onResetPage();
    filters.setState({ title: '', company: '' });
    setSelectedFilter(filterType)
  };



  const handleFilterName = useCallback(
    (event) => {
      onResetPage();
      const value = event.target.value;
      filters.setState({ title: '', company: '' });
      filters.setState({ [selectedFilter]: value })
    },
    [filters, onResetPage]
  );



  const handleTitleKeyUp = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        const value = event.target.value;
        if (filters.state.title !== value) {
          onResetPage();
          filters.setState({ title: event.target.value });
          filters.setState((prev) => ({ ...prev, title: value, company: '' }));
        }
      }
    },
    [filters, onResetPage]
  );




  // Pour le champ "Entreprise"
  const handleCompanyKeyDown = (event) => {
    if (event.key === 'Enter') {
      const value = event.target.value;
      onResetPage();
      filters.setState({ company: event.target.value });
      filters.setState((prev) => ({ ...prev, company: companyInput }));
      // On peut déclencher fetchDeclarations ici ou laisser le useEffect le faire
    }
  };

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ startDate: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ endDate: newValue });
    },
    [filters, onResetPage]
  );



  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 }, position: 'relative' }}
      >


        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date debut"
            value={filters.state.endDate}
            onChange={handleFilterStartDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{ maxWidth: { md: 180 } }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date fin"
            value={filters.state.endDate}
            onChange={handleFilterEndDate}
            slotProps={{
              textField: {
                fullWidth: true,
                error: dateError,
                helperText: dateError ? 'End date must be later than start date' : null,
              },
            }}
            sx={{
              maxWidth: { md: 180 },
              [`& .${formHelperTextClasses.root}`]: {
                bottom: { md: -40 },
                position: { md: 'absolute' },
              },
            }}
          />
        </LocalizationProvider>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <Box sx={{ position: 'relative', flexGrow: 1, width: '100%' }} >
            <TextField
              fullWidth
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyUp={handleTitleKeyUp}
              placeholder="Rechercher par titre de la déclaration"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />

          </Box>



        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            onChange={(e) => setCompanyInput(e.target.value)}
            placeholder="Rechercher par nom de l'entreprise"
            onKeyDown={handleCompanyKeyDown}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }
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
        <MenuList>
          <MenuList>
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
          </MenuList>
        </MenuList>
      </CustomPopover>
    </>
  );
}

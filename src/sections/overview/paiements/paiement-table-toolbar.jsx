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
import { useCallback , useState } from 'react';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function PaiementTableToolbar({ filters, options, dateError, onResetPage }) {
  const popover = usePopover();

  const [nameInput, setNameInput] = useState('');

   const handleFilterPaymentMethod = useCallback(
      (event) => {
        const newValue =
          typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
  
        onResetPage();
        filters.setState({ payment_method: newValue });
      },
      [filters, onResetPage]
    );

  // const handleFilterName = useCallback(
  //   (event) => {
  //     if(event.key === 'Enter') {
  //       const value = event.target.value;
  //       console.log('Entrée détectée sur le filtre Nom avec la valeur :', value);
  //       if (filters.state.name !== value) {
  //         onResetPage();
  //         filters.setState({ name: event.target.value });
  //       }
  //     }
  //     // onResetPage();
  //     // filters.setState({ name: event.target.value });
  //   },
  //   [filters, onResetPage]
  // );


  const handleKeyUp = useCallback(
    (event) => {
      if(event.key === 'Enter') {
        const value = event.target.value;
        console.log('Entrée détectée sur le filtre Nom avec la valeur :', value);
        if (filters.state.name !== value) {
          onResetPage();
          filters.setState({ name: event.target.value });
        }
      }
      // onResetPage();
      // filters.setState({ name: event.target.value });
    },
    [filters, onResetPage]
  );

 
  const handleFilterStartDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ date_before: newValue });
    },
    [filters, onResetPage]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onResetPage();
      filters.setState({ date_after: newValue });
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
         <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel htmlFor="invoice-filter-service-select-label">Methode de Paiement</InputLabel>

          <Select
            multiple
            value={filters.state.payment_method} // Ajout de la prop `value`
            onChange={handleFilterPaymentMethod}
            input={<OutlinedInput label="Methode Paiement" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'invoice-filter-service-select-label' }}
            sx={{ textTransform: 'capitalize' }}
          >
            {options?.payment_method?.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.payment_method.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl> 
      

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date debut"
            value={filters.state.date_before}
            onChange={handleFilterStartDate}
            slotProps={{ textField: { fullWidth: true } }}
            sx={{ maxWidth: { md: 180 } }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date fin"
            value={filters.state.date_end}
            onChange={handleFilterEndDate}
            slotProps={{
              textField: {
                fullWidth: true,
                error: dateError,
                helperText: dateError ? 'La date de fin doit être postérieure à la date de début.' : null,
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
          <TextField
            fullWidth
            onChange={(e) => setNameInput(e.target.value)}
            value={nameInput}
            onKeyDown={handleKeyUp}
            placeholder="rechercher par nom ou prénom du payeur"
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

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
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

'use client';

import { formHelperTextClasses } from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useCallback } from 'react';
import { Iconify } from 'src/components/iconify';

export function DecReportToolbar({ filters, options, paymentOptions, dateError }) {
  const handleFilterStatus = useCallback(
    (event) => {
      const newValue = event.target.value;
      filters.setState({ status: newValue });
    },
    [filters]
  );

  const handleFilterPaymentMethod = useCallback(
    (event) => {
      const newValue = event.target.value;
      filters.setState({ paymentMethod: newValue });
    },
    [filters]
  );

  const handleFilterNumber = useCallback(
    (event) => {
      filters.setState({ number: event.target.value });
    },
    [filters]
  );

  const handleFilterCompany = useCallback(
    (event) => {
      filters.setState({ company: event.target.value });
    },
    [filters]
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      filters.setState({ startDate: newValue });
    },
    [filters]
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      filters.setState({ endDate: newValue });
    },
    [filters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
        <InputLabel htmlFor="invoice-filter-status-select">Statut</InputLabel>
        <Select
          value={filters.state.status}
          onChange={handleFilterStatus}
          input={<OutlinedInput label="Statut" />}
          inputProps={{ id: 'invoice-filter-status-select' }}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="all">Tous</MenuItem>
          {options.status.map((option) => (
            <MenuItem key={option?.value} value={option?.value}>
              {option?.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {filters?.paymentMethod ||
        (paymentOptions && (
          <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
            <InputLabel htmlFor="invoice-filter-payment-method-select">
              Methode de paiement
            </InputLabel>
            <Select
              value={filters.state.paymentMethod}
              onChange={handleFilterPaymentMethod}
              input={<OutlinedInput label="Moyen de paiement" />}
              inputProps={{ id: 'invoice-filter-payment-method-select' }}
              sx={{ textTransform: 'capitalize' }}
            >
              <MenuItem value="all">Tous</MenuItem>
              {paymentOptions?.paymentMethod?.map((option) => (
                <MenuItem key={option?.value} value={option?.value}>
                  {option?.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date début"
          value={filters.state.startDate}
          onChange={handleFilterStartDate}
          format="DD/MM/YYYY"
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />
      </LocalizationProvider>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date fin"
          value={filters.state.endDate}
          onChange={handleFilterEndDate}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              error: dateError,
              helperText: dateError ? 'La date de fin doit être après la date de début' : null,
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
          value={filters?.state?.number}
          onChange={handleFilterNumber}
          placeholder="Rechercher par numéro"
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

        <TextField
          fullWidth
          value={filters?.state?.company}
          onChange={handleFilterCompany}
          placeholder="Rechercher par entreprise"
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
      </Stack>
    </Stack>
  );
}

import { useCallback, useState, useEffect, useRef } from 'react'; // import hooks
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
import { Iconify } from 'src/components/iconify';

export function DecReportToolbar({ isFacture, filters, options, paymentOptions, dateError }) {
  // Local state for debounced inputs
  const [localNumber, setLocalNumber] = useState(filters.state.number || '');
  const [localCompany, setLocalCompany] = useState(filters.state.company || '');

  // Refs to track debounce timers
  const numberDebounceRef = useRef(null);
  const companyDebounceRef = useRef(null);

  // Handler for immediate state update on select changes (no debounce needed)
  const handleFilterStatus = useCallback(
    (event) => {
      filters.setState({ status: event.target.value });
    },
    [filters]
  );
  const handleFilterPaymentMethod = useCallback(
    (event) => {
      filters.setState({ paymentMethod: event.target.value });
    },
    [filters]
  );

  // Update local input state on typing
  const handleNumberChange = (event) => {
    setLocalNumber(event.target.value);
  };
  const handleCompanyChange = (event) => {
    setLocalCompany(event.target.value);
  };

  // Debounce effect for "number" field (2 second delay)
  useEffect(() => {
    if (numberDebounceRef.current) clearTimeout(numberDebounceRef.current);
    numberDebounceRef.current = setTimeout(() => {
      filters.setState({ number: localNumber });
    }, 1000);
    return () => clearTimeout(numberDebounceRef.current);
  }, [localNumber, filters]);

  // Debounce effect for "company" field (1 second delay)
  useEffect(() => {
    if (companyDebounceRef.current) clearTimeout(companyDebounceRef.current);
    companyDebounceRef.current = setTimeout(() => {
      filters.setState({ company: localCompany });
    }, 1000);
    return () => clearTimeout(companyDebounceRef.current);
  }, [localCompany, filters]);

  // onPaste handlers: prevent default and insert manually for immediate search
  const handleNumberPaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData('Text');
    setLocalNumber(pastedValue);
    filters.setState({ number: pastedValue });
    if (numberDebounceRef.current) {
      clearTimeout(numberDebounceRef.current);
      numberDebounceRef.current = null;
    }
  };
  const handleCompanyPaste = (event) => {
    event.preventDefault();
    const pastedValue = event.clipboardData.getData('Text');
    setLocalCompany(pastedValue);
    filters.setState({ company: pastedValue });
    if (companyDebounceRef.current) {
      clearTimeout(companyDebounceRef.current);
      companyDebounceRef.current = null;
    }
  };

  // --- NEW: Sync local inputs when filters.state is reset elsewhere ---
  // When the shared filters state clears (ex: onResetState from FiltersResult),
  // empty the local inputs and clear pending debounce timers so they don't reapply old values.
  useEffect(() => {
    if (!filters.state.number) {
      setLocalNumber('');
      if (numberDebounceRef.current) {
        clearTimeout(numberDebounceRef.current);
        numberDebounceRef.current = null;
      }
    }
  }, [filters.state.number]);

  useEffect(() => {
    if (!filters.state.company) {
      setLocalCompany('');
      if (companyDebounceRef.current) {
        clearTimeout(companyDebounceRef.current);
        companyDebounceRef.current = null;
      }
    }
  }, [filters.state.company]);
  // ------------------------------------------------------------------

  // Determine if the number is invalid (non-empty and not length 11)
  const numberError = localNumber.length > 0 && localNumber.length !== 11;

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      {/* Status filter (no change) */}
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
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Payment method filter (no change) */}
      {isFacture &&
        (filters.paymentMethod ||
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
                {paymentOptions.paymentMethod.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )))}

      {/* Date pickers (no change) */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date début"
          value={filters.state.created_on_before}
          onChange={(newValue) => filters.setState({ created_on_before: newValue })}
          format="DD/MM/YYYY"
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ maxWidth: { md: 180 } }}
        />
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date fin"
          value={filters.state.created_on_after}
          onChange={(newValue) => filters.setState({ created_on_after: newValue })}
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

      {/* Search inputs with debounce and adornment */}
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        {/* Number search with error handling and debounce */}
        <TextField
          fullWidth
          value={localNumber}
          onChange={handleNumberChange}
          onPaste={handleNumberPaste}
          placeholder="Rechercher par numéro"
          error={numberError}
          helperText={numberError ? 'Le nombre est incorrect' : ''}
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

        {/* Company search with debounce */}
        <TextField
          fullWidth
          value={localCompany}
          onChange={handleCompanyChange}
          onPaste={handleCompanyPaste}
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

import { useCallback, useState, useEffect, useRef } from 'react';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Autocomplete } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Iconify } from 'src/components/iconify';

import { CommonPersonFilters } from './common-filter';

const DEBOUNCE_DELAY = 1000;

const FILTER_PLACEHOLDERS = {
  passport_number: 'Recherche par Numéro de passeport',
  reference: 'Recherche par Référence',
  declaration_number: 'Recherche par Numéro de déclaration',
  card_number: 'Recherche par Numéro de carte',
  name: 'Recherche par Nom',
  company: "Rechercher par nom de l'entreprise",
};

const FILTER_OPTIONS = [
  { key: 'name', label: 'Nom' },
  { key: 'passport_number', label: 'Passport Number' },
  { key: 'reference', label: 'Reference' },
  { key: 'declaration_number', label: 'Numéro de déclaration' },
  { key: 'card_number', label: 'Numéro de permis' },
  { key: 'company', label: 'Entreprise' },
];

export function DecReportToolbar({
  isDeclaration,
  isFacture,
  isPaiement,
  isPermit,
  isEmployee,
  filters,
  options,
  paymentOptions,
  sexeOptions,
  jobOptions,
  countryOptions,
  permitTypeOptions,
  dateError,
  loading,
}) {
  // Local state pour les inputs avec debounce
  const [localInputs, setLocalInputs] = useState({
    number: filters.state.number || '',
    company: filters.state.company || '',
    client: filters.state.client || '',
    declaration_number: filters.state.declaration_number || '',
    reference: filters.state.reference || '',
    card_number: filters.state.card_number || '',
    passport_number: filters.state.passport_number || '',
    name: filters.state.name || '',
  });

  const [selectedFilter, setSelectedFilter] = useState('name');
  const [showOptions, setShowOptions] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Refs pour les timers de debounce
  const debounceTimers = useRef({});
  const inputRef = useRef(null);

  // Fonction générique pour gérer le debounce
  const createDebounceHandler = useCallback(
    (field) => (value) => {
      setLocalInputs((prev) => ({ ...prev, [field]: value }));

      if (debounceTimers.current[field]) {
        clearTimeout(debounceTimers.current[field]);
      }

      debounceTimers.current[field] = setTimeout(() => {
        filters.setState({ [field]: value });
      }, DEBOUNCE_DELAY);
    },
    [filters]
  );

  // Fonction générique pour gérer le paste
  const createPasteHandler = useCallback(
    (field) => (event) => {
      event.preventDefault();
      const pastedValue = event.clipboardData.getData('Text');
      setLocalInputs((prev) => ({ ...prev, [field]: pastedValue }));
      filters.setState({ [field]: pastedValue });

      if (debounceTimers.current[field]) {
        clearTimeout(debounceTimers.current[field]);
        debounceTimers.current[field] = null;
      }
    },
    [filters]
  );

  // Handlers pour chaque champ
  const handleNumberChange = useCallback(
    (e) => createDebounceHandler('number')(e.target.value),
    [createDebounceHandler]
  );

  const handleCompanyChange = useCallback(
    (e) => createDebounceHandler('company')(e.target.value),
    [createDebounceHandler]
  );

  const handleClientChange = useCallback(
    (e) => createDebounceHandler('client')(e.target.value),
    [createDebounceHandler]
  );

  // Handlers pour les selects (pas de debounce nécessaire)
  const handleFilterStatus = useCallback(
    (event) => {
      filters.setState({ status: event.target.value });
    },
    [filters]
  );

  const handleFilterPaymentMethod = useCallback(
    (event) => {
      filters.setState({ payment_method: event.target.value });
    },
    [filters]
  );

  const handleFilterSexe = useCallback(
    (event) => {
      filters.setState({ sexe: event.target.value });
    },
    [filters]
  );

  const handleFilterJob = useCallback(
    (event, value) => {
      filters.setState({ job: value });
    },
    [filters]
  );

  const handlefilterPermitType = useCallback(
    (event) => {
      filters.setState({ permit_type: event.target.value });
    },
    [filters]
  );

  const handleFilterCountry = useCallback(
    (event) => {
      filters.setState({ nationality: event.target.value });
    },
    [filters]
  );

  // Gestion du filtre multi-options (permit)
  const handleSelectFilter = useCallback(
    (filterType) => {
      filters.setState({
        card_number: '',
        reference: '',
        declaration_number: '',
        passport_number: '',
        name: '',
        company: '',
      });
      setSelectedFilter(filterType);
      setShowOptions(false);
      setInputValue('');
    },
    [filters]
  );

  // Fonction pour mapper le filtre sélectionné au champ de state correspondant
  const getFieldFromFilter = useCallback((filter) => {
    switch (filter) {
      case 'name':
        return 'name';
      case 'passport_number':
        return 'passport_number';
      case 'reference':
        return 'reference';
      case 'declaration_number':
        return 'declaration_number';
      case 'card_number':
        return 'card_number';
      case 'company':
        return 'company';
      default:
        return 'number';
    }
  }, []);

  // Ajoutez cet useEffect pour synchroniser l'inputValue avec le filtre actuel
  useEffect(() => {
    const currentField = getFieldFromFilter(selectedFilter);
    const currentValue = filters.state[currentField] || '';
    setInputValue(currentValue);
  }, [selectedFilter, filters.state, getFieldFromFilter]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      // Appliquer le debounce selon le filtre sélectionné
      const field = getFieldFromFilter(selectedFilter);

      if (debounceTimers.current[field]) {
        clearTimeout(debounceTimers.current[field]);
      }

      debounceTimers.current[field] = setTimeout(() => {
        filters.setState({ [field]: value });
      }, DEBOUNCE_DELAY);
    },
    [selectedFilter, filters, getFieldFromFilter]
  );

  const handlePaste = useCallback(
    (event) => {
      event.preventDefault();
      const pastedValue = event.clipboardData.getData('Text');
      setInputValue(pastedValue);

      // Mapper le filtre sélectionné au champ correspondant
      const field = getFieldFromFilter(selectedFilter);

      // Mettre à jour immédiatement sans debounce
      filters.setState({ [field]: pastedValue });

      // Annuler le timer de debounce en cours si existant
      if (debounceTimers.current[field]) {
        clearTimeout(debounceTimers.current[field]);
        debounceTimers.current[field] = null;
      }
    },
    [selectedFilter, filters, getFieldFromFilter]
  );

  // Synchronisation avec les resets externes
  useEffect(() => {
    const fields = Object.keys(localInputs);
    fields.forEach((field) => {
      if (!filters.state[field] && localInputs[field]) {
        setLocalInputs((prev) => ({ ...prev, [field]: '' }));
        if (debounceTimers.current[field]) {
          clearTimeout(debounceTimers.current[field]);
          debounceTimers.current[field] = null;
        }
      }
    });
  }, [filters.state]);

  // Cleanup des timers au démontage
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  // Gestion du clic en dehors pour fermer les options
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptions]);

  const numberError = localInputs.number.length > 0 && localInputs.number.length !== 11;

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      {/* Filtre Statut */}
      {!isEmployee && (
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 150 } }}>
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
      )}

      {/* Section Permit */}
      {(isPermit || isEmployee) && (
        <CommonPersonFilters
          filters={filters.state}
          onFiltersChange={filters.setState}
          jobOptions={jobOptions}
          countryOptions={countryOptions}
          sexeOptions={sexeOptions}
          permitTypeOptions={permitTypeOptions}
          loading={loading}
          isPermit={isPermit}
        />
      )}

      {/* Méthode de paiement */}
      {isPaiement && (
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
          <InputLabel>Méthode de paiement</InputLabel>
          <Select
            value={filters.state.payment_method}
            onChange={handleFilterPaymentMethod}
            input={<OutlinedInput label="Méthode de paiement" />}
            sx={{ textTransform: 'capitalize' }}
          >
            <MenuItem value="all">Tous</MenuItem>
            {paymentOptions?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Date pickers */}
      {!(isPermit || isEmployee) && (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date début"
              value={filters.state.created_on_after}
              onChange={(newValue) => filters.setState({ created_on_after: newValue })}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true } }}
              sx={{ maxWidth: { md: 180 } }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date fin"
              value={filters.state.created_on_before}
              onChange={(newValue) => filters.setState({ created_on_before: newValue })}
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
        </>
      )}

      {/* Champs de recherche */}
      {!(isPermit || isEmployee) && (
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={localInputs.number}
            onChange={handleNumberChange}
            onPaste={createPasteHandler('number')}
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

          {isDeclaration && (
            <TextField
              fullWidth
              value={localInputs.company}
              onChange={handleCompanyChange}
              onPaste={createPasteHandler('company')}
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
          )}

          {(isFacture || isPaiement) && (
            <TextField
              fullWidth
              value={localInputs.client}
              onChange={handleClientChange}
              onPaste={createPasteHandler('client')}
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
          )}
        </Stack>
      )}
    </Stack>
  );
}

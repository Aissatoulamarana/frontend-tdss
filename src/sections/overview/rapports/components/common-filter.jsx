import { useState, useRef, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import { Iconify } from 'src/components/iconify';
import OutlinedInput from '@mui/material/OutlinedInput';
import { usePopover } from 'src/components/custom-popover';

const DEBOUNCE_DELAY = 1000;
export function CommonPersonFilters({
  filters,
  onFiltersChange,
  jobOptions,
  countryOptions,
  sexeOptions,
  permitTypeOptions,
  loading,
  isPermit = false,
}) {
  const [selectedFilter, setSelectedFilter] = useState('name');
  const [showOptions, setShowOptions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debounceTimers = useRef({});
  const inputRef = useRef(null);

  // Options de filtre selon le type
  const getFilterOptions = () => {
    const baseOptions = [
      { key: 'name', label: 'Nom' },
      { key: 'passport_number', label: 'Numéro de passeport' },
      { key: 'reference', label: 'Reference' },
      { key: 'declaration_number', label: 'Numéro de déclaration' },
      { key: 'company', label: 'Entreprise' },
    ];

    if (isPermit) {
      baseOptions.splice(4, 0, { key: 'card_number', label: 'Numéro de permis' });
    }

    return baseOptions;
  };

  const FILTER_OPTIONS = getFilterOptions();

  const FILTER_PLACEHOLDERS = {
    passport_number: 'Recherche par Numéro de passeport',
    reference: 'Recherche par Référence',
    declaration_number: 'Recherche par Numéro de déclaration',
    card_number: 'Recherche par Numéro de carte',
    name: 'Recherche par Nom',
    company: "Rechercher par nom de l'entreprise",
  };

  const getFieldFromFilter = useCallback(
    (filter) => {
      const fieldMap = {
        name: 'name',
        passport_number: isPermit ? 'passport_number' : 'passport',
        reference: 'reference',
        declaration_number: 'declaration_number',
        card_number: 'card_number',
        company: 'company',
      };
      return fieldMap[filter] || 'name';
    },
    [isPermit]
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      const field = getFieldFromFilter(selectedFilter);

      if (debounceTimers.current[field]) {
        clearTimeout(debounceTimers.current[field]);
      }

      debounceTimers.current[field] = setTimeout(() => {
        onFiltersChange({ [field]: value });
      }, DEBOUNCE_DELAY);
    },
    [selectedFilter, onFiltersChange, getFieldFromFilter]
  );

  const handlePaste = useCallback(
    (event) => {
      event.preventDefault();
      const pastedValue = event.clipboardData.getData('Text');
      setInputValue(pastedValue);

      const field = getFieldFromFilter(selectedFilter);
      onFiltersChange({ [field]: pastedValue });

      if (debounceTimers.current[field]) {
        clearTimeout(debounceTimers.current[field]);
        debounceTimers.current[field] = null;
      }
    },
    [selectedFilter, onFiltersChange, getFieldFromFilter]
  );

  const handleSelectFilter = useCallback(
    (filterType) => {
      // Réinitialiser tous les champs de recherche
      const resetFields = {
        card_number: '',
        reference: '',
        declaration_number: '',
        passport_number: '',
        passport: '',
        name: '',
        company: '',
      };
      onFiltersChange(resetFields);
      setSelectedFilter(filterType);
      setShowOptions(false);
      setInputValue('');
    },
    [onFiltersChange]
  );

  // Handlers pour les selects
  const handleFilterPermitType = useCallback(
    (event) => onFiltersChange({ permit_type: event.target.value }),
    [onFiltersChange]
  );

  const handleFilterJob = useCallback(
    (event, value) => onFiltersChange({ job: value }),
    [onFiltersChange]
  );

  const handleFilterCountry = useCallback(
    (event) => onFiltersChange({ nationality: event.target.value }),
    [onFiltersChange]
  );

  const handleFilterSexe = useCallback(
    (event) => onFiltersChange({ sexe: event.target.value }),
    [onFiltersChange]
  );

  // Gestion du clic en dehors
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

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  useEffect(() => {
    const currentField = getFieldFromFilter(selectedFilter);
    const currentValue = filters[currentField] || '';
    setInputValue(currentValue);
  }, [selectedFilter, filters, getFieldFromFilter]);

  return (
    <>
      {/* Type Permis */}
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 120 } }}>
        <InputLabel>Type Permis</InputLabel>
        <Select
          value={filters.permit_type || 'all'}
          onChange={handleFilterPermitType}
          input={<OutlinedInput label="Type Permis" />}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="all">Tous</MenuItem>
          {permitTypeOptions?.map((option) => (
            <MenuItem key={option.slug} value={option.value}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Job Autocomplete */}
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 180 } }}>
        <Autocomplete
          options={jobOptions || []}
          getOptionLabel={(option) => option.label || ''}
          isOptionEqualToValue={(opt, val) => opt.value === val.value}
          loading={loading}
          onChange={handleFilterJob}
          fullWidth
          value={filters.job || null}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrer par fonction"
              placeholder="Tapez pour rechercher..."
            />
          )}
        />
      </FormControl>

      {/* Nationalité */}
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 130 } }}>
        <InputLabel>Nationalité</InputLabel>
        <Select
          value={filters.nationality || 'all'}
          onChange={handleFilterCountry}
          input={<OutlinedInput label="Nationalité" />}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="all">Tous</MenuItem>
          {countryOptions?.map((option) => (
            <MenuItem key={option.slug} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sexe */}
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 120 } }}>
        <InputLabel>Sexe</InputLabel>
        <Select
          value={filters.sexe || 'all'}
          onChange={handleFilterSexe}
          input={<OutlinedInput label="Sexe" />}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="all">Tous</MenuItem>
          {sexeOptions?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Barre de recherche */}
      <Box sx={{ position: 'relative', flexGrow: 1, width: '100%' }} ref={inputRef}>
        <TextField
          fullWidth
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(true)}
          onPaste={handlePaste}
          placeholder={FILTER_PLACEHOLDERS[selectedFilter] || 'Recherche'}
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
        {showOptions && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              mt: 1,
              zIndex: 1300,
              width: '100%',
              backgroundColor: 'background.paper',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 1,
              p: 1,
            }}
          >
            {FILTER_OPTIONS.map((option) => (
              <Chip
                key={option.key}
                label={option.label}
                color={selectedFilter === option.key ? 'primary' : 'default'}
                onClick={() => handleSelectFilter(option.key)}
              />
            ))}
            {selectedFilter !== 'name' && (
              <Chip label="✕" size="small" onClick={() => handleSelectFilter('name')} />
            )}
          </Paper>
        )}
      </Box>
    </>
  );
}

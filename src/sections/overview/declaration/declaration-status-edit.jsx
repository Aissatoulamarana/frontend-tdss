"use client";
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import axios from 'src/utils/axios';

import { Field } from 'src/components/hook-form';
import { useMockedUser } from 'src/auth/hooks';
import API from 'src/utils/api';


// ----------------------------------------------------------------------

export function DeclarationEditStatusDate({ type }) {
  const { watch, setValue, control } = useFormContext();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [open, setOpen] = useState(false);

  const user = useMockedUser();

  const values = watch();

  // Fonction pour rechercher des entreprises en fonction de la saisie (API réelle)
  const searchCompanies = useCallback(async (searchText) => {
    setLoading(true);
    try {
      // Utiliser l'API réelle avec des paramètres de recherche
      const params = searchText && searchText.length > 0 
        ? { search: searchText, limit: 10 }
        : { limit: 10 }; // Si pas de texte, charger les 10 premières entreprises
      
      const response = await axios.get(API.listEntreprises(params));
      
      // Transformer les données pour le format attendu par l'autocomplete
      const formattedCompanies = response.data.results.map((company) => ({
        value: company.slug,
        label: company.name,
        slug: company.slug,
      }));

      setCompanies(formattedCompanies);
    } catch (error) {
      console.error("Erreur lors de la recherche des entreprises:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une version debounced de la fonction de recherche
  // pour éviter trop d'appels API pendant la saisie
  const debouncedSearch = useCallback(
    debounce((text) => {
      searchCompanies(text);
    }, 400),
    [searchCompanies]
  );

  // Charger les entreprises initiales au chargement du composant (API réelle)
  useEffect(() => {
    const loadInitialCompanies = async () => {
      setLoading(true);
      try {
        // Utiliser l'API réelle pour charger les entreprises initiales
        const response = await axios.get(API.listEntreprises({ limit: 10 }));
        
        // Transformer les données pour le format attendu par l'autocomplete
        const initialCompanies = response.data.results.map(company => ({
          value: company.slug,
          label: company.name,
          slug: company.slug,
        }));

        setCompanies(initialCompanies);
      } catch (error) {
        console.error("Erreur lors du chargement initial des entreprises:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCompanies();
  }, []);

  // Handler pour la sélection d'une entreprise
  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue);
    // Fermer le menu après sélection
    setOpen(false);
    
    // Mettre à jour la valeur dans le formulaire
    if (newValue) {
      setValue('company', newValue.value);
    } else {
      setValue('company', '');
    }
  };

  // Handler pour la saisie dans le champ de recherche
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    
    // Si l'utilisateur tape quelque chose, ouvrir le menu
    if (newInputValue) {
      setOpen(true);
    }
    
    debouncedSearch(newInputValue);
  };

  // Handler pour le focus sur le champ
  const handleFocus = () => {
    // Ouvrir le menu au focus
    setOpen(true);
    
    // Si la liste est vide, charger les entreprises initiales
    if (companies.length === 0) {
      searchCompanies('');
    }
  };
  
  // Handler pour fermer le menu
  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      {/* {user.type_code === 'ENTREPRISE' && */}
      <Controller
        name="company"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            {...field}
            fullWidth
            options={companies}
            loading={loading}
            value={selectedCompany}
            inputValue={inputValue}
            onChange={handleCompanyChange}
            onInputChange={handleInputChange}
            onFocus={handleFocus}
            onClose={handleClose}
            open={open && companies.length > 0} // Contrôler l'ouverture du menu
            getOptionLabel={(option) => option.label || ''}
            isOptionEqualToValue={(option, value) => option.value === value?.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Entreprise *"
                placeholder="Rechercher une entreprise..."
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <MenuItem {...props} key={option.slug} value={option.value}>
                {option.label}
              </MenuItem>
            )}
            noOptionsText="Aucune entreprise trouvée"
            loadingText="Chargement..."
          />
        )}
      />
      {/* } */}

      <Field.Select
        disabled
        fullWidth
        name="status"
        label="Status"
        InputLabelProps={{ shrink: true }}
      >
        {['rejettée', 'soumise', 'validée', 'brouillon'].map((option) => (
          <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
            {option}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.Text

        name="title"
        label="Titre de la declaration *"
        InputLabelProps={{ shrink: true }}
      />

    </Stack>
  );
}

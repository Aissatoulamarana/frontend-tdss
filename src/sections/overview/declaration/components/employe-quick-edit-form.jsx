'use client';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { toast } from 'sonner';
import { z as zod } from 'zod';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField, Autocomplete } from '@mui/material';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import API from 'src/utils/api';
import axios from 'src/utils/axios';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const employeQuickEditSchema = zod.object({
  first: zod.string().min(1, { message: 'le prenom est obligatoire' }),
  last: zod.string().min(1, { message: 'le nom est obligatoire' }),
  passport_number: zod.string().min(1, { message: 'le numero de passeport est obligatoire' }),

  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),

  job: zod.string().min(1, { message: 'le type est requis!' }),
});

// ----------------------------------------------------------------------

export function EmployeeQuickEditForm({ currentEmployee, open, onClose, onUpdateRow, dec_slug }) {
  const user = useMockedUser();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(() => {
    const currentJobSlug =
      typeof currentEmployee?.job === 'object' ? currentEmployee?.job?.slug : currentEmployee?.job;

    return {
      first: currentEmployee?.first || '',
      last: currentEmployee?.last || '',
      passport_number: currentEmployee?.passport_number || '',
      phone: currentEmployee?.phone || '',
      job: currentJobSlug || '',
    };
  }, [currentEmployee]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(employeQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    let isMounted = true;

    async function fetchAllFonctions() {
      setLoading(true); // ✅ on affiche le loader

      try {
        // --- ÉTAPE 1 : Lecture cache session ---
        const cachedSession = sessionStorage.getItem('fonctions');
        let optionsToUse = cachedSession ? JSON.parse(cachedSession) : null;

        // console.log('🧠 Options depuis cache:', optionsToUse);

        // --- ÉTAPE 2 : Lecture cache localStorage si session vide ---
        if (!optionsToUse) {
          const cachedLocal = localStorage.getItem('fonctions');
          if (cachedLocal) {
            const parsedLocal = JSON.parse(cachedLocal);
            const localData = Array.isArray(parsedLocal) ? parsedLocal : parsedLocal.data || []; // ✅ robustesse

            if (localData.length > 0) {
              optionsToUse = localData;
              // Copie vers la session pour cette session de navigation
              sessionStorage.setItem('fonctions', JSON.stringify(localData));
            }
          }
        }

        // --- ÉTAPE 3 : Afficher immédiatement ce qu’on a ---
        if (optionsToUse && Array.isArray(optionsToUse)) {
          setOptions(optionsToUse);
        }

        // --- ÉTAPE 4 : Vérifier si on doit rafraîchir depuis l’API ---
        const cachedLocal = localStorage.getItem('fonctions');
        let shouldFetch = true;

        if (cachedLocal) {
          try {
            const parsedLocal = JSON.parse(cachedLocal);
            const lastFetch = parsedLocal.lastFetch || 0;
            const now = Date.now();
            // Moins de 24h => pas besoin de refetch
            if (now - lastFetch < 24 * 60 * 60 * 1000) {
              shouldFetch = false;
            }
          } catch {
            shouldFetch = true; // cache corrompu
          }
        }

        if (!shouldFetch) {
          setLoading(false);

          return;
        }

        // --- ÉTAPE 5 : Fetch complet depuis l’API ---
        const resp1 = await axios.get(API.listFonctionAgent(), {
          params: { offset: 0, limit: 100 },
        });

        const total = resp1?.data?.count ?? 0;

        const resp2 = await axios.get(API.listFonctionAgent(), {
          params: { offset: 0, limit: total || 100 },
        });

        if (!isMounted) return;

        const results = resp2?.data?.results || [];
        const uniqueBySlug = results
          .filter((f, idx, arr) => arr.findIndex((item) => item.slug === f.slug) === idx)
          .map((f) => ({
            label: f.name || f.label || 'Fonction inconnue',
            value: f.slug,
          }));

        // console.log('✅ Résultats API:', resp2.data);
        // console.log('✅ Options calculées:', uniqueBySlug);

        // --- ÉTAPE 6 : Sauvegarde cache ---
        const cachePayload = {
          data: uniqueBySlug,
          lastFetch: Date.now(),
        };

        localStorage.setItem('fonctions', JSON.stringify(cachePayload));
        sessionStorage.setItem('fonctions', JSON.stringify(uniqueBySlug));

        setOptions(uniqueBySlug);
      } catch (err) {
        console.error('Erreur lors du chargement des fonctions :', err);
        toast.error('Impossible de charger la liste des fonctions.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAllFonctions();

    return () => {
      isMounted = false;
    };
  }, []);

  const getModifiedFields = (originalData, newData) => {
    const modifiedFields = {};

    Object.keys(newData).forEach((key) => {
      let originalValue = originalData[key];

      // Adaptation spéciale pour job
      if (key === 'job' && typeof originalValue === 'object') {
        originalValue = originalValue?.slug;
      }

      if (newData[key] !== originalValue) {
        modifiedFields[key] = newData[key];
      }
    });

    return modifiedFields;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const modifiedData = getModifiedFields(currentEmployee, data);

      if (Object.keys(modifiedData).length === 0) {
        toast.info('Aucune modification détectée.');
        return;
      }

      // Création d'un FormData et ajout des champs modifiés
      const formData = new FormData();
      Object.keys(modifiedData).forEach((key) => {
        formData.append(key, modifiedData[key]);
      });

      // Ne pas définir manuellement le Content-Type pour laisser le navigateur gérer les délimitations
      const response = await axios.put(API.UpdateEmploye(dec_slug, currentEmployee?.slug), data);

      if (response) {
        toast.success('Mise à jour réussie !');
        window.location.reload();

        // Fusionner les données modifiées avec le client courant pour obtenir la version à jour
        const updatedEmployee = { ...currentEmployee, ...modifiedData };
        onUpdateRow(updatedEmployee);
        reset();
        onClose();
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour .');
      console.error('Erreur:', error.response?.data || error.message);
    }
  });

  // Obtenir la valeur actuelle de la fonction sélectionnée
  const currentJobValue = watch('job');
  const currentJobOption = options.find((option) => option.value === currentJobValue);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      slotProps={{ sx: { maxWidth: 720 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Mise à jour rapide</DialogTitle>

        <DialogContent>
          <Box
            mt={4}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <Field.Text name="passport_number" label="Numero du passeport " />
            <Field.Text name="last" label="Nom " />
            <Field.Text name="first" label="Prénom " />

            <Field.Phone name="phone" label="Numéro de Téléphone" />

            {/* Remplacement du Field.Select par Autocomplete */}
            <Autocomplete
              options={options}
              getOptionLabel={(opt) => opt.label}
              loading={loading}
              fullWidth
              value={currentJobOption || null}
              filterOptions={(opts, state) =>
                opts.filter((o) =>
                  o.label.toLowerCase().includes(state.inputValue.trim().toLowerCase())
                )
              }
              onChange={(e, option) => {
                if (option) {
                  setValue('job', option.value);
                } else {
                  setValue('job', '');
                }
              }}
              renderOption={(props, option, { index }) => (
                <li {...props} key={`${option.value}-${index}`}>
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Fonction *"
                  size="small"
                  fullWidth
                  error={!!methods.formState.errors.job}
                  helperText={methods.formState.errors.job?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading && <CircularProgress size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Retour
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Mettre à jour
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

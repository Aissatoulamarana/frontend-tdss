'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import API from 'src/utils/api';
import axios from 'src/utils/axios';
import { toast } from 'sonner';
import { Form } from 'src/components/hook-form';
import { Field } from 'src/components/hook-form';
import { Stack, MenuItem, Autocomplete, TextField, CircularProgress } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Controller } from 'react-hook-form';

export const NewInvoiceSchema = zod.object({
  company: zod.string().min(1, { message: "Veuillez selectionner l'entreprise !" }),
  title: zod.string(),
  status: zod.string(),
  reference: zod.string(),
});

export function DeclarationEdit({ declaration }) {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const router = useRouter();
  const loadingSend = useBoolean();

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewInvoiceSchema),
    defaultValues: {
      company: declaration?.company?.slug || '',
      status: declaration?.status || '',
      title: declaration?.title || '',
      reference: declaration?.reference || '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Réinitialiser le formulaire lorsque 'declaration' est chargée ou mise à jour
  useEffect(() => {
    if (declaration) {
      reset({
        company: declaration?.company?.slug,
        status: declaration?.status,
        title: declaration?.title,
        reference: declaration?.number,
      });
    }
  }, [declaration, reset]);

  // Charger les entreprises initiales au chargement du composant (API réelle)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchCompanies() {
      try {
        const resp1 = await axios.get(API.listEntreprises(), {
          params: { offset: 0, limit: 1 },
        });
        const total = resp1.data.count;

        const response = await axios.get(API.listEntreprises(), {
          params: { offset: 0, limit: total },
        });
        if (!isMounted) return;

        // Transformer les données pour le format attendu par l'autocomplete
        const initialCompanies = response.data.results.map((company) => ({
          value: company.slug,
          label: company.name,
          slug: company.slug,
        }));

        setEntreprises(initialCompanies);
      } catch (error) {
        console.error('Erreur lors du chargement initial des entreprises:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
    return () => {
      isMounted = false; // Nettoyage pour éviter les fuites de mémoire
    };
  }, []);

  // Récupération des entreprises pour le select
  // useEffect(() => {
  //   getEntreprises().then((data) => setEntreprises(data));
  // }, []);

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

  const handleUpdate = handleSubmit(async (data) => {
    loadingSend.onTrue();

    try {
      // Optionnel: simuler un délai
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { slug } = declaration;
      // Mise à jour de la déclaration via PATCH
      await axios.patch(API.updateDeclaration(slug), data, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Mise à jour réussie!');

      // Réinitialiser le formulaire après succès
      reset();
      router.push(paths.dashboard.declaration.list);
    } catch (error) {
      console.error("Erreur lors de l'envoi au backend:", error);
      if (error.response) {
        console.error('Erreur avec le serveur:', error.response.data);
        toast.error(
          `Erreur serveur: ${error.response.data?.message || 'Problème interne du serveur'}`
        );
      } else if (error.request) {
        console.error('Erreur avec la requête:', error.request);
        toast.error('Erreur de requête : Vérifiez votre connexion');
      } else {
        console.error('Erreur générale:', error.message);
        toast.error(`Erreur inconnue: ${error.message}`);
      }
    } finally {
      loadingSend.onFalse();
    }
  });

  return (
    <Form methods={methods}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
        {/* Ne pas passer la prop "value" afin de laisser react-hook-form gérer l'état */}
        <Field.Text
          size="large"
          name="reference"
          label="Numero declaration"
          InputLabelProps={{ shrink: true }}
          sx={{ width: '100%' }}
          disabled
        />
        {/* <Field.Select
          fullWidth
          name="company"
          label="Entreprise"
          placeholder="Veuillez selectionner l'entreprise dont vous déclarez"
        >
          {entreprises.map((company) => (
            <MenuItem key={company.slug} value={company.slug} sx={{ textTransform: 'capitalize' }}>
              {company.name}
            </MenuItem>
          ))}
        </Field.Select> */}

        <Controller
          name="company"
          control={methods.control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              fullWidth
              options={entreprises}
              loading={loading}
              open={open}
              value={entreprises.find((opt) => opt.value === field.value) || null}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
              onChange={(event, newValue) => {
                setSelectedCompany(newValue);
                field.onChange(newValue ? newValue.value : '');
              }}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, value) => option.value === value?.value}
              filterOptions={(options, state) =>
                options.filter((option) =>
                  option.label.toLowerCase().includes(state.inputValue.toLowerCase())
                )
              }
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
        <Field.Select fullWidth name="status" label="Status" InputLabelProps={{ shrink: true }}>
          {['rejected', 'submitted', 'validated', 'unsubmitted'].map((option) => (
            <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
              {option}
            </MenuItem>
          ))}
        </Field.Select>

        <Field.Text
          name="title"
          label="Titre de la declaration"
          InputLabelProps={{ shrink: true }}
        />
      </Stack>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleUpdate}
        >
          {declaration ? 'Mettre A jour' : 'Créer'}
        </LoadingButton>
      </Stack>
    </Form>
  );
}

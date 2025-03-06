'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid2 } from '@mui/material';
import Box from '@mui/material/Box';

import Card from '@mui/material/Card';

import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';

import axios from 'src/utils/axios';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { z as zod } from 'zod';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';



import API from 'src/utils/api';


import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({

  name: zod.string().min(1, { message: 'Le champ Nom est obligatoire!' }),
  region: zod.union([
    zod.string().min(1, { message: 'La région est requise et ne peut pas être vide !' }),
    zod.number()
  ]),

});

// ----------------------------------------------------------------------

export function AgenceNew({ currentAgence }) {
  const router = useRouter();
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState();

  const defaultValues = useMemo(
    () => ({
      name: currentAgence?.code || '',
      region: currentAgence?.region || '',

    }),
    [currentAgence]
  );

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    axios
      .get(API.listRegions())
      .then((response) => {
        console.log("Données reçues :", response.data); // 🔍 Vérifier les données reçues
        setRegions(response.data.results || response.data); // Adapter si c'est sous `results`
      })
      .catch((error) => {
        console.error("Erreur API :", error);
        setError("Impossible de récupérer les catégories");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axios.post(API.createAgence(), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      reset();
      toast.success(currentAgence ? 'Mis à jour effectué!' : "ajout d'une nouvelle agence reussie !");
      router.push(paths.dashboard.agence.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid2 container spacing={3}>

        <Grid2 size={{ xs: 6, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="name" label="Nom " placeholder="Veuillez entrez un nom" />


              <Field.Select
                name="region"
                label="Région"
                placeholder="Sélectionnez une région..."
              >
                {regions.map((region) => (
                  <MenuItem key={region.id} value={String(region.id)}>
                    {region.name}
                  </MenuItem>
                ))}
              </Field.Select>

            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentAgence ? "Ajouter" : 'Sauvegarder les changements'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid2>
      </Grid2>
    </Form>
  );
}
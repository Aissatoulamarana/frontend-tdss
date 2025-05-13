"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import axios from 'src/utils/axios';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z as zod } from 'zod';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import API from 'src/utils/api';

import { Form, Field } from 'src/components/hook-form';

export const NewJobSchema = zod.object({
  name: zod.string().min(1, { message: 'Le nom est requis !' }),
  category: zod.union([
    zod.string().min(1, { message: 'La catégorie est requise et ne peut pas être vide !' }),
    zod.number()
  ]),
});

export function JobNewEditForm({ currentJob }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API.listJobCategory())
      .then((response) => {
        console.log("Données reçues :", response.data); // 🔍 Vérifier les données reçues
        setCategories(response.data.results || response.data); // Adapter si c'est sous `results`
      })
      .catch((error) => {
        console.error("Erreur API :", error);
        setError("Impossible de récupérer les catégories");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const defaultValues = useMemo(
    () => ({
      name: currentJob?.name || '',
      category: currentJob?.category || '',
    }),
    [currentJob]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewJobSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentJob) {
      reset(currentJob); // Corrigé pour utiliser les valeurs directement
    }
  }, [currentJob]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let response;
      if (currentJob) {
        // Si un job existe, mettre à jour avec PATCH
        const { slug } = currentJob;
        response = await axios.patch(API.editFonction(slug), data, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Mise à jour réussie!');
      } else {
        // Si aucun job n'existe, créer un nouveau job avec POST
        response = await axios.post(API.createFonction(), data, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Création avec succès!');
      }

      reset(); // Réinitialiser les champs du formulaire
      console.log('Réponse API:', response.data);
      router.push(paths.dashboard.fonction.list); // Rediriger vers la page appropriée
    } catch (error) {
      console.error('Erreur lors de la soumission', error);
      toast.error('Une erreur est survenue');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <Card>
          <CardHeader title="Ajout Fonction" />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text
              name="name"
              label="Nom de la fonction *"
              placeholder="Ex: Développeur Logiciel..."
            />
            <Field.Select
              name="category"
              label="Catégorie *"
              placeholder="Sélectionnez une catégorie..."
            >
              {categories.map((category) => (
                <MenuItem key={category.slug} value={category.slug}>
                  {category.name}
                </MenuItem>
              ))}
            </Field.Select>
          </Stack>
        </Card>

        <Box display="flex" alignItems="center" flexWrap="wrap">
          <FormControlLabel
            control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
            label="Activer"
            sx={{ flexGrow: 1, pl: 3 }}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            sx={{ ml: 2 }}
          >
            {!currentJob ? 'Créer une Fonction' : 'Sauvegarder les changements'}
          </LoadingButton>
        </Box>
      </Stack>
    </Form>
  );
}

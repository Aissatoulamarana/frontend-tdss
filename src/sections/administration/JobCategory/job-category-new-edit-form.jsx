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

export const NewJobCategorySchema = zod.object({
  name: zod.string().min(1, { message: 'Le nom est requis !' }),
  permit: zod.union([
    zod.string().min(1, { message: 'Le permit est requis et ne peut pas être vide !' }),
    zod.number()
  ]),
  status: zod.enum(["ON", "OFF"], { message: "Le statut est requis !" }),
  comment: zod.string().optional(),
});

export function JobCategoryNewEditForm({ currentJobCategory }) {
  const router = useRouter();
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API.listPermits())
      .then((response) => {
        // console.log("Permits reçus :", response.data); // 🔍 Vérifier les données reçues
        setPermits(response.data.results); // Adapter si c'est sous `results`
      })
      .catch((error) => {
        console.error("Erreur API :", error);
        setError("Impossible de récupérer les permits");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const defaultValues = useMemo(
    () => ({
      name: currentJobCategory?.name || '',
      permit: currentJobCategory?.permit || '',
      status: currentJobCategory?.status || 'ON', // Valeur par défaut "ON"
      comment: currentJobCategory?.comment || '', // Valeur par défaut vide
    }),
    [currentJobCategory]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewJobCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentJobCategory) {
      reset(currentJobCategory);
    }
  }, [currentJobCategory]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let response;
      if (currentJobCategory) {
        // Si un jobCategory existe, mettre à jour avec PATCH
        const { id } = currentJobCategory;
        response = await axios.patch(API.editJobCategory(id), data, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Mise à jour réussie!');
      } else {
        // Si aucun jobCategory n'existe, créer un nouveau jobCategory avec POST
        response = await axios.post(API.createJobCategory(), data, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Création avec succès!');
      }

      reset(); // Réinitialiser les champs du formulaire
      console.log('Réponse API:', response.data);
      router.push(paths.dashboard.jobCategory.list); // Rediriger vers la page appropriée
    } catch (error) {
      console.error('Erreur lors de la soumission', error);
      toast.error('Une erreur est survenue');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        <Card>
          <CardHeader title="Ajout Fonction Professionnelle" />
          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Text
              name="name"
              label="Nom de la fonction professionnelle"
              placeholder="Ex: Développeur Logiciel..."
            />
            <Field.Select
              name="permit"
              label="Permit"
              placeholder="Sélectionnez un permit..."
            >
              {permits.map((permit) => (
                <MenuItem key={permit.slug} value={String(permit.slug)}>
                  {permit.name}
                </MenuItem>
              ))}
            </Field.Select>
             {/* Ajout du champ status */}
             <Field.Select name="status" label="Statut">
              <MenuItem value="ON">Actif</MenuItem>
              <MenuItem value="OFF">Inactif</MenuItem>
            </Field.Select>
            
            {/* Ajout du champ comment */}
            <Field.Text
              name="comment"
              label="Commentaire"
              placeholder="Ajoutez un commentaire..."
              multiline
              rows={3}
            />
          </Stack>
        </Card>

        <Box display="flex" alignItems="center" flexWrap="wrap">
          <FormControlLabel
            control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
            label="Publier"
            sx={{ flexGrow: 1, pl: 3 }}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            sx={{ ml: 2 }}
          >
            {!currentJobCategory ? 'Créer une Fonction Professionnelle' : 'Sauvegarder les changements'}
          </LoadingButton>
        </Box>
      </Stack>
    </Form>
  );
}

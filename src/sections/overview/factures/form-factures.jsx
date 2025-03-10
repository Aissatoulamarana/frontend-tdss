'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, Button, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'src/utils/axios';
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

import API from 'src/utils/api';


import { Form, Field } from 'src/components/hook-form';

// Define the Zod schema
const NewPayeurSchema = z.object({
  nom: z.string().min(1, { message: 'Le nom est obligatoire' }),
  prenom: z.string().min(1, { message: 'Le prénom est obligatoire' }),
  email: z.string().email({ message: 'Email invalide' }),
  telephone: z.string().min(1, { message: 'Le téléphone est obligatoire' }),
  pays: z.string().min(1, { message: 'Selectionnez un pays' }),
  devise: z.string().min(1, { message: 'La devise est obligatoire' }),
  numero_compte: z.string().min(1, { message: 'Le numéro de compte est obligatoire' }),


});



export function PayeurForm({ id }) {
  const [devises, setDevises] = useState([]);
  const [loading, setLoading] = useState();

  // Create a single form instance
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPayeurSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      devise: '',
      numero_compte: '',
      pays: '',
      facture_id: id || '', // Initialise avec id
    },
  });
  // Destructure the properties from the same form instance
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = methods;



  useEffect(() => {
    if (id) {
      setValue('facture_id', id); // Met à jour facture_id dynamiquement
      console.log(' id de la facture', id);
    }
  }, [id, setValue]);

  // Use useFieldArray with the same control instance
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });


  const onSubmit = handleSubmit(async (data) => {
    data.facture_id = id; // ✅ Forcer l'ajout si besoin

    console.log("Données envoyées:", data); // Vérification

    if (!data.facture_id) {
      console.error("Erreur : facture_id est manquant !");
      return;
    }

    try {
      const response = await axios.post(API.CreatePayeur(), data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Réponse du backend:', response.data);
      reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi au backend:", error);
    }
  });

  useEffect(() => {
    axios
      .get(API.listDevises())
      .then((response) => {
        console.log("Données reçues :", response.data); // 🔍 Vérifier les données reçues
        setDevises(response.data.results || response.data); // Adapter si c'est sous `results`
      })
      .catch((error) => {
        console.error("Erreur API :", error);
        setError("Impossible de récupérer les catégories");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Information du Payeur
      </Typography>
      {/* Wrap your form with FormProvider */}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Nom"
            {...register('nom')}
            error={Boolean(errors.nom)}
            helperText={errors.nom?.message}
            fullWidth
          />
          <TextField
            label="Prénom"
            {...register('prenom')}
            error={Boolean(errors.prenom)}
            helperText={errors.prenom?.message}
            fullWidth
          />
          <TextField
            label="Email"
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            fullWidth
          />
          <TextField
            label="Téléphone"
            {...register('telephone')}
            error={Boolean(errors.telephone)}
            helperText={errors.telephone?.message}
            fullWidth
          />
          <Field.Select
            name="devise"
            label="Devise"
            placeholder="Sélectionnez la devise avec la quelle vous effectuez le paiement "
          >
            {devises.map((devise) => (
              <MenuItem key={devise.id} value={String(devise.id)}>
                {devise.name}
              </MenuItem>
            ))}
          </Field.Select>
          <TextField
            select
            label="Moyen de Paiement"
            {...register('numero_compte')}
            error={Boolean(errors.numero_compte)}
            helperText={errors.numero_compte?.message}
            fullWidth
          >
            <MenuItem value="Virement">Virement</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
            <MenuItem value="Espèces">Espèces</MenuItem>
          </TextField>

          <TextField
            label="Reference"
            {...register('reference')}
            error={Boolean(errors.reference)}
            helperText={errors.reference?.message}
            fullWidth
          />

          <Field.CountrySelect
            fullWidth
            size="small"
            name="pays"
            label="Nationalité"
            placeholder="Selectionnez un pays"
            sx={{ width: '100%' }}
            inputlabelprops={{ shrink: true }}
          />

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Enregistrer
          </Button>
        </Stack>
      </Form>

    </Box>
  );
}

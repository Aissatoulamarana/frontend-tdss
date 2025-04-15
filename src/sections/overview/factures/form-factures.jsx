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
  last: z.string().min(1, { message: 'Le nom est obligatoire' }),
  first: z.string().min(1, { message: 'Le prénom est obligatoire' }),
  email: z.string().email({ message: 'Email est obligatoire' }),
  phone: z.string().min(1, { message: 'Le téléphone est obligatoire' }),
  country_origin: z.string().min(1, { message: 'Selectionnez un pays' }),
  employer: z.string().min(1, { message: "L'employeur est obligatoire" }),
  job: z.string().min(1, { message: 'La fonction est obligatoire' }),


});



export function PayeurForm({ slug }) {
  const [devises, setDevises] = useState([]);
  const [loading, setLoading] = useState();

  // Create a single form instance
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPayeurSchema),
    defaultValues: {
      last: '',
      first: '',
      email: '',
      phone: '',
      employer: '',
      job: '',
      country_origin: '',
      facture_id: slug || '', // Initialise avec id
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
    if (slug) {
      setValue('facture_id', slug); // Met à jour facture_id dynamiquement
      console.log(' id de la facture', slug);
    }
  }, [slug, setValue]);

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
            {...register('last')}
            error={Boolean(errors.last)}
            helperText={errors.last?.message}
            fullWidth
          />
          <TextField
            label="Prénom"
            {...register('first')}
            error={Boolean(errors.first)}
            helperText={errors.first?.message}
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
            {...register('phone')}
            error={Boolean(errors.phone)}
            helperText={errors.phone?.message}
            fullWidth
          />

          <TextField

            label="Entreprise"
            {...register('employer')}
            error={Boolean(errors.employer)}
            helperText={errors.employer?.message}
            fullWidth
          >

          </TextField>

          <TextField
            label="Fonction"
            {...register('job')}
            error={Boolean(errors.job)}
            helperText={errors.job?.message}
            fullWidth
          />

          <Field.CountrySelect
            fullWidth
            size="small"
            name="country_origin"
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

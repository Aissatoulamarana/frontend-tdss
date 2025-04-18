'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stack, Button, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'src/utils/axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import API from 'src/utils/api';
import { getDevises, getCountries } from 'src/utils/options';
import { Form, Field } from 'src/components/hook-form';

// Définition du schéma Zod sans payment_method
const NewPayeurSchema = z.object({
  payer_data: z.object({
    last: z.string().min(1, { message: 'Le nom est obligatoire' }),
    first: z.string().min(1, { message: 'Le prénom est obligatoire' }),
    email: z.string().email({ message: 'Email invalide' }),
    phone: z.string().min(1, { message: 'Le téléphone est obligatoire' }),
    country_origin: z.string(),
    address: z.string().min(1, { message: 'L’adresse est obligatoire' })
  }),
  payment_data: z.object({
    document: z
      .any()
      .refine(file => file instanceof File && file.type === 'application/pdf', {
        message: 'Le fichier doit être un PDF'
      }),
    payment_method: z.string().min(1, { message: 'Le mode de paiement est requis' }),
    devise: z.string().min(1, { message: 'La devise est requise' }),
    comment: z.string().optional()
  })
});

export function PayeurForm({ slug }) {
  const [devises, setDevises] = useState([]);
  const [countries, setCountries] = useState([]);

  const paymentTypes = [
    { id: 'Virement', label: 'Virement' },
    { id: 'Espèces', label: 'Espèces' },
    { id: 'Chèques', label: 'Chèques' }
  ];

  const defaultValues = useMemo(() => ({
    payer_data: {
      last: '',
      first: '',
      email: '',
      phone: '',
      country_origin: '',
      address: ''
    },
    payment_data: {
      document: null,
      devise: '',
      comment: '',
      payment_method: ''
    }
  }))

  // Initialisation du formulaire
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPayeurSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset
  } = methods;

  // Récupération des devises au montage
  useEffect(() => {
    getDevises().then(setDevises);
    getCountries().then(setCountries);
  }, []);



  const onSubmit = handleSubmit(async data => {
    try {

      const response = await axios.post(API.paidFacture(slug), data, {
        headers: { 'Content-Type': 'application/json' },
      });
      reset();
      if (response.data) {
        toast.success('Mise à jour réussie!');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi au backend :", error);
    }
  });



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Information du Payeur
      </Typography>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Field.Text
            label="Nom"
            name={"payer_data.last"}
          />

          <Field.Text
            label="Prénom"
            name={'payer_data.first'}

          />

          <Field.Text
            label="Email"
            name={'payer_data.email'}

          />


          <Field.Text
            label="Téléphone"
            name={'payer_data.phone'}

          />

          <Field.Text
            label="Adresse"
            name={'payer_data.address'}

          />


          <Field.Select
            fullWidth
            size="small"
            name="payer_data.country_origin"
            label="Nationalité"
            placeholder="Sélectionnez un pays"
            inputlabelprops={{ shrink: true }}
          >
            {countries.map((c) => (
              <MenuItem key={c.slug} value={c.slug} >
                {d.name}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Select
            name="payment_data.devise"
            label="Devise"
          >
            {devises.map((d) => (
              <MenuItem key={d.slug} value={d.slug}>
                {d.name}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Upload
            name="payment_data.document"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
            )}
          />


          <Field.Select
            name="payment_data.payment_method"
            label="Mode de Paiement"
          >
            {paymentTypes.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.label}
              </MenuItem>
            ))}
          </Field.Select>

          <Field.Text
            label="Commentaire"
            name="payment_data.comment"
            multiline
            rows={3}
            fullWidth
          />

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Payer
          </Button>
        </Stack>
      </Form>
    </Box>
  );
}

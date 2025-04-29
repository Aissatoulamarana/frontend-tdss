'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  MenuItem,
  Box,
  Stack
} from '@mui/material';
import axios from 'src/utils/axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z } from 'zod';
import { toast } from 'sonner';
import API from 'src/utils/api';
import { getDevises, getCountries } from 'src/utils/options';
import { Form, Field , schemaHelper } from 'src/components/hook-form';

const NewPayeurSchema = z.object({
  payer_last: z.string().min(1, { message: 'Le nom est obligatoire' }),
  payer_first: z.string().min(1, { message: 'Le prénom est obligatoire' }),
  payer_email: z.string().email({ message: 'Email invalide' }),
  payer_phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  payer_country_origin: z.string(),
  payer_address: z.string().min(1, { message: 'L’adresse est obligatoire' }),
  payment_document: z
    .any()
    .refine(file => file instanceof File && file.type === 'application/pdf', {
      message: 'Le fichier doit être un PDF'
    }),
  payment_devise: z.string().min(1, { message: 'La devise est requise' }),
  payment_payment_method: z.string().min(1, { message: 'Le mode de paiement est requis' }),
  payment_comment: z.string().optional()
});

export function PayeurForm({ slug, open, onClose }) {
  const [devises, setDevises] = useState([]);
  const [countries, setCountries] = useState([]);

  const paymentTypes = [
    { id: 'TRANSFER', label: 'Virement' },
    { id: 'DEPOSIT',  label: 'Espèces' },
    { id: 'CHEQUE',   label: 'Chèques' }
  ];

  const defaultValues = useMemo(() => ({
    payer_last: '',
    payer_first: '',
    payer_email: '',
    payer_phone: '',
    payer_country_origin: '',
    payer_address: '',
    payment_document: null,
    payment_devise: '',
    payment_payment_method: '',
    payment_comment: ''
  }), []);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPayeurSchema),
    defaultValues
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset
  } = methods;

  useEffect(() => {
    getDevises().then(setDevises);
    getCountries().then(setCountries);
  }, []);

  const onSubmit = handleSubmit(async data => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'payment_document' && value instanceof File) {
          formData.append(key, value);
        } 
        // else if (key !== 'payment_document') {
        //   formData.append(key, value as string);
        // }
      });

      await axios.post(API.paidFacture(slug), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      reset();
      toast.success('Mise à jour réussie !');
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi au backend :", error);
      toast.error('Une erreur est survenue.');
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ color: 'text.disabled' }}>
        Information du Payeur
      </DialogTitle>

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
                {c.name}
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

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Retour
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Payer
          </Button>
        </DialogActions>
        </Stack>
      </Form>
    </Dialog>
  );
}

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z as zod } from 'zod';
import { useBoolean } from 'src/hooks/use-boolean';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import API from 'src/utils/api';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Phone } from '@mui/icons-material';

export const NewBankSchema = zod.object({
  name: zod.string().min(1, { message: 'Le nom est requis !' }),
  description: zod.string(),
  address: zod.string().min(1, { message: "L'adresse est requise !" }),
  type: zod.union([
    zod.string().min(1, { message: 'Le type est requise et ne peut pas être vide !' }),
    zod.number()
  ]),
  region: zod.union([
    zod.string().min(1, { message: 'La région est requise et ne peut pas être vide !' }),
    zod.number()
  ]),
  email: zod.string().min(1, { message: "l'email est obligatoire" }),
  phone: schemaHelper.phoneNumber().min(1, { message: "Entrez le numero de téléphone" }),
  admin_first_name: zod.string().min(1, { message: "Le nom de l'administrateur est requis !" }),
  admin_last_name: zod.string().min(1, { message: "Le prénom de l'administrateur" }),
  admin_email: zod.string().email({ message: "L'email de l'administrateur est invalide !" }),
  admin_phone: schemaHelper.phoneNumber(),
  admin_poste: zod.string(),
  logo: zod.any().optional(),
});

export function BankNewEditForm({ currentClient }) {
  const password = useBoolean();
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = useMemo(() => ({
    name: currentClient?.name || '',
    description: currentClient?.description || '',
    type: currentClient?.type || '',
    email: currentClient?.email || '',
    phone: currentClient?.phone || '',
    address: currentClient?.address || '',
    region: currentClient?.region || 'Conakry',
    admin_phone: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_poste: '',
    logo: currentClient?.logo || '',
  }), [currentClient]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewBankSchema),
    defaultValues,
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;

  useEffect(() => {
    if (currentClient) reset(currentClient);
  }, [currentClient]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      if (data.logo instanceof File) formData.append('logo', data.logo);
      await API.CreateBank(formData);
      toast.success('Création réussie !');
      reset();
    } catch (error) {
      toast.error('Erreur lors de la création de la banque.');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 4, maxWidth: 800, mx: 'auto', boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        </Typography>
        <Grid container spacing={3}>
          {/* Logo centré en haut */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Field.UploadAvatar name="logo" maxSize={3145728} />
          </Grid>
          {/* Champs disposés deux par deux */}
          <Grid item xs={12} sm={6}>
            <Field.Text name="name" label="Nom de la Banque" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field.Text name="admin_name" label="Nom de l'Administrateur" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field.Text name="swift_code" label="Code SWIFT" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field.Text name="admin_email" label="Email de l'Administrateur" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field.Text name="address" label="Adresse" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field.Phone name="phoneNumber" label="Numéro de Téléphone" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Field.Text name="region" label="Région" fullWidth />
          </Grid>



          <Grid item xs={12} sm={6}>
            <TextField
              label="Mot de Passe"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'right', mt: 3 }}>
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {currentClient ? 'Sauvegarder' : 'Créer'}
          </LoadingButton>
        </Box>
      </Card>
    </Form>
  );
}

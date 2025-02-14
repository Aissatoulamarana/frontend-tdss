'use client';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/routes/hooks';
import { toast } from 'sonner';
import axios from 'axios';
import { paths } from 'src/routes/paths';

import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/api';

export const NewBankSchema = zod.object({
  name: zod.string().min(1, { message: 'Le nom est requis !' }),
  identifier: zod.string().min(1, { message: "L'identifiant est requis" }),
  swift_code: zod.string().min(1, { message: 'Le Code SWIFT est obligatoire !' }),
});

export function BankNewEditForm({ currentBank }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentBank?.name || '',
      identifier: currentBank?.identifier || '',
      swift_code: currentBank?.swift_code || '',
      logo: currentBank?.logo || '',
    }),
    [currentBank]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewBankSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentBank) {
      reset(currentBank);
    }
  }, [currentBank]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post(API.CreateBank(), data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(response);
      reset();
      toast.success(currentBank ? 'Mise à jour réussie!' : 'Création avec succès!');
      router.push(paths.dashboard.fonction.list);
    } catch (error) {
      console.error('Erreur lors de la soumission', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 2, maxWidth: 900, mx: 'auto' }}>
        {' '}
        {/* Réduction du padding */}
        <Grid container spacing={2} alignItems="center">
          {' '}
          {/* Espacement réduit */}
          {/* Colonne gauche - Logo */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Field.UploadAvatar
                name="logo"
                maxSize={3145728}
                helperText={
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography>Logo de la banque</Typography>
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.disabled' }}>
                      Formats acceptés : *.jpeg, *.jpg, *.png, *.gif
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Grid>
          {/* Colonne droite - Formulaire */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2} sx={{ width: 1 }}>
              {' '}
              {/* Espacement réduit */}
              <Field.Text
                name="name"
                label="Nom de la Banque"
                placeholder="Nom de la banque"
                sx={{ px: 1, py: 1 }} // Réduction du padding interne
              />
              <Field.Text
                name="identifier"
                label="Identifiant de la Banque"
                placeholder="Identifiant"
                sx={{ px: 1, py: 1 }}
              />
              <Field.Text
                name="swift_code"
                label="Code SWIFT"
                placeholder="Code SWIFT de la Banque"
                sx={{ px: 1, py: 1 }}
              />
            </Stack>
          </Grid>
        </Grid>
        {/* Bouton aligné à droite */}
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
            {currentBank ? 'Sauvegarder les changements' : 'Enregistrer'}
          </LoadingButton>
        </Box>
      </Card>
    </Form>
  );
}

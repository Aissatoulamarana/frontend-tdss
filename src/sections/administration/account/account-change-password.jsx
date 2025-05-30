import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import API from 'src/utils/api';
import axios from 'src/utils/axios';

export const ChangePassWordSchema = zod
  .object({
    current_password: zod
      .string()
      .min(1, { message: "l'ancien mot de passe est obligatoire " })
      .min(6, { message: 'Password must be at least 6 characters!' }),
    new_password: zod.string().min(1, { message: 'le nouveau mot de passe est obligatoire' }),
    confirmNewPassword: zod.string().min(1, { message: 'le mot de passe de confirmation est obligatoire' }),
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "le nouveau mot de passe doit être différent de l'ancien mot de passe",
    path: ['newPassword'],
  })
  .refine((data) => data.new_password === data.confirmNewPassword, {
    message: 'le nouveau mot de passe et la confirmation du mot de passe doivent être les mêmes!',
    path: ['confirmNewPassword'],
  });

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const password = useBoolean();

  const defaultValues = { current_password: '', new_password: '', confirmNewPassword: '' };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));


      await axios.post(API.changePassword(), {
        current_password: data.current_password,
        new_password: data.new_password,
      });

      reset();
      toast.success('Mise à jour réussie !');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite lors de la mise à jour");
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="current_password"
          type={password.value ? 'text' : 'password'}
          label="Ancien mot de passe"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Field.Text
          name="new_password"
          label="Nouveau mot de passe"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={
            <Stack component="span" direction="row" alignItems="center">
              <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> le mot de passe doit être au moins de 8 caractères
            </Stack>
          }
        />

        <Field.Text
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Confirmation mot de passe"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          Enregistrer les changements
        </LoadingButton>
      </Card>
    </Form>
  );
}

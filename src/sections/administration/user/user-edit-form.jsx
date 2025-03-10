import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid2 } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import axios from 'src/utils/axios';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import API from 'src/utils/api';
import { fData } from 'src/utils/format-number';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------
// Le schéma de validation (nous n'incluons plus username car le backend s'appuie sur email)
export const NewUserSchema = zod.object({
  picture: zod.any().optional(),

  email: zod
    .string()
    .min(1, { message: 'Email est obligatoire!' })
    .email({ message: 'Email doit être valide!' }),

  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
  location: zod.string().optional(),
  agency: zod.string().optional(),
  // city: zod.string().optional(),
  type: zod.string().optional(),
  job: zod.string().optional(),
  // Not required
  status: zod.string().optional(),
  reset_pwd: zod.boolean(),
});

// ----------------------------------------------------------------------
// Composant ajusté
export function UserNewEditForm({ currentUser }) {
  const router = useRouter();
  const password = useBoolean();

  const defaultValues = useMemo(
    () => ({
      // On n'utilise plus de champ username côté UI car le backend utilisera l'email pour username
      email: currentUser?.email || '',

      phone: currentUser?.phone || '',
      country: currentUser?.country || '',

      // city: currentUser?.city || '',
      location: currentUser?.location || '',
      agency: currentUser?.agency || '',
      type: currentUser?.type || '',
      job: currentUser?.job || '',
      picture: currentUser?.picture || null,
      reset_pwd: currentUser?.reset_pwd ?? true,
      status: currentUser?.status || '',
    }),
    [currentUser]
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Petite pause pour simuler le délai
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Créer un FormData pour gérer le multipart/form-data
      const formData = new FormData();

      // Si le champ picture est renseigné et de type File, on l'ajoute
      if (data.picture && data.picture instanceof File) {
        formData.append('picture', data.picture);
      }
      // Ajouter les autres champs
      formData.append('email', data.email);

      // Pour le username, on force l'utilisation de l'email (évite les conflits d'unicité)
      formData.append('username', data.email);
      formData.append('phone', data.phone);
      formData.append('country', data.country);
      // formData.append('city', data.city);
      formData.append('location', data.location || '');
      formData.append('agency', data.agency || '');
      formData.append('type', data.type || '');
      formData.append('job', data.job || '');
      formData.append('reset_pwd', data.reset_pwd);

      const response = await axios.post(API.createUser(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      reset();
      toast.success(currentUser ? 'Mis à jour effectué!' : "Création d'un utilisateur reussie !");
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 6, md: 4 }}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banni' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}
            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="picture"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banni
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Désactiver le compte
                    </Typography>
                  </>
                }
                sx={{
                  mx: 0,
                  mb: 3,
                  width: 1,
                  justifyContent: 'space-between',
                }}
              />
            )}

            <Field.Switch
              name="reset_pwd"
              labelPlacement="start"
              label={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Vérification du mail
                </Typography>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Supprimer un utilisateur
                </Button>
              </Stack>
            )}
          </Card>
        </Grid2>

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
              {/* On a retiré le champ username du formulaire affiché */}

              <Field.Text name="email" label="Adresse Mail" />
              <Field.Phone name="phone" label="Numéro de Téléphone" />
              {/* <Field.Text
                name="password"
                label="Password"
                placeholder="6+ characters"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              /> */}
              <Field.CountrySelect
                fullWidth
                name="country"
                label="Country"
                placeholder="Selectionnez un pays"
              />
              {/* <Field.Text name="city" label="Ville" /> */}
              <Field.Text name="location" label="Addresse" />
              <Field.Text name="agency" label="Company" />
              <Field.Select name="type" label="Role" inputlabelprops={{ shrink: true }}>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="user">Client</MenuItem>
                <MenuItem value="superviseur">Superviseur</MenuItem>
              </Field.Select>
              <Field.Text name="job" label="Poste" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? "Créer l'utilisateur" : 'Sauvegarder les changements'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid2>
      </Grid2>
    </Form>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import { Grid2 } from '@mui/material';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { useMockedUser } from 'src/auth/hooks';
import { getRegions, getAgences, getProfils, getUserTypes } from 'src/utils/options';


// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  first_name: zod.string().min(1, { message: ' Le prénom est obligatoire' }),
  last_name: zod.string().min(1, { message: 'le nom est obligatoire' }),
  email: zod
    .string()
    .min(1, { message: 'Email est obligatoire!' })
    .email({ message: 'Email doit etre un email valide !' }),
  picture: schemaHelper.file({
    message: { required_error: 'televerser un image!' },
  }),
  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),

  type: zod.string().min(1, { message: 'le type est requis!' }),
  profile: zod.string().min(1, { message: 'le profil est requis!' }),
  location: zod.string().min(1, { message: 'la région est réquise!' }),
  agency: zod.string().min(1, { message: " l' agence est requis" }),
});

export function AccountGeneral() {

  const { user } = useMockedUser();
  const [regions, setRegions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [profils, setProfils] = useState([]);
  const [agences, setAgences] = useState([]);

  const defaultValues = {
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    picture: user?.picture || null,
    phone: user?.phone || '',
    type: user?.type || '',
    profile: user?.profile || '',
    location: user?.location || '',
    agency: user?.agency || '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    getRegions().then(data => setRegions(data));
    getAgences().then(data => setAgences(data));
    getUserTypes().then(data => setRoles(data));
    getProfils().then(data => setProfils(data));
  })

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
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

            {/* <Field.Switch
              name="isPublic"
              labelPlacement="start"
              label="Public profile"
              sx={{ mt: 5 }}
            /> */}

            {/* <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Supprimer l'utilisateur
            </Button> */}
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 8 }}>
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
              <Field.Text name="first_name" label="Prénom" />
              <Field.Text name="last_name" label="Nom" />
              <Field.Text name="email" label="Adresse Mail" />
              <Field.Phone name="phone" label="Numéro de Téléphone" />

              <Field.Select name="profile" label="Profil" >
                {profils.map((profil) => (
                  <MenuItem key={profil?.slug} value={profil?.slug}>
                    {profil?.name}
                  </MenuItem>
                ))}
              </Field.Select>
              <Field.Select name="location" label="Region" >
                {regions.map((region) => (
                  <MenuItem key={region?.slug} value={region?.slug}>
                    {region?.name}
                  </MenuItem>
                ))
                }
              </Field.Select>
              <Field.Select name="agency" label="Agence" >
                {agences.map((agence) => (
                  <MenuItem key={agence?.slug} value={agence?.slug}>
                    {agence?.name}
                  </MenuItem>
                ))
                }
              </Field.Select>
              <Field.Select name="type" label="Role" inputlabelprops={{ shrink: true }}>
                {roles?.map((role) => (
                  <MenuItem key={role.slug} value={role.slug}>
                    {role?.name}
                  </MenuItem>
                ))}
              </Field.Select>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>


              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Enregistrer les changements
              </LoadingButton>
            </Stack>
          </Card>
        </Grid2>
      </Grid2>
    </Form>
  );
}

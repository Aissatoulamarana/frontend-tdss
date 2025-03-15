'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'src/routes/hooks';
import { toast } from 'sonner';
import { fData } from 'src/utils/format-number';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { paths } from 'src/routes/paths';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import axios from 'src/utils/axios';
import API from 'src/utils/api';

import { getRegions, getProfileTypes } from 'src/utils/options';

export const NewClientSchema = zod.object({
    // Informations du client
    name: zod.string().min(1, { message: 'Le nom est requis !' }),
    description: zod.string(),
    adresse: zod.string().min(1, { message: "L'adresse est requise !" }),
    type: zod.union([
        zod.string().min(1, { message: 'Le type est requis et ne peut pas être vide !' }),
        zod.number()
    ]),
    location: zod.union([
        zod.string().min(1, { message: 'La région est requise et ne peut pas être vide !' }),
        zod.number()
    ]),
    email: zod
        .string()
        .min(1, { message: "l'email est obligatoire" })
        .email({ message: "l'email doit être un email valide!" }),
    contact: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    picture: zod.any().optional(),

});

export function ClientNewEditForm({ currentClient }) {
    const router = useRouter();

    const [loaded, setLoaded] = useState(false);
    const [regions, setRegions] = useState([]);
    const [types, setTypes] = useState([]);

    const defaultValues = useMemo(
        () => ({
            name: currentClient?.name || '',
            description: currentClient?.description || '',
            type: currentClient?.type || '',
            email: currentClient?.email || '',
            contact: currentClient?.contact || '',
            adresse: currentClient?.adresse || '',
            location: currentClient?.location || 'Conakry',
            picture: currentClient?.picture || '',

        }),
        [currentClient]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewClientSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentClient) reset(currentClient);
    }, [currentClient, reset]);

    // Soumission finale du formulaire
    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();

            // Ajouter tous les champs du formulaire sauf l'image
            Object.keys(data).forEach(key => {
                if (key !== 'picture') {
                    formData.append(key, data[key]);
                }
            });

            // Vérifier et ajouter l'image
            if (data.picture instanceof File) {
                formData.append('picture', data.picture);
            }

            // Envoi de la requête
            await axios.post(API.createProfile(), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Création réussie !');
            reset();
            router.push(paths.dashboard.client.root);
        } catch (error) {
            toast.error('Erreur lors de la création du profil.');
            console.error('Erreur:', error.response?.data || error.message);
        }
    });




    useEffect(() => {
        getRegions().then(data => setRegions(data));
        getProfileTypes().then(data => setTypes(data));

    }, []);

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
                {/* Card du picture (toujours affiché à gauche) */}
                <Grid item size={{ xs: 12, md: 4 }}>
                    <Card
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: 3,
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Logo
                        </Typography>
                        <Field.UploadAvatar name="picture" maxSize={3145728}
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
                            } />
                    </Card>
                </Grid>

                {/* Card des formulaires (réduit en taille) */}
                <Grid item size={{ xs: 12, md: 8 }}>
                    <Card
                        sx={{
                            p: 3,
                            boxShadow: 3,
                            borderRadius: 2,
                            backgroundColor: 'background.paper',
                            maxWidth: 600,
                            mx: 'auto',
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, textAlign: 'flex-start', fontWeight: 'bold' }}>
                            Informations du Client
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item size={{ xs: 8, md: 6 }}>
                                <Field.Text name="name" label="Nom du client" fullWidth size="small" />
                            </Grid>
                            <Grid item size={{ xs: 8, md: 6 }}>
                                <Field.Select name="type" label="Type de Profil" fullWidth size="small" >
                                    {types.map((profiletype) => (
                                        <MenuItem key={profiletype.slug} value={profiletype.slug} >
                                            {profiletype.name}
                                        </MenuItem>
                                    ))}
                                </Field.Select>
                            </Grid>
                            <Grid item size={{ xs: 8, md: 12 }}>
                                <Field.Text
                                    name="description"
                                    label="Description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                />
                            </Grid>
                            <Grid item size={{ xs: 8, md: 6 }}>
                                <Field.Text name="email" label="Email" fullWidth size="small" />
                            </Grid>
                            <Grid item size={{ xs: 8, md: 6 }}>
                                <Field.Phone name="contact" label="Téléphone" fullWidth size="small" />
                            </Grid>
                            <Grid item size={{ xs: 8, md: 6 }}>
                                <Field.Select name="location" label="Région" fullWidth size="small" >
                                    {regions.map((region) => (
                                        <MenuItem key={region.slug} value={region.slug}>
                                            {region.name}
                                        </MenuItem>
                                    ))}
                                </Field.Select>
                            </Grid>
                            <Grid item size={{ xs: 8, md: 6 }}>
                                <Field.Text name="adresse" label="Adresse" fullWidth size="small" />
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'right', mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                                {currentClient ? 'Sauvegarder' : 'Créer'}
                            </LoadingButton>
                        </Box>
                    </Card>

                </Grid>
            </Grid>
        </Form>
    );
}

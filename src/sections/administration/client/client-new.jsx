'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import { fData } from 'src/utils/format-number';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import axios from 'src/utils/axios';
import API from 'src/utils/api';

import { fetchOptions, regions, profileTypes } from 'src/utils/options';

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
    email: zod.string().min(1, { message: "L'email est obligatoire" }),
    contact: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    picture: zod.any().optional(),
    // Informations de l'administrateur
    user_first_name: zod.string().min(1, { message: "Le nom de l'administrateur est requis !" }),
    user_last_name: zod.string().min(1, { message: "Le prénom de l'administrateur est requis !" }),
    user_email: zod.string().email({ message: "L'email de l'administrateur est invalide !" }),
    user_phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
    user_poste: zod.string(),
});

export function ClientNewEditForm({ currentClient }) {
    // Etat pour gérer l'étape du formulaire
    const [step, setStep] = useState(1);
    const [loaded, setLoaded] = useState(false);

    const defaultValues = useMemo(
        () => ({
            name: currentClient?.name || '',
            description: currentClient?.description || '',
            type: currentClient?.type || '',
            email: currentClient?.email || '',
            contact: currentClient?.contact || '',
            adresse: currentClient?.addresse || '',
            location: currentClient?.location || 'Conakry',
            picture: currentClient?.picture || '',
            user_first_name: '',
            user_last_name: '',
            user_email: '',
            user_phone: '',
            user_poste: '',
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

            // Ajouter tous les champs sauf ceux liés à "user"
            Object.entries(data).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined && !key.startsWith('user_')) {
                    formData.append(key, value);
                }
            });

            // Vérifier si une image est sélectionnée et l'ajouter correctement
            if (data.picture instanceof File) {
                formData.append('picture', data.picture);
            }

            // Ajouter chaque champ user_ individuellement au lieu d'un objet JSON
            formData.append('user.email', data.user_email);
            formData.append('user.first_name', data.user_first_name);
            formData.append('user.last_name', data.user_last_name);
            formData.append('user.phone', data.user_phone);
            formData.append('user.poste', data.user_poste);

            // Envoi de la requête
            await axios.post(API.createProfile(), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Création réussie !');
            reset();
            setStep(1);
        } catch (error) {
            toast.error('Erreur lors de la création du profil.');
            console.error('Erreur:', error.response?.data || error.message);
        }
    });



    useEffect(() => {
        // Récupérer les options lors du chargement du composant
        fetchOptions().then(() => {
            setLoaded(true); // Marquer comme chargé une fois les données récupérées
            console.log(regions);
            console.log('profile type', profileTypes)
        });
    }, []);

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
                {/* Card du picture (toujours affiché à gauche) */}
                <Grid item xs={12} md={4}>
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
                            picture
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
                <Grid item xs={12} md={8}>
                    {step === 1 && (
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
                            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                                Informations du Client
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field.Text name="name" label="Nom du client" fullWidth size="small" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field.Select name="type" label="Type de Profil" fullWidth size="small" >
                                        {profileTypes.map((profiletype) => (
                                            <MenuItem key={profiletype.id} value={String(profiletype.id)} >
                                                {profiletype.name}
                                            </MenuItem>
                                        ))}
                                    </Field.Select>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field.Text
                                        name="description"
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field.Text name="email" label="Email" fullWidth size="small" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field.Phone name="contact" label="Téléphone" fullWidth size="small" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field.Select name="location" label="Région" fullWidth size="small" >
                                        {regions.map((region) => (
                                            <MenuItem key={region.id} value={String(region.id)}>
                                                {region.name}
                                            </MenuItem>
                                        ))}
                                    </Field.Select>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field.Text name="adresse" label="Adresse" fullWidth size="small" />
                                </Grid>
                            </Grid>
                            <Box sx={{ textAlign: 'right', mt: 3 }}>
                                <Button variant="contained" onClick={() => setStep(2)}>
                                    Suivant
                                </Button>
                            </Box>
                        </Card>
                    )}

                    {step === 2 && (
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
                            <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                                Informations de l'Administrateur
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Field.Text name="user_first_name" label="Nom" fullWidth size="small" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field.Text name="user_last_name" label="Prénom" fullWidth size="small" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field.Text name="user_email" label="Email" fullWidth size="small" />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Field.Phone name="user_phone" label="Téléphone" fullWidth size="small" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field.Text name="user_poste" label="Poste" fullWidth size="small" />
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button variant="outlined" onClick={() => setStep(1)}>
                                    Précédent
                                </Button>
                                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                                    {currentClient ? 'Sauvegarder' : 'Créer'}
                                </LoadingButton>
                            </Box>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Form>
    );
}

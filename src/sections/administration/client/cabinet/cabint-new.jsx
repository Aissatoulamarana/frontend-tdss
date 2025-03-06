'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card,
    Box,
    Grid,
    TextField,
    Typography,
    Button,
} from '@mui/material';

const CabinetSchema = z.object({
    name: z.string().nonempty("Le nom du cabinet est requis"),
    identifier: z.string().nonempty("L'identifiant est requis"),
    email: z.string().email("Veuillez renseigner un email valide"),
    address: z.string().optional(),
    telephone: z.string().optional(),
});

export function CreateCabinetForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(CabinetSchema),
        defaultValues: {
            name: '',
            identifier: '',
            email: '',
            address: '',
            telephone: '',
        },
    });

    const [logo, setLogo] = useState(null);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('identifier', data.identifier);
            formData.append('email', data.email);
            formData.append('address', data.address);
            formData.append('telephone', data.telephone);
            if (logo) {
                formData.append('logo', logo);
            }

            const res = await fetch('/api/cabinet/create', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                console.error('Erreur lors de la création du cabinet');
            } else {
                const result = await res.json();
                // Redirection ou affichage d'un message de succès
                router.push(`/cabinet/${result.cabinet_id}`);
            }
        } catch (error) {
            console.error('Erreur :', error);
        }
    };

    return (
        <Card sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Création d'un Cabinet
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Nom du Cabinet"
                            fullWidth
                            {...register('name')}
                            error={Boolean(errors.name)}
                            helperText={errors.name?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Identifiant"
                            fullWidth
                            {...register('identifier')}
                            error={Boolean(errors.identifier)}
                            helperText={errors.identifier?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            fullWidth
                            {...register('email')}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Adresse"
                            fullWidth
                            {...register('address')}
                            error={Boolean(errors.address)}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Téléphone"
                            fullWidth
                            {...register('telephone')}
                            error={Boolean(errors.telephone)}
                            helperText={errors.telephone?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="outlined" component="label">
                            {logo ? 'Changer le logo' : 'Ajouter un logo'}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setLogo(file);
                                }}
                            />
                        </Button>
                        {logo && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {logo.name}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {isSubmitting ? 'Création en cours...' : 'Créer le Cabinet'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
}

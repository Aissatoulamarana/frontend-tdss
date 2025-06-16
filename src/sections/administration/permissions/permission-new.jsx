'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import axios from 'src/utils/axios';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z as zod } from 'zod';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import API from 'src/utils/api';

import { Form, Field } from 'src/components/hook-form';

export const NewJobSchema = zod.object({
    name: zod.string().min(1, { message: 'Le nom est requis !' }),
    codes: zod.string().min(1, { message: 'Le code est obligatoire !' }),
    list: zod.array(zod.string()).min(1, { message: 'Veuillez sélectionner au moins une autorisation !' }),
    profile_type: zod.union([
        zod.string().min(1, { message: 'Le profil est requis et ne peut pas être vide !' }),
        zod.number()
    ]),
});

const list_autorisations = [
    { value: 'Dashboards', label: 'Dashboards' },
    { value: 'Administration', label: 'Administration' },
    { value: 'Ajouter', label: 'Ajouter' },
    { value: 'Supprimer', label: 'Supprimer' },
    { value: 'Modifier', label: 'Modifier' },
];


export function PermissionNew({ currentPermission }) {
    const router = useRouter();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/profile_type/")
            .then((response) => {
                setProfiles(response.data.results || response.data); // Adapter si c'est sous `results`
            })
            .catch((error) => {
                console.error("Erreur API :", error);
                setError("Impossible de récupérer les catégories");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    const defaultValues = useMemo(
        () => ({
            name: currentPermission?.name || '',
            codes: currentPermission?.codes || '',  // 🛠 Ajouté pour éviter undefined
            list: currentPermission?.list || [], // 🛠 Ajouté pour éviter undefined
            profile_type: currentPermission?.profile_type || '',
        }),
        [currentPermission]
    );


    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(NewJobSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (currentPermission) {
            reset(currentPermission); // Corrigé pour utiliser les valeurs directement
        }
    }, [currentPermission]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            let response;

            // 🛠 Convertir `list` en JSON
            const formattedData = {
                ...data,
                list: JSON.stringify(data.list) // ✅ Convertir `list` en chaîne JSON
            };

            if (currentPermission) {
                const {id} = currentPermission;
                response = await axios.patch(API.editPermission(id), formattedData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                toast.success('Mise à jour réussie!');
            } else {
                response = await axios.post(API.createPermission(), formattedData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                toast.success('Création avec succès!');
            }

            reset();
            router.push(paths.dashboard.permission.list);
        } catch (error) {
            console.error('Erreur lors de la soumission', error);
            toast.error('Une erreur est survenue');
        }
    });


    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
                <Card>
                    <CardHeader title="Nouvelle" />
                    <Divider />
                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Field.Text
                            name="codes"
                            label="Ajoutez un code"
                            placeholder="XXXXX"
                        />
                        <Field.Text
                            name="name"
                            label="Ajoutez un nom"
                            placeholder="Ex: Administrateur de compte "
                        />
                        <Field.Select
                            name="profile_type"
                            label="Profile Type"
                            placeholder="Sélectionnez un profil..."
                        >
                            {profiles.map((profile) => (
                                <MenuItem key={profile.id} value={String(profile.id)}>
                                    {profile.name}
                                </MenuItem>
                            ))}
                        </Field.Select>
                        <Field.MultiSelect
                            name="list"
                            label="Autorisations"
                            placeholder="Sélectionnez une autorisation"
                            options={Array.isArray(list_autorisations) ? list_autorisations : []} // 👈 Ici, on passe bien les options !
                        />


                    </Stack>
                </Card>

                <Box display="flex-end " alignItems="self-end" flexWrap="wrap">

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={isSubmitting}
                        sx={{ ml: 2 }}
                    >
                        {!currentPermission ? 'Ajouter' : 'Sauvegarder les changements'}
                    </LoadingButton>
                </Box>
            </Stack>
        </Form>
    );
}

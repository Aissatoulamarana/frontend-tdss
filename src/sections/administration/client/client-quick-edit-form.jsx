"use client";
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { toast } from 'sonner';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { z as zod } from 'zod';
import Typography from '@mui/material/Typography';

import { Form, Field, schemaHelper } from 'src/components/hook-form';
import API from 'src/utils/api';
import axios from 'src/utils/axios';

import { getRegions, getProfileTypes } from 'src/utils/options';
import { fData } from 'src/utils/format-number';

// ----------------------------------------------------------------------
// Schéma de validation
export const ClientQuickEditSchema = zod.object({
    name: zod.string().min(1, { message: 'Le nom est requis !' }),
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
});

export function ClientQuickEditForm({ currentClient, open, onClose, onUpdateRow }) {
    const [regions, setRegions] = useState([]);
    const [types, setTypes] = useState([]);

    // Définir les valeurs par défaut en s'assurant que les clés correspondent aux données du profil
    const defaultValues = useMemo(() => {
        // Pour la région : trouver l'option dont le nom correspond à currentClient.location
        const currentRegion = regions.find(region => region.name === currentClient?.location);
        // Pour le type de profil : pareil, on cherche l'option dont le nom correspond
        const currentType = types.find(type => type.name === currentClient?.type);

        return {
            name: currentClient?.name || '',
            type: currentType ? currentType.slug : currentClient?.type || '',
            email: currentClient?.email || '',
            contact: currentClient?.contact || '',
            adresse: currentClient?.adresse || '',
            location: currentRegion ? currentRegion.slug : currentClient?.location || '',
            picture: currentClient?.picture || '',
        };
    }, [currentClient, regions, types]);


    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(ClientQuickEditSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const getModifiedFields = (originalData, newData) => {
        const modifiedFields = {};

        Object.keys(newData).forEach((key) => {
            if (newData[key] !== originalData[key]) {
                modifiedFields[key] = newData[key];
            }
        });

        return modifiedFields;
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const modifiedData = getModifiedFields(currentClient, data);

            if (Object.keys(modifiedData).length === 0) {
                toast.info("Aucune modification détectée.");
                return;
            }

            // Création d'un FormData et ajout des champs modifiés
            const formData = new FormData();
            Object.keys(modifiedData).forEach(key => {
                formData.append(key, modifiedData[key]);
            });

            // Ne pas définir manuellement le Content-Type pour laisser le navigateur gérer les délimitations
            const response = await axios.patch(API.UpdateProfile(currentClient.slug), formData);

            toast.success('Mise à jour réussie !');

            // Fusionner les données modifiées avec le client courant pour obtenir la version à jour
            const updatedClient = { ...currentClient, ...modifiedData };
            console.log("Client mis à jour :", updatedClient);
            onUpdateRow(updatedClient);
            reset();
            onClose();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du profil.');
            console.error('Erreur:', error.response?.data || error.message);
        }
    });




    // Récupérer les options pour les selects
    useEffect(() => {
        getRegions().then(data => setRegions(data));
        getProfileTypes().then(data => setTypes(data));
    }, []);

    // Pour mettre à jour les valeurs du formulaire dès que currentClient change
    useEffect(() => {
        reset(defaultValues);
    }, [currentClient, defaultValues, reset]);

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
            slotProps={{ sx: { maxWidth: 720 } }}
        >
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Mise à jour rapide</DialogTitle>
                <DialogContent>
                    <Box
                        mt={4}
                        display="grid"
                        gap={3}
                        gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }}
                    >
                        {/* Section Logo centrée */}
                        <Box
                            gridColumn={{ xs: '1 / -1', sm: '1 / 3' }}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                        >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Logo
                            </Typography>
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

                        <Field.Text name="name" label="Nom" fullWidth />
                        <Field.Select name="type" label="Type de Profil" fullWidth>
                            {types.map((profiletype) => (
                                <MenuItem key={profiletype.slug} value={profiletype.slug}>
                                    {profiletype.name}
                                </MenuItem>
                            ))}
                        </Field.Select>
                        <Field.Text name="email" label="Email" fullWidth />
                        <Field.Phone name="contact" label="Téléphone" fullWidth />
                        <Field.Select name="location" label="Région" fullWidth>
                            {regions.map((region) => (
                                <MenuItem key={region.slug} value={region.slug}>
                                    {region.name}
                                </MenuItem>
                            ))}
                        </Field.Select>
                        <Field.Text name="adresse" label="Adresse" fullWidth />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Retour
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Mettre à jour
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>

    );
}

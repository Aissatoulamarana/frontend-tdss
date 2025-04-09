'use client';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { toast } from 'sonner';
import { USER_STATUS_OPTIONS } from 'src/_mock';
import { z as zod } from 'zod';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import { getJobAgent } from 'src/utils/options';

import API from 'src/utils/api';
import axios from 'src/utils/axios';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const employeQuickEditSchema = zod.object({
    first: zod.string().min(1, { message: 'le prenom est obligatoire' }),
    last: zod.string().min(1, { message: 'le nom est obligatoire' }),
    passport_number: zod.string().min(1, { message: 'le numero de passeport est obligatoire' }),

    phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),

    job: zod.string().min(1, { message: 'le type est requis!' }),

});

// ----------------------------------------------------------------------

export function EmployeeQuickEditForm({ currentEmployee, open, onClose, onUpdateRow, dec_slug }) {

    const user = useMockedUser();
    const [jobs, setJobs] = useState([]);


    const defaultValues = useMemo(() => {
        const currentJob = jobs?.find(job => job.name === currentEmployee?.job);

        return {
            first: currentEmployee?.first || '',
            last: currentEmployee?.last || '',
            passport_number: currentEmployee?.passport_number || '',

            phone: currentEmployee?.phone || '',

            job: currentJob ? currentJob.slug : currentEmployee.job.slug || '',

        }
    }, [jobs, currentEmployee])

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(employeQuickEditSchema),
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
            let originalValue = originalData[key];

            // Adaptation spéciale pour job
            if (key === "job" && typeof originalValue === "object") {
                originalValue = originalValue.slug;
            }

            if (newData[key] !== originalValue) {
                modifiedFields[key] = newData[key];
            }
        });

        return modifiedFields;
    };


    const onSubmit = handleSubmit(async (data) => {
        try {
            const modifiedData = getModifiedFields(currentEmployee, data);

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
            const response = await axios.patch(API.UpdateEmploye(dec_slug, currentEmployee.slug), formData);

            if (response) {
                toast.success('Mise à jour réussie !');
                window.location.reload();

                // Fusionner les données modifiées avec le client courant pour obtenir la version à jour
                const updatedEmployee = { ...currentEmployee, ...modifiedData };
                console.log("utilisateur  mis à jour :", updatedEmployee);
                onUpdateRow(updatedEmployee);
                reset();
                onClose();
            }
        } catch (error) {
            toast.error('Erreur lors de la mise à jour .');
            console.error('Erreur:', error.response?.data || error.message);
        }
    });

    useEffect(() => {
        getJobAgent().then(data => setJobs(data));
    }, []); // important !


    // Pour mettre à jour les valeurs du formulaire dès que currentEmployee change
    useEffect(() => {
        if (jobs.length > 0) {
            reset(defaultValues);
        }
    }, [jobs, currentEmployee, defaultValues, reset]);


    return (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={open}
            onClose={onClose}
            slotProps={{ sx: { maxWidth: 720 } }}
        >
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Mise à jour rapide</DialogTitle>

                <DialogContent>


                    <Box
                        mt={4}
                        rowGap={3}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                    >



                        <Field.Text name="passport_number" label="Numero du passeport " />
                        <Field.Text name="last" label="Nom " />
                        <Field.Text name="first" label="Prénom " />

                        <Field.Phone name="phone" label="Numéro de Téléphone" />


                        <Field.Select name="job" label="Fonction" >
                            {jobs.map((job) => (
                                <MenuItem key={job?.slug} value={job?.slug}>
                                    {job?.name}
                                </MenuItem>
                            ))}
                        </Field.Select>

                    </Box>
                </DialogContent>

                <DialogActions>
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
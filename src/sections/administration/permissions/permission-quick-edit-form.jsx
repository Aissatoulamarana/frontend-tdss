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

// ----------------------------------------------------------------------
// Schéma de validation
export const PermissionQuickEditSchema = zod.object({
    name: zod.string().min(1, { message: 'Le nom est requis !' }),
    codes: zod.string().min(1, { message: 'Le code est obligatoire !' }),
    list: zod.array(zod.string()).min(1, {
        message: 'Veuillez sélectionner au moins une autorisation !',
    }),
    profile_type: zod.union([
        zod.string().min(1, {
            message: 'Le profil est requis et ne peut pas être vide !',
        }),
        zod.number(),
    ]),
});

// ----------------------------------------------------------------------
// Composant de formulaire d'édition rapide
export function PermissionQuickEditForm({ currentPermission, open, onClose }) {
    const defaultValues = useMemo(
        () => ({
            name: currentPermission?.name || '',
            codes: currentPermission?.codes || '',
            list: currentPermission?.list || [],
            profile_type: currentPermission?.profile_type || '',
        }),
        [currentPermission]
    );

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(PermissionQuickEditSchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            // Simulation d'une opération asynchrone (ex. appel API)
            const promise = new Promise((resolve) => setTimeout(resolve, 1000));

            // Attendre la résolution de la promesse
            await promise;

            // Afficher la notification de succès
            toast.success('Update success!');
            console.info('DATA', data);

            // Réinitialiser le formulaire et fermer le dialogue
            reset();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Update error!');
        }
    });

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { maxWidth: 720 } }}
        >
            <Form methods={methods} onSubmit={onSubmit}>
                <DialogTitle>Mise à jour rapide</DialogTitle>
                <DialogContent>
                    <Box
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                        columnGap={2}
                        rowGap={3}
                    >
                        <Field.Text name="codes" label="Ajoutez un code" />
                        <Field.Text name="name" label="Ajoutez un nom" />

                        <Field.Select
                            fullWidth
                            name="profile_type"
                            label="Profile Type"
                            placeholder="Sélectionnez un profil..."
                        />

                        <Field.MultiSelect
                            name="list"
                            label="Autorisations"
                            placeholder="Sélectionnez une autorisation"
                            options={currentPermission.list}
                        />
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

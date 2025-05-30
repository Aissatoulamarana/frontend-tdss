import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';

import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import API from 'src/utils/api';
import axios from 'src/utils/axios';

export const ChangeEmailSchema = zod
    .object({
        current_password: zod
            .string()
            .min(1, { message: "l'ancien mot de passe est obligatoire " })
            .min(6, { message: 'Password must be at least 6 characters!' }),
        new_email: zod.string().min(1, { message: 'Email  est obligatoire' }),

    })


// ----------------------------------------------------------------------

export function AccountChangeEmail() {
    const password = useBoolean();

    const defaultValues = { current_password: '', new_email: '' };

    const methods = useForm({
        mode: 'all',
        resolver: zodResolver(ChangeEmailSchema),
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


            await axios.post(API.changeEmail(), {
                current_password: data.current_password,
                new_email: data.new_email,
            });

            reset();
            toast.success('Mise à jour réussie !');
            console.info('DATA', data);
        } catch (error) {
            toast.error(error);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
                <Field.Text
                    name="current_password"
                    type={password.value ? 'text' : 'password'}
                    label="Votre mot de passe"
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
                    name="new_email"
                    label="Nouveau email"
                />



                <LoadingButton type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
                    Enregistrer les changements
                </LoadingButton>
            </Card>
        </Form>
    );
}

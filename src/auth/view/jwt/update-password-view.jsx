'use client';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCountdownSeconds } from 'src/hooks/use-countdown';

import { SentIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';
import { FormResendCode } from '../../components/form-resend-code';
import { resetPassword, updatePassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export const UpdatePasswordSchema = zod
    .object({
        code: zod
            .string()
            .min(1, { message: 'Code is required!' })
            .min(6, { message: 'Code must be at least 6 characters!' }),
        email: zod
            .string()
            .min(1, { message: 'Email is required!' })
            .email({ message: 'Email must be a valid email address!' }),
        password: zod
            .string()
            .min(1, { message: 'Password is required!' })
            .min(6, { message: 'Password must be at least 6 characters!' }),
        confirmPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match!',
        path: ['confirmPassword'],
    });

// ----------------------------------------------------------------------

export function UpdatePasswordView() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const email = searchParams.get('email');

    const password = useBoolean();

    const countdown = useCountdownSeconds(5);

    const defaultValues = {
        code: '',
        email: email || '',
        password: '',
        confirmPassword: '',
    };

    const methods = useForm({
        resolver: zodResolver(UpdatePasswordSchema),
        defaultValues,
    });

    const {
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await updatePassword({
                username: data.email,
                confirmationCode: data.code,
                newPassword: data.password,
            });

            router.push(paths.auth.jwt.signIn);
        } catch (error) {
            console.error(error);
        }
    });

    const handleResendCode = useCallback(async () => {
        if (!countdown.isCounting) {
            try {
                countdown.reset();
                countdown.start();

                await resetPassword({ username: values.email });
            } catch (error) {
                console.error(error);
            }
        }
    }, [countdown, values.email]);

    const renderForm = (
        <Box gap={3} display="flex" flexDirection="column">
            <Field.Text
                name="email"
                label="Email "
                placeholder="example@gmail.com"
                InputLabelProps={{ shrink: true }}
                disabled
            />

            <Field.Code name="code" />

            <Field.Text
                name="password"
                label="Mot de passe"
                placeholder="8+ characters"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
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
                name="confirmPassword"
                label="Confirmation du mot de passe"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
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

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                loadingIndicator="Update password..."
            >
                Mettre A jour
            </LoadingButton>
        </Box>
    );

    return (
        <>
            <FormHead
                icon={<SentIcon />}
                title="Envoyez la demande!"
                description={`Nous enverrons un e-mail de confirmation à votre adresse contenant un code à 6 chiffres.  
Veuillez saisir ce code dans le champ ci-dessous pour vérifier votre adresse e-mail..`}
            />

            <Form methods={methods} onSubmit={onSubmit}>
                {renderForm}
            </Form>

            <FormResendCode
                onResendCode={handleResendCode}
                value={countdown.value}
                disabled={countdown.isCounting}
            />

            <FormReturnLink href={paths.auth.jwt.signIn} />
        </>
    );
}

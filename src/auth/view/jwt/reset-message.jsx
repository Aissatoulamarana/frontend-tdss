'use client';



import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { m } from 'framer-motion';

import { SentIcon } from 'src/assets/icons';
import { varBounce, MotionContainer } from 'src/components/animate';
import { paths } from 'src/routes/paths';
import { useRouter, } from 'src/routes/hooks';
import { SimpleLayout } from 'src/layouts/simple';
import { PageAttenteIllustration } from 'src/assets/illustrations';

import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';






// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export function MessageView() {
    const router = useRouter();


    return (

        <SimpleLayout content={{ compact: true }}>
            <Container component={MotionContainer}>

                <m.div variants={varBounce().in}>
                    <Typography variant="h3" sx={{ mb: 2 }}>
                        Demande de réinitialisation du mot de passe envoyé!
                    </Typography>
                </m.div>
                <m.div variants={varBounce().in}>
                    <Typography sx={{ color: 'text.secondary' }}>
                        Vous pouvez maintenant verifier dans vos mails si vous n'avez pas recu un lien qui vous permettra de rénitialiser votre mot de passe

                    </Typography>
                </m.div>
                <m.div variants={varBounce().in}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        N'oubiez pas de verifier dans vos spams
                    </Typography>
                </m.div>

                <m.div variants={varBounce().in}>
                    <PageAttenteIllustration sx={{ my: { xs: 5, sm: 10 } }} />
                </m.div>

                <FormReturnLink href={paths.auth.jwt.signIn} />
            </Container>
        </SimpleLayout>
    );
}

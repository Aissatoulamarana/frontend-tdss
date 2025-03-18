'use client';


import { paths } from 'src/routes/paths';
import { useRouter, } from 'src/routes/hooks';


import { SentIcon } from 'src/assets/icons';



import { FormHead } from '../../components/form-head';
import { FormReturnLink } from '../../components/form-return-link';



// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export function MessageView() {
    const router = useRouter();


    return (
        <>
            <FormHead
                icon={<SentIcon />}
                title="Envoyez la demande!"
                description={`Veuillez verifier vos emails si vous n'avez pas recu un lien qui vous permettra de rénitialiser votre mot de passe  `}
            />





            <FormReturnLink href={paths.auth.jwt.signIn} />
        </>
    );
}

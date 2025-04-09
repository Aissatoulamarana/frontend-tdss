import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import axios from 'src/utils/axios';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import API from 'src/utils/api';

import { Form } from 'src/components/hook-form';


import { toast } from 'sonner';
import { DeclarationNewEditDetails } from './declaration-edit-detail';
import { DeclarationEditStatusDate } from './declaration-status-edit';

// ----------------------------------------------------------------------
// Définition du schéma de validation
export const NewInvoiceSchema = zod.object({
  employees: zod.array(
    zod.object({
      passport_number: zod.string().min(1, { message: 'Numero du passeport obligatoire' }),
      job: zod.string().min(1, { message: 'le champ fonction est obligatoire!' }),
      phone: zod.string().min(1, { message: "Entrez votre numero de téléphone " }),
      first: zod.string().min(1, { message: 'Entrez votre prenom ' }),
      last: zod.string().min(1, { message: 'Entrez votre nom ' }),

    })
  ),

  company: zod.string().min(1, { message: "Veuillez selectionner l'entreprise !" }),
  title: zod.string().min(1, { message: 'le titre de la déclaration est obligatoire' }),
});



// ----------------------------------------------------------------------

export function DeclarationNew({ declaration, type, formData }) {
  const router = useRouter();
  const loadingSave = useBoolean();
  const loadingSend = useBoolean();



  const defaultValues = useMemo(() => ({
    status: declaration?.status || 'brouillon',
    title: declaration?.title || '',
    company: declaration?.company || '',
    employees: formData?.length > 0
      ? formData
      : declaration?.employees || [
        {
          passport_number: '',
          first: '',
          last: '',
          phone: '',
          job: '',
          identifier: '',
        },
      ],
  }), [declaration, formData]);


  console.log("Valeur de type dans DeclarationNew :", type);

  // Initialisation du formulaire
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewInvoiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const handleCreateAndSend = handleSubmit(async (data) => {
    // Démarre le chargement
    loadingSend.onTrue();

    try {
      let response;

      // Simuler un délai pour des actions asynchrones (optionnel)
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (declaration) {
        const { slug } = declaration;
        // Mettre à jour une déclaration existante
        response = await axios.patch(API.updateDeclaration(slug), data, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Mise à jour réussie!');
      } else {
        // Créer une nouvelle déclaration
        response = await axios.post(API.createDeclaration(), data, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log("les données de la déclaration envoyées:", data);
        toast.success('Déclaration créée avec succès');
      }

      // Réinitialiser le formulaire après succès
      reset();

      // Rediriger l'utilisateur après la soumission
      router.push(paths.dashboard.declaration.list);

    } catch (error) {
      console.error("Erreur lors de l'envoi au backend:", error);

      // Gestion des erreurs spécifiques
      if (error.response) {
        // Erreur liée à la réponse du serveur
        console.error('Erreur avec le serveur:', error.response.data);
        toast.error(`Erreur serveur: ${error.response.data?.message || 'Problème interne du serveur'}`);
      } else if (error.request) {
        // Erreur liée à la requête
        console.error('Erreur avec la requête:', error.request);
        toast.error("Erreur de requête : Vérifiez votre connexion");
      } else {
        // Autres erreurs
        console.error('Erreur générale:', error.message);
        toast.error(`Erreur inconnue: ${error.message}`);
      }

    } finally {
      // Arrêter le chargement, que ce soit en cas de succès ou d'échec
      loadingSend.onFalse();
    }
  });


  return (
    <Form methods={methods}>
      <Card>
        <DeclarationEditStatusDate type={type} />
        <DeclarationNewEditDetails formData={formData} type={type} />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
        // onClick={handleSaveAsDraft}
        >
          Brouillon
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {declaration ? 'Mettre A jour' : 'Créer '}
        </LoadingButton>
      </Stack>
    </Form>
  );
}

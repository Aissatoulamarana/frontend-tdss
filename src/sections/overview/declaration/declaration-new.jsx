import { zodResolver } from '@hookform/resolvers/zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import API from 'src/utils/api';
import { today } from 'src/utils/format-time';

import { Form, schemaHelper } from 'src/components/hook-form';

import { STORAGE_KEY } from 'src/auth/context/jwt/constant';

import { DeclarationNewEditDetails } from './declaration-edit-detail';
import { DeclarationEditStatusDate } from './declaration-status-edit';

// ----------------------------------------------------------------------
// Définition du schéma de validation
export const NewInvoiceSchema = zod.object({
  createDate: schemaHelper.date({
    message: { required_error: 'Create date is required!' },
  }),
  items: zod.array(
    zod.object({
      numero: zod.string().min(1, { message: 'Numero du passeport obligatoire' }),
      fonction: zod.string().min(1, { message: 'le champ fonction est obligatoire!' }),
      telephone: zod.string().min(1, { message: "Entrez votre numero de téléphone " }),
      prenom: zod.string().min(1, { message: 'Entrez votre prenom ' }),
      nom: zod.string().min(1, { message: 'Entrez votre nom ' }),
      empreinte: zod.any().optional(),
      signature: zod.any().optional(),
      recto: zod.any().optional(),
      verso: zod.any().optional(),

    })
  ),
  status: zod.string(),
  declarationNumber: zod.string(),
  type: zod.string(),
});

// Génération d'un ID unique
let currentIdd = 0;
const generateUniqueId = () => {
  currentIdd++;
  const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
  const uniqueId = `DEC-${String(currentIdd).padStart(5, '0')}-${randomPart}`;
  return uniqueId;
};

// ----------------------------------------------------------------------

export function DeclarationNew({ currentInvoice, type }) {
  const router = useRouter();
  const loadingSave = useBoolean();
  const loadingSend = useBoolean();

  // Définition des valeurs par défaut
  const defaultValues = useMemo(() => {
    const generatedDeclarationNumber =
      currentInvoice?.declarationNumber || generateUniqueId();

    return {
      declarationNumber: generatedDeclarationNumber,
      createDate: currentInvoice?.createDate || today(),
      status: currentInvoice?.status || 'brouillon',
      type: type,
      items:
        currentInvoice?.items || [
          {
            numero: '',
            nom: '',
            prenom: '',
            telephone: '',
            fonction: '',
            // Initialisation des champs fichiers à null
            empreinte: null,
            signature: null,
            recto: null,
            verso: null,
          },
        ],
    };
  }, [currentInvoice]);

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

  // Pour le brouillon, envoi du JSON classique
  const handleSaveAsDraft = handleSubmit(async (data) => {
    console.log('Envoi brouillon, données :', data);
    loadingSave.onTrue();
    const access_token = sessionStorage.getItem(STORAGE_KEY);

    try {
      // Simulation d'un délai
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await axios.post(API.createDeclaration(), data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });
      console.log('Brouillon sauvegardé, réponse :', response.data);
      reset();
      loadingSave.onFalse();
      router.push(paths.dashboard.declaration.list);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde brouillon :', error);
      loadingSave.onFalse();
    }
  });

  const handleCreateAndSend = handleSubmit(async (data) => {
    console.log('Envoi final, données :', data);
    loadingSend.onTrue();
    const access_token = sessionStorage.getItem(STORAGE_KEY);

    try {
      data.status = 'soumise';

      // Créer un objet FormData
      const formData = new FormData();
      formData.append('createDate', data.createDate);
      formData.append('declarationNumber', data.declarationNumber);
      formData.append('status', data.status);
      formData.append('type', data.type);

      // Pour chaque item, on ajoute les champs et les fichiers
      data.items.forEach((item, index) => {
        formData.append(`items[${index}][numero]`, item.numero);
        formData.append(`items[${index}][nom]`, item.nom);
        formData.append(`items[${index}][prenom]`, item.prenom);
        formData.append(`items[${index}][telephone]`, item.telephone);
        formData.append(`items[${index}][fonction]`, item.fonction);

        // Ajout des fichiers s'ils existent
        if (item.empreinte instanceof File) {
          formData.append(`items[${index}][empreinte]`, item.empreinte);
        }
        if (item.signature instanceof File) {
          formData.append(`items[${index}][signature]`, item.signature);
        }
        if (item.recto instanceof File) {
          formData.append(`items[${index}][recto]`, item.recto);
        }
        if (item.verso instanceof File) {
          formData.append(`items[${index}][verso]`, item.verso);
        }
      });

      // Envoyer la requête avec FormData
      const response = await axios.post(API.createDeclaration(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log('Réponse finale du backend :', response.data);
      reset();
      loadingSend.onFalse();
      router.push(paths.dashboard.declaration.list);
    } catch (error) {
      console.error("Erreur lors de l'envoi final :", error);
      loadingSend.onFalse();
    }
  });



  return (
    <Form methods={methods}>
      <Card>
        <DeclarationEditStatusDate type={type} />
        <DeclarationNewEditDetails />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          color="inherit"
          size="large"
          variant="outlined"
          loading={loadingSave.value && isSubmitting}
          onClick={handleSaveAsDraft}
        >
          Brouillon
        </LoadingButton>

        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend.value && isSubmitting}
          onClick={handleCreateAndSend}
        >
          {currentInvoice ? 'Mettre A jour' : 'Soumettre'}
        </LoadingButton>
      </Stack>
    </Form>
  );
}

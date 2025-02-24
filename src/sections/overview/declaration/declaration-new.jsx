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

import { Form } from 'src/components/hook-form';

import { STORAGE_KEY } from 'src/auth/context/jwt/constant';

import { toast } from 'sonner';
import { DeclarationNewEditDetails } from './declaration-edit-detail';
import { DeclarationEditStatusDate } from './declaration-status-edit';

// ----------------------------------------------------------------------
// Définition du schéma de validation
export const NewInvoiceSchema = zod.object({
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
      attestation: zod.any().optional(),
      certificat: zod.any().optional(),
      contrat: zod.any().optional(),
      dossierCriminel: zod.any().optional(),
      dossierMedical: zod.any().optional(),
      diplomes: zod.any().optional(),
      cv: zod.any().optional(),
      passeport: zod.any().optional(),
      planPanafricanisation: zod.any().optional(),


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

export function DeclarationNew({ currentInvoice, type, formData }) {
  const router = useRouter();
  const loadingSave = useBoolean();
  const loadingSend = useBoolean();



  // Définition des valeurs par défaut
  const defaultValues = useMemo(() => {
    const generatedDeclarationNumber =
      currentInvoice?.declarationNumber || generateUniqueId();

    return {
      declarationNumber: generatedDeclarationNumber,
      status: currentInvoice?.status || 'brouillon',
      type: type,

      items: formData.length > 0
        ? formData
        : currentInvoice?.items || [
          {
            numero: '',
            nom: '',
            prenom: '',
            telephone: '',
            fonction: '',
            identifier: '',
            // Initialisation des champs fichiers à null
            empreinte: null,
            signature: null,
            recto: null,
            verso: null,
            attestation: null,
            certificat: null,
            contrat: null,
            dossierCriminel: null,
            dossierMedical: null,
            diplomes: null,
            cv: null,
            passeport: null,
            planPanafricanisation: null,
          },
        ],
    };
  }, [currentInvoice, formData]);

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

  // Pour le brouillon, envoi du JSON classique
  const handleSaveAsDraft = handleSubmit(async (data) => {
    console.log('Envoi brouillon, données :', data);
    loadingSave.onTrue();
    const access_token = sessionStorage.getItem(STORAGE_KEY);

    try {

      // Créer un objet FormData
      const formData = new FormData();
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

      console.log('Brouillon sauvegardé, réponse :', response.data);
      reset();
      loadingSave.onFalse();
      toast.success("Brouillon sauvegardé !")
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
      toast.success("Déclaration soumise avec succès !")
      router.push(paths.dashboard.declaration.list);
    } catch (error) {
      console.error("Erreur lors de l'envoi final :", error);
      loadingSend.onFalse();
    }
  });

  // const identifierValue = useWatch({ control: methods.control, name: 'identifier' });
  // useEffect(() => {
  //   if (identifierValue) {
  //     // Récupérer le tableau des items du formulaire
  //     const items = methods.getValues('items');
  //     // Trouver l'index de l'item qui correspond à l'identifiant saisi
  //     const index = items.findIndex(item => item.identifier === identifierValue);
  //     if (index !== -1) {
  //       axios.get(API.searchIdentifier(identifierValue))
  //         .then(response => {
  //           const person = response.data.data;
  //           // Mise à jour dynamique des champs de l'item correspondant
  //           methods.setValue(`items[${index}].numero`, person.numero);
  //           methods.setValue(`items[${index}].nom`, person.nom);
  //           methods.setValue(`items[${index}].prenom`, person.prenom);
  //           methods.setValue(`items[${index}].telephone`, person.telephone);
  //           methods.setValue(`items[${index}].fonction`, person.fonction);
  //         })
  //         .catch(error => console.error('Erreur lors de la récupération des données :', error));
  //     }
  //   }
  // }, [identifierValue, methods]);


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

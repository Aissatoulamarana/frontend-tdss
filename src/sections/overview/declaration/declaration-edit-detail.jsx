import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useState, useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Step, Modal, Stepper, StepLabel } from '@mui/material';


import API from 'src/utils/api';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------


export function DeclarationNewEditDetails({ }) {
  const { control, setValue, watch } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const values = watch();

  const handleAdd = () => {
    append({
      numero: '',
      nom: '',
      fonction: '',
      prenom: '',
      telephone: '',
      passportExists: false,
      // On initialise les fichiers à null (ils seront mis à jour via le modal)
      recto: null,
      verso: null,
      signature: null,
      empreinte: null,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };


  // Ouvre le modal pour les données biométriques
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Ferme le modal et réinitialise le stepper
  const handleCloseModal = () => {
    setOpenModal(false);
    setActiveStep(0);
  };

  // Passe à l'étape suivante (tant que l'étape active est inférieure à 3)
  const handleNext = () => {
    if (activeStep < 3) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Retour à l'étape précédente
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    }
  };

  // Handler générique pour gérer l'upload d'un fichier.
  // On passe le nom du champ à mettre à jour dans le formulaire.
  const handleImageUpload = (fieldName) => (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log(`Fichier sélectionné pour ${fieldName}:`, files[0]);
      setValue(fieldName, files[0]);
    } else {
      console.log(`Aucun fichier sélectionné pour ${fieldName}`);
    }
  };



  // Exemple de fonction "finish" : ici, on ferme simplement le modal.
  // Vous pouvez ajouter d'autres traitements si besoin.
  const handleFinish = () => {


    handleCloseModal();
  };


  useEffect(() => {
    const fetchFonctions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API.listFonctions());
        console.log('Données reçues :', response.data); // Vérifie le retour du backend

        if (response.data && response.data.fonctions) {
          const fonctions = response.data.fonctions.map((fonction) => ({
            value: fonction.name,
            label: fonction.name,
            id: fonction.id, // Ajout de l'ID pour éviter le problème de key
          }));
          console.log('Options mises à jour :', fonctions);
          setOptions(fonctions);
        } else {
          console.error('Aucune fonction reçue');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des fonctions :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFonctions();
  }, []);

  const handleSelectService = useCallback(
    (index, option) => {
      const selectedService = options.find((fonction) => fonction.value === option);
      if (selectedService) {
        setValue('serviceField', selectedService);
      }
    },
    [setValue, options]
  );

  // useEffect(() => {
  //   // Ajouter les données importées lorsqu'elles changent
  //   if (formData && formData.length > 0) {
  //     formData.forEach((data) => {
  //       console.log(data);
  //       append({
  //         numero: data['Numero Passeport '] || '', // Adaptation de "Numero Passeport"
  //         nom: data.Nom || '', // Adaptation de "Nom"
  //         fonction: data.Fonction || '', // Adaptation de "Fonction"
  //         prenom: data['Prénom'] || '', // Adaptation de "Prénom"
  //         telephone: data['Téléphone'] || '', // Adaptation de "Nationalité"
  //         passportExists: false, // On pourra déclencher la vérification ensuite si besoin
  //       });
  //     });
  //   }
  // }, [formData, append]);

  // Fonction debounced pour vérifier le numéro du passeport en temps réel
  const checkPassportExistence = async (numero, index) => {
    if (!numero) return;
    try {
      const response = await axios.get(API.searchPassport(numero));
      if (response.data.exists) {
        setValue(`items[${index}].passportExists`, true);
        setValue(`items[${index}].type`, '');
      } else {
        setValue(`items[${index}].passportExists`, false);
        setValue(`items[${index}].type`, 'Nouvelle');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche du passeport', error);
    }
  };

  // Création de la version debounce de la fonction
  // On utilise ici 500ms de délai après la dernière saisie
  const debouncedPassportCheck = useCallback(
    debounce((numero, index) => {
      checkPassportExistence(numero, index);
    }, 500),
    []
  );

  // Handler pour le changement de la saisie du numéro de passeport
  const handlePassportChange = (e, index) => {
    const numero = e.target.value;
    setValue(`items[${index}].numero`, numero);
    debouncedPassportCheck(numero, index);
  };




  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Informations Personnelles
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>

              <Field.Text
                size="small"
                name={`items[${index}].numero`}
                label="Numero Passeport"

                inputlabelprops={{ shrink: true }}
                onChange={(e) => handlePassportChange(e, index)}
                error={values.items && values.items[index]?.passportExists} // Active l'erreur si le passeport existe
                helperText={
                  values.items && values.items[index]?.passportExists
                    ? 'Ce numéro de passeport existe déjà ca sera une duplicata ou un renouvellement '
                    : ''
                }
              />

              <Field.Phone
                size="small"
                name={`items[${index}].telephone`}
                label="Numéro de Téléphone"
                placeholder="votre numero de téléphone  "
                sx={{ width: '100%' }}
                inputlabelprops={{ shrink: true }}
              />

              <Field.Text
                size="small"
                name={`items[${index}].nom`}
                label="Nom "
                inputlabelprops={{ shrink: true }}
              />
              <Field.Text
                size="small"
                name={`items[${index}].prenom`}
                label="Prénom"
                inputlabelprops={{ shrink: true }}
              />

              <Field.Select
                name={`items[${index}].fonction`}
                size="small"
                label="Fonction"
                inputlabelprops={{ shrink: true }}
                sx={{ maxWidth: { md: 160 } }}
              >
                <MenuItem
                  // onClick={() => handleClearService(index)}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>

                <Divider sx={{ borderStyle: 'dashed' }} />

                {options.map((fonction) => (
                  <MenuItem
                    key={fonction.value} // Utilisation de value au lieu d'id
                    value={fonction.value} // Assure-toi d'utiliser value et non name
                    onClick={() => handleSelectService(index, fonction.value)}
                  >
                    {fonction.label} {/* Affiche label au lieu de name */}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>


            <Button onClick={handleOpenModal} variant="outlined">
              Données Biometriques
            </Button>

            {/* Modal pour les données biométriques */}
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box
                sx={{
                  width: '60%',
                  maxWidth: 600,
                  margin: 'auto',
                  mt: 10,
                  p: 3,
                  bgcolor: 'background.paper',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(15%, 60%)',
                }}
              >
                <Stepper activeStep={activeStep} alternativeLabel>
                  {['Recto', 'Verso', 'Signature', 'Empreinte'].map((label, i) => (
                    <Step key={i}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Button onClick={handleBack} disabled={activeStep === 0}>
                      Retour
                    </Button>
                    <Button onClick={activeStep === 3 ? handleFinish : handleNext}>
                      {activeStep === 3 ? 'Terminer' : 'Suivant'}
                    </Button>
                  </Stack>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" align="center">
                      {['Recto', 'Verso', 'Signature', 'Empreinte'][activeStep]}
                    </Typography>

                    {/* Utilisation du composant UploadWithPreview pour chaque étape */}
                    {activeStep === 0 && (
                      <Field.UploadAvatar
                        name={`items[${index}].recto`}
                        maxSize={3145728}
                        helperText={
                          <Typography variant="caption">
                            Allowed *.jpeg, *.jpg, *.png, *.gif
                          </Typography>
                        }
                        onChange={handleImageUpload(`items[${index}].recto`)}
                      />
                    )}
                    {activeStep === 1 && (
                      <Field.UploadAvatar
                        name={`items[${index}].verso`}
                        maxSize={3145728}
                        helperText={
                          <Typography variant="caption">
                            Allowed *.jpeg, *.jpg, *.png, *.gif
                          </Typography>
                        }
                        onChange={handleImageUpload(`items[${index}].verso`)}
                      />
                    )}
                    {activeStep === 2 && (
                      <Field.UploadAvatar
                        name={`items[${index}].signature`}
                        type="file"
                        maxSize={3145728}
                        helperText={
                          <Typography variant="caption">
                            Allowed *.jpeg, *.jpg, *.png, *.gif
                          </Typography>
                        }
                        onChange={handleImageUpload(`items[${index}].signature`)}
                      />
                    )}
                    {activeStep === 3 && (
                      <Field.UploadAvatar
                        name={`items[${index}].empreinte`}
                        maxSize={3145728}
                        helperText={
                          <Typography variant="caption">
                            Allowed *.jpeg, *.jpg, *.png, *.gif
                          </Typography>
                        }
                        onChange={handleImageUpload(`items[${index}].empreinte`)}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Modal>
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              Supprimer
            </Button>
          </Stack>



        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add Item
        </Button>
      </Stack>




    </Box>
  );
}
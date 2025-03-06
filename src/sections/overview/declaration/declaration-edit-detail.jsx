import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'src/utils/axios';
import debounce from 'lodash.debounce';
import { useState, useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Step, Modal, Stepper, StepLabel, IconButton } from '@mui/material';


import API from 'src/utils/api';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------


export function DeclarationNewEditDetails({ formData, type }) {
  const { control, setValue, watch } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDoc, setOpenModalDoc] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState();

  const typedec = type?.trim();

  const { fields, append, remove } = useFieldArray({ control, name: 'employees' });

  const values = watch();

  const handleAdd = () => {
    append({
      passport_number: '',
      last: '',
      job: '',
      first: '',
      phone: '',
      passportExists: false,
      // On initialise les fichiers à null (ils seront mis à jour via le modal)
      recto: null,
      verso: null,
      signature: null,
      empreinte: null,
      attestation: null,
      certificat: null,
      contrat: null,
      dossierCriminel: null,
      dossierMedical: null,
      diplomes: null,
      cv: null,
      passeport: null,
      planPanafricanisation: null,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };


  // Ouvre le modal pour les données biométriques
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleOpenModalDoc = () => {
    setOpenModalDoc(true);
  };


  const handleCloseModalDoc = () => {

    setOpenModalDoc(false);

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
    const { files } = event.target;
    if (files && files.length > 0) {
      console.log(`Fichier sélectionné pour ${fieldName}:`, files[0]);
      setValue(fieldName, files[0]);
    } else {
      console.log(`Aucun fichier sélectionné pour ${fieldName}`);
    }
  };

  const handleUploadDoc = (fieldName) => (event) => {
    const doc = event.target.files;
    if (doc && doc.length > 0) {
      setValue(fieldName, doc[0]);
    } else {
      console.log(`Aucun fichier sélectionné pour ${fieldName}`);
    }
  }

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

        if (response.data && response.data) {
          const fonctions = response.data.map((fonction) => ({
            value: String(fonction.id),
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

  useEffect(() => {
    if (formData && formData.length > 0) {
      formData.forEach((data) => {
        console.log(data);

        append({
          passport_number: data["Numero "]?.trim() || '', // Suppression espace
          last: data.Nom || '',
          job: data.Fonction || '',
          first: data.Prenom || '',
          phone: `+${String(data.Telephone)}` || '',
          passportExists: false,
        });
      });
    }
  }, [formData, append]);


  // Fonction debounced pour vérifier le numéro du passeport en temps réel
  const checkPassportExistence = async (numero, index) => {
    if (!numero) return;
    try {
      const response = await axios.get(API.searchPassport(numero));
      setData(response.data.data)
      console.log('les informations du detenteur de ce passport ', response.data.data)
      if (response.data.exists) {
        setValue(`employees[${index}].passportExists`, true);
      } else {
        setValue(`employees[${index}].passportExists`, false);
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
    setValue(`employees[${index}].passport_number`, numero);
    debouncedPassportCheck(numero, index);
  };



  //  Créer la fonction qui vérifie l'identifier
  const checkIdentifier = async (identifier, index) => {
    if (!identifier) return;
    try {
      const response = await axios.get(API.searchIdentifier(identifier));
      const person = response.data.data;
      // Mise à jour dynamique des champs de l'item correspondant
      setValue(`employees[${index}].passport_number`, person.numero);
      setValue(`employees[${index}].last`, person.nom);
      setValue(`employees[${index}].first`, person.prenom);
      setValue(`employees[${index}].phone`, person.telephone);
      setValue(`employees[${index}].job`, person.fonction);
      debouncedPassportCheck(person.numero, index);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  //  Créer une version debounced pour éviter trop d'appels à l'API
  const debouncedIdentifierCheck = useCallback(
    debounce((identifier, index) => {
      checkIdentifier(identifier, index);
    }, 500),
    []
  );

  //  Créer le handler pour le champ identifier
  const handleIdentifierChange = (e, index) => {
    const identifier = e.target.value;
    setValue(`employees[${index}].identifier`, identifier);
    debouncedIdentifierCheck(identifier, index);
  };

  const allDocuments = [
    { label: "Déclaration d'attestation", key: "attestation" },
    { label: "Certificat de régulation sociale", key: "certificat" },
    { label: "Contrat de travail", key: "contrat" },
    { label: "Dossier criminel", key: "dossierCriminel" },
    { label: "Dossier médical (3 derniers mois)", key: "dossierMedical" },
    { label: "Copies des diplômes", key: "diplomes" },
    { label: "CV", key: "cv" },
    { label: "Passeport", key: "passeport" },
    { label: "Plan de panafricanisation", key: "planPanafricanisation" },
  ];

  // Si le type est "Duplicata", on ne garde que "Certificat de perte" et "CV"
  const filteredDocuments = typedec === "Duplicata"
    ? [{ label: "Certificat de perte", key: "certificatPerte" }, { label: "CV", key: "cv" }]
    : allDocuments;


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Informations Personnelles
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              {typedec == 'Renouvellement' || typedec == 'Duplicata' && (
                <Field.Text
                  size="small"
                  name={`employees[${index}].identifier`}
                  label="Identifiant"
                  inputlabelprops={{ shrink: true }}
                  onChange={(e) => handleIdentifierChange(e, index)}
                />
              )}

              <Field.Text
                size="small"
                name={`employees[${index}].passport_number`}
                label="Numéro Passeport"
                inputlabelprops={{ shrink: true }}
                onChange={(e) => handlePassportChange(e, index)}
                error={typedec === "Nouvelle" && Boolean(values.employees?.[index]?.passportExists)}
                helperText={
                  values.employees?.[index]?.passportExists
                    ? typedec === "Nouvelle"
                      ? "❌ Ce numéro de passeport existe déjà. Cela devrait être un duplicata ou un renouvellement."
                      : "✅ Ce passeport existe déjà, il est bien enregistré."
                    : ""
                }
                sx={{
                  "& .MuiFormHelperText-root": {
                    color: values.employees?.[index]?.passportExists
                      ? typedec === "Nouvelle"
                        ? "error.main"
                        : "success.main"
                      : "inherit"
                  }
                }}
              />




              <Field.Phone
                size="small"
                name={`employees[${index}].phone`}
                label="Numéro de Téléphone"
                placeholder="votre numero de téléphone  "
                sx={{ width: '100%' }}
                inputlabelprops={{ shrink: true }}
              />

              <Field.Text
                size="small"
                name={`employees[${index}].last`}
                label="Nom "
                inputlabelprops={{ shrink: true }}
              />
              <Field.Text
                size="small"
                name={`employees[${index}].first`}
                label="Prénom"
                inputlabelprops={{ shrink: true }}
              />

              <Field.Select
                name={`employees[${index}].job`}
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
                    key={fonction.id} // Utilisation de value au lieu d'id
                    value={fonction.value} // Assure-toi d'utiliser value et non name
                    onClick={() => handleSelectService(index, fonction.value)}
                  >
                    {fonction.label} {/* Affiche label au lieu de name */}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>


            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {typedec !== "Duplicata" && (
                <Button onClick={handleOpenModal} variant="outlined">
                  {typedec === "Renouvellement" ? "Ancien Permis" : "Données Biométriques"}
                </Button>
              )}

              <Button onClick={handleOpenModalDoc} variant="outlined">
                Joindre Documents
              </Button>
            </Stack>

            {/* Modal pour les documents */}
            <Modal open={openModalDoc} onClose={handleCloseModalDoc}>
              <Box
                sx={{
                  width: '60%',
                  maxWidth: 600,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  p: 3,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mt: 3, textAlign: 'center' }}>Documents à joindre</Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {filteredDocuments.map((doc) => (
                    <Stack key={doc.key} direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {doc.label}
                      </Typography>
                      <IconButton
                        variant="outlined"
                        component="label"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: 1,
                          borderColor: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                          },
                        }}
                      >
                        <Iconify icon="solar:attach-circle-bold" width={20} />
                        <input
                          type="file"
                          onChange={handleUploadDoc(`items[${index}].${doc.key}`)}
                        />
                      </IconButton>

                      {/* Icône pour voir le fichier s'il est téléchargé */}
                      {watch(`items[${index}].${doc.key}`) && (
                        <IconButton
                          color="primary"
                          component="a"
                          href={URL.createObjectURL(watch(`items[${index}].${doc.key}`))}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Iconify icon="solar:eye-bold" width={24} />
                        </IconButton>
                      )}
                    </Stack>
                  ))}
                </Stack>

              </Box>
            </Modal>


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
                {/* Condition : Si Renouvellement -> Upload seul, sinon Stepper */}
                {typedec === "Renouvellement" ? (
                  <>
                    <Typography variant="h6" align="center" gutterBottom>
                      Upload de l'Ancien Permis
                    </Typography>
                    <Field.UploadAvatar
                      name="ancienPermis"
                      maxSize={3145728}
                      helperText={
                        <Typography variant="caption">
                          Formats autorisés : *.jpeg, *.jpg, *.png, *.gif
                        </Typography>
                      }
                      onChange={handleImageUpload("ancienPermis")}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
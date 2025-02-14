import { useEffect, useCallback, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import API from 'src/utils/api';
import axios from 'axios';
import debounce from 'lodash.debounce';

// ----------------------------------------------------------------------

export function DeclarationNewEditDetails({ formData, setFormData }) {
  const { control, setValue, watch } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const values = watch();

  const handleAdd = () => {
    append({
      numero: '',
      type: 'Nouvelle',
      nom: '',
      fonction: '',
      prenom: '',
      nationalite: '',
      passportExists: false, // Par défaut, on considère que le passport n'existe pas
    });
  };

  const handleRemove = (index) => {
    remove(index);
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

  useEffect(() => {
    // Ajouter les données importées lorsqu'elles changent
    if (formData && formData.length > 0) {
      formData.forEach((data) => {
        console.log(data);
        append({
          numero: data['Numero Passeport '] || '', // Adaptation de "Numero Passeport"
          type: data['Type'] || '', // Adaptation de "Type"
          nom: data['Nom'] || '', // Adaptation de "Nom"
          fonction: data['Fonction'] || '', // Adaptation de "Fonction"
          prenom: data['Prénom'] || '', // Adaptation de "Prénom"
          nationalite: data['Nationalité'] || '', // Adaptation de "Nationalité"
          passportExists: false, // On pourra déclencher la vérification ensuite si besoin
        });
      });
    }
  }, [formData, append]);

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
                type="number"
                inputlabelprops={{ shrink: true }}
                onChange={(e) => handlePassportChange(e, index)}
                error={values.items && values.items[index]?.passportExists} // Active l'erreur si le passeport existe
                helperText={
                  values.items && values.items[index]?.passportExists
                    ? 'Ce numéro de passeport existe déjà'
                    : ''
                }
              />
              {/* Champ "Type" affiché en fonction de l'existence du passeport */}
              {values.items && values.items[index] && values.items[index].passportExists ? (
                <Field.Select
                  name={`items[${index}].type`}
                  size="small"
                  label="Type"
                  inputlabelprops={{ shrink: true }}
                >
                  <MenuItem value="Duplicata">Duplicata</MenuItem>
                  <MenuItem value="Renouvellement">Renouvellement</MenuItem>
                </Field.Select>
              ) : (
                <Field.Text
                  size="small"
                  name={`items[${index}].type`}
                  label="Type"
                  inputlabelprops={{ shrink: true }}
                  disabled
                />
              )}

              <Field.CountrySelect
                size="small"
                name={`items[${index}].nationalite`}
                label="Nationalité"
                placeholder="Selectionnez un pays "
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

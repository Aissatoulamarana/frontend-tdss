"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import debounce from 'lodash.debounce';
import { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useForm, useFieldArray } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input/input';
import { useRouter } from 'src/routes/hooks';

import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

import API from 'src/utils/api';
import axios from 'src/utils/axios';
import { toast } from 'sonner';
import { Iconify } from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';


// Schéma pour un employé individuel
export const employeSchema = zod.object({
  first: zod.string().min(1, { message: 'le prenom est obligatoire' }),
  last: zod.string().min(1, { message: 'le nom est obligatoire' }),
  passport_number: zod.string().min(1, { message: 'le numero de passeport est obligatoire' }),
  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  job: zod.string().min(1, { message: 'le type est requis!' }),
  type: zod.string().default('NEW')
});

// Schéma global pour le formulaire qui attend un tableau d'employés
const formSchema = zod.object({
  employees: zod.array(employeSchema).min(1, { message: 'Veuillez ajouter au moins un employé.' }),
});

export function DeclarationAddEmployee({ declaration, open, onClose }) {
  const [options, setOptions] = useState([]);
  const router = useRouter();
  const loadingSend = useBoolean();

  // Utilisation du schéma global pour la validation
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues: {
      employees: [
      ],
    },
  });

  // useFieldArray pour gérer le tableau 'employees'
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'employees' });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAddEmployee = handleSubmit(async (data) => {
    loadingSend.onTrue();
    try {
      // Simuler un délai d'une demi-seconde
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { slug } = declaration;
      // On enveloppe les employés dans un objet, selon l'attente du backend
      const payload = data.employees;
      const response = await axios.post(API.AddEmploye(slug), payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Employés ajoutés avec succès!');
      reset();
      onClose();
      router.push(paths.dashboard.declaration.details(declaration.slug));
    } catch (error) {
      console.error("Erreur lors de l'envoi au backend:", error);
      if (error.response) {
        console.error('Erreur avec le serveur:', error.response.data);
        toast.error(`Erreur serveur: ${error.response.data?.message || 'Problème interne du serveur'}`);
      } else if (error.request) {
        console.error('Erreur avec la requête:', error.request);
        toast.error("Erreur de requête : Vérifiez votre connexion");
      } else {
        console.error('Erreur générale:', error.message);
        toast.error(`Erreur inconnue: ${error.message}`);
      }
    } finally {
      loadingSend.onFalse();
    }
  });

  // Ajoute un nouvel employé avec des valeurs par défaut
  const handleAdd = () => {
    append({
      passport_number: '',
      last: '',
      job: '',
      first: '',
      phone: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  // Exemple de vérification du numéro de passeport avec debounce
  const checkPassportExistence = async (numero) => {
    if (!numero) return;
    try {
      const response = await axios.post(API.searchPassport(numero));
      if (response.data.exists) {
        toast.error('❌ Ce numéro de passeport existe déjà.');
      } else {
        toast.success("✅ Ce passeport n'existe pas");
      }
    } catch (error) {
      console.error('Erreur lors de la recherche du passeport', error);
    }
  };

  const debouncedPassportCheck = useCallback(
    debounce((numero) => {
      checkPassportExistence(numero);
    }, 5000),
    []
  );

  // Gestion du changement pour le numéro de passeport
  const handlePassportChange = (e, index) => {
    const {value} = e.target;
    methods.setValue(`employees[${index}].passport_number`, value);
    debouncedPassportCheck(value);
  };

  useEffect(() => {
    const fetchFonctions = async () => {
      try {
        const response = await axios.get(API.listFonctionAgent());
        if (response.data && response.data.results) {
          const fonctions = response.data.results.map((fonction) => ({
            value: fonction.slug,
            label: fonction.name,
          }));
          setOptions(fonctions);
        } else {
          console.error('Aucune fonction reçue');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des fonctions :', error);
      }
    };
    fetchFonctions();
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      slotProps={{
        sx: {
          width: '70%',
          maxWidth: 800,
        },
      }}
    >
      <Form methods={methods} onSubmit={handleAddEmployee}>
        <DialogTitle>Ajout d'autres employés</DialogTitle>
        <DialogContent>
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
                      name={`employees[${index}].passport_number`}
                      label="Numéro Passeport"
                      inputlabelprops={{ shrink: true }}
                      onChange={(e) => handlePassportChange(e, index)}
                    />
                    <Field.Phone
                      size="small"
                      name={`employees[${index}].phone`}
                      label="Numéro de Téléphone"
                      placeholder="votre numero de téléphone"
                      sx={{ width: '100%' }}
                      inputlabelprops={{ shrink: true }}
                    />
                    <Field.Text
                      size="small"
                      name={`employees[${index}].last`}
                      label="Nom"
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
                      <MenuItem sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        None
                      </MenuItem>
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      {options.map((fonction) => (
                        <MenuItem key={fonction.value} value={fonction.value}>
                          {fonction.label}
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
            <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-end', md: 'center' }}>
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
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Retour
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Ajouter
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

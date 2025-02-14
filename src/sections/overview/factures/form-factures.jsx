import React, {useEffect} from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Box, Stack, Button, MenuItem, Typography, TextField } from '@mui/material';
import { Form, Field } from 'src/components/hook-form';
import API from 'src/utils/api';

// Define the Zod schema
const NewPayeurSchema = z.object({
  nom: z.string().min(1, { message: 'Le nom est obligatoire' }),
  prenom: z.string().min(1, { message: 'Le prénom est obligatoire' }),
  email: z.string().email({ message: 'Email invalide' }),
  telephone: z.string().min(1, { message: 'Le téléphone est obligatoire' }),
  pays: z.string().min(1, { message: 'Selectionnez un pays' }),
  devise: z.string().min(1, { message: 'La devise est obligatoire' }),
  numero_compte: z.string().min(1, { message: 'Le numéro de compte est obligatoire' }),
  
  
});



export function PayeurForm({id}) {
  // Create a single form instance
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPayeurSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      devise: 'USD',
      numero_compte: '',
      pays: '',
      facture_id: id || '', // Initialise avec id
    },
  });
  // Destructure the properties from the same form instance
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue, 
    control,
  } = methods;



  useEffect(() => {
    if (id) {
      setValue('facture_id', id); // Met à jour facture_id dynamiquement
      console.log(' id de la facture', id);
    }
  }, [id, setValue]);

  // Use useFieldArray with the same control instance
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

 
  const onSubmit = handleSubmit(async (data) => {
    data.facture_id = id; // ✅ Forcer l'ajout si besoin
    
    console.log("Données envoyées:", data); // Vérification
  
    if (!data.facture_id) {
      console.error("Erreur : facture_id est manquant !");
      return;
    }
  
    try {
      const response = await axios.post(API.CreatePayeur(), data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Réponse du backend:', response.data);
      reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi au backend:", error);
    }
  });
  


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Information du Payeur
      </Typography>
      {/* Wrap your form with FormProvider */}
   
         <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Nom"
              {...register('nom')}
              error={Boolean(errors.nom)}
              helperText={errors.nom?.message}
              fullWidth
            />
            <TextField
              label="Prénom"
              {...register('prenom')}
              error={Boolean(errors.prenom)}
              helperText={errors.prenom?.message}
              fullWidth
            />
            <TextField
              label="Email"
              {...register('email')}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              fullWidth
            />
            <TextField
              label="Téléphone"
              {...register('telephone')}
              error={Boolean(errors.telephone)}
              helperText={errors.telephone?.message}
              fullWidth
            />
            <TextField
              select
              label="Devise"
              {...register('devise')}
              error={Boolean(errors.devise)}
              helperText={errors.devise?.message}
              fullWidth
            >
              <MenuItem value="USD">USD (Dollar)</MenuItem>
              <MenuItem value="GNF">GNF (Franc Guinéen)</MenuItem>
            </TextField>
            <TextField
              label="Numéro de Compte"
              {...register('numero_compte')}
              error={Boolean(errors.numero_compte)}
              helperText={errors.numero_compte?.message}
              fullWidth
            />
           
              <Field.CountrySelect
                fullWidth
                size="small"
                name="pays"
                label="Nationalité"
                placeholder="Selectionnez un pays"
                sx={{ width: '100%' }}
                inputlabelprops={{ shrink: true }}
              />
           
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Enregistrer
            </Button>
          </Stack>
        </Form>
      
    </Box>
  );
}

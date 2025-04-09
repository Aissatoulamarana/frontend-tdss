"use client";
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { Field } from 'src/components/hook-form';
import { getEntreprises } from 'src/utils/options';

import { useMockedUser } from 'src/auth/hooks';


// ----------------------------------------------------------------------

export function DeclarationEditStatusDate({ type }) {
  const { watch } = useFormContext();
  const [loaded, setLoaded] = useState(false);
  const [entreprises, setEntreprises] = useState([]);

  const user = useMockedUser()

  const values = watch();

  useEffect(() => {
    // Récupérer les options lors du chargement du composant
    getEntreprises().then(data => setEntreprises(data));
  }, []);


  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      {/* {user.type_code === 'ENTREPRISE' && */}
      <Field.Select
        fullWidth
        name='company'
        label='Entreprise *'
        placeholder="veuillez selectionnez l'entreprise dont vous déclarez"
      >
        {entreprises.map((company) => (
          <MenuItem key={company.slug} value={company.slug} sx={{ textTransform: 'capitalize' }}>
            {company.name}
          </MenuItem>
        ))}
      </Field.Select>
      {/* } */}

      <Field.Select
        disabled
        fullWidth
        name="status"
        label="Status"
        InputLabelProps={{ shrink: true }}
      >
        {['rejettée', 'soumise', 'validée', 'brouillon'].map((option) => (
          <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
            {option}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.Text

        name="title"
        label="Titre de la declaration *"
        InputLabelProps={{ shrink: true }}
      />

    </Stack>
  );
}

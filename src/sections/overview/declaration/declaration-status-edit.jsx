"use client";
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormContext } from 'react-hook-form';
import { useEffect, useState, useCallback } from 'react';

import { Field } from 'src/components/hook-form';
import { useMockedUser } from 'src/auth/hooks';

// Import des données mock pour les entreprises
import { mockFetchCompanies } from 'src/_mock/companies';


// ----------------------------------------------------------------------

export function DeclarationEditStatusDate({ type }) {
  const { watch, setValue } = useFormContext();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState('/api/companies/?page=1'); // URL de la première page
  const [previousUrl, setPreviousUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const user = useMockedUser();

  const values = watch();

  // Fonction pour extraire le numéro de page d'une URL
  const getPageFromUrl = (url) => {
    if (!url) return 1;
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // Fonction pour charger les entreprises (simulée)
  const fetchCompanies = useCallback(async (url, append = false) => {
    if (!url) return; // Plus rien à charger

    setLoading(true);
    try {
      // Extraire le numéro de page de l'URL
      const page = getPageFromUrl(url);
      setCurrentPage(page);

      // Simuler l'appel API avec notre fonction mock
      const response = await mockFetchCompanies(page);
      const { data } = response;

      // Transformer les données pour le format attendu par le sélecteur
      const newCompanies = data.results.map((company) => ({
        value: company.slug,
        label: company.name,
        slug: company.slug,
      }));

      // Mettre à jour la liste des entreprises
      setCompanies((prev) => append ? [...prev, ...newCompanies] : newCompanies);
      
      // Mettre à jour les URLs de pagination
      setNextUrl(data.next);
      setPreviousUrl(data.previous);
    } catch (error) {
      console.error("Erreur lors de la récupération des entreprises:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les entreprises au chargement du composant
  useEffect(() => {
    fetchCompanies('/api/companies/?page=1');
  }, [fetchCompanies]);

  // Handler pour sélectionner une entreprise
  const handleSelectCompany = useCallback(
    (option) => {
      const selectedCompany = companies.find((company) => company.value === option);
      if (selectedCompany) {
        setValue('companyField', selectedCompany);
      }
    },
    [setValue, companies]
  );


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
        placeholder="Veuillez sélectionner l'entreprise dont vous déclarez"
        slotProps={{
          select: {
            MenuProps: {
              PaperProps: {
                onScroll: (event) => {
                  // Charger plus d'entreprises quand on atteint le bas
                  const bottom =
                    event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
                  if (bottom && nextUrl && !loading) {
                    fetchCompanies(nextUrl, true); // Charger les suivants
                  }

                  // Charger les précédents quand on atteint le haut
                  const top = event.target.scrollTop === 0;
                  if (top && previousUrl && !loading) {
                    fetchCompanies(previousUrl, true); // Charger les précédents
                  }
                },
                style: {
                  maxHeight: 200, // Pour activer le scroll
                },
              },
            },
          },
        }}
      >
        <MenuItem sx={{ fontStyle: 'italic', color: 'text.secondary' }} value="">
          Aucune entreprise sélectionnée
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />
        {companies.map((company) => (
          <MenuItem
            key={company.slug}
            value={company.value}
            onClick={() => handleSelectCompany(company.value)}
          >
            {company.label}
          </MenuItem>
        ))}
        {loading && (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        )}
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

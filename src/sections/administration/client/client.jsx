'use client';

import { useState } from 'react';
import { Box, Card, CardContent, Button } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import Link from '@mui/material/Link';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

export function Client() {
  const [customOptions, setCustomOptions] = useState([]);

  const handleAddOption = () => {
    const newOption = prompt('Entrez le nom de la nouvelle catégorie :');
    if (newOption) {
      setCustomOptions([
        ...customOptions,
        {
          name: newOption,
          icon: <PublicIcon sx={{ fontSize: 40, color: 'gray' }} />,
          link: `/dashboard/client/${newOption.toLowerCase()}`,
        },
      ]);
    }
  };

  const options = [
    {
      name: 'Banque',
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: 'blue' }} />,
      link: paths.dashboard.client.bank,
    },
    {
      name: 'Entreprises',
      icon: <BusinessIcon sx={{ fontSize: 40, color: 'green' }} />,
      link: paths.dashboard.client.business,
    },
    {
      name: 'Ambassade',
      icon: <PublicIcon sx={{ fontSize: 40, color: 'red' }} />,
      link: paths.dashboard.client.embassy,
    },
    ...customOptions,
  ];

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3, textAlign: 'center' }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box component="h1" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Choisissez une option
        </Box>
        <Button variant="outlined" color="primary" onClick={handleAddOption}>
          Ajouter une catégorie
        </Button>
      </Box>

      {/* Conteneur des cartes */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          pb: 2,
        }}
      >
        {options.map(({ name, icon, link }) => (
          <Link key={name} component={RouterLink} href={link} underline="none">
            <Card
              sx={{
                width: '12rem',
                height: '12rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {icon}
              </CardContent>
              <Box component="h2" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mt: 1 }}>
                {name}
              </Box>
            </Card>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

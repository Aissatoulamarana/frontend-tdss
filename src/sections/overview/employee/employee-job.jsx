import { useRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function EmployeeJob({ info }) {
  const JobArray = Array.isArray(info) ? info : [];

  const fileRef = useRef(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const renderAbout = (
    <Card sx={{ overflow: 'visible' }}>
      <Box sx={{ p: 3 }}>
        {info?.map((i, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            flexWrap="wrap"
            mb={2} // espace entre les cartes
          >
            {/* Nom */}
            <Box display="flex" alignItems="center" mx={2}>
              <Iconify icon="mdi:briefcase" width={28} sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>Nom</Typography>
                <Link variant="body2" color="text.secondary">
                  {i?.name}
                </Link>
              </Box>
            </Box>

            {/* Categorie de Fonction */}
            <Box display="flex" alignItems="center" mx={2}>
              <Iconify icon="mdi:tag" width={28} sx={{ mr: 1, color: 'primary.main' }} />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>Categorie de Fonction</Typography>
                <Typography variant="body2" color="text.secondary">
                  {i?.category}
                </Typography>
              </Box>
            </Box>

            {/* Permis */}
            <Box display="flex" alignItems="center" mx={2}>
              <Iconify
                icon="mdi:card-account-details"
                width={28}
                sx={{ mr: 1, color: 'primary.main' }}
              />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>Permis</Typography>
                <Typography variant="body2" color="text.secondary">
                  {i?.permit}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );

  return (
    <Grid xs={12} md={4}>
      <Stack spacing={3}>{renderAbout}</Stack>
    </Grid>
  );
}

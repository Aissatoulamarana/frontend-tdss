import { useRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import Grid from '@mui/material/Grid2';
import CardHeader from '@mui/material/CardHeader';



import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------

export function ProfileHome({ info, posts }) {
  const fileRef = useRef(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };



  const renderAbout = (
    <Card sx={{ overflow: 'visible' }}>
      <CardHeader
        title="Description"
        sx={{ textAlign: 'center', pb: 0 }}
      />

      {/* Description centrée en haut */}
      <Box sx={{ p: 3, textAlign: 'center', fontSize: '1.1rem', lineHeight: 1.6 }}>
        {info?.description}
      </Box>

      <Divider />

      {/* Infos en grille dynamique */}
      <Box sx={{ p: 3 }}>

        {/* Adresse */}
        <Box display="flex" alignItems="center" justifyContent="space-around" flexWrap="wrap">

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="mdi:map-marker" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Adresse</Box>
              <Link variant="body2" color="text.secondary">
                {info?.adresse}
              </Link>
            </Box>
          </Box>


          {/* Email */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="fluent:mail-24-filled" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Email</Box>
              <Box variant="body2" color="text.secondary">
                {info?.email}
              </Box>
            </Box>
          </Box>


          {/* Contact */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="ic:baseline-phone" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Contact</Box>
              <Box variant="body2" color="text.secondary">
                {info?.contact}
              </Box>
            </Box>
          </Box>


          {/* Région */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="ic:round-location-city" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Région</Box>
              <Link variant="body2" color="text.secondary">
                {info?.location?.name}
              </Link>
            </Box>
          </Box>

        </Box>
      </Box>
    </Card>
  );


  return (

    <Grid size={{ xs: 12, md: 4 }}>
      <Stack spacing={3}>
        {renderAbout}


      </Stack>
    </Grid>

  );
}

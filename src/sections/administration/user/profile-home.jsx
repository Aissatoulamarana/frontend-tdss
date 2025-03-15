import { useRef } from 'react';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Grid2';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';

import { ProfilePostItem } from './profile-post-item';

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
        {info.description}
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
                {info.adresse}
              </Link>
            </Box>
          </Box>


          {/* Email */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="fluent:mail-24-filled" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Email</Box>
              <Box variant="body2" color="text.secondary">
                {info.email}
              </Box>
            </Box>
          </Box>


          {/* Contact */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="ic:baseline-phone" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Contact</Box>
              <Box variant="body2" color="text.secondary">
                {info.contact}
              </Box>
            </Box>
          </Box>


          {/* Région */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="ic:round-location-city" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Région</Box>
              <Link variant="body2" color="text.secondary">
                {info.location.name}
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

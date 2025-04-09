import { useRef } from 'react';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import Grid from '@mui/material/Grid2';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';

// import { ProfilePostItem } from './profile-post-item';

// ----------------------------------------------------------------------

export function EmployeeInfo({ info, posts }) {
  const fileRef = useRef(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };



  const renderAbout = (
    <Card sx={{ overflow: 'visible' }}>

      <Box sx={{ p: 3 }}>

        {/* Reference */}
        <Box display="flex" alignItems="center" justifyContent="space-around" flexWrap="wrap">

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="mdi:identifier" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Numero Reference</Box>
              <Link variant="body2" color="text.secondary">
                {info?.reference}
              </Link>
            </Box>
          </Box>


          {/* Numero Passeport  */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="mdi:passport" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Numéro Passeport</Box>
              <Box variant="body2" color="text.secondary">
                {info.passport_number}
              </Box>
            </Box>
          </Box>


          {/* Contact */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="ic:baseline-phone" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Contact</Box>
              <Box variant="body2" color="text.secondary">
                {info?.phone}
              </Box>
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

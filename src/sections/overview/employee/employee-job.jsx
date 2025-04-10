import { useRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Grid2';



import { Iconify } from 'src/components/iconify';

// import { ProfilePostItem } from './profile-post-item';

// ----------------------------------------------------------------------

export function EmployeeJob({ info, posts }) {
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
            <Iconify icon="mdi:briefcase" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Nom</Box>
              <Link variant="body2" color="text.secondary">
                {info?.name}
              </Link>
            </Box>
          </Box>


          {/* Numero Passeport  */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="mdi:tag" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Categorie de Fonction</Box>
              <Box variant="body2" color="text.secondary">
                {info.category}
              </Box>
            </Box>
          </Box>


          {/* Contact */}

          <Box display="flex" alignItems="center" mx={2}>
            <Iconify icon="mdi:card-account-details" width={28} sx={{ mr: 1, color: 'primary.main' }} />
            <Box>
              <Box sx={{ fontWeight: 600 }}>Permis</Box>
              <Box variant="body2" color="text.secondary">
                {info?.permit}
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

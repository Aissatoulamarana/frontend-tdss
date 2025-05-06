import React, { forwardRef } from 'react';
import { Box, Card, Divider, Typography, Stack } from '@mui/material';
import { fDate } from 'src/utils/format-time';
import FilteredTablePrint from './components/tableau-print';

const DeclarationDetailsPrint = forwardRef(({ declaration, employees }, ref) => (
  <Card
    ref={ref}
    sx={{
      position: 'relative',
      pt: 3,
      px: 3,
      pb: 6,
      boxShadow: 'none',
      '@media print': { m: 0, boxShadow: 'none', border: 'none' }
    }}
  >
    {/* Logo et infos de la compagnie */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        '& img': { width: 50, height: 50, mr: 2 }
      }}
    >
      <Box component="img" alt="logo" src={declaration?.company.picture} />
      <Box sx={{ flex: 1, textAlign: 'right' }}>
        <Typography variant="h6">{declaration?.company.name}</Typography>
        <Typography variant="body2">{declaration?.company.adresse}</Typography>
        <Typography variant="body2">{declaration?.company.location}</Typography>
        <Typography variant="body2">{declaration?.company.contact}</Typography>
        <Typography variant="body2">{declaration?.company.email}</Typography>
        
      </Box>
    </Box>

    {/* Titre de la déclaration en grand */}
    <Typography
      variant="h4"
      sx={{
        textAlign: 'center',
        fontWeight: 'bold',
        mb: 2,
        '@media print': { fontSize: '1.5rem' }
      }}
    >
      DÉCLARATION N° {declaration?.number}
    </Typography>

    <Divider />

    {/* Date et Référence */}
    <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
      <Typography variant="subtitle2">
        Date : {fDate(declaration?.created_on)}
      </Typography>
      <Typography variant="subtitle2">
        Réf. : {declaration?.number}
      </Typography>
    </Stack>

    <FilteredTablePrint employees={employees} />

    {/* Pied de page fixe */}
    {/* <Typography className="printFooter">
      Déclaration n° {declaration?.number}
    </Typography> */}
  </Card>
));

export default DeclarationDetailsPrint;

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// DeclarationDetailsPrint.js
import React, { forwardRef } from 'react';

import { fDate } from 'src/utils/format-time';

import FilteredTable from './components/tableau';

const DeclarationDetailsPrint = forwardRef(({ declaration }, ref) => (
    <Card ref={ref} sx={{ pt: 5, px: 5 }}>
      <Box
        rowGap={5}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      >
        <Box
          component="img"
          alt="logo"
          src="/logo/logo-single.png"
          sx={{ width: 48, height: 48 }}
        />
        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Typography variant="h6">{declaration?.declaration_number}</Typography>
        </Box>

        <Box sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Numero de la declaration
            <br />
            {declaration?.declaration_number}
          </Typography>
        </Box>

        <Box sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Date de creation
          </Typography>
          {fDate(declaration?.create_date)}
        </Box>
      </Box>
      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

      {/* Le tableau filtré */}
      <FilteredTable declaration={declaration} />

      <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
    </Card>
  ));

export default DeclarationDetailsPrint;

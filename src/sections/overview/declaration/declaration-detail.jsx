import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState, useCallback } from 'react';

import { fDate } from 'src/utils/format-time';

import { usePopover } from 'src/components/custom-popover';
import { Label } from 'src/components/label';

import FilteredTable from './components/tableau';
import { DeclarationToolbar } from './declaration-toolbar';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function DeclarationDetails({ declaration }) {
  const [currentStatus, setCurrentStatus] = useState(declaration?.status);
  const statusOptions = [{ value: declaration.status, label: declaration.status }];


  const popover = usePopover();



  const handleChangeStatus = useCallback((event) => {
    setCurrentStatus(event.target.value);
  }, []);

  return (
    <>
      <DeclarationToolbar
        declaration={declaration}
        currentStatus={currentStatus || ''}
        onChangeStatus={handleChangeStatus}
        statusOptions={statusOptions}

      />
      <Card sx={{ pt: 5, px: 5 }}>
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
          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              variant="soft"
              color={
                (currentStatus === 'paid' && 'success') ||
                (currentStatus === 'pending' && 'warning') ||
                (currentStatus === 'overdue' && 'error') ||
                'default'
              }
            >
              {currentStatus}
            </Label>

            <Typography variant="h6"> {declaration?.reference}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Numero de la declaration
              <br />
              {declaration?.reference}
            </Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date de creation
            </Typography>
            {fDate(declaration?.created_on)}
          </Stack>
        </Box>
        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} mb={4} />

        <FilteredTable declaration={declaration} />

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      </Card>
    </>
  );
}
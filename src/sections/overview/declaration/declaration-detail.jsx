import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';
import { fDate } from 'src/utils/format-time';

import { usePopover } from 'src/components/custom-popover';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';


import FilteredTable from './components/tableau';
import { DeclarationToolbar } from './declaration-toolbar';
import { DeclarationAddEmployee } from './declaration-add-employee';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function DeclarationDetails({ declaration, employees }) {

  const [open, setOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  // const statusOptions = [{ value: declaration?.status, label: declaration?.status }];

  const user = useMockedUser();

  const popover = usePopover();




  const handleChangeStatus = useCallback((event) => {
    setCurrentStatus(event.target.value);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const statusLabels = {
    UNSUBMITTED: 'Non soumise',
    SUBMITTED: 'Soumise',
    REJECTED: 'Rejetée',
    VALIDATED: 'Validée',
    BILLED: 'Facturée',
  };

  // Ajoute la couleur correspondante au statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'VALIDATED':
        return 'success';
      case 'SUBMITTED':
        return 'info';
      case 'UNSUBMITTED':
        return 'warning';
      case 'REJECTED':
        return 'error';
      case 'BILLED':
        return 'primary';
      default:
        return 'default';
    }
  };

  const statusOptions = [
    {
      value: declaration?.status,
      label: statusLabels[declaration?.status] || declaration?.status
    }
  ];
  

  useEffect(() => {
    if (declaration?.status) {
      setCurrentStatus(declaration?.status);
    }
  }, [declaration?.status]);

  return (
    <>
      <DeclarationToolbar
        declaration={declaration}
        currentStatus={currentStatus || ''}
        onChangeStatus={(e) => setCurrentStatus(e.target.value)}
        statusOptions={statusOptions}
        employees={employees}


      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: { xs: 1, md: 2 } }}>
        {declaration?.status === 'UNSUBMITTED' && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpen}
            sx={{
              mb: { xs: 1, md: 1 },
              maxWidth: '100px',      // Limite la largeur du bouton
              minWidth: 'auto',
              px: 2,                  // Réduit le padding horizontal
              fontSize: '0.875rem',    // Taille de police réduite si nécessaire
            }}
          >
            Ajouter
          </Button>
        )}
      </Box>

      {/* <FormProvider > */}
      <DeclarationAddEmployee
        declaration={declaration}
        // type={type}
        open={open}
        onClose={handleClose}
      />
      {/* </FormProvider> */}
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
            src={declaration?.company?.picture}
            sx={{ width: 48, height: 48 }}
          />
          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label variant="soft" color={getStatusColor(currentStatus)}>
                        {statusLabels[currentStatus] || 'Inconnu'}
             </Label>

            <Typography variant="h6"> {declaration?.reference}</Typography>
          </Stack>
          <Box
            gridColumn={{ xs: '1', sm: 'span 2' }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
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

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Montant Total
              </Typography>
              {declaration?.total_amount} GNF
            </Stack>
          </Box>
        </Box>
        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} mb={4} />

        {declaration && (<FilteredTable declaration={declaration} />)}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      </Card>
    </>
  );
}
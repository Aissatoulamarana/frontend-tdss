import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import IconButton from '@mui/material/IconButton';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import FilteredTable from './components/tableau';
import { DeclarationToolbar } from './declaration-toolbar';
import { useAuthContext } from 'src/auth/hooks';

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

            <Typography variant="h6"> {declaration?.declaration_number}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Numero de la declaration
              <br />
              {declaration?.declaration_number}
            </Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date de creation
            </Typography>
            {fDate(declaration?.create_date)}
          </Stack>
        </Box>
        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} mb={4} />

        <FilteredTable declaration={declaration} />

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      </Card>
    </>
  );
}
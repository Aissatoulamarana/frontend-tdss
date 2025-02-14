
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
import { FactureToolbar } from './facture-toolbar';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  [`& .${tableCellClasses.root}`]: {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));


export function FactureDetails({ facture }) {
  const [currentStatus, setCurrentStatus] = useState(facture?.statut);



  const popover = usePopover();

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          <Box sx={{ mt: 2 }} />
          TOTAL
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(facture?.montant_usd)}
        </TableCell>

      </StyledTableRow>


    </>
  );

  const renderFooter = (
    <Box gap={2} display="flex" alignItems="center" flexWrap="wrap" sx={{ py: 3 }}>
      <div>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          NOTES
        </Typography>
        <Typography variant="body2">
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Typography>
      </div>

      <Box flexGrow={{ md: 1 }} sx={{ textAlign: { md: 'right' } }}>
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Have a question?
        </Typography>
        <Typography variant="body2">support@minimals.cc</Typography>
      </Box>
    </Box>
  );

  const renderList = (
    <Scrollbar sx={{ mt: 5 }}>
      <Table sx={{ minWidth: 960 }}>
        <TableHead>
          <TableRow>
            <TableCell width={40}>#</TableCell>

            <TableCell sx={{ typography: 'subtitle2' }}>Categorie de permis</TableCell>

            <TableCell>Quantité</TableCell>

            <TableCell align="right">Prix Unitaire</TableCell>

            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {facture?.details.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>

              <TableCell>
                <Box sx={{ maxWidth: 560 }}>
                  <Typography variant="subtitle2">{row.category}</Typography>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                    Permis  {row.permis}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>{row.quantite}</TableCell>

              <TableCell align="right">{fCurrency(row.prix_unitaire)}</TableCell>

              <TableCell align="right">{fCurrency(row.prix_unitaire * row.quantite)}</TableCell>
            </TableRow>
          ))}

          {renderTotal}

        </TableBody>
      </Table>
    </Scrollbar>
  );


  return (
    <>
      <FactureToolbar
        facture={facture}
        currentStatus={currentStatus || ''}

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
            <Typography variant="h6"> {facture?.numero_facture}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              CLIENT
            </Typography>
            <br />
            <Typography variant='h6' >
              {facture?.client?.company}
            </Typography>
            <br />
            Tél : {facture?.client?.phone_number}
            <br />
            Adresse :  {facture?.client?.address}

          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date facture : {fDate(facture?.create_date)}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Declaration N : {facture?.declaration_number}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date declaration : {fDate(facture?.dec_date)}
            </Typography>

          </Stack>
        </Box>
        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} mb={4} />

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />
      </Card>
    </>
  );
}

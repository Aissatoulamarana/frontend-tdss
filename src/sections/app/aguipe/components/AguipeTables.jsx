'use client';

import { useState } from 'react';
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  TablePagination,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Skeleton,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fDate } from 'src/utils/format-time';
import { Label } from 'src/components/label/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_TRANSLATIONS = {
  paid: { label: 'Payé', color: 'success' },
  pending: { label: 'En attente', color: 'warning' },
  unpaid: { label: 'Impayé', color: 'error' },
  draft: { label: 'Brouillon', color: 'default' },
  submitted: { label: 'Soumis', color: 'info' },
  billed: { label: 'Facturé', color: 'primary' },
  unsubmitted: { label: 'Non soumis', color: 'default' },
  // Valeur par défaut pour les statuts inconnus
  _default: { label: 'Inconnu', color: 'default' }
};

// Fonction utilitaire pour obtenir la traduction d'un statut
const getStatusInfo = (status) => {
  if (!status) return STATUS_TRANSLATIONS._default;
  return STATUS_TRANSLATIONS[status.toLowerCase()] || { 
    label: status, 
    color: 'default' 
  };
};

// ----------------------------------------------------------------------

export function AguipeTables({ declarations = [], loading = false }) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Card>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Numéro</TableCell>
                <TableCell>Entreprise</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Employés</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <Skeleton variant="text" height={60} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
  }

  return (
    <Card>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
        <Typography variant="h6">Dernières déclarations</Typography>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Numéro</TableCell>
              <TableCell>Entreprise</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Employés</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {declarations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow hover key={row.reference}>
                  <TableCell>
                    <Typography variant="subtitle2">{row.number}</Typography>
                  </TableCell>
                  <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      alt={row.company}
                      src={row.company_logo}
                      sx={{ mr: 2, bgcolor: 'primary.main' }}
                    >
                      {row.company ? row.company.charAt(0) : 'C'}
                    </Avatar>
                    <Typography variant="subtitle2" noWrap>
                      {row.company}
                    </Typography>
                  </TableCell>
                  <TableCell>{fDate(row.created_on)}</TableCell>
                  <TableCell>
                    <Label color={getStatusInfo(row.status).color}>
                      {getStatusInfo(row.status).label}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip 
                      title={`${row.employees?.length || 0} employé(s)`}
                      arrow
                    >
                      <Box 
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          bgcolor: 'primary.lighter',
                          color: 'primary.dark',
                          borderRadius: 1,
                          px: 1.5,
                          py: 0.5,
                          minWidth: 40,
                          fontWeight: 'fontWeightMedium',
                        }}
                      >
                        <Iconify icon="mdi:account-group" width={16} sx={{ mr: 0.5 }} />
                        {row.employees?.length || 0}
                      </Box>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={declarations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
        }
      />
    </Card>
  );
}

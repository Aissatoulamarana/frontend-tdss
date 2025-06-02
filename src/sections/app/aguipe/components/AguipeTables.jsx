'use client';

import { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead,
  TablePagination, 
  TableRow, 
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Données mockées pour les déclarations récentes
const DECLARATIONS = [
  {
    id: 'DEC-2023-001',
    date: new Date(2023, 10, 15),
    entreprise: 'Entreprise A',
    montant: 1250000,
    statut: 'soumis',
  },
  {
    id: 'DEC-2023-002',
    date: new Date(2023, 10, 14),
    entreprise: 'Entreprise B',
    montant: 985000,
    statut: 'en_attente',
  },
  {
    id: 'DEC-2023-003',
    date: new Date(2023, 10, 13),
    entreprise: 'Entreprise C',
    montant: 745000,
    statut: 'rejeté',
  },
  {
    id: 'DEC-2023-004',
    date: new Date(2023, 10, 12),
    entreprise: 'Entreprise D',
    montant: 1560000,
    statut: 'soumis',
  },
  {
    id: 'DEC-2023-005',
    date: new Date(2023, 10, 11),
    entreprise: 'Entreprise E',
    montant: 890000,
    statut: 'en_attente',
  },
  {
    id: 'DEC-2023-006',
    date: new Date(2023, 10, 10),
    entreprise: 'Entreprise F',
    montant: 1120000,
    statut: 'soumis',
  },
  {
    id: 'DEC-2023-007',
    date: new Date(2023, 10, 9),
    entreprise: 'Entreprise G',
    montant: 650000,
    statut: 'rejeté',
  },
].map((item, index) => ({ ...item, id: `DEC-2023-${String(index + 1).padStart(3, '0')}` }));

// Fonction pour obtenir la couleur du statut
const getStatusColor = (status) => {
  switch (status) {
    case 'soumis':
      return 'success';
    case 'en_attente':
      return 'warning';
    case 'rejeté':
      return 'error';
    default:
      return 'default';
  }
};

// Fonction pour formater le statut
const formatStatus = (status) => {
  const statusMap = {
    soumis: 'Soumis',
    en_attente: 'En attente',
    rejeté: 'Rejeté',
  };
  return statusMap[status] || status;
};

// ----------------------------------------------------------------------

export function AguipeTables() {
  const theme = useTheme();
  const [tableData] = useState(DECLARATIONS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleViewRow = (id) => {
    // Gérer la vue détaillée
    console.log('Voir détails:', id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Trier les données pour afficher d'abord les déclarations en attente, puis rejetées, puis soumises
  const sortedData = [...tableData].sort((a, b) => {
    // Priorité 1: En attente
    if (a.statut === 'en_attente' && b.statut !== 'en_attente') return -1;
    if (a.statut !== 'en_attente' && b.statut === 'en_attente') return 1;
    
    // Priorité 2: Rejeté
    if (a.statut === 'rejeté' && b.statut !== 'rejeté') return -1;
    if (a.statut !== 'rejeté' && b.statut === 'rejeté') return 1;
    
    // Priorité 3: Par date (plus récent en premier)
    return new Date(b.date) - new Date(a.date);
  });

  // Pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedData.length) : 0;
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <CardHeader 
        title="Déclarations récentes" 
        action={
          <Button 
            variant="contained" 
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => console.log('Nouvelle déclaration')}
          >
            Nouvelle déclaration
          </Button>
        }
      />
      
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Déclaration</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Entreprise</TableCell>
                <TableCell align="right">Montant</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{fDate(row.date, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{row.entreprise}</TableCell>
                  <TableCell align="right">{fCurrency(row.montant)} FCFA</TableCell>
                  <TableCell>
                    <Label
                      color={getStatusColor(row.statut)}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {formatStatus(row.statut)}
                    </Label>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Voir les détails">
                      <IconButton onClick={() => handleViewRow(row.id)}>
                        <Iconify icon="eva:eye-outline" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Télécharger">
                      <IconButton>
                        <Iconify icon="eva:download-outline" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedData.length}
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

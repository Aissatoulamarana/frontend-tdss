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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { fDate } from 'src/utils/format-time';
import { Label } from 'src/components/label/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STATUS_COLOR = {
  paid: 'success',
  pending: 'warning',
  unpaid: 'error',
  draft: 'default',
  submitted: 'info',
  billed: 'primary',
  unsubmitted: 'default',
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
                <TableCell>Référence</TableCell>
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
              <TableCell>Référence</TableCell>
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
                    <Label color={STATUS_COLOR[row.status] || 'default'}>
                      {row.status}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      flexWrap="wrap"
                      gap={1}
                      sx={{ minWidth: 200 }}
                    >
                      {row.employees?.slice(0, 3).map((employee, index) => (
                        <Tooltip 
                          key={index} 
                          title={`${employee.first || ''} ${employee.last || ''}`.trim() || 'Employé'}
                          arrow
                        >
                          <Avatar
                            alt={`${employee.first || ''} ${employee.last || ''}`.trim()}
                            src={employee.avatar}
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'primary.main',
                              color: 'common.white',
                              fontSize: 12,
                              fontWeight: 600,
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: theme.shadows[4],
                              },
                              transition: theme.transitions.create(['transform', 'box-shadow']),
                            }}
                          >
                            {employee.first ? `${employee.first.charAt(0)}${employee.last ? employee.last.charAt(0) : ''}` : 'E'}
                          </Avatar>
                        </Tooltip>
                      ))}
                      
                      {row.employees?.length > 3 && (
                        <Tooltip 
                          title={
                            <Stack spacing={0.5}>
                              {row.employees.slice(3).map((emp, idx) => (
                                <div key={idx}>{`${emp.first || ''} ${emp.last || ''}`.trim() || 'Employé'}</div>
                              ))}
                            </Stack>
                          }
                          arrow
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'grey.500',
                              color: 'common.white',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'grey.600',
                              },
                              transition: theme.transitions.create('background-color'),
                            }}
                          >
                            +{row.employees.length - 3}
                          </Avatar>
                        </Tooltip>
                      )}
                    </Stack>
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

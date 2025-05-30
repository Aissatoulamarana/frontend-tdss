import React, { useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

export function ProfileUsers({ info }) {
  const router = useRouter();

  // Fonction pour gérer le clic sur une ligne de la table
  const handleViewDetail = useCallback((slug) => {
    router.push(paths.dashboard.user.details(slug));
  }, [router]);

  return (
    <Card sx={{ overflow: 'visible' }}>
      <CardHeader
        title="Liste des utilisateurs"
        sx={{ textAlign: 'center', pb: 0 }}
      />

      {/* Description centrée en haut */}
      <Box sx={{ p: 3, textAlign: 'center', fontSize: '1.1rem', lineHeight: 1.6 }}>
        {info?.description}
      </Box>

      <Divider />

      {/* Table des utilisateurs */}
      <Box sx={{ p: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 960 }}>
            <TableHead sx={{ bgcolor: 'background.neutral' }}>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {info?.map((user) => (
                <TableRow
                  key={user.slug}
                  onClick={() => handleViewDetail(user.slug)} // Gérer le clic sur la ligne
                  sx={{
                    cursor: 'pointer', // Changer le curseur pour indiquer que la ligne est cliquable
                    '&:hover': {
                      backgroundColor: 'action.hover', // Ajouter un effet de survol
                    },
                  }}
                >
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
}
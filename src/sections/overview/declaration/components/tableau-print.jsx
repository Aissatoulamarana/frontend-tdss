import React, { useState } from 'react';
import {
  Box,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Typography
} from '@mui/material';

const categories = [
  { label: 'Tous', value: 'All' },
  { label: 'Cadres', value: 'Cadre' },
  { label: 'Agents', value: 'Agent de maitrise' },
  { label: 'Ouvriers', value: 'Ouvrier' }
];

export default function FilteredTablePrint({ employees }) {
  const [filter, setFilter] = useState('All');
  const rows =
    filter === 'All'
      ? employees
      : employees.filter(emp => emp.job.category === filter);

  return (
    <>
      {/* Catégories visibles même à l'impression */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        {categories.map(cat => (
          <Button
            key={cat.value}
            size="small"
            color='#fff'
            variant={filter === cat.value ? 'outlined' : 'outlined'}
            onClick={() => setFilter(cat.value)}
            sx={{ 
              textTransform: 
              'none', flex: 1 }}
          >
            <Box>
              <Typography variant="body2" >{cat.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {cat.value === 'All'
                  ? employees.length
                  : employees.filter(emp => emp.job.category === cat.value).length}
              </Typography>
            </Box>
          </Button>
        ))}
      </Box>

      <TableContainer
        // sx={{
        //   // border: '1px solid #ccc',
        //   '@media print': { border: '1px solid #000', pageBreakInside: 'avoid' }
        // }}
      >
        <Table size="small">
          <TableHead className="printTableHead">
            <TableRow>
              <TableCell sx={{ width: '5%', fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>
                Passeport
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nom & Prénom</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Téléphone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fonction</TableCell>
              <TableCell sx={{ width: '15%', fontWeight: 'bold' }}>
                Permis
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={row.id}
                sx={{
                  '& > *': {
                    py: 1.2  // padding vertical pour espacer les lignes
                  },
                  '@media print': { pageBreakInside: 'avoid' }
                }}
              >
                <TableCell>{i + 1}</TableCell>
                <TableCell>{row.passport_number}</TableCell>
                <TableCell>
                  {row.last} {row.first}
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.job.name}</TableCell>
                <TableCell>{row.job.permit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

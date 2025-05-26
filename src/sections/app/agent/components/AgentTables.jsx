import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import { fDate } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

// Contexte utilisateur simulé (à remplacer par un vrai contexte d'authentification)
const CURRENT_USER = {
  id: 'AGENT-001',
  name: 'Jean Dupont',
  company: 'Entreprise ABC',
  role: 'agent',
};

// Données mockées pour le développement
const ALL_DECLARATIONS = [
  {
    id: 'DEC-001',
    date: new Date('2023-05-01'),
    company: 'Entreprise ABC',
    status: 'submitted',
    employees: 12,
    agentId: 'AGENT-001',
  },
  {
    id: 'DEC-002',
    date: new Date('2023-05-05'),
    company: 'Société XYZ',
    status: 'pending',
    employees: 8,
    agentId: 'AGENT-002',
  },
  {
    id: 'DEC-003',
    date: new Date('2023-05-10'),
    company: 'Compagnie 123',
    status: 'submitted',
    employees: 15,
    agentId: 'AGENT-001',
  },
  {
    id: 'DEC-004',
    date: new Date('2023-05-15'),
    company: 'Entreprise ABC',
    status: 'pending',
    employees: 5,
    agentId: 'AGENT-001',
  },
  {
    id: 'DEC-005',
    date: new Date('2023-05-20'),
    company: 'Société GHI',
    status: 'submitted',
    employees: 10,
    agentId: 'AGENT-003',
  },
];

const ALL_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Jean Dupont',
    position: 'Ingénieur',
    company: 'Entreprise ABC',
    permitType: 'Permis A',
    addedDate: new Date('2023-05-18'),
    avatar: '/assets/images/avatar/avatar_1.jpg',
    agentId: 'AGENT-001',
  },
  {
    id: 'EMP-002',
    name: 'Marie Martin',
    position: 'Comptable',
    company: 'Société XYZ',
    permitType: 'Permis B',
    addedDate: new Date('2023-05-17'),
    avatar: '/assets/images/avatar/avatar_2.jpg',
    agentId: 'AGENT-002',
  },
  {
    id: 'EMP-003',
    name: 'Pierre Dubois',
    position: 'Technicien',
    company: 'Compagnie 123',
    permitType: 'Permis C',
    addedDate: new Date('2023-05-16'),
    avatar: '/assets/images/avatar/avatar_3.jpg',
    agentId: 'AGENT-001',
  },
  {
    id: 'EMP-004',
    name: 'Sophie Leroy',
    position: 'Assistante',
    company: 'Entreprise ABC',
    permitType: 'Permis A',
    addedDate: new Date('2023-05-15'),
    avatar: '/assets/images/avatar/avatar_4.jpg',
    agentId: 'AGENT-001',
  },
  {
    id: 'EMP-005',
    name: 'Thomas Bernard',
    position: 'Manager',
    company: 'Société GHI',
    permitType: 'Permis B',
    addedDate: new Date('2023-05-14'),
    avatar: '/assets/images/avatar/avatar_5.jpg',
    agentId: 'AGENT-003',
  },
];

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID' },
  { id: 'date', label: 'Date' },
  { id: 'company', label: 'Entreprise' },
  { id: 'employees', label: 'Employés' },
  { id: 'status', label: 'Statut' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

export function AgentRecentDeclarations() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('all'); // 'all', 'submitted', 'pending'
  const [declarations, setDeclarations] = useState([]);

  // Filtrer les déclarations pour n'afficher que celles de l'agent connecté
  useEffect(() => {
    // Filtrer par agent
    const filteredByAgent = ALL_DECLARATIONS.filter(dec => dec.agentId === CURRENT_USER.id);
    
    // Appliquer le filtre de statut si nécessaire
    const filtered = filter === 'all' 
      ? filteredByAgent 
      : filteredByAgent.filter(dec => dec.status === filter);
    
    setDeclarations(filtered);
  }, [filter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  return (
    <Card>
      <CardHeader 
        title="Mes Déclarations" 
        sx={{ mb: 2 }} 
        action={
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="status-filter-label">Statut</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filter}
              label="Statut"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">Toutes</MenuItem>
              <MenuItem value="submitted">Soumises</MenuItem>
              <MenuItem value="pending">Non Soumises</MenuItem>
            </Select>
          </FormControl>
        }
      />
      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {declarations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <AgentDeclarationRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePagination
        page={page}
        component="div"
        count={declarations.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function AgentDeclarationRow({ row }) {
  const popover = usePopover();

  const handleViewDetails = () => {
    popover.onClose();
    // Ici, on pourrait rediriger vers la page de détails de la déclaration
  };

  const handleEdit = () => {
    popover.onClose();
    // Ici, on pourrait rediriger vers la page d'édition de la déclaration
  };

  const handleDelete = () => {
    popover.onClose();
    // Ici, on pourrait implémenter la logique de suppression
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.id}</TableCell>
        <TableCell>{fDate(row.date)}</TableCell>
        <TableCell>{row.company}</TableCell>
        <TableCell>{row.employees}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={row.status === 'submitted' ? 'success' : 'warning'}
          >
            {row.status === 'submitted' ? 'Soumise' : 'Non Soumise'}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleViewDetails}>
          <Iconify icon="solar:eye-bold" />
          Voir détails
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Modifier
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Supprimer
        </MenuItem>
      </CustomPopover>
    </>
  );
}

// ----------------------------------------------------------------------

export function AgentRecentEmployees() {
  const [employees, setEmployees] = useState([]);
  const [companyFilter, setCompanyFilter] = useState('all');

  // Filtrer les employés pour n'afficher que ceux de l'agent connecté
  useEffect(() => {
    // Filtrer par agent
    const filteredByAgent = ALL_EMPLOYEES.filter(emp => emp.agentId === CURRENT_USER.id);
    
    // Appliquer le filtre d'entreprise si nécessaire
    const filtered = companyFilter === 'all' 
      ? filteredByAgent 
      : filteredByAgent.filter(emp => emp.company === companyFilter);
    
    setEmployees(filtered);
  }, [companyFilter]);

  // Obtenir la liste des entreprises uniques pour le filtre
  const companies = [...new Set(ALL_EMPLOYEES
    .filter(emp => emp.agentId === CURRENT_USER.id)
    .map(emp => emp.company))];

  const handleCompanyFilterChange = (event) => {
    setCompanyFilter(event.target.value);
  };

  return (
    <Card>
      <CardHeader 
        title="Mes Employés" 
        sx={{ mb: 2 }} 
        action={
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="company-filter-label">Entreprise</InputLabel>
            <Select
              labelId="company-filter-label"
              value={companyFilter}
              label="Entreprise"
              onChange={handleCompanyFilterChange}
            >
              <MenuItem value="all">Toutes</MenuItem>
              {companies.map(company => (
                <MenuItem key={company} value={company}>{company}</MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />
      <Box sx={{ p: 3, pt: 0 }}>
        {employees.length > 0 ? (
          <Stack spacing={3} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
            {employees.map((employee) => (
              <EmployeeItem key={employee.id} employee={employee} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Aucun employé trouvé
            </Typography>
          </Box>
        )}

        {employees.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              size="small"
              color="inherit"
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            >
              Voir tous les employés
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function EmployeeItem({ employee }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar alt={employee.name} src={employee.avatar} />

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{employee.name}</Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {employee.position}
          </Typography>

          <Divider orientation="vertical" sx={{ height: 12, mx: 1 }} />

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {employee.company}
          </Typography>
        </Stack>
      </Box>

      <Stack alignItems="flex-end">
        <Label variant="soft" color="info">
          {employee.permitType}
        </Label>

        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {fDate(employee.addedDate)}
        </Typography>
      </Stack>
    </Stack>
  );
}
import { useState, useEffect } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
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
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filtrer les déclarations par agent et par statut
  const declarations = ALL_DECLARATIONS.filter(dec => {
    const isCurrentAgent = dec.agentId === CURRENT_USER.id;
    const matchesFilter = filter === 'all' || dec.status === filter;
    return isCurrentAgent && matchesFilter;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  return (
    <Card sx={{
      boxShadow: isDarkMode ? '0 4px 8px 0 rgba(0, 0, 0, 0.4)' : '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: 1,
      overflow: 'hidden',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: isDarkMode ? '0 6px 12px 0 rgba(0, 0, 0, 0.5)' : '0 4px 8px 0 rgba(0, 0, 0, 0.15)',
      },
    }}>
      <CardHeader 
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:clipboard-text-clock" width={24} />
            <Typography variant="h6">
              Déclarations fiscales récentes
            </Typography>
            <Label color="info" sx={{ ml: 1 }}>
              {declarations.length}
            </Label>
          </Stack>
        }
        subheader={
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Liste des dernières déclarations fiscales enregistrées dans le système
          </Typography>
        }
        sx={{ 
          pb: 0,
          '& .MuiCardHeader-title': {
            color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
          }
        }} 
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel id="status-filter-label">Statut</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filter}
                label="Statut"
                onChange={handleFilterChange}
                startAdornment={<Iconify icon="mdi:filter-variant" width={20} sx={{ mr: 0.5, ml: -0.5 }} />}
              >
                <MenuItem value="all">Toutes</MenuItem>
                <MenuItem value="submitted">Soumises</MenuItem>
                <MenuItem value="pending">Non Soumises</MenuItem>
              </Select>
            </FormControl>
            <Button 
              size="small" 
              startIcon={<Iconify icon="mdi:plus" />}
              variant="contained"
              color="primary"
            >
              Nouvelle
            </Button>
          </Stack>
        }
      />
      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ 
            minWidth: 720,
            '& .MuiTableCell-head': {
              color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
              backgroundColor: isDarkMode ? theme.palette.background.paper : theme.palette.background.neutral,
              fontWeight: 600
            }
          }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>
              {declarations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <AgentDeclarationRow key={row.id} row={row} isDarkMode={isDarkMode} />
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

function AgentDeclarationRow({ row, isDarkMode }) {
  const theme = useTheme();
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
      <TableRow
        hover
        sx={{
          '&:hover': {
            backgroundColor: isDarkMode 
              ? theme.palette.action.hover 
              : theme.palette.background.neutral,
          },
        }}
      >
        <TableCell sx={{ color: isDarkMode ? theme.palette.text.secondary : undefined }}>{row.id}</TableCell>
        <TableCell sx={{ color: isDarkMode ? theme.palette.text.secondary : undefined }}>{fDate(row.date)}</TableCell>
        <TableCell sx={{ color: isDarkMode ? theme.palette.text.primary : undefined }}>{row.company}</TableCell>
        <TableCell sx={{ color: isDarkMode ? theme.palette.text.secondary : undefined }}>{row.employees}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={row.status === 'submitted' ? 'success' : 'warning'}
          >
            {row.status === 'submitted' ? 'Soumise' : 'Non Soumise'}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton 
            color={popover.open ? 'primary' : 'default'} 
            onClick={popover.onOpen}
            sx={{ 
              color: popover.open 
                ? theme.palette.primary.main 
                : isDarkMode ? theme.palette.text.secondary : undefined 
            }}
          >
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
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
    <Card sx={{
      boxShadow: isDarkMode ? '0 4px 8px 0 rgba(0, 0, 0, 0.4)' : '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: 1,
      overflow: 'hidden',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: isDarkMode ? '0 6px 12px 0 rgba(0, 0, 0, 0.5)' : '0 4px 8px 0 rgba(0, 0, 0, 0.15)',
      },
    }}>
      <CardHeader 
        title={
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="mdi:account-group" width={24} />
            <Typography variant="h6">
              Employés par entreprise
            </Typography>
            <Label color="info" sx={{ ml: 1 }}>
              {employees.length}
            </Label>
          </Stack>
        }
        
        sx={{ 
          pb: 0,
          '& .MuiCardHeader-title': {
            color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
          }
        }} 
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl size="small">
              <InputLabel id="company-filter-label">Entreprise</InputLabel>
              <Select
                labelId="company-filter-label"
                value={companyFilter}
                label="Entreprise"
                onChange={handleCompanyFilterChange}
                startAdornment={<Iconify icon="mdi:filter-variant" width={20} sx={{ mr: 0.5, ml: -0.5 }} />}
              >
                <MenuItem value="all">Toutes</MenuItem>
                {companies.map(company => (
                  <MenuItem key={company} value={company}>{company}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        }
      />
      <Box sx={{ p: 1, pt: 0 }}>
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
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const popover = usePopover();
  
  // Déterminer la couleur du badge en fonction du type de permis
  const getPermitColor = (type) => {
    switch (type) {
      case 'Permis A': return 'success';
      case 'Permis B': return 'info';
      case 'Permis C': return 'warning';
      default: return 'default';
    }
  };
  
  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={2}
      sx={{
        p: 1.5,
        borderRadius: 1,
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: isDarkMode 
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.primary.lighter, 0.2),
          boxShadow: `0 0 0 1px ${isDarkMode ? theme.palette.divider : theme.palette.primary.lighter}`,
        },
      }}
      onClick={popover.onOpen}
    >
      <Avatar 
        alt={employee.name} 
        src={employee.avatar} 
        sx={{ 
          width: 48, 
          height: 48,
          border: `2px solid ${theme.palette[getPermitColor(employee.permitType)].main}`,
          boxShadow: `0 0 0 2px ${alpha(theme.palette[getPermitColor(employee.permitType)].main, 0.2)}`,
        }} 
      />

      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="subtitle2"
          sx={{ 
            color: isDarkMode ? theme.palette.common.white : theme.palette.text.primary,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          {employee.name}
          <Tooltip title="Ajouté récemment" arrow>
            <Label 
              color="success" 
              variant="soft" 
              sx={{ 
                height: 18, 
                fontSize: '0.65rem', 
                display: isRecent(employee.addedDate) ? 'inline-flex' : 'none'
              }}
            >
              Nouveau
            </Label>
          </Tooltip>
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
          <Iconify icon="mdi:briefcase-outline" width={14} sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {employee.position}
          </Typography>

          <Divider orientation="vertical" sx={{ height: 12, mx: 1 }} />

          <Iconify icon="mdi:office-building-outline" width={14} sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {employee.company}
          </Typography>
        </Stack>
      </Box>

      <Stack alignItems="flex-end">
        <Label 
          variant="soft" 
          color={getPermitColor(employee.permitType)}
          sx={{ fontWeight: 600 }}
        >
          {employee.permitType}
        </Label>

        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
          <Iconify icon="mdi:calendar-outline" width={14} sx={{ mr: 0.5 }} />
          {fDate(employee.addedDate)}
        </Typography>
      </Stack>
      
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem>
          <Iconify icon="solar:eye-bold" />
          Voir détails
        </MenuItem>

        <MenuItem>
          <Iconify icon="solar:pen-bold" />
          Modifier
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Supprimer
        </MenuItem>
      </CustomPopover>
    </Stack>
  );
}

// Fonction pour vérifier si un employé a été ajouté récemment (moins de 7 jours)
function isRecent(date) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}
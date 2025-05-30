import { useState, useEffect, useCallback, useMemo } from 'react';
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
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import { fDate } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Label } from 'src/components/label';
import axios from 'src/utils/axios';
import API from 'src/utils/api';

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
  {
    id: 'DEC-006',
    date: new Date('2023-05-22'),
    company: 'Entreprise ABC',
    status: 'rejected',
    employees: 7,
    agentId: 'AGENT-001',
  },
  {
    id: 'DEC-007',
    date: new Date('2023-05-25'),
    company: 'Société XYZ',
    status: 'pending',
    employees: 3,
    agentId: 'AGENT-001',
  },
  {
    id: 'DEC-008',
    date: new Date('2023-05-26'),
    company: 'Entreprise ABC',
    status: 'rejected',
    employees: 2,
    agentId: 'AGENT-001',
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
  const filteredDeclarations = ALL_DECLARATIONS.filter(dec => {
    const isCurrentAgent = dec.agentId === CURRENT_USER.id;
    const matchesFilter = filter === 'all' || dec.status === filter;
    return isCurrentAgent && matchesFilter;
  });
  
  // Prioriser les déclarations non soumises (pending) et rejetées (rejected)
  const declarations = [...filteredDeclarations].sort((a, b) => {
    // Priorité 1: Non soumises (pending)
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    
    // Priorité 2: Rejetées (rejected)
    if (a.status === 'rejected' && b.status !== 'rejected') return -1;
    if (a.status !== 'rejected' && b.status === 'rejected') return 1;
    
    // Priorité 3: Par date (plus récent en premier)
    return new Date(b.date) - new Date(a.date);
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
            <Iconify icon="mdi:clipboard-text-clock" width={24} sx={{ color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.common.white }}>
              Déclarations récentes
            </Typography>
            <Label color="info" sx={{ ml: 1 }}>
              {declarations.length}
            </Label>
          </Stack>
        }
        
        sx={{ 
          pb: 0,
          
          '& .MuiCardHeader-title': {
            color: theme.palette.common.white,
            display: 'block',
            width: '100%'
          }
        }} 
        action={
          <Stack direction="row" spacing={1} alignItems="center" marginBottom={3}>
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
                <MenuItem value="rejected">Rejetées</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        }
      />
      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ 
            minWidth: 720,
            '& .MuiTableCell-head': {
              color: theme.palette.common.white,
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
            color={
              row.status === 'submitted' ? 'success' : 
              row.status === 'rejected' ? 'error' : 'warning'
            }
          >
            {row.status === 'submitted' ? 'Soumise' : 
             row.status === 'rejected' ? 'Rejetée' : 'Non Soumise'}
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
    )
}
export function AgentRecentEmployees() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [companies, setCompanies] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [sectorFilter, setSectorFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les entreprises depuis l'API
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Utiliser l'endpoint listEntreprises qui est disponible
      const response = await axios.get(API.listEntreprises());
      // Vérifier si la réponse contient des données
      if (response.data && Array.isArray(response.data.results)) {
        const companiesData = response.data.results;
        setCompanies(companiesData);
        
        // Extraire les secteurs uniques pour le filtre
        const uniqueSectors = [...new Set(companiesData.map(comp => 
          comp.sector || comp.secteur || 'Non spécifié'
        ))];
        setSectors(uniqueSectors);
        
        console.log('Entreprises chargées:', companiesData.length);
      } else {
        setCompanies([]);
        setSectors([]);
        console.warn('Format de données inattendu:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises:', error.response?.data || error.message);
      setError('Impossible de charger les entreprises. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Charger les entreprises au chargement du composant
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filtrer les entreprises par secteur
  const filteredCompanies = useMemo(() => {
    if (sectorFilter === 'all') return companies;
    return companies.filter(comp => 
      (comp.sector && comp.sector === sectorFilter) || 
      (comp.secteur && comp.secteur === sectorFilter)
    );
  }, [companies, sectorFilter]);

  const handleSectorFilterChange = (event) => {
    setSectorFilter(event.target.value);
  };
  
  // Fonction pour rafraîchir les données
  const handleRefresh = () => {
    fetchCompanies();
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
          <Stack direction="row" alignItems="center" spacing={1} key="header-stack">
            <Iconify icon="mdi:office-building" width={24} sx={{ color: isDarkMode ? theme.palette.primary.light : theme.palette.primary.main }} key="header-icon" />
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.common.white }} key="header-title">
              Entreprises associées
            </Typography>
            <Label color="info" sx={{ ml: 1 }} key="header-count">
              {companies.length}
            </Label>
          </Stack>
        }
        
        sx={{ 
          pb: 0,
          
          '& .MuiCardHeader-title': {
            color: theme.palette.common.white,
            display: 'block',
            width: '100%'
          }
        }} 
        action={
          <Stack direction="row" spacing={1} alignItems="center" key="filter-stack">
            <FormControl size="small" key="sector-filter">
              <InputLabel id="sector-filter-label">Secteur</InputLabel>
              <Select
                labelId="sector-filter-label"
                value={sectorFilter}
                label="Secteur"
                onChange={handleSectorFilterChange}
                sx= {{mb: 0.5}}
                startAdornment={<Iconify icon="mdi:filter-variant" width={20} sx={{ mr: 0.5, ml: -0.5}} />}
              >
                <MenuItem value="all" key="all-sectors">Tous</MenuItem>
                {sectors.map((sector, index) => (
                  <MenuItem key={`sector-${index}-${sector}`} value={sector}>{sector}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        }
      />
      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button size="small" onClick={handleRefresh} sx={{ ml: 2 }}>
              Réessayer
            </Button>
          </Alert>
        </Box>
      )}
      
      <Box sx={{ p: 2, pt: 1 }}>
        {loading ? (
          <Box sx={{ py: 3 }}>
            <Stack spacing={2}>
              {[...Array(3)].map((_, index) => (
                <Stack key={index} direction="row" spacing={2} sx={{ p: 1 }}>
                  <Skeleton variant="rounded" width={48} height={48} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={20} />
                  </Box>
                  <Skeleton variant="rounded" width={80} height={32} />
                </Stack>
              ))}
            </Stack>
          </Box>
        ) : filteredCompanies.length > 0 ? (
          <Stack spacing={3} divider={<Divider sx={{ borderStyle: 'dashed' }} key="company-divider" />}>
            {filteredCompanies.map((company, index) => (
              <CompanyItem 
                key={company.id || company.slug || `company-${index}`} 
                company={company} 
                isDarkMode={isDarkMode} 
              />
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Aucune entreprise trouvée
            </Typography>
          </Box>
        )}

        {filteredCompanies.length > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon="mdi:refresh" />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ mr: 1 }}
            >
              Actualiser
            </Button>
            <Button
              size="small"
              color="inherit"
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
            >
              Voir toutes
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
            color: isDarkMode ? theme.palette.text.primary : theme.palette.text.primary,
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

// ----------------------------------------------------------------------

function CompanyItem({ company, isDarkMode }) {
  const theme = useTheme();
  const popover = usePopover();
  
  // Déterminer la couleur du badge en fonction du statut
  const getStatusColor = (status) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'actif': return 'success';
      case 'inactive': return 'warning';
      case 'inactif': return 'warning';
      default: return 'default';
    }
  };
  
  // Vérifier si la dernière déclaration est récente (moins de 7 jours)
  const hasRecentDeclaration = company.lastDeclaration ? isRecent(company.lastDeclaration) : false;
  
  // Valeurs par défaut pour les propriétés qui pourraient être manquantes
  const companyName = company.name || company.nom || 'Entreprise sans nom';
  const companyLogo = company.logo || company.avatar || '/assets/images/company/default.png';
  const companySector = company.sector || company.secteur || 'Non spécifié';
  const companyEmployees = company.employees || company.employes || 0;
  const companyStatus = company.status || company.statut || 'Non spécifié';
  
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
        alt={companyName} 
        src={companyLogo} 
        variant="rounded"
        sx={{ 
          width: 48, 
          height: 48,
          backgroundColor: theme.palette.background.neutral,
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
          {companyName}
          {hasRecentDeclaration && (
            <Tooltip title="Déclaration récente" arrow>
              <Label 
                color="info" 
                variant="soft" 
                sx={{ 
                  height: 18, 
                  fontSize: '0.65rem',
                }}
              >
                Récent
              </Label>
            </Tooltip>
          )}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
          <Iconify icon="mdi:domain" width={14} sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {companySector}
          </Typography>

          {companyEmployees > 0 && (
            <>
              <Divider orientation="vertical" sx={{ height: 12, mx: 1 }} />
              <Iconify icon="mdi:account-group-outline" width={14} sx={{ color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {companyEmployees} employé{companyEmployees > 1 ? 's' : ''}
              </Typography>
            </>
          )}
        </Stack>
      </Box>

      <Stack alignItems="flex-end">
        {companyStatus && (
          <Label 
            variant="soft" 
            color={getStatusColor(companyStatus)}
            sx={{ fontWeight: 600 }}
          >
            {companyStatus === 'active' || companyStatus === 'actif' ? 'Active' : 
             companyStatus === 'inactive' || companyStatus === 'inactif' ? 'Inactive' : 
             companyStatus}
          </Label>
        )}

        {company.lastDeclaration && (
          <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
            <Iconify icon="mdi:calendar-outline" width={14} sx={{ mr: 0.5 }} />
            {fDate(company.lastDeclaration)}
          </Typography>
        )}
      </Stack>
      
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 250 }}
      >
        <MenuItem>
          <Iconify icon="solar:eye-bold" />
          Voir détails
        </MenuItem>

        <MenuItem>
          <Iconify icon="mdi:file-document-plus" />
          Nouvelle déclaration
        </MenuItem>

        <MenuItem>
          <Iconify icon="mdi:account-group" />
          Gérer les employés
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

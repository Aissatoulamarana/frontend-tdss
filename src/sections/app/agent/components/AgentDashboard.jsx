import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Button, 
  Card, 
  Container, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  Stack, 
  Typography,
  Alert,
  Skeleton
} from '@mui/material';
// Imports des paramètres de configuration
import { useSettingsContext } from 'src/components/settings/context/use-settings-context';

// Ces imports sont conservés pour l'implémentation future des appels API réels
// Actuellement, nous utilisons des données simulées pour le développement
// import axios from 'src/utils/axios';
// import API from 'src/utils/api';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';

import { AgentWidgetSummary } from './AgentWidgetSummary';
import { AgentDeclarationChart } from './AgentCharts';
import { AgentRecentDeclarations, AgentRecentEmployees } from './AgentTables';
import { AgentActionButton } from './AgentActionButton';

// ----------------------------------------------------------------------

// Obtenir la liste des entreprises de l'agent (sera remplacé par un appel API réel)
const AGENT_COMPANIES = [
  'Entreprise ABC',
  'Société XYZ',
];

// ----------------------------------------------------------------------

export default function AgentDashboard() {
  // Utiliser le contexte d'authentification pour obtenir l'utilisateur actuel
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const theme = useTheme();
  // Fonction pour gérer l'exportation des données
  const handleExportData = async () => {
    try {
      // Construire l'URL d'exportation
      const exportUrl = `/api/agent/export?company=${encodeURIComponent(companyFilter || '')}&period=${encodeURIComponent(periodFilter || '')}`;
      
      // Créer un élément d'ancrage pour déclencher le téléchargement
      const a = document.createElement('a');
      a.href = exportUrl;
      a.download = `export-${companyFilter || 'all'}-${periodFilter || 'all'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Afficher un message de succès
      toast.success('Exportation terminée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      toast.error('Erreur lors de l\'exportation');
    }
  };
  
  // Fonction pour gérer la création d'une nouvelle déclaration
  const handleCreateNew = useCallback(() => {
    // Ici, vous pouvez ajouter la logique pour créer une nouvelle déclaration
    // Par exemple, naviguer vers la page de création de déclaration
    // ou ouvrir une boîte de dialogue
    console.log('Création d\'une nouvelle déclaration');
    
    // Exemple de navigation (décommentez si vous utilisez next/router ou next/navigation)
    // router.push('/declarations/nouvelle');
    
    // Ou ouvrir une boîte de dialogue
    // setOpenNewDeclarationDialog(true);
  }, []);
  
  // Gestion du changement de filtre d'entreprise
  const handleCompanyChange = useCallback((event) => {
    const newCompany = event.target.value;
    setCompanyFilter(newCompany);
    // Les données seront automatiquement rafraîchies via l'effet qui dépend de companyFilter
  }, []);
  
  const [companyFilter, setCompanyFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('month');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [companies, setCompanies] = useState(AGENT_COMPANIES);
  
  // États pour les données
  const [summaryData, setSummaryData] = useState({
    totalDeclarations: 0,
    unsubmittedDeclarations: 0,
    rejectedDeclarations: 0
  });
  
  const [recentDeclarations, setRecentDeclarations] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], series: [] });
  
  // États de chargement
  const [loading, setLoading] = useState({
    summary: true,
    companies: true,
    charts: true,
    declarations: true,
    employees: true
  });
  
  // États d'erreur
  const [errors, setErrors] = useState({});

  // Charger les entreprises de l'agent
  const fetchCompanies = useCallback(async () => {
    setLoading(prev => ({ ...prev, companies: true }));
    try {
      // En production, remplacer par un appel API réel
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulation de chargement
      setCompanies(AGENT_COMPANIES);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises', error);
      setErrors(prev => ({ ...prev, companies: 'Impossible de charger les entreprises' }));
      toast.error('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(prev => ({ ...prev, companies: false }));
    }
  }, [user?.id]);

  // Déclaration des fonctions de chargement
  const fetchSummaryData = useCallback(async () => {
    setLoading(prev => ({ ...prev, summary: true }));
    try {
      const params = { company: companyFilter, period: periodFilter };
      
      if (periodFilter === 'custom' && dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate.toISOString().split('T')[0];
        params.endDate = dateRange.endDate.toISOString().split('T')[0];
      }
      
      // Données simulées pour le développement
      setSummaryData({
        totalDeclarations: 42,
        unsubmittedDeclarations: 8,
        rejectedDeclarations: 5,
        pending: 12,
        validated: 25
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors du chargement des données de résumé', error);
      setErrors(prev => ({ ...prev, summary: 'Impossible de charger les données de résumé' }));
      toast.error('Erreur lors du chargement des données de résumé');
      return false;
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  }, [companyFilter, periodFilter, dateRange]);

  const fetchChartData = useCallback(async () => {
    setLoading(prev => ({ ...prev, charts: true }));
    try {
      // Données simulées pour le développement
      setChartData({
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        series: [
          {
            name: 'Déclarations',
            type: 'column',
            data: [23, 44, 22, 27, 43, 22],
          },
          {
            name: 'Montants',
            type: 'area',
            data: [30, 25, 36, 30, 45, 35],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error('Erreur lors du chargement des données du graphique', error);
      setErrors(prev => ({ ...prev, charts: 'Impossible de charger les données du graphique' }));
      return false;
    } finally {
      setLoading(prev => ({ ...prev, charts: false }));
    }
  }, []);

  const fetchDeclarationsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, declarations: true }));
    try {
      // Données simulées pour le développement
      setRecentDeclarations([
        { id: 1, reference: 'DEC-2023-001', company: 'Entreprise ABC', period: 'Janvier 2023', amount: 1500, status: 'validated' },
        { id: 2, reference: 'DEC-2023-002', company: 'Société XYZ', period: 'Janvier 2023', amount: 2300, status: 'pending' },
        { id: 3, reference: 'DEC-2022-012', company: 'Entreprise ABC', period: 'Décembre 2022', amount: 1800, status: 'validated' },
      ]);
      return true;
    } catch (error) {
      console.error('Erreur lors du chargement des déclarations récentes', error);
      setErrors(prev => ({ ...prev, declarations: 'Impossible de charger les déclarations récentes' }));
      return false;
    } finally {
      setLoading(prev => ({ ...prev, declarations: false }));
    }
  }, []);

  const fetchEmployeesData = useCallback(async () => {
    setLoading(prev => ({ ...prev, employees: true }));
    try {
      // Données simulées pour le développement
      setRecentEmployees([
        { id: 1, name: 'Jean Dupont', matricule: 'EMP001', position: 'Développeur', department: 'IT', joinDate: '15/01/2022' },
        { id: 2, name: 'Marie Martin', matricule: 'EMP002', position: 'Designer', department: 'Design', joinDate: '22/03/2022' },
        { id: 3, name: 'Pierre Durand', matricule: 'EMP003', position: 'Chef de projet', department: 'Gestion', joinDate: '10/05/2021' },
      ]);
      return true;
    } catch (error) {
      console.error('Erreur lors du chargement des employés récents', error);
      setErrors(prev => ({ ...prev, employees: 'Impossible de charger les employés récents' }));
      return false;
    } finally {
      setLoading(prev => ({ ...prev, employees: false }));
    }
  }, []);

  // Fonction pour gérer le changement de période
  const handlePeriodFilterChange = useCallback((event) => {
    const newPeriod = event.target.value;
    setPeriodFilter(newPeriod);
  }, []);
  
  // Fonction pour gérer le changement de filtre d'entreprise
  const handleCompanyFilterChange = useCallback((event) => {
    setCompanyFilter(event.target.value);
  }, []);

  // Fonction pour rafraîchir toutes les données
  const handleRefresh = useCallback(() => {
    setLoading(prev => ({
      ...prev,
      summary: true,
      charts: true,
      declarations: true,
      employees: true
    }));
    
    // Exécuter toutes les fonctions de chargement
    Promise.all([
      fetchSummaryData(),
      fetchChartData(),
      fetchDeclarationsData(),
      fetchEmployeesData()
    ]).catch(error => {
      console.error('Erreur lors du rafraîchissement des données', error);
      toast.error('Erreur lors du rafraîchissement des données');
    });
  }, [fetchSummaryData, fetchChartData, fetchDeclarationsData, fetchEmployeesData]);
  
  // Effet pour recharger les données lorsque les filtres changent
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRefresh();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [companyFilter, periodFilter, handleRefresh]);
  
  // Effet pour charger les données initiales
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Effet pour charger les données initiales
  useEffect(() => {
    // Charger les entreprises au montage du composant
    fetchCompanies();
    
    // Charger les autres données initiales
    const loadInitialData = async () => {
      try {
        setLoading(prev => ({
          ...prev,
          summary: true,
          charts: true,
          declarations: true,
          employees: true
        }));
        
        await Promise.all([
          fetchSummaryData(),
          fetchChartData(),
          fetchDeclarationsData(),
          fetchEmployeesData()
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement initial des données', error);
        toast.error('Erreur lors du chargement des données');
      }
    };
    
    loadInitialData();
    
    // Nettoyage si nécessaire
    return () => {
      // Annuler les requêtes en cours si nécessaire
    };
  }, [fetchCompanies, fetchSummaryData, fetchChartData, fetchDeclarationsData, fetchEmployeesData]);
  
  // Effet pour recharger les données lorsque les filtres changent
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRefresh();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [companyFilter, periodFilter, handleRefresh]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* En-tête avec filtre et bouton d'action */}
      <Box sx={{ 
        mb: 5, 
        p: 3, 
        borderRadius: 2,
        color: 'common.white',
        boxShadow: 3
      }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: 'common.white', fontWeight: 'bold', mb: 0.5 }}>
              Tableau de bord
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, display: { xs: 'none', sm: 'block' } }}>
              Bon retour, {user?.name || 'Agent'}. Voici un aperçu de vos activités.
            </Typography>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
           
            
            <FormControl 
              variant="outlined" 
              size="small" 
              sx={{ 
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.8)'
                  }
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.8)'
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'rgba(255, 255, 255, 0.9)'
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.8)'
                }
              }}
            >
              <InputLabel id="company-filter-label">Entreprise</InputLabel>
              <Select
                labelId="company-filter-label"
                value={companyFilter}
                onChange={handleCompanyChange}
                label="Entreprise"
                disabled={loading.summary || loading.charts || loading.declarations || loading.employees}
              >
                <MenuItem value="all">Toutes les entreprises</MenuItem>
                {AGENT_COMPANIES.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Box>
      
      {/* Boutons d'action secondaires */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="mdi:refresh" />}
          onClick={handleRefresh}
          disabled={loading.summary}
          sx={{
            '&:hover': {
              bgcolor: 'action.hover',
              transform: 'translateY(-1px)',
              boxShadow: 1
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Actualiser
        </Button>
        
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<Iconify icon="mdi:file-export" />}
          onClick={handleExportData}
          disabled={loading.summary}
          sx={{
            '&:hover': {
              bgcolor: 'secondary.light',
              color: 'secondary.contrastText',
              transform: 'translateY(-1px)',
              boxShadow: 1
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Exporter
        </Button>
        
        <AgentActionButton />
      </Box>
      
      {/* Affichage des erreurs */}
      {errors.summary && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.summary}
          <Button size="small" onClick={fetchSummaryData} sx={{ ml: 2 }}>
            Réessayer
          </Button>
        </Alert>
      )}
      
      {/* Widgets de résumé */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          {loading.summary ? (
            <Card sx={{ p: 3, height: '100%', minHeight: 200 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentWidgetSummary
              title="Total Déclarations"
              total={summaryData.totalDeclarations}
              icon={<Iconify icon="mdi:file-document-multiple" width={36} height={36} />}
              color="primary"
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {loading.summary ? (
            <Card sx={{ p: 3, height: '100%', minHeight: 200 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentWidgetSummary
              title="Déclarations non soumises"
              total={summaryData.unsubmittedDeclarations}
              icon={<Iconify icon="mdi:file-document-alert" width={36} height={36} />}
              color="warning"
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          {loading.summary ? (
            <Card sx={{ p: 3, height: '100%', minHeight: 200 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={40} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentWidgetSummary
              title="Déclarations rejetées"
              total={summaryData.rejectedDeclarations}
              icon={<Iconify icon="mdi:file-document-remove" width={36} height={36} />}
              color="error"
            />
          )}
        </Grid>
        
        {/* Graphiques */}
        <Grid item xs={12} lg={12}>
          {errors.charts && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.charts}
              <Button size="small" onClick={fetchChartData} sx={{ ml: 2 }}>
                Réessayer
              </Button>
            </Alert>
          )}
          {loading.charts ? (
            <Card sx={{ p: 3, height: '100%', minHeight: 350 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentDeclarationChart />
          )}
        </Grid>
          
          
        </Grid>

        {/* Tableaux de données sur la même ligne avec répartition 70/30 */}
        <Grid container item xs={12} spacing={2} sx={{ mt: 3 }}>
          {/* Section Déclarations récentes (70%) */}
          <Grid item xs={12} md={8}>
            {errors.declarations && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.declarations}
                <Button size="small" onClick={fetchDeclarationsData} sx={{ ml: 2 }}>
                  Réessayer
                </Button>
              </Alert>
            )}
            {loading.declarations ? (
              <Card sx={{ p: 3, height: '100%', minHeight: 400 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
              </Card>
            ) : (
              <AgentRecentDeclarations />
            )}
          </Grid>

          {/* Section Entreprises associées (30%) */}
          <Grid item xs={12} md={4}>
            {errors.employees && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.employees}
                <Button size="small" onClick={fetchEmployeesData} sx={{ ml: 2 }}>
                  Réessayer
                </Button>
              </Alert>
            )}
            {loading.employees ? (
              <Card sx={{ p: 3, height: '100%', minHeight: 400 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
              </Card>
            ) : (
              <AgentRecentEmployees />
            )}
          </Grid>
        </Grid>
  
    </Container>
  );
}
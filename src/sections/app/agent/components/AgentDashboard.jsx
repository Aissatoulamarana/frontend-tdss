import { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
// Ces imports sont conservés pour l'implémentation future des appels API réels
// Actuellement, nous utilisons des données simulées pour le développement
import axios from 'src/utils/axios';
import API from 'src/utils/api';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';

import { AgentWidgetSummary, getAgentSummaryData } from './AgentWidgetSummary';
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
  
  const [companyFilter, setCompanyFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('month');
  const [companies, setCompanies] = useState(AGENT_COMPANIES);
  
  // États pour les données
  const [summaryData, setSummaryData] = useState({
    totalDeclarations: 0,
    unsubmittedDeclarations: 0,
    rejectedDeclarations: 0
  });
  
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
      // const response = await axios.get(API.getAgentCompanies(user?.id));
      // setCompanies(response.data);
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // En attendant l'API réelle, on utilise des données simulées
      // mais dans un environnement de production, ces données viendraient du serveur
      // en fonction de l'utilisateur authentifié
      setCompanies(AGENT_COMPANIES);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises', error);
      setErrors(prev => ({ ...prev, companies: 'Impossible de charger les entreprises' }));
      toast.error('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(prev => ({ ...prev, companies: false }));
    }
  }, [user?.id]); // Ajouter user?.id comme dépendance pour recharger si l'utilisateur change

  // Fonction pour gérer le changement de période
  const handlePeriodFilterChange = (event) => {
    const newPeriod = event.target.value;
    setPeriodFilter(newPeriod);
    // Recharger les données avec la nouvelle période
    setTimeout(() => handleRefresh(), 100);
  };

  // Charger les données de résumé
  const fetchSummaryData = useCallback(async () => {
    setLoading(prev => ({ ...prev, summary: true }));
    try {
      // Préparer les paramètres pour l'appel API
      const params = { company: companyFilter, period: periodFilter };
      
      // Si la période est personnalisée et que les dates sont définies
      if (periodFilter === 'custom' && dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate.toISOString().split('T')[0];
        params.endDate = dateRange.endDate.toISOString().split('T')[0];
      }
      
      try {
        // Appel API réel pour récupérer les données de résumé
        const response = await axios.get(API.getAgentSummary(companyFilter), { params });
        
        // Vérifier si la réponse contient les données attendues
        if (response.data) {
          setSummaryData({
            totalDeclarations: response.data.totalDeclarations || 0,
            unsubmittedDeclarations: response.data.unsubmittedDeclarations || 0,
            rejectedDeclarations: response.data.rejectedDeclarations || 0
          });
        } else {
          // Fallback sur les données mockées en cas de réponse vide
          console.warn('Réponse API vide, utilisation des données mockées');
          setSummaryData({
            totalDeclarations: getAgentSummaryData('totalDeclarations', companyFilter, user?.id),
            unsubmittedDeclarations: getAgentSummaryData('unsubmittedDeclarations', companyFilter, user?.id),
            rejectedDeclarations: getAgentSummaryData('rejectedDeclarations', companyFilter, user?.id)
          });
        }
      } catch (error) {
        console.warn('Erreur API, utilisation des données mockées', error);
        // Fallback sur les données mockées en cas d'erreur
        setSummaryData({
          totalDeclarations: getAgentSummaryData('totalDeclarations', companyFilter, user?.id),
          unsubmittedDeclarations: getAgentSummaryData('unsubmittedDeclarations', companyFilter, user?.id),
          rejectedDeclarations: getAgentSummaryData('rejectedDeclarations', companyFilter, user?.id)
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de résumé', error);
      setErrors(prev => ({ ...prev, summary: 'Impossible de charger les données de résumé' }));
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  }, [companyFilter, periodFilter, toast]);
  
  // Charger les données des graphiques
  const fetchChartData = useCallback(async () => {
    setLoading(prev => ({ ...prev, charts: true }));
    try {
      // Préparer les paramètres pour l'appel API
      const params = { company: companyFilter, period: periodFilter };
      
      try {
        // Appel API réel pour récupérer les données des graphiques
        const response = await axios.get(API.getAgentChartData(companyFilter), { params });
        
        // Mettre à jour les données des graphiques si la réponse est valide
        if (response.data && response.data.chartData) {
          // Ici, vous pouvez stocker les données dans un état si nécessaire
          // ou les passer directement aux composants de graphiques
          // Par exemple : setChartData(response.data.chartData);
          console.log('Données des graphiques chargées avec succès', response.data);
        } else {
          console.warn('Réponse API vide pour les graphiques');
          // Vous pouvez charger des données mockées ici si nécessaire
        }
      } catch (error) {
        console.warn('Erreur lors du chargement des données des graphiques via API', error);
        // Vous pouvez charger des données mockées ici si nécessaire
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données des graphiques', error);
      setErrors(prev => ({ ...prev, charts: 'Impossible de charger les graphiques' }));
      toast.error('Erreur lors du chargement des graphiques');
    } finally {
      setLoading(prev => ({ ...prev, charts: false }));
    }
  }, [companyFilter, periodFilter, user?.id]);

  // Charger les données des déclarations récentes
  const fetchDeclarationsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, declarations: true }));
    try {
      // Préparer les paramètres pour l'appel API
      const params = { company: companyFilter, period: periodFilter };
      
      try {
        // Appel API réel pour récupérer les déclarations récentes
        const response = await axios.get(API.getAgentRecentDeclarations(params));
        
        // Mettre à jour les données des déclarations si la réponse est valide
        if (response.data && Array.isArray(response.data.declarations)) {
          // Ici, vous pourriez stocker les déclarations dans un état global
          // ou les passer directement au composant AgentRecentDeclarations
          // Par exemple : setDeclarations(response.data.declarations);
          
          // Assurez-vous que les déclarations sont triées selon la priorité demandée :
          // 1. Déclarations non soumises (pending)
          // 2. Déclarations rejetées (rejected)
          // 3. Tri par date (plus récent en premier)
          const sortedDeclarations = [...response.data.declarations].sort((a, b) => {
            // Priorité 1: Non soumises (pending)
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            
            // Priorité 2: Rejetées (rejected)
            if (a.status === 'rejected' && b.status !== 'rejected') return -1;
            if (a.status !== 'rejected' && b.status === 'rejected') return 1;
            
            // Priorité 3: Par date (plus récent en premier)
            return new Date(b.date) - new Date(a.date);
          });
          
          console.log('Déclarations récentes chargées avec succès', sortedDeclarations);
          // Vous pourriez stocker les déclarations triées ici : setDeclarations(sortedDeclarations);
        } else {
          console.warn('Réponse API vide pour les déclarations récentes');
          // Vous pouvez charger des données mockées ici si nécessaire
        }
      } catch (error) {
        console.warn('Erreur lors du chargement des déclarations récentes via API', error);
        // Vous pouvez charger des données mockées ici si nécessaire
      }
    } catch (error) {
      console.error('Erreur lors du chargement des déclarations récentes', error);
      setErrors(prev => ({ ...prev, declarations: 'Impossible de charger les déclarations récentes' }));
      toast.error('Erreur lors du chargement des déclarations');
    } finally {
      setLoading(prev => ({ ...prev, declarations: false }));
    }
  }, [companyFilter, periodFilter, user?.id]);
  
  // Charger les données des employés récents
  const fetchEmployeesData = useCallback(async () => {
    setLoading(prev => ({ ...prev, employees: true }));
    try {
      // Préparer les paramètres pour l'appel API
      const params = { company: companyFilter, period: periodFilter };
      
      try {
        // Appel API réel pour récupérer les employés récents
        const response = await axios.get(API.getAgentRecentEmployees(params));
        
        // Mettre à jour les données des employés si la réponse est valide
        if (response.data && Array.isArray(response.data.employees)) {
          // Ici, vous pourriez stocker les employés dans un état global
          // ou les passer directement au composant AgentRecentEmployees
          // Par exemple : setEmployees(response.data.employees);
          
          console.log('Employés récents chargés avec succès', response.data.employees);
        } else {
          console.warn('Réponse API vide pour les employés récents');
          // Vous pouvez charger des données mockées ici si nécessaire
        }
      } catch (error) {
        console.warn('Erreur lors du chargement des employés récents via API', error);
        // Vous pouvez charger des données mockées ici si nécessaire
      }
    } catch (error) {
      console.error('Erreur lors du chargement des employés récents', error);
      setErrors(prev => ({ ...prev, employees: 'Impossible de charger les employés récents' }));
      toast.error('Erreur lors du chargement des employés');
    } finally {
      setLoading(prev => ({ ...prev, employees: false }));
    }
  }, [companyFilter, periodFilter, user?.id]);

  // Effet pour charger les données initiales
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Effet pour charger toutes les données lorsque le filtre change
  useEffect(() => {
    fetchSummaryData();
    fetchChartData();
    fetchDeclarationsData();
    fetchEmployeesData();
  }, [fetchSummaryData, fetchChartData, fetchDeclarationsData, fetchEmployeesData]);

  const handleCompanyFilterChange = (event) => {
    setCompanyFilter(event.target.value);
  };
  
  // Fonction pour rafraîchir toutes les données
  const handleRefresh = () => {
    fetchSummaryData();
    fetchChartData();
    fetchDeclarationsData();
    fetchEmployeesData();
  };

  return (
    <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box>
          <Typography variant="h4">Tableau de Bord Agent</Typography>
          {user && (
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {user.name} | {user.type_name} |
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }} size="small" disabled={loading.companies}>
            <InputLabel id="company-filter-label">Entreprise</InputLabel>
            <Select
              labelId="company-filter-label"
              value={companyFilter}
              label="Entreprise"
              onChange={handleCompanyFilterChange}
            >
              <MenuItem value="all">Toutes mes entreprises</MenuItem>
              {companies.map(company => (
                <MenuItem key={company} value={company}>{company}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel id="period-filter-label">Période</InputLabel>
            <Select
              labelId="period-filter-label"
              value={periodFilter}
              label="Période"
              onChange={handlePeriodFilterChange}
            >
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="quarter">Ce trimestre</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Iconify icon="mdi:refresh" />}
            onClick={handleRefresh}
            disabled={loading.summary}
          >
            Actualiser
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Iconify icon="mdi:file-export" />}
            onClick={() => window.open(API.exportAgentData(companyFilter, periodFilter), '_blank')}
            disabled={loading.summary}
          >
            Exporter
          </Button>
          
          <AgentActionButton />
        </Box>
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
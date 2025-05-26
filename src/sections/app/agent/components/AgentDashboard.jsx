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
import { AgentPermitCategoryChart, AgentDeclarationChart } from './AgentCharts';
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
    totalEmployees: 0,
    totalPayments: 0,
    pendingPayments: 0,
    totalInvoices: 0
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
      // const response = await axios.get(API.getAgentCompanies());
      // setCompanies(response.data);
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCompanies(AGENT_COMPANIES);
    } catch (error) {
      console.error('Erreur lors du chargement des entreprises', error);
      setErrors(prev => ({ ...prev, companies: 'Impossible de charger les entreprises' }));
      toast.error('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(prev => ({ ...prev, companies: false }));
    }
  }, []);

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
      
      // En production, remplacer par un appel API réel
      // const response = await axios.get(API.getAgentSummary(companyFilter), { params });
      // setSummaryData(response.data);
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSummaryData({
        totalEmployees: getAgentSummaryData('totalEmployees', companyFilter, user?.id),
        totalPayments: getAgentSummaryData('totalPayments', companyFilter, user?.id),
        pendingPayments: getAgentSummaryData('pendingPayments', companyFilter, user?.id),
        totalInvoices: getAgentSummaryData('totalInvoices', companyFilter, user?.id)
      });
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
      
      // En production, remplacer par un appel API réel
      // const response = await axios.get(API.getAgentChartData(companyFilter), { params });
      // Mettre à jour les données des graphiques
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Les données sont déjà chargées dans les composants de graphiques
    } catch (error) {
      console.error('Erreur lors du chargement des données des graphiques', error);
      setErrors(prev => ({ ...prev, charts: 'Impossible de charger les graphiques' }));
      toast.error('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(prev => ({ ...prev, charts: false }));
    }
  }, [companyFilter, periodFilter, toast]);

  // Charger les données des déclarations récentes
  const fetchDeclarationsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, declarations: true }));
    try {
      // Préparer les paramètres pour l'appel API
      const params = { company: companyFilter, period: periodFilter };
      
      // En production, remplacer par un appel API réel
      // const response = await axios.get(API.getAgentRecentDeclarations(companyFilter), { params });
      // Mettre à jour les données des déclarations
    } catch (error) {
      console.error('Erreur lors du chargement des déclarations récentes', error);
      setErrors(prev => ({ ...prev, declarations: 'Impossible de charger les déclarations récentes' }));
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(prev => ({ ...prev, declarations: false }));
    }
  }, [companyFilter, periodFilter, toast]);
  
  // Charger les données des employés récents
  const fetchEmployeesData = useCallback(async () => {
    setLoading(prev => ({ ...prev, employees: true }));
    try {
      // Préparer les paramètres pour l'appel API
      const params = { company: companyFilter, period: periodFilter };
      
      // En production, remplacer par un appel API réel
      // const response = await axios.get(API.getAgentRecentEmployees(params));
      // Mettre à jour les données des employés
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1700));
      // Les données sont déjà chargées dans le composant de tableau
    } catch (error) {
      console.error('Erreur lors du chargement des employés récents', error);
      setErrors(prev => ({ ...prev, employees: 'Impossible de charger les employés récents' }));
      toast.error('Erreur lors du chargement des entreprises');
    } finally {
      setLoading(prev => ({ ...prev, employees: false }));
    }
  }, [companyFilter, periodFilter, toast]);

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
        <Typography variant="h4">Tableau de Bord Agent</Typography>
        
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
        <Grid item xs={12} sm={6} md={3}>
          {loading.summary ? (
            <Card sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentWidgetSummary
              title="Employés déclarés"
              total={summaryData.totalEmployees}
              icon={<Iconify icon="mdi:account-group" width={36} />}
              color="info"
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading.summary ? (
            <Card sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentWidgetSummary
              title="Total Paiement"
              total={summaryData.totalPayments}
              icon={<Iconify icon="mdi:cash-multiple" width={36} />}
              color="success"
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading.summary ? (
            <Card sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentWidgetSummary
              title="En attente de paiement"
              total={summaryData.pendingPayments}
              icon={<Iconify icon="mdi:clock-time-four" width={36} />}
              color="warning"
            />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {loading.summary ? (
            <Card sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentWidgetSummary
              title="Total Factures"
              total={summaryData.totalInvoices}
              icon={<Iconify icon="mdi:file-document" width={36} />}
              color="error"
            />
          )}
        </Grid>

        {/* Graphiques */}
        <Grid item xs={12} md={6} lg={4}>
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
            <AgentPermitCategoryChart />
          )}
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          {loading.charts ? (
            <Card sx={{ p: 3, height: '100%', minHeight: 350 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <AgentDeclarationChart />
          )}
        </Grid>

        {/* Tableaux de données */}
        <Grid item xs={12} md={6} lg={8}>
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

        <Grid item xs={12} md={6} lg={4}>
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
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Stack, 
  Typography, 
  Box, 
  Button, 
  CircularProgress,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuthContext } from 'src/auth/hooks';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import dayjs from 'dayjs';
import { Iconify } from 'src/components/iconify';

// Components
import { AguipeStats } from './components/AguipeStats';
import { AguipeCharts } from './components/AguipeCharts';
import { AguipeTables } from './components/AguipeTables';

// Services
import AguipService from 'src/services/aguipService';

// ----------------------------------------------------------------------

// Périodes prédéfinies
const PERIODS = [
  { value: 'this_month', label: 'Ce mois-ci' },
  { value: 'last_month', label: 'Le mois dernier' },
  { value: 'last_3_months', label: '3 derniers mois' },
  { value: 'this_year', label: 'Cette année' },
  { value: 'custom', label: 'Personnalisée' },
];

export default function AguipeAppView() {
  const theme = useTheme();
  const { user } = useAuthContext();
  
  // États
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    chartData: { series: [], categories: [] },
    recentDeclarations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('this_month');
  const [startDate, setStartDate] = useState(dayjs(startOfMonth(new Date())));
  const [endDate, setEndDate] = useState(dayjs(endOfMonth(new Date())));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Charger les données du tableau de bord
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Formater les dates au format attendu par l'API (YYYY-MM-DD)
      const formatDate = (date) => {
        if (dayjs.isDayjs(date)) {
          return date.format('YYYY-MM-DD');
        }
        return format(date, 'yyyy-MM-dd');
      };
      
      // Déterminer les dates en fonction de la période sélectionnée
      let start = startDate;
      let end = endDate;
      
      const today = new Date();
      
      switch (period) {
        case 'this_month':
          start = dayjs().startOf('month');
          end = dayjs().endOf('month');
          break;
        case 'last_month':
          start = dayjs().subtract(1, 'month').startOf('month');
          end = dayjs().subtract(1, 'month').endOf('month');
          break;
        case 'last_3_months':
          start = dayjs().subtract(3, 'month');
          end = dayjs();
          break;
        case 'this_year':
          start = dayjs().startOf('year');
          end = dayjs();
          break;
        // Pour 'custom', on utilise les dates sélectionnées
      }
      
      console.log('Période sélectionnée:', period);
      console.log('Dates de la requête:', { start: formatDate(start), end: formatDate(end) });
      
      // Mettre à jour les états des dates
      setStartDate(start);
      setEndDate(end);
      
      // Récupérer les données de l'API
      console.log('Appel à AguipService.getDashboardData...');
      const data = await AguipService.getDashboardData({
        startDate: formatDate(start),
        endDate: formatDate(end)
      });
      
      console.log('Données reçues de l\'API:', data);
      
      // Vérifier si les données sont valides
      if (!data) {
        throw new Error('Aucune donnée reçue du service');
      }
      
      // Log des données de statistiques pour débogage
      console.log('Statistiques reçues:', {
        total_declarations: data.stats?.total_declarations,
        total_facture: data.stats?.total_facture,
        total_payment: data.stats?.total_payment,
        taux_payment: data.stats?.taux_payment
      });
      
      setDashboardData(data);
      
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des données',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]); // On ne met que period en dépendance pour éviter les boucles infinies

  // Charger les données au montage du composant  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadDashboardData();
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
        setSnackbar({
          open: true,
          message: 'Erreur lors du chargement des données',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps
  
  // Gérer le changement de période
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };
  
  // Gérer le changement de date personnalisée
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (period !== 'custom') {
      setPeriod('custom');
    }
  };
  
  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (period !== 'custom') {
      setPeriod('custom');
    }
  };
  
  // Formater la période pour l'affichage
  const formatPeriodDisplay = () => {
    if (period === 'custom') {
      return `Du ${startDate.format('DD MMM YYYY')} au ${endDate.format('DD MMM YYYY')}`;
    }
    return PERIODS.find(p => p.value === period)?.label || '';
  };

  // Gérer la fermeture de la snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fonction pour formater le type de profil
  const formatUserRole = (role) => {
    const roles = {
      admin: 'Administrateur',
      agent: 'Agent',
      supervisor: 'Superviseur',
      manager: 'Gestionnaire',
    };
    return roles[role] || role;
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        {/* En-tête avec informations utilisateur et période */}
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">Tableau de bord AGUIPE</Typography>
            {user && (
              <Typography variant="body2" color="text.secondary">
                Connecté en tant que <strong>{user.name || user.email}</strong>
                {user.type_name && ` (${formatUserRole(user.type_name)})`}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {formatPeriodDisplay()}
            </Typography>
          </Box>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
            <select
              value={period}
              onChange={handlePeriodChange}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                minWidth: '200px',
                backgroundColor: 'white',
                height: '40px'
              }}
            >
              {PERIODS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <DatePicker
              label="Début"
              value={startDate}
              onChange={handleStartDateChange}
              format="dd/MM/yyyy"
              slotProps={{ 
                textField: { 
                  size: 'small', 
                  sx: { width: { xs: '100%', sm: 150 } },
                  fullWidth: typeof window !== 'undefined' && window.innerWidth < 600
                } 
              }}
              disabled={period !== 'custom'}
            />
            
            <DatePicker
              label="Fin"
              value={endDate}
              onChange={handleEndDateChange}
              format="dd/MM/yyyy"
              slotProps={{ 
                textField: { 
                  size: 'small', 
                  sx: { width: { xs: '100%', sm: 150 } },
                  fullWidth: typeof window !== 'undefined' && window.innerWidth < 600
                } 
              }}
              disabled={period !== 'custom'}
            />
            
            <Button 
              variant="contained" 
              onClick={loadDashboardData}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Iconify icon="mdi:refresh" />}
              fullWidth={typeof window !== 'undefined' && window.innerWidth < 600}
              sx={{ height: '40px' }}
            >
              {loading ? 'Chargement...' : 'Actualiser'}
            </Button>
          </Stack>
        </Stack>

        {/* Affichage des erreurs */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Section des statistiques */}
        <div>
          {console.log('Données transmises à AguipeStats:', {
            stats: dashboardData.stats,
            loading
          })}
          <AguipeStats 
            stats={{
              total_declarations: dashboardData.stats?.total_declarations || 0,
              total_facture: dashboardData.stats?.total_facture || 0,
              total_payment: dashboardData.stats?.total_payment || 0,
              taux_payment: dashboardData.stats?.taux_payment || 0
            }}
            loading={loading}
          />
        </div>

        {/* Section des graphiques */}
        <AguipeCharts 
          statistique_shart={dashboardData.statistique_shart || {}}
          loading={loading}
        />

        {/* Section des tableaux */}
        <AguipeTables 
          declarations={dashboardData.recentDeclarations} 
          loading={loading}
        />
      </Stack>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

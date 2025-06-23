'use client';

import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { useMockedUser } from 'src/auth/hooks';

// import { AppNewInvoice } from '../app-new-invoice';
import { AppNewInvoice} from './app-new-invoice';
// import { AppWidgetSummary } from '../app-widget-summary';
import { AppWidgetSummary } from './app-widget-summary';

// Import axios et ton API
import axios from 'src/utils/axios';
import API from 'src/utils/api';

import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box 
} from '@mui/material';

import { MultiLineChart } from './CaissierCharts';

// Service pour récupérer toutes les factures avec tous les résultats
// const fetchAllFactures = async () => {
//   try {
//     // Premier appel pour récupérer le count total
//     const firstResponse = await axios.get(API.listFactures());
//     const totalCount = firstResponse.data.count;
    
//     // Si on a beaucoup de factures, on récupère tout avec limit élevé
//     const response = await axios.get(API.listFactures(), {
//       params: {
//         limit: totalCount || 1000 // On récupère toutes les factures
//       }
//     });
    
//     // console.log('All Factures Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des factures:', error);
//     throw error;
//   }
// };

// // Fonction pour filtrer les données par mois
// const filterDataByMonth = (data, selectedMonth, selectedYear) => {
//   if (!data || !Array.isArray(data) || !selectedMonth || !selectedYear) return data || [];
  
//   return data.filter(item => {
//     const itemDate = new Date(item.created_on);
//     return itemDate.getMonth() === selectedMonth - 1 && itemDate.getFullYear() === selectedYear;
//   });
// };

// // Fonction pour générer les données de transaction par mois
// const generateMonthlyTransactionData = (factures, selectedYear) => {
//   const monthlyData = Array(12).fill(0);
//   const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  
//     // Vérifier que factures existe et est un tableau
//   if (!factures || !Array.isArray(factures)) {
//     return {
//       categories: monthNames,
//       series: monthlyData
//     };
//   }

//   factures.forEach(facture => {
//     const date = new Date(facture.created_on);
//     if (date.getFullYear() === selectedYear) {
//       monthlyData[date.getMonth()]++;
//     }
//   });
  
//   return {
//     categories: monthNames,
//     series: monthlyData
//   };
// };

// Services pour recuperer les metriques du dashboard
const fetchDashboardMetrics = async (month, year) => {
  try {
    const params = {};
    if (month) params.month = month;
    if (year) params.year = year;
    const response = await axios.get(API.facturesFirstLineDashboardCaissier(month), { params });
    // console.log('Dashboard Metrics Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques du dashboard:', error);
    throw error;
  }
};
// Service pour récupérer les transactions mensuelles
const fetchMonthlyTransactionData = async (year) => {
  try {
    const response = await axios.get(API.paiementsMonthly(year));
    // console.log('Monthly Transaction Data Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de transaction mensuelles:', error);
    throw error;
  }
};
// Service pour récupérer les 5 dernières factures non payées
const fetchLastUnpaidInvoices = async () => {
  try {
    const response = await axios.get(API.facturesLastUnpaid());
    // console.log('Dernières Factures Non Payées Response:', response.data);
    return response.data.results || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des dernières factures non payées:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export function CaissierAppView() {

  const { user } = useMockedUser();
  const theme = useTheme();

  // États pour les métriques du dashboard
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalFactures: 0,
    montantTotalFactures: 0,
    facturesPayees: 0,
    montantFacturesPayees: 0,
    facturesEnAttente: 0,
    montantFacturesEnAttente: 0,
    montantTotalPaye: 0,
    nombrePaiements: 0,
  });

  // const [dernieresFactures, setDernieresFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les filtres
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  
  // états pour les données
  const [dernieresFacturesNonPayees, setDernieresFacturesNonPayees] = useState([]);
  const [monthlyTransactionData, setMonthlyTransactionData] = useState({
    categories: [],
    series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  // const [allFactures, setAllFactures] = useState([]);
  
  // Préparation des données pour le graphique
  const rechartsData = (monthlyTransactionData.categories || []).map((month, index) => ({
    mois: month,
    transactions: monthlyTransactionData.series ? monthlyTransactionData.series[index] : 0,
  }));

  // Options pour les filtres
  const months = [
    { value: '', label: 'Tous les mois' },
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
  ];
  const years = Array.from({ length: 5}, (_, i) => new Date().getFullYear() - i);

//   const calculateMetrics = (factures) => {
//     if (!factures || factures.length === 0) {
//       return {
//         totalFactures: 0,
//         montantTotalFactures: 0,
//         facturesPayees: 0,
//         montantFacturesPayees: 0,
//         facturesEnAttente: 0,
//         montantFacturesEnAttente: 0,
//       };
//     }
//     // filtrer par mois si selectionné
//     const filteredFactures = filterDataByMonth(factures, selectedMonth, selectedYear);
//     // 1. Total Factures
//     const totalFactures = filteredFactures.length;
//     const montantTotalFactures = filteredFactures.reduce((total, facture) => total + parseFloat(facture.amount || 0), 0);
//     // 2. Factures payées - somme des factures avec status = "PAID"
//     const facturesPayees = filteredFactures.filter(facture => facture.status === 'PAID');
//     const facturesPayeesCount = facturesPayees.length;
//     const montantFacturesPayees = facturesPayees.reduce((total, facture) => total + parseFloat(facture.amount || 0), 0);

//     // FActures en attente
//     const facturesEnAttente = filteredFactures.filter(facture => facture.status !== 'PAID');
//     const facturesEnAttenteCount = facturesEnAttente.length;
//     const montantFacturesEnAttente = facturesEnAttente.reduce((total, facture) => total + parseFloat(facture.amount || 0), 0);
//     return {
//       totalFactures,
//       montantTotalFactures,
//       facturesPayees: facturesPayeesCount,
//       montantFacturesPayees,
//       facturesEnAttente: facturesEnAttenteCount,
//       montantFacturesEnAttente,
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const facturesData = await fetchAllFactures();
//         setAllFactures(facturesData.results || []);
//         // console.log('All Factures Data:', facturesData.results);
//       } catch (err) {
//         setError('Erreur lors du chargement des factures');
//         console.error('Erreur lors du chargement des factures:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Recalcul des métriques et des données à chaque changement de filtre
// useEffect(() => {
//   if (allFactures && allFactures.length > 0) {
//     const metrics = calculateMetrics(allFactures);
//     setDashboardMetrics(metrics);

//     // Génération des données pour le graphique
//     const chartData = generateMonthlyTransactionData(allFactures, chartYear);
//     setMonthlyTransactionData(chartData);
//     // console.log('Monthly Transaction Data:', chartData);
//     // console.log('Monthly Transaction Data:', chartData.series);

//     // 5 dernières factures non payées
//     const facturesNonPayees = allFactures
//       .filter(facture => facture.status !== 'PAID')
//       .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
//       .slice(0, 5);
//     setDernieresFacturesNonPayees(facturesNonPayees);
//   }
// }, [allFactures, selectedMonth, selectedYear, chartYear]);


  // fonction pour charger les metriques du dashboard
  
  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const metrics = await fetchDashboardMetrics(selectedMonth, selectedYear);
      setDashboardMetrics({
        totalFactures: metrics.number_total_factures || 0,
        montantTotalFactures: metrics.total_factures_amount || 0,
        facturesPayees: metrics.number_factures_paid || 0,
        montantFacturesPayees: metrics.factures_paid_amount || 0,
        facturesEnAttente: metrics.number_factures_unpaid || 0,
        montantFacturesEnAttente: metrics.factures_unpaid_amount || 0,
      });
    } catch (error) {
      setError('Erreur lors du chargement des métriques');
      console.error('Erreur lors du chargement des métriques:', error);
    } finally {
      setLoading(false);
    }
  };
  // fonction pour charger les transactions mensuelles 
  const loadMonthlyTransactions = async () => {
    try {
      const data = await fetchMonthlyTransactionData(chartYear); 
      console.log(`Data monthly transactions:`, data);
      
      if (data.month && data.data) {
        // Convertir les numéros de mois en noms de mois
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const categories = data.month.map(monthNum => {
          const index = parseInt(monthNum, 10) - 1; // Convertir "01" -> 0, "02" -> 1, etc.
          return monthNames[index] || monthNum;
        });
        
        setMonthlyTransactionData({
          categories: categories,
          series: data.data
        });
        console.log('Données mensuelles (format month/data):', { categories, series: data.data });
      }
      // Format par défaut en cas d'échec
      else {
        setMonthlyTransactionData({
          categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
          series: data.transactions_by_month || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        });
        console.log('Données mensuelles (par défaut):', data);
      }
    } catch (error) {
      setError('Erreur lors du chargement des transactions mensuelles'); 
      console.error('Erreur lors du chargement des transactions mensuelles:', error);
    }
  }
  // Fonction pour charger les 5 dernieres factures non payees
  const loadLastUnpaidInvoices = async () => {
    try {
      const data = await fetchLastUnpaidInvoices(); 
      setDernieresFacturesNonPayees(data.results || data.invoices || data || []); 
    } catch (err) {
      console.error('Erreur lors du chargement des factures non payées:', err);
      setError('Erreur lors du chargement des factures non payées');
    }
  }

  // chargement initial des donnees 
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true); 
        setError(null); 

        // chargement simultane des data
        await Promise.all([
          loadDashboardMetrics(), 
          loadMonthlyTransactions(), 
          loadLastUnpaidInvoices()
        ]); 
      } catch (err) {
        setError('Erreur lors du chargement des data'); 
        console.error('Erreur lors du chargement initial', err); 
      } finally {
        setLoading(false);
      }
    }; 
    loadInitialData();  
  }, []);
  // Recharger les métriques quand les filtres changent
  useEffect(() => {
    if (!loading) {
      loadDashboardMetrics();
    }
  }, [selectedMonth, selectedYear]);

  // Recharger les transactions mensuelles quand l'année du graphique change
  useEffect(() => {
    if (!loading) {
      loadMonthlyTransactions();
    }
  }, [chartYear]);
  // Fonction pour formater les nombres  
  function formatNumber(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (loading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div> Chargement des données ...</div>
        </Box>
      </DashboardContent>
    );
  }

return (
  <DashboardContent maxWidth="xl">
    {error && (
      <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
        {error}
      </div>
    )}

    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Tableau de bord Caissier</h2>
      <Box sx={{ typography: 'subtitle1', color: 'text.secondary' }}>
        {user ? `Bienvenue, ${user.name}` : 'Bienvenue, utilisateur inconnu'}
      </Box>
    </Box>

    {/* Filtres */}
    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Mois</InputLabel>
        <Select
          value={selectedMonth}
          label="Mois"
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Année</InputLabel>
        <Select
          value={selectedYear}
          label="Année"
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
    </Box>

    <Grid container spacing={2}>
      {/* Première ligne - Métriques principales */}
      <Grid size={{ xs: 12, md: 4 }}>
        <AppWidgetSummary
          title="Total Factures"
          percent={2.6}
          total={dashboardMetrics.totalFactures}
          subtitle={`Montant: ${formatNumber(dashboardMetrics.montantTotalFactures)}`}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [15, 18, 12, 51, 68, 11, 39, 37],
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <AppWidgetSummary
          title="Factures Payées"
          percent={0.2}
          total={dashboardMetrics.facturesPayees}
          subtitle={`Montant: ${formatNumber(dashboardMetrics.montantFacturesPayees)}`}
          chart={{
            colors: [theme.vars.palette.success.main],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [20, 41, 63, 33, 28, 35, 50, 46],
          }}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <AppWidgetSummary
          title="Factures en Attente"
          percent={-0.1}
          total={dashboardMetrics.facturesEnAttente}
          subtitle={`Montant: ${formatNumber(dashboardMetrics.montantFacturesEnAttente)}`}
          chart={{
            colors: [theme.vars.palette.warning.main],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [18, 19, 31, 8, 16, 37, 12, 33],
          }}
        />
      </Grid>

      {/* Deuxième ligne - Graphique des transactions */}
      <Grid size={{ xs: 12 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Transactions par Mois</h3>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Année</InputLabel>
            <Select
              value={chartYear}
              label="Année"
              onChange={(e) => setChartYear(e.target.value)}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <MultiLineChart data={rechartsData} />
      </Grid>

      {/* Troisième ligne - Dernières factures non payées */}
      <Grid size={{ xs: 12 }}>
        <AppNewInvoice
          title="5 Dernières Factures Non Payées"
          tableData={dernieresFacturesNonPayees} 
          headLabel={[
            { id: 'number', label: 'Numéro Facture' },
            { id: 'declaration_number', label: 'Numéro Déclaration' },
            { id: 'amount', label: 'Montant' },
            { id: 'client', label: 'Client' },
            { id: 'status', label: 'Statut' },
            { id: 'created_on', label: 'Date de Création' },
          ]}
        />
      </Grid>
    </Grid>
  </DashboardContent>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { useMockedUser } from 'src/auth/hooks';

// import { AppNewInvoice } from '../app-new-invoice';
import { AppNewInvoice } from './app-new-invoice';
// import { AppWidgetSummary } from '../app-widget-summary';
import { AppWidgetSummary } from './app-widget-summary';

// Import axios et ton API
import axios from 'src/utils/axios';
import API from 'src/utils/api';

import { FormControl, InputLabel, Select, MenuItem, Box, Menu, IconButton } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

import { MultiLineChart } from './CaissierCharts';

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
const fetchMonthlyTransactionData = async (year, month = null) => {
  try {
    const params = { year };
    if (month) params.month = month;
    const response = await axios.get(API.paiementsMonthly(year), { params });
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
    console.log('Dernières Factures Non Payées Response:', response.data);
    return response.data || [];
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les filtres - Première ligne (métriques)
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // États pour les filtres - Deuxième ligne (graphique transactions)
  const [chartMonth, setChartMonth] = useState('');
  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  // états pour les données
  const [dernieresFacturesNonPayees, setDernieresFacturesNonPayees] = useState([]);
  const [monthlyTransactionData, setMonthlyTransactionData] = useState({
    categories: [],
    series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  // État pour le menu d'export
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const exportMenuOpen = Boolean(exportAnchorEl);

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
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

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
      const data = await fetchMonthlyTransactionData(chartYear, chartMonth);
      // console.log(`Data monthly transactions:`, data);

      if (data.month && data.data) {
        // Convertir les numéros de mois en noms de mois
        const monthNames = [
          'Jan',
          'Fév',
          'Mar',
          'Avr',
          'Mai',
          'Jun',
          'Jul',
          'Aoû',
          'Sep',
          'Oct',
          'Nov',
          'Déc',
        ];
        const categories = data.month.map((monthNum) => {
          const index = parseInt(monthNum, 10) - 1; // Convertir "01" -> 0, "02" -> 1, etc.
          return monthNames[index] || monthNum;
        });

        setMonthlyTransactionData({
          categories: categories,
          series: data.data,
        });
        // console.log('Données mensuelles (format month/data):', { categories, series: data.data });
      }
      // Format par défaut en cas d'échec
      else {
        setMonthlyTransactionData({
          categories: [
            'Jan',
            'Fév',
            'Mar',
            'Avr',
            'Mai',
            'Jun',
            'Jul',
            'Aoû',
            'Sep',
            'Oct',
            'Nov',
            'Déc',
          ],
          series: data.transactions_by_month || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        });
        // console.log('Données mensuelles (par défaut):', data);
      }
    } catch (error) {
      setError('Erreur lors du chargement des transactions mensuelles');
      console.error('Erreur lors du chargement des transactions mensuelles:', error);
    }
  };

  // Fonction pour charger les 5 dernieres factures non payees
  const loadLastUnpaidInvoices = async () => {
    try {
      const data = await fetchLastUnpaidInvoices();
      console.log('DATA des dernières factures non payées:', data);
      setDernieresFacturesNonPayees(data.results || data.invoices || data || []);
      // console.log('Dernières Factures Non Payées :', dernieresFacturesNonPayees);
    } catch (err) {
      console.error('Erreur lors du chargement des factures non payées:', err);
      setError('Erreur lors du chargement des factures non payées');
    }
  };

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
          loadLastUnpaidInvoices(),
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

  // Recharger les métriques quand les filtres de la première ligne changent
  useEffect(() => {
    if (!loading) {
      loadDashboardMetrics();
    }
  }, [selectedMonth, selectedYear]);

  // Recharger les transactions mensuelles quand les filtres de la deuxième ligne changent
  useEffect(() => {
    if (!loading) {
      loadMonthlyTransactions();
    }
  }, [chartYear, chartMonth]);

  // Fonction pour formater les nombres
  function formatNumber(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // Fonctions d'export
  const handleExportMenuOpen = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };

  const exportToCSV = () => {
    const headers = ['Mois', 'Nombre de Transactions'];
    const csvContent = [
      headers.join(','),
      ...rechartsData.map((row) => `${row.mois},${row.transactions}`),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `transactions_mensuelles_${chartYear}${chartMonth ? `_${chartMonth}` : ''}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleExportMenuClose();
  };

  const exportToJSON = () => {
    const jsonData = {
      periode: {
        annee: chartYear,
        mois: chartMonth || 'Tous les mois',
      },
      donnees: rechartsData,
      totalTransactions: rechartsData.reduce((sum, item) => sum + item.transactions, 0),
      dateExport: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `transactions_mensuelles_${chartYear}${chartMonth ? `_${chartMonth}` : ''}.json`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleExportMenuClose();
  };

  const exportToExcel = () => {
    // Simuler un export Excel basique avec format TSV
    const headers = ['Mois', 'Nombre de Transactions'];
    const tsvContent = [
      headers.join('\t'),
      ...rechartsData.map((row) => `${row.mois}\t${row.transactions}`),
    ].join('\n');

    const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `transactions_mensuelles_${chartYear}${chartMonth ? `_${chartMonth}` : ''}.xls`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleExportMenuClose();
  };

  const printChart = () => {
    const printContent = `
      <html>
        <head>
          <title>Transactions Mensuelles - ${chartYear}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .period { color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .summary { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rapport des Transactions Mensuelles</h1>
            <div class="period">Période: ${chartMonth ? months.find((m) => m.value === chartMonth)?.label : 'Tous les mois'} ${chartYear}</div>
          </div>
          <table>
            <thead>
              <tr><th>Mois</th><th>Nombre de Transactions</th></tr>
            </thead>
            <tbody>
              ${rechartsData.map((row) => `<tr><td>${row.mois}</td><td>${row.transactions}</td></tr>`).join('')}
            </tbody>
          </table>
          <div class="summary">
            <strong>Total des transactions: ${rechartsData.reduce((sum, item) => sum + item.transactions, 0)}</strong>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    handleExportMenuClose();
  };

  if (loading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          <div> Chargement des données ...</div>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Tableau de bord Caissier</h2>
        <Box sx={{ typography: 'subtitle1', color: 'text.secondary' }}>
          {user ? `Bienvenue, ${user.name}` : 'Bienvenue, utilisateur inconnu'}
        </Box>
      </Box>

      {/* Filtres pour la première ligne - Métriques */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Métriques des Factures</h3>
        <Box sx={{ display: 'flex', gap: 2 }}>
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

        {/* Deuxième ligne - Graphique des transactions avec filtres */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <h3>Transactions par Mois</h3>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Mois</InputLabel>
                <Select
                  value={chartMonth}
                  label="Mois"
                  onChange={(e) => setChartMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}

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

              {/* Bouton d'export */}
              <IconButton
                onClick={handleExportMenuOpen}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
                title="Exporter les données"
              >
                <DownloadIcon />
              </IconButton>

              {/* Menu d'export */}
              <Menu
                anchorEl={exportAnchorEl}
                open={exportMenuOpen}
                onClose={handleExportMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={exportToExcel}>📊 Exporter en Excel</MenuItem>
                <MenuItem onClick={printChart}>🖨️ Imprimer le rapport</MenuItem>
              </Menu>
            </Box>
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

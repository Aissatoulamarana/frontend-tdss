import { useState, useEffect, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';
import { Iconify } from 'src/components/iconify';

import { ComptableWidgetSummary } from './ComptableWidgetSummary';
import { ComptableDeclarationTable } from './ComptableTables';
import { ComptableFactureTable } from './ComptableTables';
import { ComptableFacturationChart } from './ComptableCharts';
import { ComptableStatusChart } from './ComptableCharts';

// ----------------------------------------------------------------------

export function ComptableDashboard() {
  const theme = useTheme();
  const { user } = useAuthContext();
  
  const [summaryData, setSummaryData] = useState({
    declarationsToInvoice: 0,
    totalInvoices: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState({
    summary: true,
    declarations: true,
    invoices: true,
    charts: true,
  });

  const [errors, setErrors] = useState({
    summary: null,
    declarations: null,
    invoices: null,
    charts: null,
  });

  // Fonction pour récupérer les données de résumé
  const fetchSummaryData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, summary: true }));
      setErrors(prev => ({ ...prev, summary: null }));
      
      // Simulation d'un appel API
      // À remplacer par un vrai appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données mockées pour le développement
      setSummaryData({
        declarationsToInvoice: 24,
        totalInvoices: 156,
        pendingPayments: 32,
        totalRevenue: 15680000, // en FCFA
      });
      
      setLoading(prev => ({ ...prev, summary: false }));
    } catch (error) {
      console.error('Erreur lors de la récupération des données de résumé:', error);
      setErrors(prev => ({ ...prev, summary: 'Erreur lors de la récupération des données de résumé' }));
      setLoading(prev => ({ ...prev, summary: false }));
    }
  }, []);

  // Fonction pour récupérer les données des déclarations
  const fetchDeclarationsData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, declarations: true }));
      setErrors(prev => ({ ...prev, declarations: null }));
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(prev => ({ ...prev, declarations: false }));
    } catch (error) {
      console.error('Erreur lors de la récupération des déclarations:', error);
      setErrors(prev => ({ ...prev, declarations: 'Erreur lors de la récupération des déclarations' }));
      setLoading(prev => ({ ...prev, declarations: false }));
    }
  }, []);

  // Fonction pour récupérer les données des factures
  const fetchInvoicesData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, invoices: true }));
      setErrors(prev => ({ ...prev, invoices: null }));
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(prev => ({ ...prev, invoices: false }));
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
      setErrors(prev => ({ ...prev, invoices: 'Erreur lors de la récupération des factures' }));
      setLoading(prev => ({ ...prev, invoices: false }));
    }
  }, []);

  // Fonction pour récupérer les données des graphiques
  const fetchChartData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, charts: true }));
      setErrors(prev => ({ ...prev, charts: null }));
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(prev => ({ ...prev, charts: false }));
    } catch (error) {
      console.error('Erreur lors de la récupération des données des graphiques:', error);
      setErrors(prev => ({ ...prev, charts: 'Erreur lors de la récupération des données des graphiques' }));
      setLoading(prev => ({ ...prev, charts: false }));
    }
  }, []);

  // Charger les données au chargement du composant
  useEffect(() => {
    fetchSummaryData();
    fetchDeclarationsData();
    fetchInvoicesData();
    fetchChartData();
  }, [fetchSummaryData, fetchDeclarationsData, fetchInvoicesData, fetchChartData]);

  return (
    <Container maxWidth="xl">
      {/* En-tête du dashboard */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Tableau de bord Comptable
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {user ? (
            <>Bienvenue, {user.name} | Rôle : {user.type_name}</>
          ) : (
            <>Bienvenue, Utilisateur | Rôle: Comptable</>
          )}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Widgets de résumé */}
        <Grid item xs={12} sm={6} md={3}>
          {loading.summary ? (
            <Card sx={{ p: 3 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={60} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <ComptableWidgetSummary
              title="Déclarations à facturer"
              total={summaryData.declarationsToInvoice}
              icon={<Iconify icon="mdi:file-document-edit" width={36} height={36} />}
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
            <ComptableWidgetSummary
              title="Total Factures"
              total={summaryData.totalInvoices}
              icon={<Iconify icon="mdi:file-document-multiple" width={36} height={36} />}
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
            <ComptableWidgetSummary
              title="Paiements en attente"
              total={summaryData.pendingPayments}
              icon={<Iconify icon="mdi:clock-time-four" width={36} height={36} />}
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
            <ComptableWidgetSummary
              title="Chiffre d'affaires"
              total={summaryData.totalRevenue}
              icon={<Iconify icon="mdi:cash-multiple" width={36} height={36} />}
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
            <ComptableStatusChart />
          )}
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          
          {loading.charts ? (
            <Card sx={{ p: 3, height: '100%', minHeight: 350 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <ComptableFacturationChart />
          )}
        </Grid>

        {/* Tableaux de données */}
        <Grid item xs={12} lg={12}>
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
            <ComptableDeclarationTable title="Déclarations à facturer" />
          )}
        </Grid>

        <Grid item xs={12} lg={12}>
          {errors.invoices && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.invoices}
              <Button size="small" onClick={fetchInvoicesData} sx={{ ml: 2 }}>
                Réessayer
              </Button>
            </Alert>
          )}
          {loading.invoices ? (
            <Card sx={{ p: 3, height: '100%', minHeight: 400 }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={300} sx={{ mt: 2 }} />
            </Card>
          ) : (
            <ComptableFactureTable title="Factures récentes" />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

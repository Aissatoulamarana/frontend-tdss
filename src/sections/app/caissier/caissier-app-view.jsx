'use client';

import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';

import { _appAuthors, _appRelated, _appInstalled } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { useMockedUser } from 'src/auth/hooks';

import { AppAreaInstalled } from '../app-area-installed';
import { AppCurrentDownload } from '../app-current-download';
// import { AppNewInvoice } from '../app-new-invoice';
import { AppNewInvoice} from './app-new-invoice';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopInstalledCountries } from '../app-top-installed-countries';
import { AppTopRelated } from '../app-top-related';
import { AppWidgetSummary } from '../app-widget-summary';

// Import axios et ton API
import axios from 'src/utils/axios';
import API from 'src/utils/api';

// Service pour récupérer toutes les factures avec tous les résultats
const fetchAllFactures = async () => {
  try {
    // Premier appel pour récupérer le count total
    const firstResponse = await axios.get(API.listFactures());
    const totalCount = firstResponse.data.count;
    
    // Si on a beaucoup de factures, on récupère tout avec limit élevé
    const response = await axios.get(API.listFactures(), {
      params: {
        limit: totalCount || 1000 // On récupère toutes les factures
      }
    });
    
    // console.log('All Factures Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    throw error;
  }
};

// Service pour récupérer les paiements
const fetchAllPaiements = async () => {
  try {
    const response = await axios.get(API.listPaiments());
    // console.log('All Paiements Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
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
    facturesPayees: 0,
    montantTotalPaye: 0,
    nombrePaiements: 0,
  });
  const [dernieresFactures, setDernieresFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération des métriquess
  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupère toutes les factures
        const facturesData = await fetchAllFactures();
        // Récupère tous les paiements
        const paiementsData = await fetchAllPaiements();
        // console.log('Paiements Data:', paiementsData);
        
        // 1. Total Factures
        const totalFactures = facturesData.count;
        // console.log('Total Factures:', totalFactures);

        // 2. Factures payées - somme des factures avec status = "PAID"
        const facturesPayees = facturesData.results?.filter(
          facture => facture.status === 'PAID'
        ).length || 0;
        // console.log('Factures Payées:', facturesPayees);

        // 3. Montant Total Payé - somme des amounts des factures payées par le caissier
        const montantTotalPaye = facturesData.results
          ?.filter(facture => facture.status === 'PAID' && facture.created_by === user?.name)
          .reduce((total, facture) => total + parseFloat(facture.amount || 0), 0) ;
        // console.log('Montant Total Payé:', montantTotalPaye);

        // 4. Nombre de paiements - nombre de paiements effectués par le caissier
        const PaiementsParCaissier = paiementsData.results?.filter(
          paiement => paiement.created_by === user?.name
        ).length || 0;
        // console.log('user connected :', user)
        // console.log('Nombre de Paiements:', PaiementsParCaissier);
        const nombrePaiements = PaiementsParCaissier;

        // 5. Dernières factures (5 dernières)
        const dernieres = facturesData.results?.sort((a, b) => new Date(b.created_on) - new Date(a.created_on)).slice(0, 5) || [];
        // console.log('Dernières :', dernieres);
        setDashboardMetrics({
          totalFactures,
          facturesPayees,
          montantTotalPaye,
          nombrePaiements,
        });
        setDernieresFactures(dernieres);
        // console.log('Dernières Factures:', dernieresFactures);

      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  // Fonction pour formater les montants en GNF 
  const formatCurrency = (amount) => new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF', // GNF - change selon ta devise
    }).format(amount);

  // Fonction pour formater les nombres
  const formatNumber = (number) => new Intl.NumberFormat('fr-FR').format(number);

  // Calcul des pourcentages (tu peux les adapter selon tes besoins)
  const calculatePercentage = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <DashboardContent maxWidth="xl">
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <AppWidgetSummary
            title="Total Factures"
            percent={2.6} // Tu peux calculer ce pourcentage dynamiquement
            total={dashboardMetrics.totalFactures}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <AppWidgetSummary
            title="Factures payées"
            percent={0.2}
            total={dashboardMetrics.facturesPayees}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <AppWidgetSummary
            title="Montant Total Payé"
            percent={2.6}
            total={formatNumber(dashboardMetrics.montantTotalPaye)} // Format sans devise pour l'affichage
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <AppWidgetSummary
            title="Nombre de Paiements"
            percent={-0.1}
            total={dashboardMetrics.nombrePaiements}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        {/* Reste du dashboard... */}
        <Grid size={{ xs: 6, md: 4 }}>
          <AppCurrentDownload
            title="Paiements Par type de permis"
            subheader=""
            chart={{
              series: [
                { label: 'Permis A', value: 12244 },
                { label: 'Permis B', value: 53345 },
                { label: 'Permis C', value: 44313 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 8 }}>
          <AppAreaInstalled
            title="Factures"
            subheader="(+43%) Depuis l'année dernière"
            chart={{
              categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
              ],
              series: [
                {
                  name: '2022',
                  data: [
                    { name: 'Permis A', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                    { name: 'Permis B', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                    { name: 'Permis C', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    { name: 'Permis A', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                    { name: 'Permis B', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                    { name: 'Permis C', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                  ],
                },
                {
                  name: '2024',
                  data: [
                    { name: 'Permis A', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Permis B', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Permis C', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                  ],
                },
                {
                  name: '2025',
                  data: [
                    { name: 'Permis A', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Permis B', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                    { name: 'Permis C', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 8 }}>
          <AppNewInvoice
            title="Dernières Factures"
            tableData={dernieresFactures} 
            headLabel={[
              { id: 'number', label: 'Numéro Facture ' },
              { id: 'declaration_number', label: 'Numéro Déclaration' },
              { id: 'amount', label: 'Montant' },
              { id: 'client', label: 'Client' },
              { id: 'status', label: 'Statut' },
            ]}
            />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <AppTopRelated title="Entreprises" list={_appRelated} />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <AppTopInstalledCountries title="Pays" list={_appInstalled} />
        </Grid>

        <Grid size={{ xs: 6, md: 4 }}>
          <AppTopAuthors title="Top Utilisateurs" list={_appAuthors} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
import { useState, useEffect, useCallback } from 'react';
import { Container } from '@mui/material';
import { toast } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { useSettingsContext } from 'src/components/settings/context/use-settings-context';

// Importation des composants modulaires
import {
  AgentDashboardHeader,
  AgentStatCards,
  AgentChartSection,
  AgentDeclarationsSection
} from './dashboard';

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

  // États pour les filtres
  const [companyFilter, setCompanyFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // États pour les données
  const [summaryData, setSummaryData] = useState({
    totalDeclarations: 0,
    unsubmittedDeclarations: 0,
    rejectedDeclarations: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentDeclarations, setRecentDeclarations] = useState([]);

  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState({
    summary: true,
    charts: true,
    declarations: true
  });
  const [errors, setErrors] = useState({
    summary: '',
    charts: '',
    declarations: ''
  });

  // Fonction pour gérer l'exportation des données
  const handleExportData = async () => {
    try {
      const exportUrl = `/api/agent/export?company=${encodeURIComponent(companyFilter || '')}&period=${encodeURIComponent(periodFilter || '')}`;
      const a = document.createElement('a');
      a.href = exportUrl;
      a.download = `export-${companyFilter || 'all'}-${periodFilter || 'all'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Exportation terminée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'exportation');
    }
  };

  // Fonction pour charger les données de l'agent
  const fetchAgentData = useCallback(async () => {
    // Réinitialiser les erreurs
    setErrors({
      summary: '',
      charts: '',
      declarations: ''
    });

    // Charger les données de résumé
    setLoading(prev => ({ ...prev, summary: true }));
    try {
      // Simulation d'un appel API avec un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées - à remplacer par un appel API réel
      const summaryResponse = {
        totalDeclarations: 125,
        unsubmittedDeclarations: 8,
        rejectedDeclarations: 3
      };
      
      setSummaryData(summaryResponse);
    } catch (error) {
      console.error('Erreur lors du chargement des données de résumé:', error);
      setErrors(prev => ({ ...prev, summary: 'Erreur lors du chargement des données de résumé' }));
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }

    // Charger les données du graphique
    setLoading(prev => ({ ...prev, charts: true }));
    try {
      // Simulation d'un appel API avec un délai
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Données simulées - à remplacer par un appel API réel
      const chartResponse = [
        { month: 'Jan', value: 10 },
        { month: 'Fév', value: 15 },
        { month: 'Mar', value: 12 },
        { month: 'Avr', value: 18 },
        { month: 'Mai', value: 20 },
        { month: 'Juin', value: 22 },
        { month: 'Juil', value: 25 },
        { month: 'Août', value: 28 },
        { month: 'Sep', value: 30 },
        { month: 'Oct', value: 32 },
        { month: 'Nov', value: 35 },
        { month: 'Déc', value: 40 }
      ];
      
      setChartData(chartResponse);
    } catch (error) {
      console.error('Erreur lors du chargement des données du graphique:', error);
      setErrors(prev => ({ ...prev, charts: 'Erreur lors du chargement des données du graphique' }));
    } finally {
      setLoading(prev => ({ ...prev, charts: false }));
    }

    // Charger les déclarations récentes
    setLoading(prev => ({ ...prev, declarations: true }));
    try {
      // Simulation d'un appel API avec un délai
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Données simulées - à remplacer par un appel API réel
      const declarationsResponse = [
        {
          id: '1',
          company: 'Entreprise ABC',
          employee: 'Jean Dupont',
          date: '2023-05-15',
          amount: 250000,
          status: 'pending'
        },
        {
          id: '2',
          company: 'Société XYZ',
          employee: 'Marie Martin',
          date: '2023-05-10',
          amount: 350000,
          status: 'approved'
        },
        {
          id: '3',
          company: 'Entreprise ABC',
          employee: 'Pierre Durand',
          date: '2023-05-05',
          amount: 150000,
          status: 'rejected'
        },
        {
          id: '4',
          company: 'Société XYZ',
          employee: 'Sophie Lefebvre',
          date: '2023-04-28',
          amount: 200000,
          status: 'approved'
        },
        {
          id: '5',
          company: 'Entreprise ABC',
          employee: 'Luc Moreau',
          date: '2023-04-20',
          amount: 300000,
          status: 'pending'
        }
      ];
      
      setRecentDeclarations(declarationsResponse);
    } catch (error) {
      console.error('Erreur lors du chargement des déclarations récentes:', error);
      setErrors(prev => ({ ...prev, declarations: 'Erreur lors du chargement des déclarations récentes' }));
    } finally {
      setLoading(prev => ({ ...prev, declarations: false }));
    }
  }, []);

  // Charger les données au chargement du composant
  useEffect(() => {
    fetchAgentData();
  }, [fetchAgentData]);

  // Gérer le changement de filtre d'entreprise
  const handleCompanyFilterChange = (event) => {
    setCompanyFilter(event.target.value);
  };

  // Gérer le changement de filtre de période
  const handlePeriodFilterChange = (event) => {
    setPeriodFilter(event.target.value);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* En-tête avec filtres et boutons d'action */}
      <AgentDashboardHeader 
        user={user}
        companyFilter={companyFilter}
        onCompanyChange={handleCompanyFilterChange}
        companies={AGENT_COMPANIES}
        onRefresh={fetchAgentData}
        onExport={handleExportData}
        loading={loading.summary || loading.charts || loading.declarations}
      />

      {/* Cartes de statistiques */}
      <AgentStatCards 
        stats={{
          total: summaryData.totalDeclarations,
          pending: summaryData.unsubmittedDeclarations,
          rejected: summaryData.rejectedDeclarations
        }}
        loading={loading.summary}
      />

      {/* Section graphique */}
      <AgentChartSection 
        loading={loading.charts}
        error={errors.charts}
        onRetry={() => fetchAgentData()}
      />

      {/* Section déclarations récentes */}
      <AgentDeclarationsSection 
        loading={loading.declarations}
        error={errors.declarations}
        onRetry={() => fetchAgentData()}
      />
    </Container>
  );
}
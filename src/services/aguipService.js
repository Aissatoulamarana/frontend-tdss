import axios from 'src/utils/axios';
import API from 'src/utils/api';

class AguipService {
  /**
   * Récupère les données du tableau de bord AGUIP
   * @param {Object} params - Paramètres de requête
   * @param {string} [params.startDate] - Date de début au format DD/MM/YYYY
   * @param {string} [params.endDate] - Date de fin au format DD/MM/YYYY
   * @returns {Promise<Object>} Les données du tableau de bord formatées
   */
  static async getDashboardData({ startDate, endDate } = {}) {
    try {
      const url = API.getAguipDashboard(startDate, endDate);
      const response = await axios.get(url);
      
      // Formatage des données pour les graphiques
      const formattedData = this.formatChartData(response.data);
      
      return {
        stats: response.data.statistiques_cards,
        chartData: formattedData,
        recentDeclarations: response.data.laste_declaration_liste || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord AGUIP:', error);
      throw error;
    }
  }

  /**
   * Formate les données pour les graphiques
   * @param {Object} data - Données brutes de l'API
   * @returns {Object} Données formatées pour les graphiques
   */
  static formatChartData(data) {
    if (!data.statistique_shart) {
      return { series: [], categories: Array(12).fill().map((_, i) => (i + 1).toString()) };
    }

    const { declaration, facture, payment } = data.statistique_shart;
    
    // Créer les catégories (mois de l'année)
    const categories = Array(12).fill().map((_, i) => {
      const date = new Date(2023, i, 1);
      return date.toLocaleString('fr-FR', { month: 'short' });
    });

    // Créer les séries pour chaque type de données
    const series = [
      {
        name: 'Déclarations',
        type: 'line',
        data: Object.values(declaration || {})
      },
      {
        name: 'Factures',
        type: 'column',
        data: Object.values(facture || {})
      },
      {
        name: 'Paiements',
        type: 'column',
        data: Object.values(payment || {})
      }
    ];

    return { series, categories };
  }
}

export default AguipService;

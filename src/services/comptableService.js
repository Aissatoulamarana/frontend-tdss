import axios from 'src/utils/axios';
import API from 'src/utils/api';

// Service pour le tableau de bord comptable
class ComptableService {
  
  // Récupérer le nombre de déclarations à facturer
  static async getDeclarationsToInvoice(month = null) {
    try {
      const response = await axios.get(API.getDeclarationsToInvoice(month));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des déclarations à facturer:', error);
      throw error;
    }
  }

  // Récupérer les données de première ligne du dashboard comptable
  static async getAccountantFirstLine(month = null) {
    try {
      const response = await axios.get(API.getAccountantFirstLine(month));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données de première ligne:', error);
      throw error;
    }
  }

  // Récupérer les données mensuelles des factures
  static async getMonthlyInvoices(year = null) {
    try {
      const response = await axios.get(API.getMonthlyInvoices(year));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données mensuelles:', error);
      throw error;
    }
  }

  // Récupérer les dernières déclarations validées
  static async getLastValidatedDeclarations() {
    try {
      const response = await axios.get(API.getLastValidatedDeclarations());
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des dernières déclarations:', error);
      throw error;
    }
  }

  // Méthode pour récupérer toutes les données du dashboard en parallèle
  static async getDashboardData(month = null, year = null) {
    try {
      const currentDate = new Date();
      const currentMonth = month || (currentDate.getMonth() + 1);
      const currentYear = year || currentDate.getFullYear();

      const [
        declarationsData,
        firstLineData,
        monthlyData,
        lastDeclarationsData
      ] = await Promise.all([
        this.getDeclarationsToInvoice(currentMonth),
        this.getAccountantFirstLine(currentMonth),
        this.getMonthlyInvoices(currentYear),
        this.getLastValidatedDeclarations()
      ]);

      return {
        declarationsToInvoice: declarationsData.number_declarations_to_invoice || 0,
        totalInvoices: firstLineData.number_total_factures || 0,
        pendingPayments: firstLineData.number_factures_unpaid || 0,
        totalRevenue: firstLineData.total_factures_amount || 0,
        monthlyData: {
          months: monthlyData.month || [],
          data: monthlyData.data || []
        },
        lastDeclarations: lastDeclarationsData || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données du dashboard:', error);
      throw error;
    }
  }
}

export default ComptableService;

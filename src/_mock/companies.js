// Données mock pour simuler une API paginée d'entreprises
export const MOCK_COMPANIES = [
  { slug: 'company-1', name: 'Entreprise Alpha' },
  { slug: 'company-2', name: 'Société Beta' },
  { slug: 'company-3', name: 'Groupe Gamma' },
  { slug: 'company-4', name: 'Corporation Delta' },
  { slug: 'company-5', name: 'Entreprise Epsilon' },
  { slug: 'company-6', name: 'Société Zeta' },
  { slug: 'company-7', name: 'Groupe Eta' },
  { slug: 'company-8', name: 'Corporation Theta' },
  { slug: 'company-9', name: 'Entreprise Iota' },
  { slug: 'company-10', name: 'Société Kappa' },
  { slug: 'company-11', name: 'Groupe Lambda' },
  { slug: 'company-12', name: 'Corporation Mu' },
  { slug: 'company-13', name: 'Entreprise Nu' },
  { slug: 'company-14', name: 'Société Xi' },
  { slug: 'company-15', name: 'Groupe Omicron' },
  { slug: 'company-16', name: 'Corporation Pi' },
  { slug: 'company-17', name: 'Entreprise Rho' },
  { slug: 'company-18', name: 'Société Sigma' },
  { slug: 'company-19', name: 'Groupe Tau' },
  { slug: 'company-20', name: 'Corporation Upsilon' },
  { slug: 'company-21', name: 'Entreprise Phi' },
  { slug: 'company-22', name: 'Société Chi' },
  { slug: 'company-23', name: 'Groupe Psi' },
  { slug: 'company-24', name: 'Corporation Omega' },
];

// Fonction pour simuler une API paginée
export const mockFetchCompanies = (page = 1, pageSize = 10)=>new Promise((resolve) => {
    // Simuler un délai réseau
    setTimeout(() => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const results = MOCK_COMPANIES.slice(startIndex, endIndex);
      
      // Simuler la structure d'une réponse d'API paginée
      resolve({
        data: {
          count: MOCK_COMPANIES.length,
          next: endIndex < MOCK_COMPANIES.length ? `/api/companies/?page=${page + 1}` : null,
          previous: page > 1 ? `/api/companies/?page=${page - 1}` : null,
          results,
        }
      });
    }, 300); // Délai de 300ms pour simuler le réseau
  });

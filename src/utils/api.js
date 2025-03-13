//  const BASE_URL = 'http://127.0.0.1:8000'; // Adresse de votre backend
 const BASE_URL = 'https://test.tdss.com.gn/api'; // Adresse de votre backend

const API = {
  nextjsPage: () => `${BASE_URL}/nextjs/page`, // Vue Next.js
  login: () => `${BASE_URL}/auth/jwt/create/`, // api connexion
  me: () => `${BASE_URL}/users/me/`, // informations de l'utilisateur connecté
  logout: () => `${BASE_URL}/auth/jwt/logout/`, // deconnexion
  resetPassword: () => `${BASE_URL}/users/reset_password/`,// reinitialisation du password

  createUser: () => `${BASE_URL}/users/`, // Création d'un utilisateur
  listUsers: () => `${BASE_URL}/users/`, // Liste des utilisateurs
  deleteUser: (slug) => `${BASE_URL}/users/${slug}/`, // Suppression d'un utilisateur
  updateUser: (slug) => `${BASE_URL}/users/${slug}/`, // Mise à jour d'un utilisateur
  userDetails: (slug) => `${BASE_URL}/users/${slug}/`, // Détails d'un utilisateur
  userDelete: (id) => `${BASE_URL}/users/${id}/`, // Supprimer un utilisateur

  listDeclarations: () => `${BASE_URL}/declarations/`, // Liste des déclarations
  createDeclaration: () => `${BASE_URL}/declarations/`, // Création d'une déclaration
  detailsDeclaration: (declarationId) => `${BASE_URL}/declarations/${declarationId}/`, // Voir les details d'une déclaration
  validateDeclaration: (declarationId) => `${BASE_URL}/declarations/${declarationId}/status-update/`, // Validation d'une déclaration
  facturerDeclaration: (declarationId) => `${BASE_URL}/declarations/${declarationId}/facturer`, // facturer une déclaration
  rejetterDeclaration: (declarationId) => `${BASE_URL}/declarations/${declarationId}/status-update/`, // Rejetter une déclaration 
  supprimerDeclaration: (declarationId) => `${BASE_URL}/declarations/${declarationId}/`, // Supprimer une déclaration
  updateDeclaration: (declarationId) => `${BASE_URL}/declarations/${declarationId}/`,// Modifier une déclaration
  move: () => `${BASE_URL}/declarations/move-employees/`,//deplacer des employés d'une déclaration à une autre


  listFactures: () => `${BASE_URL}/factures/`, // Liste des factures
  paidFacture: (factureId) => `${BASE_URL}factures/${factureId}/mark-paid/`, // Paiement d'une facture
  detailsFacture: (factureId) => `${BASE_URL}/factures/${factureId}/`,// Details d'une facture 
  PaidFactures: () => `${BASE_URL}/paid_factures/`, // payer plusieurs factures a la fois 
  
  listPaiments: () => `${BASE_URL}/payments/`, // Liste des paiements
  
  createFonction: () => `${BASE_URL}/jobs/`, // Ajouter une fonction
  listFonctions: () => `${BASE_URL}/jobs/`, // Liste des fonctions
  detailsFonction: (functionId) => `${BASE_URL}/jobs/${functionId}/`, // details d'une fonction
  deleteFonction: (functionId) => `${BASE_URL}/jobs/${functionId}/`, // Supprimer une fonction
  editFonction: (functionId) => `${BASE_URL}/jobs/${functionId}/`, // modifier une fonction
  

  CreateBank: () => `${BASE_URL}/bank/create`,
  listBank: () => `${BASE_URL}/list_bank/`,


  CreatePayeur: () => `${BASE_URL}/api/payeur/`,
  
  listRegions: () => `${BASE_URL}/regions/`,

  createAgence: () => `${BASE_URL}/agency/`,
  listAgences: () => `${BASE_URL}/regions/agencies/`,

  activate: (id) => `${BASE_URL}/activate-user/${id}/`,
  banni: (id) => `${BASE_URL}/banni-user/${id}/`,

 
  
  searchIdentifier: (identifier) => `${BASE_URL}/api/search_identifier/?identifier=${identifier}`,
  searchPassport: (numero) => `${BASE_URL}/employees/check-passport/?numero=${numero}`,

  createPermission: () => `${BASE_URL}/permission/`,
  listPermissions: () => `${BASE_URL}/permission/`, // Liste des fonctions

  listDevises: () => `${BASE_URL}/devises/`,

  listProfilesTypes: () => `${BASE_URL}/profile-types/`,

  createProfile: () => `${BASE_URL}/profiles/`,
  listProfiles: () => `${BASE_URL}/profiles/`,
  listClients: () => `${BASE_URL}/profiles/get-groupes/`,

  listCategories: () => `${BASE_URL}/api/job-categories/`,
  

};

export default API;

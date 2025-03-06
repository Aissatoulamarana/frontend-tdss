 const BASE_URL = 'http://127.0.0.1:8000'; // Adresse de votre backend
//  const BASE_URL = 'https://tdss-backend.onrender.com'; // Adresse de votre backend

const API = {
  nextjsPage: () => `${BASE_URL}/nextjs/page`, // Vue Next.js
  login: () => `${BASE_URL}/auth/jwt/create/`, // Vue Login
  me: () => `${BASE_URL}/auth/users/me/`,
  logout: () => `${BASE_URL}/auth/jwt/logout/`,
  listDeclarations: () => `${BASE_URL}/api_dec/`, // Liste des déclarations
  createDeclaration: () => `${BASE_URL}/create_dec/`, // Création d'une déclaration
  validateDeclaration: (declarationId) => `${BASE_URL}/update-status/${declarationId}/`, // Validation d'une déclaration
  listFactures: () => `${BASE_URL}/api_factures/`, // Liste des factures
  paidFacture: (factureId) => `${BASE_URL}api/paid-facture/${factureId}/`, // Paiement d'une facture
  detailsFacture: (factureId) => `${BASE_URL}/facture/${factureId}/`,// Details d'une facture 
  listUsers: () => `${BASE_URL}/auth/users/`, // Liste des utilisateurs
  userDetails: (id) => `${BASE_URL}/users/${id}/`, // Détails d'un utilisateur
  createUser: () => `${BASE_URL}/auth/users/`, // Création d'un utilisateur
  deleteUser: (id) => `${BASE_URL}/users/${id}/delete/`, // Suppression d'un utilisateur
  updateUser: (id) => `${BASE_URL}/auth/users/${id}/`, // Mise à jour d'un utilisateur
  facturerDeclaration: (declarationId) => `${BASE_URL}/facturer-dec/${declarationId}/`, // Validation d'une déclaration
  rejetterDeclaration: (declarationId) => `${BASE_URL}/update-status/${declarationId}/`, // Rejetter une déclaration
  detailsDeclaration: (declarationId) => `${BASE_URL}/details-declaration/${declarationId}/`, // Voir les details d'une déclaration
  supprimerDeclaration: (declarationId) => `${BASE_URL}/supprimer-declaration/${declarationId}/`, // Supprimer une déclaration
  updateDeclaration: (declarationId) => `${BASE_URL}/api/update-declaration/${declarationId}/`,
  createFonction: () => `${BASE_URL}/jobs/`, // Ajouter une fonction
  detailsFonction: (functionId) => `${BASE_URL}/api/jobs/${functionId}/`, // details d'une fonction
  deleteFonction: (functionId) => `${BASE_URL}/api/jobs/${functionId}/`, // Supprimer une fonction
  editFonction: (functionId) => `${BASE_URL}/api/jobs/${functionId}/`, // modifier une fonction
  listFonctions: () => `${BASE_URL}/jobs/`, // Liste des fonctions
  move: () => `${BASE_URL}/api/move_declaration/`,
  CreateBank: () => `${BASE_URL}/bank/create`,
  listBank: () => `${BASE_URL}/list_bank/`,
  CreatePayeur: () => `${BASE_URL}/api/payeur/`,
  
  listRegions: () => `${BASE_URL}/api/regions/`,

  createAgence: () => `${BASE_URL}/add-agency/`,
  listAgences: () => `${BASE_URL}/api/agences/`,

  activate: (id) => `${BASE_URL}/activate-user/${id}/`,
  banni: (id) => `${BASE_URL}/banni-user/${id}/`,
  searchPassport: (numero) => `${BASE_URL}/api/check-passport/?numero=${numero}`,
  listPaiments: () => `${BASE_URL}/api/payments//`, // Liste des paiements
  PaidFactures: () => `${BASE_URL}/paid_factures/`, // payer plusieurs factures a la fois 
  searchIdentifier: (identifier) => `${BASE_URL}/api/search_identifier/?identifier=${identifier}`,
  createPermission: () => `${BASE_URL}/add-permission/`,
  listPermissions: () => `${BASE_URL}/permissions/`, // Liste des fonctions

  listDevises: () => `${BASE_URL}/api/devises/`,

  listProfilesTypes: () => `${BASE_URL}/api/profile_type/`,

};

export default API;

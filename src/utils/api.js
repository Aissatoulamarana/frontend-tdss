 const BASE_URL = 'http://127.0.0.1:8000'; // Adresse de votre backend
// const BASE_URL = 'https://declaration-qp2u.onrender.com'; // Adresse de votre backend

const API = {
  nextjsPage: () => `${BASE_URL}/nextjs/page`, // Vue Next.js
  login: () => `${BASE_URL}/login/`, // Vue Login
  listDeclarations: () => `${BASE_URL}/api/declarations/`, // Liste des déclarations
  createDeclaration: () => `${BASE_URL}/api/declarations/create/`, // Création d'une déclaration
  validateDeclaration: (declarationId) => `${BASE_URL}/validate-declaration/${declarationId}/`, // Validation d'une déclaration
  listFactures: () => `${BASE_URL}/list-factures/`, // Liste des factures
  paidFacture: (factureId) => `${BASE_URL}/paid-facture/${factureId}/`, // Paiement d'une facture
  detailsFacture: (factureId) => `${BASE_URL}/facture/${factureId}/`,// Details d'une facture 
  listUsers: () => `${BASE_URL}/users/`, // Liste des utilisateurs
  userDetails: (id) => `${BASE_URL}/users/${id}/`, // Détails d'un utilisateur
  createUser: () => `${BASE_URL}/users/create/`, // Création d'un utilisateur
  deleteUser: (id) => `${BASE_URL}/users/${id}/delete/`, // Suppression d'un utilisateur
  updateUser: (id) => `${BASE_URL}/users/${id}/put`, // Mise à jour d'un utilisateur
  facturerDeclaration: (declarationId) => `${BASE_URL}/facturer-declaration/${declarationId}/`, // Validation d'une déclaration
  rejetterDeclaration: (declarationId) => `${BASE_URL}/rejeter-declaration/${declarationId}/`, // Rejetter une déclaration
  detailsDeclaration: (declarationId) => `${BASE_URL}/details-declaration/${declarationId}/`, // Voir les details d'une déclaration
  supprimerDeclaration: (declarationId) => `${BASE_URL}/supprimer-declaration/${declarationId}/`, // Supprimer une déclaration
  createFonction: () => `${BASE_URL}/create-fonction/`, // Ajouter une fonction
  detailsFonction: (functionId) => `${BASE_URL}/fonction/${functionId}/`, // details d'une fonction
  deleteFonction: (functionId) => `${BASE_URL}/delete/fonction/${functionId}/`, // Supprimer une fonction
  editFonction: (functionId) => `${BASE_URL}/edit/fonction/${functionId}/`, // modifier une fonction
  listFonctions: () => `${BASE_URL}/list-fonction/`, // Liste des fonctions
  move: () => `${BASE_URL}/api/move_declaration/`,
  CreateBank: () => `${BASE_URL}/bank/create`,
  listBank: () => `${BASE_URL}/list_bank/`,
  CreatePayeur: () => `${BASE_URL}/api/payeur/`,
  me: () => `${BASE_URL}/me/`,
  activate: (id) => `${BASE_URL}/activate-user/${id}/`,
  banni: (id) => `${BASE_URL}/banni-user/${id}/`,
  searchPassport: (numero) => `${BASE_URL}/api/search_passport/?numero=${numero}`,
  listPaiments: () => `${BASE_URL}/paiements/`, // Liste des paiements
  PaidFactures: () => `${BASE_URL}/paid_factures/`, // payer plusieurs factures a la fois 
  searchIdentifier: (identifier) => `${BASE_URL}/api/search_identifier/?identifier=${identifier}`,
};

export default API;

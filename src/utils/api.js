
//  const BASE_URL = 'http://127.0.0.1:8000'; // Adresse de votre backend
 const BASE_URL = 'https://test.tdss.com.gn/api'; // Adresse de votre backend

const API = {
  nextjsPage: () => `${BASE_URL}/nextjs/page`, // Vue Next.js
  login: () => `${BASE_URL}/auth/jwt/create/`, // api connexion
  me: () => `${BASE_URL}/users/me/`, // informations de l'utilisateur connecté
  logout: () => `${BASE_URL}/auth/jwt/logout/`, // deconnexion
  resetPassword: () => `${BASE_URL}/users/reset_password/`,// reinitialisation du password
  resetPasswordConfirmation: () => `${BASE_URL}/users/reset_password_confirm/`,// reinitialisation du password
  changePassword : () => `${BASE_URL}/users/set_password/`, // changer le mot de passe
  changeEmail: () => `${BASE_URL}/users/set_email/`, // changer l'email de l'utilisateur

  createUser: () => `${BASE_URL}/users/`, // Création d'un utilisateur
  listUsers: () => `${BASE_URL}/users/`, // Liste des utilisateurs
  listUserTypes: () => `${BASE_URL}/profiles/user-types/`, // Liste des types d'utilisateurs
  deleteUser: (slug) => `${BASE_URL}/users/${slug}/`, // Suppression d'un utilisateur
  updateUser: (slug) => `${BASE_URL}/users/${slug}/`, // Mise à jour d'un utilisateur
  userDetails: (slug) => `${BASE_URL}/users/${slug}/`, // Détails d'un utilisateur
  userDelete: (slug) => `${BASE_URL}/users/${slug}/`, // Supprimer un utilisateur
  activateAccount:() => `${BASE_URL}/users/activation/`, // activer le compte d'un utilisateur
  addProfileToUser: () => `${BASE_URL}/users/add-profile/`, // Ajouter un profil à un utilisateur

  listDeclarations: () => `${BASE_URL}/declarations/?limit=100&offset=100/`, // Liste des déclarations
  createDeclaration: () => `${BASE_URL}/declarations/`, // Création d'une déclaration
  detailsDeclaration: (slug) => `${BASE_URL}/declarations/${slug}/`, // Voir les details d'une déclaration
  validateDeclaration: (slug) => `${BASE_URL}/declarations/${slug}/validate/`, // Validation d'une déclaration
  submitDeclaration: (slug) => `${BASE_URL}/declarations/${slug}/submit/`, // Soumettre une déclaration
  facturerDeclaration: (slug) => `${BASE_URL}/declarations/${slug}/facturer/`, // facturer une déclaration
  rejetterDeclaration: (slug) => `${BASE_URL}/declarations/${slug}/reject/`, // Rejetter une déclaration 
  supprimerDeclaration: (slug) => `${BASE_URL}/declarations/${slug}/`, // Supprimer une déclaration
  updateDeclaration: (slug) => `${BASE_URL}/declarations/${slug}/`,// Modifier une déclaration
  move: (slug) => `${BASE_URL}/declarations/${slug}/move-employees/`,// deplacer des employés d'une déclaration à une autre


  Employe : (slug) => `${BASE_URL}/declarations/${slug}/employees/`, // Liste des employés d'une declaration
  UpdateEmploye: (declarationSlug, employeeSlug) => `${BASE_URL}/declarations/${declarationSlug}/employees/${employeeSlug}/`, // Modifier un employé d'une déclaration
  DeleteEmploye: (slug) => `${BASE_URL}/declarations/${slug}/delete-employees/`, // Supprimer un ou plusieurs employés d'une déclaration
  AddEmploye: (slug) => `${BASE_URL}/declarations/${slug}/add-employees/`, // Ajouter un employé à une déclaration
  listEmployee: () => `${BASE_URL}/employees/?limit=100&offset=100/`, // liste de tous les employés
  detailsEmployee: (slug) => `${BASE_URL}/employees/${slug}/`, // details d'un employé

  


  listFactures: () => `${BASE_URL}/factures/`, // Liste des factures
  paidFacture: (slug) => `${BASE_URL}factures/${slug}/mark-paid/`, // Paiement d'une facture
  detailsFacture: (slug) => `${BASE_URL}/factures/${slug}/`,// Details d'une facture 
  PaidFactures: () => `${BASE_URL}/paid_factures/`, // payer plusieurs factures a la fois 
  
  listPaiments: () => `${BASE_URL}/payments/`, // Liste des paiements
  
  createFonction: () => `${BASE_URL}/jobs/`, // Ajouter une fonction
  listFonctions: () => `${BASE_URL}/jobs/`, // Liste des fonctions
  detailsFonction: (slug) => `${BASE_URL}/jobs/${slug}/`, // details d'une fonction
  deleteFonction: (slug) => `${BASE_URL}/jobs/${slug}/`, // Supprimer une fonction
  editFonction: (slug) => `${BASE_URL}/jobs/${slug}/`, // modifier une fonction
  listCategories: () => `${BASE_URL}/jobs/agent/job-categories/`,
  listFonctionAgent: () => `${BASE_URL}/jobs/agent/jobs`, // Liste des fonctions des agents
  

  CreateBank: () => `${BASE_URL}/bank/create`,
  listBank: () => `${BASE_URL}/list_bank/`,


  CreatePayeur: () => `${BASE_URL}/api/payeur/`,
  
  listRegions: () => `${BASE_URL}/regions/`,

  createAgence: () => `${BASE_URL}/agency/`,
  listAgences: () => `${BASE_URL}/regions/agencies/`,

  // activate: (id) => `${BASE_URL}/activate-user/${id}/`,
  banni: (id) => `${BASE_URL}/banni-user/${id}/`,

 
  
  searchIdentifier: (identifier) => `${BASE_URL}/api/search_identifier/?identifier=${identifier}`,
  searchPassport: (numero) => `${BASE_URL}/declarations/employees/check-passport/?numero=${numero}`,

  createPermission: () => `${BASE_URL}/permission/`,
  listPermissions: () => `${BASE_URL}/permission/`, // Liste des fonctions

  listProfilesTypes: () => `${BASE_URL}/profiles/types/`,
  
  createProfile: () => `${BASE_URL}/profiles/`,
  listProfiles: () => `${BASE_URL}/profiles/`,
  UpdateProfile: (slug) => `${BASE_URL}/profiles/${slug}/`,
  listActiveProfile: () => `${BASE_URL}/profiles/active-profiles/`,
  // listEntreprises: () => `${BASE_URL}/profiles/active-profiles/?type=entreprise`, // Liste des entreprises
  listEntreprises: (params = {}) => {
    const searchParams = new URLSearchParams({ type: 'entreprise', ...params }).toString();
    return `${BASE_URL}/profiles/active-profiles/?${searchParams}`;
  }, // Liste des entreprises avec des params

  listDevises: () => `${BASE_URL}/devises/`,
  listPermits: () => `${BASE_URL}/permits/`,

  // job-category
  createJobCategory: () => `${BASE_URL}/jobs/job-category/`,
  listJobCategory: () => `${BASE_URL}/jobs/job-category/`,
  detailsJobCategory: (slug) => `${BASE_URL}/jobs/job-category/${slug}/`,
  editJobCategory: (slug) => `${BASE_URL}/jobs/job-category/${slug}/`,
  deleteJobCategory: (slug) => `${BASE_URL}/jobs/job-category/${slug}/`,

};

export default API;

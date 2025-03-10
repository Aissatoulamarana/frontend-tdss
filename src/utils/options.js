import axios from 'src/utils/axios';
import API from 'src/utils/api';

// Déclarer les variables pour stocker les options
let regions = [];
let categories = [];
let devises = [];
let profileTypes = [];
let permissions = [];
let agences = [];
let declarations = [];
let entreprises = [];
let banks = [];

const fetchOptions = async () => {
  try {
    const [
      regionsData,
      agenceData,
      categoriesData,
      devisesData,
      profileTypeData,
      permissionsData,
      declarationsData,
      entreprisesData,
      bankData,
    ] = await Promise.all([
      axios.get(API.listRegions()),
      axios.get(API.listAgences()),
      axios.get(API.listCategories()),
      axios.get(API.listDevises()),
      axios.get(API.listProfilesTypes()),
      axios.get(API.listPermissions()),
      axios.get(API.listDeclarations()),
      axios.get(API.listProfiles()),
      axios.get(API.listProfiles()),
    ]);

    // Vérification que les données existent avant de les stocker
    regions = Array.isArray(regionsData?.data) ? regionsData.data : [];
    categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
    devises = Array.isArray(devisesData?.data) ? devisesData.data : [];
    profileTypes = Array.isArray(profileTypeData?.data) ? profileTypeData.data : [];
    permissions = Array.isArray(permissionsData?.data) ? permissionsData.data : [];
    agences = Array.isArray(agenceData?.data) ? agenceData.data : [];
    declarations = Array.isArray(declarationsData?.data) ? declarationsData.data : [];
    entreprises = Array.isArray(entreprisesData?.data.ENTREPRISE) ? entreprisesData.data.ENTREPRISE : [];
    banks = Array.isArray(bankData?.data?.BANK) ? bankData?.data.BANK : [];


  } catch (error) {
    console.error('Erreur lors de la récupération des options:', error);
  }
};

// Exposer la fonction fetchOptions et les variables
export { fetchOptions, regions, categories, devises, profileTypes, permissions, agences, declarations, entreprises, banks };

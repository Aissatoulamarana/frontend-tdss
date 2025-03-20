// optionsService.js
import axios from 'src/utils/axios';
import API from 'src/utils/api';

const cache = {
  regions: null,
  categories: null,
  devises: null,
  profileTypes: null,
  permissions: null,
  agences: null,
  declarations: null,
  entreprises: null,
  banks: null,
  profils: null,
  userTypes: null,
  job:null,
  job_categories:null,
};

const pendingPromises = {};

const fetchAndCache = async (cacheKey, apiCall, dataPath = 'data') => {
  // Si déjà en cache, retourne immédiatement
  if (cache[cacheKey]) return cache[cacheKey];

  // Si une promesse est en cours, on la retourne
  if (pendingPromises[cacheKey]) return pendingPromises[cacheKey];

  // Sinon, on lance l'appel
  pendingPromises[cacheKey] = axios.get(apiCall()).then(response => {
    let data;
    if (dataPath === 'results' && Array.isArray(response?.data?.results)) {
      data = response.data.results;
    } else if (Array.isArray(response?.data)) {
      data = response.data;
    } else {
      data = [];
    }
    cache[cacheKey] = data;
    delete pendingPromises[cacheKey];
    return data;
  }).catch(error => {
    console.error(`Erreur lors de la récupération de ${cacheKey}:`, error);
    delete pendingPromises[cacheKey];
    throw error;
  });

  return pendingPromises[cacheKey];
};

export const getRegions = () => fetchAndCache('regions', API.listRegions, 'results');
export const getCategories = () => fetchAndCache('categories', API.listCategories);
export const getDevises = () => fetchAndCache('devises', API.listDevises);
export const getProfileTypes = () => fetchAndCache('profileTypes', API.listProfilesTypes, 'results');
export const getPermissions = () => fetchAndCache('permissions', API.listPermissions);
export const getAgences = () => fetchAndCache('agences', API.listAgences , 'results');
export const getDeclarations = () => fetchAndCache('declarations', API.listDeclarations);
export const getEntreprises = () => fetchAndCache('entreprises', API.listProfiles);
export const getBanks = () => fetchAndCache('banks', API.listProfiles);
export const getProfils = () => fetchAndCache('profils', API.listProfiles , 'results');
export const getUserTypes = () => fetchAndCache('userTypes', API.listUserTypes, 'results');
export const getJob = () => fetchAndCache('job', API.listFonctions, 'results');
export const getJobCategories = () => fetchAndCache('job_categories', API.listCategories, 'results');

export const clearCache = () => {
  Object.keys(cache).forEach(key => cache[key] = null);
  Object.keys(pendingPromises).forEach(key => delete pendingPromises[key]);
};

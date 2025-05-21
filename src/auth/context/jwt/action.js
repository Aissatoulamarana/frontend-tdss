// src/auth/context/jwt/action.js

'use client';

import API from 'src/utils/api';
import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY , STORAGE_KEY_REFRESH_TOKEN } from './constant';
import { setSession } from './utils';


export const resetPassword = async ({email}) => {
  try {
    const params = {email}
    const res = await axios.post(API.resetPassword(), params);

  }catch (error) {
    console.log('Error during reset password', error)
  }
};

export const updatePassword = async ({uid , token , new_password}) => {
  try {
    const params = {uid, token, new_password}
    const res = await axios.post(API.resetPasswordConfirmation(), params);
  }catch (error) {
    console.log('Error during update password', error)
  }
}


/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const params = { email, password };

    const res = await axios.post(API.login(), params);
    const  access_token  = res.data.access;
    const refresh_token = res.data.refresh;

   

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    setSession(access_token, refresh_token);
  } catch (error) {
    // Affiche toute l'erreur pour examiner sa structure complète
    console.error('Error during sign in:', error?.detail);
    throw new Error(error?.detail);

    // if (error.response) {
    //   // console.error('Response from server:', error.response);

    //   // Essayons d'accéder à l'erreur spécifique dans `error.response.data`
    //   // console.error('Error response data:', error.response.data);

    //   // Nous lançons l'erreur si elle existe dans la réponse du serveur
    //   const message = error.response.data.detail || 'Authentication failed';
   
      
      
    // } else if (error.request) {
    //   console.error('Error during sign in (no response):', error.request);
    //   throw new Error('Aucune réponse du serveur. Veuillez réessayer plus tard.');
    // } else {
    //   console.error('Error during sign in (unknown error):', error);
    //   throw new Error(error);
    // }
  }
};


/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    // Fonction pour supprimer un cookie
    const deleteCookie = (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
<<<<<<< HEAD
      
=======
      console.log(`Cookie ${name} supprimé`);
>>>>>>> fix-transformation-champ-en-divider
    };

    // Vérifie si l'utilisateur est connecté
    const refresh_token = sessionStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);
<<<<<<< HEAD
    
=======
    console.log('Refresh token dans sessionStorage:', refresh_token);
>>>>>>> fix-transformation-champ-en-divider

    // Supprime les tokens des cookies
    deleteCookie(STORAGE_KEY); // Supprime le cookie du token d'accès
    deleteCookie(STORAGE_KEY_REFRESH_TOKEN); // Supprime le cookie du refresh token

    // Supprime les tokens du sessionStorage
    sessionStorage.removeItem(STORAGE_KEY); // Supprime le token d'accès
    sessionStorage.removeItem(STORAGE_KEY_REFRESH_TOKEN); // Supprime le refresh token

    // Supprime l'utilisateur du localStorage
    localStorage.removeItem('user');

<<<<<<< HEAD
    
=======
    console.log('Déconnexion réussie');
>>>>>>> fix-transformation-champ-en-divider
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
};




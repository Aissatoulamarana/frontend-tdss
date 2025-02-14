//src/auth/context/jwt/action.js
'use client';

import axios, { endpoints } from 'src/utils/axios';
import API from 'src/utils/api';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const params = { email, password };

    const res = await axios.post(API.login(), params);

    const { access_token } = res.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    setSession(access_token);
  } catch (error) {
    // Affiche toute l'erreur pour examiner sa structure complète
    console.error('Error during sign in:', error);

    if (error.response) {
      console.error('Response from server:', error.response);

      // Essayons d'accéder à l'erreur spécifique dans `error.response.data`
      console.error('Error response data:', error.response.data);

      // Nous lançons l'erreur si elle existe dans la réponse du serveur
      throw new Error(error.response.data.error || 'Authentication failed');
    } else if (error.request) {
      console.error('Error during sign in (no response):', error.request);
      throw new Error('Aucune réponse du serveur. Veuillez réessayer plus tard.');
    } else {
      console.error('Error during sign in (unknown error):', error.message);
      throw new Error(error.message);
    }
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
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

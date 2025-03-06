// src/auth/context/jwt/utils.js

import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { STORAGE_KEY_REFRESH_TOKEN } from './constant';

// ----------------------------------------------------------------------

export function jwtDecode(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(access_token) {
  if (!access_token) {
    return false;
  }

  try {
    const decoded = jwtDecode(access_token);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  if (timeLeft > 0) {
    setTimeout(() => {
      try {
        alert('Token expired!');
        sessionStorage.removeItem(STORAGE_KEY);
        window.location.href = paths.auth.jwt.signIn;
      } catch (error) {
        console.error('Error during token expiration:', error);
        throw error;
      }
    }, timeLeft);
  } else {
    alert('Token already expired!');
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.href = paths.auth.jwt.signIn;
  }
}

// ----------------------------------------------------------------------

export async function setSession(access_token, refresh_token) {
  try {

    // Store refresh token in sessionStorage if it exists
    if (refresh_token) {
      console.log ('le refres token stored in sessionStorage', refresh_token);
      sessionStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, refresh_token); 
    }
    if (access_token) {
      // Storing access token in sessionStorage
      sessionStorage.setItem(STORAGE_KEY, access_token); 

      // Set Authorization header for axios
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;

      // Decode the access token to check its expiration
      const decodedToken = jwtDecode(access_token); // Decode token to get expiration

      if (decodedToken && 'exp' in decodedToken) {
        tokenExpired(decodedToken.exp); // Handle token expiration logic
      } else {
        throw new Error('Invalid access token!');
      }
    } else {
      // If no access token, remove tokens and clear Authorization header
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY_REFRESH_TOKEN); // Remove refresh token too
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}

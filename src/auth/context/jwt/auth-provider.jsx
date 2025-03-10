
// src/auth/context/jwt/auth-provider.jsx

'use client';

import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import API from 'src/utils/api';
import axios from 'src/utils/axios';

import { AuthContext } from '../auth-context';
import { STORAGE_KEY } from './constant';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {


      const access_token = sessionStorage.getItem(STORAGE_KEY);

      if (access_token && isValidToken(access_token)) {
        setSession(access_token);

        const res = await axios.get(API.me());

        const user = res.data;
        console.log('User récupéré :', user);

        // Sauvegarder l'utilisateur dans le localStorage
        localStorage.setItem('user', JSON.stringify(user));
        setState({ user: { ...user, access_token }, loading: false });

      } else {
        setState({ user: null, loading: false });

        // Supprimer l'utilisateur du localStorage si la session est invalide
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });

      // Supprimer l'utilisateur du localStorage en cas d'erreur
      localStorage.removeItem('user');
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
          ...state.user,
          role: state.user?.role ?? 'admin',
        }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

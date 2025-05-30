


import { useAuthContext } from 'src/auth/hooks';

// Si vous utilisez l'authentification réelle, utilisez `useAuthContext` comme ceci :
export function useMockedUser() {
  const { user } = useAuthContext();
  return { user };
}




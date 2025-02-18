// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    analytics: {
      root: `${ROOTS.DASHBOARD}/analytics`,
      declaration: `${ROOTS.DASHBOARD}/analytics/declaration`,
      facture: `${ROOTS.DASHBOARD}/analytics/facture`,
      paiement: `${ROOTS.DASHBOARD}/analytics/paiement`,
      permis: `${ROOTS.DASHBOARD}/analytics/permis`,
    },
    declaration: {
      root: `${ROOTS.DASHBOARD}/declaration`,
      list: `${ROOTS.DASHBOARD}/declaration/list`,
      new: `${ROOTS.DASHBOARD}/declaration/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/declaration/${id}/edit`,
      details: (id) => `/dashboard/declaration/${id}`,
      renew: `${ROOTS.DASHBOARD}/declaration/renew`,
      duplica: `${ROOTS.DASHBOARD}/declaration/duplica`,
    },

    factures: {
      root: `${ROOTS.DASHBOARD}/factures`,
      list: `${ROOTS.DASHBOARD}/factures/list`,
      details: (id) => `/dashboard/factures/${id}`,
    },

    paiements: {
      root: `${ROOTS.DASHBOARD}/paiements`,
      list: `${ROOTS.DASHBOARD}/paiements/list`,
    },
    penalite: {
      root: `${ROOTS.DASHBOARD}/penalite`,
      list: `${ROOTS.DASHBOARD}/penalite/list`,
    },

    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
    },

    fonction: {
      root: `${ROOTS.DASHBOARD}/fonction`,
      new: `${ROOTS.DASHBOARD}/fonction/new`,
      list: `${ROOTS.DASHBOARD}/fonction/list`,
    },

    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },

    client: {
      root: `${ROOTS.DASHBOARD}/client`,
      bank: `${ROOTS.DASHBOARD}/client/bank`,
      business: `${ROOTS.DASHBOARD}/client/business`,
      embassy: `${ROOTS.DASHBOARD}/client/embassy`,
      list: `${ROOTS.DASHBOARD}/user/list`,
    },
  },
};
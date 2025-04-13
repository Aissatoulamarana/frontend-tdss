import { CONFIG } from 'src/config-global';

import { paths } from 'src/routes/paths';

import { SvgColor } from 'src/components/svg-color';
import path from 'path';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  penalite: icon('ic-course'),
  facture: icon('ic-invoice'),
  booking: icon('ic-booking'),
  paiement: icon('ic-banking'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  declaration: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  company: icon('ic-company'),
};

// ----------------------------------------------------------------------

const user = JSON.parse(localStorage.getItem('user'));
const type = user?.type?.toLowerCase().trim();

export const navData = [
  /**
   * Overview
   */
  {
    subheader: "Vue d'ensemble",
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      // {
      //   title: 'Statistiques',
      //   path: paths.dashboard.analytics.root,
      //   icon: ICONS.analytics,
      //   children: [
      //     { title: 'Declaration', path: paths.dashboard.analytics.declaration },
      //     { title: 'Facture', path: paths.dashboard.analytics.facture },
      //     { title: 'Paiement', path: paths.dashboard.analytics.paiement },
      //     { title: 'Penalité', path: paths.dashboard.group.root },
      //     { title: 'Permis de travail', path: paths.dashboard.analytics.permis },
      //   ],
      // },
      {
        title: 'Déclarations',
        path: paths.dashboard.declaration.list,
        icon: ICONS.declaration,
        // children: [
        //   { title: 'Nouvelle', path: paths.dashboard.declaration.new.replace(':type', 'nouvelle') },
        //   { title: 'Renouvellement', path: paths.dashboard.declaration.renew.replace(':type', 'renouvellement') },
        //   { title: 'Duplicata', path: paths.dashboard.declaration.duplica.replace(':type', 'duplicata') }
        // ]
      },
      {
        title: 'Factures',
        path: paths.dashboard.factures.list,
        icon: ICONS.facture,
      },
      {
        title: 'Employés',
        path: paths.dashboard.factures.list,
        icon: ICONS.facture,
      },
      // {
      //   title: 'Paiements',
      //   path: paths.dashboard.paiements.list,
      //   icon: ICONS.paiement,
      // },

      // { title: 'Penalités', path: paths.dashboard.penalite.list, icon: ICONS.penalite },
    ],
  },
  /**
   * Management
   */
  ...(type !== 'agent'
    ? [
      {
        subheader: 'Administration',
        items: [
          {
            title: 'Utilisateurs',
            path: paths.dashboard.user.list,
            icon: ICONS.user,
            // children: [
            //   { title: 'Listes Utilisateurs', path: paths.dashboard.user.list },
            //   { title: 'Nouveau', path: paths.dashboard.user.new },
            // ],
          },
          {
            title: 'Catégories Fonctions',
            path: paths.dashboard.jobCategory.root,
            // icon: ICONS.job,
            // children: [
            //   { title: 'Listes Catégories Professionnelles', path: paths.dashboard.jobCategory.list },
            //   { title: 'Nouvelle', path: paths.dashboard.jobCategory.new },
            // ]
          },
          {
            title: 'Fonction',
            path: paths.dashboard.fonction.list,
            icon: ICONS.job,
            // children: [
            //   { title: 'Listes Fonctions', path: paths.dashboard.fonction.list },
            //   { title: 'Nouvelle', path: paths.dashboard.fonction.new },
            // ],
          },
          {
            title: 'Profils',
            path: paths.dashboard.client.root,
            icon: ICONS.tour,
          },
          {
            title: 'Agence',
            path: paths.dashboard.agence.root,
            icon: ICONS.company,
          },
          {
            title: 'Permissions',
            path: paths.dashboard.permission.list,
            icon: ICONS.company,
          },
          {
            title: 'Regions',
            path: paths.dashboard.region.root,
            icon: ICONS.company,
          },
          {
            title: 'Type  Profil',
            path: paths.dashboard.profilType.root,
            icon: ICONS.company,
          },
          {
            title: 'Type Utilisateur',
            path: paths.dashboard.userType.root,
            icon: ICONS.company,
          },
          {
            title: 'Devises',
            path: paths.dashboard.devise.root,
            icon: ICONS.company,
          },
          {
            title: 'Permits',
            path: paths.dashboard.permit.root,
            icon: ICONS.company,
          }
        ],
      },
    ]
    : []),


];
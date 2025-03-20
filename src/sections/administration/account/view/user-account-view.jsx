'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AccountGeneral } from '../account-general';
import { AccountBilling } from '../account-billing';
import { AccountSocialLinks } from '../account-social-links';
import { AccountNotifications } from '../account-notifications';
import { AccountChangePassword } from '../account-change-password';
import { AccountChangeEmail } from '../account-change-email';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'general', label: 'General', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  // {
  //   value: 'billing',
  //   label: 'Paiements',
  //   icon: <Iconify icon="solar:bill-list-bold" width={24} />,
  // },
  // {
  //   value: 'notifications',
  //   label: 'Notifications',
  //   icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
  // },
  // {
  //   value: 'social',
  //   label: 'Réseaux sociaux',
  //   icon: <Iconify icon="solar:share-bold" width={24} />,
  // },
  { value: 'security', label: 'Sécurité', icon: <Iconify icon="ic:round-vpn-key" width={24} /> },
  { value: 'email', label: 'Email', icon: <Iconify icon="mdi:email" width={24} /> },
];

// ----------------------------------------------------------------------

export function AccountView() {
  const tabs = useTabs('general');

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profil"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Utilisateurs', href: paths.dashboard.user.root },
          { name: 'Profil' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 4, md: 6 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {tabs.value === 'general' && <AccountGeneral />}

      {/* {tabs.value === 'billing' && (
        <AccountBilling
          plans={_userPlans}
          cards={_userPayment}
          invoices={_userInvoices}
          addressBook={_userAddressBook}
        />
      )} */}

      {/* {tabs.value === 'notifications' && <AccountNotifications />} */}

      {/* {tabs.value === 'social' && <AccountSocialLinks socialLinks={_userAbout.socialLinks} />} */}

      {tabs.value === 'security' && <AccountChangePassword />}
      {tabs.value === 'email' && <AccountChangeEmail />}
    </DashboardContent>
  );
}

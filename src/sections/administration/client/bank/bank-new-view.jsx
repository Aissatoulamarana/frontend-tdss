'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BankNewEditForm } from './bank-new';

// ----------------------------------------------------------------------

export function BankCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Ajouter Une Nouvelle Bank"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Client', href: paths.dashboard.client.root },
          { name: 'Nouvelle Banque' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <BankNewEditForm />
    </DashboardContent>
  );
}

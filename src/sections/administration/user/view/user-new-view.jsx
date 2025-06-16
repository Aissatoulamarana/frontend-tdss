'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-edit-form';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function UserCreateView() {

  const { user } = useMockedUser();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Creer un nouvel utilisateur"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Utilisateurs', href: paths.dashboard.user.list },
          { name: 'Nouvel utilisateur' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm user={user} />
    </DashboardContent>
  );
}

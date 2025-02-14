'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeclarationDetails } from '../declaration-detail';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function DeclarationDetailsView({ declaration }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={declaration?.declaration_number}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Declarations', href: paths.dashboard.declaration.list },
          { name: declaration?.declaration_number },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeclarationDetails declaration={declaration} />
    </DashboardContent>
  );
}
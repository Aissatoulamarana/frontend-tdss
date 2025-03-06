'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeclarationDetails } from '../declaration-detail';

// ----------------------------------------------------------------------

export function DeclarationDetailsView({ declaration }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={declaration?.declaration_number}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Declarations', href: paths.dashboard.declaration.list },
          { name: declaration?.reference },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeclarationDetails declaration={declaration} />
    </DashboardContent>
  );
}
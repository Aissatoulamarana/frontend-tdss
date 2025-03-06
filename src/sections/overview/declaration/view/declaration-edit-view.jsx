'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeclarationNew } from '../declaration-new';

// ----------------------------------------------------------------------

export function DeclarationEditView({ declaration }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Déclarations', href: paths.dashboard.declaration.list },
          { name: declaration?.declaration_number },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeclarationNew currentInvoice={declaration} />
    </DashboardContent>
  );
}
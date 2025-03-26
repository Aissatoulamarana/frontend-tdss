'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobCategoryNewEditForm } from '../job-category-new-edit-form'
// ----------------------------------------------------------------------

export function JobCategoryCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Créer Une Nouvelle Catégorie Professionnelle"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Catégorie Professionnelle', href: paths.dashboard.jobCategory.list },
          { name: 'Nouvelle Catégorie Professionnelle' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <JobCategoryNewEditForm />
    </DashboardContent>
  );
}

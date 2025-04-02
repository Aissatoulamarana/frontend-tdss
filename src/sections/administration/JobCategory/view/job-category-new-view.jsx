'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobCategoryNewEditForm } from '../job-category-new';

// ----------------------------------------------------------------------

export function JobCategoryCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Ajouter une nouvelle fonction professionnelle"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Fonction Professionnelle', href: paths.dashboard.jobCategory.root },
                    { name: 'Nouvelle' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <JobCategoryNewEditForm />
        </DashboardContent>
    );
}

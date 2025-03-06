'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AgenceNew } from '../agence-new';

// ----------------------------------------------------------------------

export function AgenceCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Ajouter Une Nouvelle Agence"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Agence', href: paths.dashboard.agence.root },
                    { name: 'Nouvelle Agence' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <AgenceNew />
        </DashboardContent>
    );
}

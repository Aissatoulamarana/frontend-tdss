'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ClientNewEditForm } from '../client-new';

// ----------------------------------------------------------------------

export function ClientCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Ajouter Un nouveau profil"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Profil', href: paths.dashboard.client.root },
                    { name: 'Nouveau' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <ClientNewEditForm />
        </DashboardContent>
    );
}

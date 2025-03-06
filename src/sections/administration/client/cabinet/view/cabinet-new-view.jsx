'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CreateCabinetForm } from '../cabint-new';

// ----------------------------------------------------------------------

export function CabinetCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Nouveau Cabinet"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Client', href: paths.dashboard.client.root },
                    { name: 'Nouveau Cabinet' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <CreateCabinetForm />
        </DashboardContent>
    );
}

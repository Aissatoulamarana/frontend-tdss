'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PermissionNew } from '../permission-new';

// ----------------------------------------------------------------------

export function PermissionCreateView() {
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Ajouter Une Nouvelle Permission"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Permissions', href: paths.dashboard.permission.list },
                    { name: 'Nouvelle Permission' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PermissionNew />
        </DashboardContent>
    );
}

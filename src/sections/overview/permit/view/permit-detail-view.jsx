import { Iconify } from 'src/components/iconify';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const TABS_PERMITS = [
  { value: 'details', label: 'Détails', icon: <Iconify icon="solar:user-id-bold" width={24} /> },

  {
    value: 'declaration',
    label: 'Déclarations',
    icon: <Iconify icon="solar:document-add-bold" width={24} />,
  },
  {
    value: 'doc',
    label: 'Documents',
    icon: <Iconify icon="mdi:file" width={24} />,
  },
  {
    value: 'biometrie',
    label: 'Biometrie',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
];

export function PermitDetailView({ slug }) {
  const tabs = useTabs('details');

  const displayedTabs = TABS_PERMITS;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Détails"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Permits', href: paths.dashboard.permit.list },
          { name: 'Détails' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
    </DashboardContent>
  );
}

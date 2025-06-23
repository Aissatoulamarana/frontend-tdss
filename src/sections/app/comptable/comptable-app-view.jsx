'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import { ComptableDashboard } from './components/ComptableDashboard';

// ----------------------------------------------------------------------

export function ComptableAppView() {
  return (
    <DashboardContent maxWidth="xl">
      <ComptableDashboard />
    </DashboardContent>
  );
}
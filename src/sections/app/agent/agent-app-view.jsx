'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import AgentDashboard from './components/AgentDashboard';



// ----------------------------------------------------------------------

export function AgentAppView() {
  return (
    <DashboardContent>
      <AgentDashboard />
    </DashboardContent>
  );
}
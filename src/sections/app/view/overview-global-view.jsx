'use client';



import { DashboardContent } from 'src/layouts/dashboard';


import { useMockedUser } from 'src/auth/hooks';


import { OverviewAppView } from '../overview-app-view';
// import { AgentAppView } from '../agent';
import {AgentAppView} from '../agent/agent-app-view';
import { SuperviserAppView } from '../superviseur/superviseur-app-view';
import { ComptableAppView } from '../comptable/comptable-app-view';
import { CaissierAppView } from '../caissier/caissier-app-view';


// ----------------------------------------------------------------------

export function OverviewGlobalView() {
  const { user } = useMockedUser();
  const type = user?.type.toLowerCase().trim();

  


  return (
    <DashboardContent maxWidth="xl">
      {type === 'admin' && (
      <OverviewAppView></OverviewAppView>
)}
{type === 'agent' && (
      <AgentAppView/>
)}
{type === 'superviseur' && (
      <SuperviserAppView/>
)}
      {type === 'comptable' && (
      <ComptableAppView/>
)}

      {type === 'caissier' && (
      <CaissierAppView/>
)}
    </DashboardContent>
  );
}
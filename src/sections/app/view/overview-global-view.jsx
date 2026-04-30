'use client';

import { DashboardContent } from 'src/layouts/dashboard';
import { useMockedUser } from 'src/auth/hooks';

// Import des vues des différents rôles
import { OverviewAppView } from '../overview-app-view';
import { AgentAppView } from '../agent/agent-app-view';
import { SuperviserAppView } from '../superviseur/superviseur-app-view';
import { ComptableAppView } from '../comptable/comptable-app-view';
import { CaissierAppView } from '../caissier/caissier-app-view';
import { PrinterAppView } from '../printer';
import AguipeAppView from '../aguipe/AguipeAppView';
import Loading from 'src/app/dashboard/loading';

// ----------------------------------------------------------------------

export function OverviewGlobalView() {
  const { user } = useMockedUser();

  const type = user?.type_code.toLowerCase().trim();

  // Rendu conditionnel basé sur le type d'utilisateur
  const renderView = () => {
    switch (type) {
      case 'admin':
        return <OverviewAppView />;
      case 'agent':
        return <AgentAppView />;
      case 'supervisor':
        return <SuperviserAppView />;
      case 'accountant':
        return <ComptableAppView />;
      case 'treasurer':
        return <CaissierAppView />;
      case 'aguipe':
        return <AguipeAppView />;
      case 'printer':
        return <PrinterAppView />;
      default:
        return <Loading />;
    }
  };

  return <DashboardContent maxWidth="xl">{renderView()}</DashboardContent>;
}

import { CONFIG } from 'src/config-global';

import { AnalyticPaiementView } from 'src/sections/overview/analytics/paiement/view';
import { ReportPaiement } from 'src/sections/overview/rapports/paiement';

// ----------------------------------------------------------------------

export const metadata = { title: `Analytics Paiements - ${CONFIG.appName}` };

export default function Page() {
  return <ReportPaiement />;
}

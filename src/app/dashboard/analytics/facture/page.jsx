import { CONFIG } from 'src/config-global';

import { AnalyticsFactureView } from 'src/sections/overview/analytics/factures/view';

// ----------------------------------------------------------------------




export const metadata = { title: `Analytics Factures - ${CONFIG.appName}` };


export default function Page() {
  return <AnalyticsFactureView />;
}

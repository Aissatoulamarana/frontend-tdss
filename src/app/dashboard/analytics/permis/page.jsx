import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------
import { PermisAnalyticsView } from 'src/sections/overview/analytics/permis/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Analytics Permis - ${CONFIG.appName}` };


export default function Page() {
  return <PermisAnalyticsView />;
}

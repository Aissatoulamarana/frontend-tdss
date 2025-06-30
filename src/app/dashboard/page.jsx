import { CONFIG } from 'src/config-global';

import { OverviewGlobalView } from 'src/sections/app/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <OverviewGlobalView />;
}

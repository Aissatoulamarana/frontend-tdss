import { CONFIG } from 'src/config-global';

import { PermitListView } from 'src/sections/administration/permit/permit-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Permit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <PermitListView />;
}

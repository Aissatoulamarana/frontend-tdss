import { CONFIG } from 'src/config-global';

import { FactureListView } from 'src/sections/overview/factures/view';

// ----------------------------------------------------------------------


export const metadata = { title: `Factures | Dashboard - ${CONFIG.appName}` };


export default function Page() {
  return <FactureListView />;
}

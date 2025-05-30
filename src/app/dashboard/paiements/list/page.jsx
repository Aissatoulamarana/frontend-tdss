import { CONFIG } from 'src/config-global';

import { PaiementListView } from 'src/sections/overview/paiements/view';

// ----------------------------------------------------------------------


export const metadata = { title: `Paiements | Dashboard - ${CONFIG.appName}` };


export default function Page() {
  return <PaiementListView />;
}

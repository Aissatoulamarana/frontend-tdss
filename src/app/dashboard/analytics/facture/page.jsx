import { CONFIG } from 'src/config-global';

import { Reportfacture } from 'src/sections/overview/rapports/facture';

// ----------------------------------------------------------------------

export const metadata = { title: `Analytics Factures - ${CONFIG.appName}` };

export default function Page() {
  return <Reportfacture />;
}

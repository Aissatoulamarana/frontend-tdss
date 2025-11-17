import { CONFIG } from 'src/config-global';

import { ReportPermit } from 'src/sections/overview/rapports/permits';
// ----------------------------------------------------------------------

export const metadata = { title: `Rapport Permits - ${CONFIG.appName}` };

export default function Page() {
  return <ReportPermit />;
}

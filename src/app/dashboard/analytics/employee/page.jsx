import { CONFIG } from 'src/config-global';

import { ReportEmployee } from 'src/sections/overview/rapports/employees';
// ----------------------------------------------------------------------

export const metadata = { title: `Rapport Employés - ${CONFIG.appName}` };

export default function Page() {
  return <ReportEmployee />;
}

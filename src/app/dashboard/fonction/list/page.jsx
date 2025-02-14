import { CONFIG } from 'src/config-global';

import { JobListView } from 'src/sections/administration/fonction/view';

// ----------------------------------------------------------------------

<<<<<<< HEAD
export const metadata = { title: `Job list | Dashboard - ${CONFIG.appName}` };
=======
export const metadata = { title: `Fonction  | Dashboard - ${CONFIG.appName}` };
>>>>>>> dev-frontend

export default function Page() {
  return <JobListView />;
}

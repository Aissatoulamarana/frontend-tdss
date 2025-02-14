import { CONFIG } from 'src/config-global';

import { JobCreateView } from 'src/sections/administration/fonction/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new job | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <JobCreateView />;
}

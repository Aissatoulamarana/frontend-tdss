import { CONFIG } from 'src/config-global';

import { JobCategoryListView } from 'src/sections/administration/JobCategory/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Job Category | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <JobCategoryListView />;
}

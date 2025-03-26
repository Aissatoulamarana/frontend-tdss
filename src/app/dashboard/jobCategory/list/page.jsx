import { CONFIG } from 'src/config-global';

import { JobCategoryListView } from 'src/sections/administration/jobCategory/view';

// ----------------------------------------------------------------------


export const metadata = { title: `Catégorie Professionnelle  | Dashboard - ${CONFIG.appName}` };


export default function Page() {
  return <JobCategoryListView />;
}

import { CONFIG } from 'src/config-global';
import { JobCategoryCreateView } from 'src/sections/administration/jobCategory/view';
// ----------------------------------------------------------------------

export const metadata = { title: `Créer une nouvelle catégorie professionnelle | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <JobCategoryCreateView />;
}

import { CONFIG } from 'src/config-global';

import { ListPlanAfricanisationView } from 'src/sections/overview/plan-africanisation/view';

export const metadata = { title: `Liste des Plans d'Africanisation | - ${CONFIG.appName}` };

export default function Page() {
  return <ListPlanAfricanisationView />;
}

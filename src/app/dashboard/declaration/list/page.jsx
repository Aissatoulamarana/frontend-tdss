import { CONFIG } from 'src/config-global';

import { DeclarationListView } from 'src/sections/overview/declaration/view';

// ----------------------------------------------------------------------


export const metadata = { title: `Listes des Declarations | - ${CONFIG.appName}` };


export default function Page() {
  return <DeclarationListView />;
}

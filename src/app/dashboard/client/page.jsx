import { CONFIG } from 'src/config-global';

import { Client } from 'src/sections/administration/client/client';

// ----------------------------------------------------------------------

export const metadata = { title: `Kanban | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <Client />;
}

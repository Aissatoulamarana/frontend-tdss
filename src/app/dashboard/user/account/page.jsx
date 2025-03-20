import { CONFIG } from 'src/config-global';

import { AccountView } from 'src/sections/administration/account/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Account settings | Dashboard - ${CONFIG.appName}` };

export default async function Page() {

  return <AccountView />;
}

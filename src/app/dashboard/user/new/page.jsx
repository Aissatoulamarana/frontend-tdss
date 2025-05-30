import { CONFIG } from 'src/config-global';

import { UserCreateView } from 'src/sections/administration/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserCreateView />;
}

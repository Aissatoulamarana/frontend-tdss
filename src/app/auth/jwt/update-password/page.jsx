import { CONFIG } from 'src/config-global';

import { UpdatePasswordView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Update password |  - ${CONFIG.appName}` };

export default function Page() {
  return <UpdatePasswordView />;
}

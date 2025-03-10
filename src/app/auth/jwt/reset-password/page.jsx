import { CONFIG } from 'src/config-global';

import { ResetPasswordView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Reset password |  - ${CONFIG.appName}` };

export default function Page() {
  return <ResetPasswordView />;
}

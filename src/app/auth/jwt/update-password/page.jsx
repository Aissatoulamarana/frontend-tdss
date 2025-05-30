import { CONFIG } from 'src/config-global';


import { MessageView } from 'src/auth/view/jwt/reset-message';

// ----------------------------------------------------------------------

export const metadata = { title: `Update password |  - ${CONFIG.appName}` };

export default function Page() {
  return <MessageView />;
}

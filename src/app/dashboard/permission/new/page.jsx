import { CONFIG } from 'src/config-global';

import { PermissionCreateView } from 'src/sections/administration/permissions/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new job | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <PermissionCreateView />;
}

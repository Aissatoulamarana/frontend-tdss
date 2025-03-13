import { CONFIG } from 'src/config-global';

import { UserProfileView } from 'src/sections/administration/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User profile | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <UserProfileView />;
}

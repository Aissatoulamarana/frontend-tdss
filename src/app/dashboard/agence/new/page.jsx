import { CONFIG } from 'src/config-global';

import { AgenceCreateView } from 'src/sections/administration/agence/view';

// ----------------------------------------------------------------------

export const metadata = { title: ` New Agency | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <AgenceCreateView />;
}

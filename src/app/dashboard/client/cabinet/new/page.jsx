import { CONFIG } from 'src/config-global';

import { CabinetCreateView } from 'src/sections/administration/client/cabinet/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Cabinet | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <CabinetCreateView />;
}

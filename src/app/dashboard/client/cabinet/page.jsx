import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Listes des cabinets | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <BlankView title="Listes des cabinets" />;
}

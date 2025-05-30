import { CONFIG } from 'src/config-global';

import { AgenceListView } from 'src/sections/administration/agence/view';

// ----------------------------------------------------------------------


export const metadata = { title: `Fonction  | Dashboard - ${CONFIG.appName}` };


export default function Page() {
    return <AgenceListView />;
}

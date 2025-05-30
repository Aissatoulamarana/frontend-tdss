import { CONFIG } from 'src/config-global';

import { DeclarationNewView } from 'src/sections/overview/declaration/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Renouvellement Déclaration | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <DeclarationNewView />;
}

import { CONFIG } from 'src/config-global';

import { DeviseListView } from 'src/sections/administration/devise/devise-list-view';


// ----------------------------------------------------------------------

export const metadata = { title: `Devise | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <DeviseListView />;
}

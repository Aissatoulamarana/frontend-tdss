import { CONFIG } from 'src/config-global';
import { ProfilTypeListView } from 'src/sections/administration/profilType/view';




// ----------------------------------------------------------------------

export const metadata = { title: `Region list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <ProfilTypeListView />;
}

import { CONFIG } from 'src/config-global';
import { ProfilTypeListView } from 'src/sections/administration/profilType/view';




// ----------------------------------------------------------------------

export const metadata = { title: `Type Profil | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <ProfilTypeListView />;
}

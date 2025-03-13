import { CONFIG } from 'src/config-global';
import { RegionListView } from 'src/sections/administration/region/view';



// ----------------------------------------------------------------------

export const metadata = { title: `Region list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <RegionListView />;
}

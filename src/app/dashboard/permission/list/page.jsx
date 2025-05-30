import { CONFIG } from 'src/config-global';
import { PermissionListView } from 'src/sections/administration/permissions/view';



// ----------------------------------------------------------------------

export const metadata = { title: `Permission list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <PermissionListView />;
}

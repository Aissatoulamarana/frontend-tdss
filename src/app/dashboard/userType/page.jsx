import { CONFIG } from 'src/config-global';

import { UserTypeListView } from 'src/sections/administration/userType/user-type-list-view';



// ----------------------------------------------------------------------

export const metadata = { title: `Type User | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <UserTypeListView />;
}

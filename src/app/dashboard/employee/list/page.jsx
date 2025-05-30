import { CONFIG } from 'src/config-global';


import { EmployeeListView } from 'src/sections/overview/employee/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Empoyee | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <EmployeeListView />;
}

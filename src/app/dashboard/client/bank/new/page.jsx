import { CONFIG } from 'src/config-global';

import { BankCreateView } from 'src/sections/administration/client/bank/view';

// ----------------------------------------------------------------------

export const metadata = { title: `New Bank | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return <BankCreateView />;
}

import { CONFIG } from 'src/config-global';

import { AccountView } from 'src/sections/administration/account/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Account settings | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { slug } = await params;
  return <AccountView slug={slug} />;
}

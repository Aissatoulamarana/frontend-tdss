import { CONFIG } from 'src/config-global';
import { PermitDetailView } from 'src/sections/overview/permit/view';

export const metadata = { title: `Details Permit | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { slug } = await params;
  return <PermitDetailView slug={slug} />;
}

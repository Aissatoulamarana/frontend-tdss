import { CONFIG } from 'src/config-global';
import { PenaliteDetailsView } from 'src/sections/overview/penalite/view';

export const metadata = { title: `Details Penalite | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { slug } = await params;

  return <PenaliteDetailsView slug={slug} />;
}

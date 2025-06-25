import { CONFIG } from 'src/config-global';

import { DeclarationEditView } from 'src/sections/overview/declaration/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Modifier Declarations | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { slug } = await params;

  return <DeclarationEditView slug={slug} />;
}

export const dynamic = 'force-dynamic';

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
// export async function generateStaticParams() {
//   if (CONFIG.isStaticExport) {

//     return declarations.map((declaration) => ({ id: declaration.id }));

//   }
//   return [];
// }

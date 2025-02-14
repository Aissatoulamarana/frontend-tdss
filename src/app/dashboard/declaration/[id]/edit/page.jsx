import { CONFIG } from 'src/config-global';

import { DeclarationEditView } from 'src/sections/overview/declaration/view';


// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export const metadata = { title: `Modifier Declarations | Dashboard - ${CONFIG.appName}` };


export default function Page({ params }) {
  const { id } = params;


  const detailsDeclaration = declarations.find((declaration) => declaration.id === id);

  return <DeclarationEditView declaration={detailsDeclaration} />;

}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {

    return declarations.map((declaration) => ({ id: declaration.id }));

  }
  return [];
}

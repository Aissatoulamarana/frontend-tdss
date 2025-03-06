import { CONFIG } from 'src/config-global';

import { DeclarationEditView } from 'src/sections/overview/declaration/view';
import API from 'src/utils/api';
import axios from 'src/utils/axios';


// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export const metadata = { title: `Modifier Declarations | Dashboard - ${CONFIG.appName}` };

async function fetchDec(id) {
  try {
    const res = await axios.get(API.detailsDeclaration(id), {
      cache: 'no-store', // Toujours récupérer les données les plus récentes
    });

    if (!res || !res.data) {
      throw new Error(`Erreur API: ${res.status}`);
    }

    return res.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la declaration:', error);
    return null;
  }
}


export default async function Page({ params }) {
  const { id } = await params;
  if (!id) {
    return <div>Erreur: ID manquant</div>;
  }

  const detailsDeclaration = await fetchDec(id);
  if (detailsDeclaration) {
    console.log("les details de la déclaration", detailsDeclaration)
  } else {
    console.error('Impossible de récupérer les détails de la déclaration');
  }

  return <DeclarationEditView declaration={detailsDeclaration} />;

}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

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

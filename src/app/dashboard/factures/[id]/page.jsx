import axios from 'src/utils/axios';
import { CONFIG } from 'src/config-global';

import API from 'src/utils/api';

import { FactureDetailsView } from 'src/sections/overview/factures/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Facture details | Dashboard - ${CONFIG.appName}` };

export default async function Page({ params }) {
  const { id } = params;

  try {
    // Récupérer les détails de la déclaration via l'API backend
    const response = await axios.get(API.detailsFacture(id));

    // Avec axios, les données sont accessibles via response.data
    const FactureDetails = response.data;
    console.log("les données de la facture reçues par le backend ", FactureDetails);

    return <FactureDetailsView facture={FactureDetails} />;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la facture:', error);

    // Affiche une erreur ou une page vide si les données ne peuvent pas être chargées
    return <div>Erreur lors du chargement des détails de la facture.</div>;
  }
}
// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    const response = await fetch(API.getAllFactures());
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des déclarations: ${response.statusText}`);
    }

    const factures = await response.json();

    return factures.map((facture) => ({ id: facture.id.toString() })); // Assurez-vous que `id` est une chaîne
  }
  return [];
}

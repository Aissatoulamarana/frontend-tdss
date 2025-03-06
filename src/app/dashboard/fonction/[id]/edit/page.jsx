import { CONFIG } from 'src/config-global';
import { JobEditView } from 'src/sections/administration/fonction/view';
import API from 'src/utils/api';
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export const metadata = { title: `Job edit | Dashboard - ${CONFIG.appName}` };

// Fonction pour récupérer un job spécifique
async function fetchJob(id) {
    try {
        const res = await axios.get(API.detailsFonction(id), {
            cache: 'no-store', // Toujours récupérer les données les plus récentes
        });

        if (!res || !res.data) {
            throw new Error(`Erreur API: ${res.status}`);
        }

        return res.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du job:', error);
        return null;
    }
}

// Fonction de la page (doit être async pour utiliser `await`)
export default async function Page({ params }) {
    const { id } = await params;
    // Vérifie si `params.id` est correctement récupéré
    if (!id) {
        return <div>Erreur: ID manquant</div>;
    }

    const currentJob = await fetchJob(id);
    if (currentJob) {
        console.log('Détails du job:', currentJob);
    } else {
        console.error('Impossible de récupérer les détails du job');
    }


    return <JobEditView job={currentJob} />;
}

// ----------------------------------------------------------------------

// Gestion du mode dynamique ou statique
// const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';
// export { dynamic };

// // Génération des paramètres statiques pour le pré-rendu
// export async function generateStaticParams() {
//     try {
//         const res = await axios.get(API.listFonctions()); // Assurez-vous que cette API retourne une liste
//         const jobs = await res.json();

//         return jobs.map((job) => ({ id: job.id.toString() }));
//     } catch (error) {
//         console.error('Erreur lors de la récupération des jobs:', error);
//         return [];
//     }
// }

// /src/app/dashboard/user/[id]/page.jsx
import { CONFIG } from 'src/config-global';


// Fonction pour récupérer les données de l'utilisateur
import { UserDetailsView } from 'src/sections/administration/user/view';

export const metadata = { title: `Details User| Dashboard - ${CONFIG.appName}` }

export default async function UserDetails({ params }) {
  const { slug } = await params;


  return (
    <UserDetailsView slug={slug} />
  );
}

import { CONFIG } from 'src/config-global';
import { UserEditView } from 'src/sections/administration/user/view';

export const metadata = { title: `Update User| Dashboard - ${CONFIG.appName}` }

export default async function Page({ params }) {
    const { slug } = await params

    return (
        <UserEditView slug={slug} />
    )
}
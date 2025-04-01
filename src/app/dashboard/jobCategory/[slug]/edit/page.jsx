import { CONFIG } from 'src/config-global';
import { JobCategoryEditView } from 'src/sections/administration/jobCategory/view/job-category-edit-view';

export const metadata = { title: `Update Job Category| Dashboard - ${CONFIG.appName}` }

export default async function Page({ params }) {
    const { slug } = params;

    return (
        <JobCategoryEditView slug={slug} />
    )
}

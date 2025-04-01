// /src/app/dashboard/user/[id]/page.jsx
import { CONFIG } from 'src/config-global';
import React from 'react';
import { JobCategoryDetailsView } from 'src/sections/administration/jobCategory/view/job-category-detail-view';

export const metadata = { title: `Details Job Category | Dashboard - ${CONFIG.appName}` };


export default async function JobCategoryDetails({ params }) {
    const { slug } = await params;
    return (
        <JobCategoryDetailsView slug={slug} />
    );
}

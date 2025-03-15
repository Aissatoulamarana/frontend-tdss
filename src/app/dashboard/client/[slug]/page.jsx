// /src/app/dashboard/user/[id]/page.jsx

import React from 'react';
import { ClientDetailsView } from 'src/sections/administration/client/view';




export default async function UserDetails({ params }) {
    const { slug } = await params;
    return (
        <ClientDetailsView slug={slug} />
    );
}

'use client';
import { useEffect, useState } from 'react';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobNewEditForm } from '../job-new-edit-form';

import API from 'src/utils/api';
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export function JobEditView({ slug }) {

    const [job, setJob] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(API.detailsFonction(slug));
                setJob(response.data);
                console.log('Données du job à modifier', response.data);
            } catch (error) {
                setError(error.message || 'Erreurs lors du chargement des données');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [slug]);

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Modifier"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Fonction', href: paths.dashboard.fonction.root },
                    { name: job?.name },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <JobNewEditForm currentJob={job} />
        </DashboardContent>
    );
}

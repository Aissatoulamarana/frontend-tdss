'use client';
import { useEffect, useState, useCallback } from 'react'
import API from "src/utils/api";
import axios from "src/utils/axios";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { JobCategoryHome } from '../job-category-home';

export function JobCategoryDetailsView({ slug }) {
    const [jobCategory, setJobCategory] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const router = useRouter()

    const handleEdit = useCallback(() => {
        router.push(paths.dashboard.jobCategory.edit(slug));
    }, [router]);

    const tabs = useTabs('jobCategory');
    
    useEffect(() => {
        // Récupération des données de job category
        const fetchJobCategory = async () => {
            try {
                const response = await axios.get(API.editJobCategory(slug));
                setJobCategory(response.data);
                console.log(response.data);
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobCategory();
    }, [slug]);
    // console.log('jobCategory', jobCategory);
    
    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <DashboardContent>
            <Box sx={{ mb: { xs: 3, md: 5 } }}>
                <CustomBreadcrumbs
                    heading="Fonction Professionnelle"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Fonction Professionnelle', href: paths.dashboard.jobCategory.root },
                        { name: jobCategory?.name },
                    ]}
                />
                {/* Bouton d'édition sous les breadcrumbs */}
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                    <Tooltip title="Modifier">
                        <IconButton onClick={handleEdit}>
                            <Iconify icon="solar:pen-bold" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {tabs.value === 'jobCategory' && <JobCategoryHome info={jobCategory} />}
        </DashboardContent>
    );
}

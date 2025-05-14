'use client';

import { useEffect, useState } from 'react'
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { JobCategoryNewEditForm } from '../job-category-new';

import API from 'src/utils/api';
import axios from 'src/utils/axios';



export function JobCategoryEditView({ slug }) {
    

    const [jobCategory, setJobCategory] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Récupération des données du profil
        const fetchJobCategory = async () => {
            try {
                const response = await axios.get(API.editJobCategory(slug));
                setJobCategory(response.data);
                
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobCategory();
    }, [slug]);

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Modifier Job Category"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Catégories Professionnelles', href: paths.dashboard.jobCategory.root },
                    { name: 'Modifier' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            >



            </CustomBreadcrumbs>
            <JobCategoryNewEditForm currentJobCategory={jobCategory} />
        </DashboardContent>
    );
} 
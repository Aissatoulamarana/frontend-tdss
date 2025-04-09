'use client';
import { useEffect, useState, useCallback } from 'react'
import API from "src/utils/api";
import axios from "src/utils/axios";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useTabs } from 'src/hooks/use-tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmployeeCover } from '../employee-cover';
import { EmployeeInfo } from '../employee-info';
import { EmployeeDeclarations } from '../employee-declaration';
import { EmployeeJob } from '../employee-job';



const TABS_ENTREPRISE = [
    { value: 'profile', label: 'Infos', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
    { value: 'fonction', label: 'Fonction', icon: <Iconify icon="mdi:briefcase" width={24} /> },
    { value: 'declaration', label: 'Déclarations', icon: <Iconify icon="solar:document-add-bold" width={24} /> },
    { value: 'permis', label: 'Permits', icon: <Iconify icon="mdi:card-account-details" width={24} /> },

];

export function EmployeeDetailsView({ slug }) {
    const [employee, setEmployee] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [declarations, setDeclarations] = useState();
    const [job, setJob] = useState();

    const router = useRouter()


    const tabs = useTabs('profile');

    useEffect(() => {
        // Récupération des données du profil
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(API.detailsEmployee(slug));
                setEmployee(response.data);
                const { declaration } = response.data;
                const { job } = response.data;

                // On enveloppe dans un tableau si declaration n'est pas déjà un tableau.
                setDeclarations(Array.isArray(declaration) ? declaration : [declaration]);

                // console.log('les données de la declaration', response.data.declaration)
                setJob(Array.isArray(job) ? job : [job]);
                // console.log(response.data);
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [slug]);


    let displayedTabs = TABS_ENTREPRISE;


    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <DashboardContent>
            <Box sx={{ mb: { xs: 3, md: 5 } }}>
                <CustomBreadcrumbs
                    heading="Details Employé"
                    links={[
                        { name: 'Dashboard', href: paths.dashboard.root },
                        { name: 'Employés', href: paths.dashboard.employee.list },
                        { name: employee?.first },
                    ]}
                />

            </Box>

            <Card sx={{ mb: 3, height: 290, position: 'relative' }}>
                <EmployeeCover
                    role={employee?.last}
                    name={employee?.first}
                    avatarUrl={employee?.picture}
                    coverUrl={employee?.picture}
                />
                <Box
                    display="flex"
                    justifyContent={{ xs: 'center', md: 'flex-end' }}
                    sx={{
                        width: 1,
                        bottom: 0,
                        zIndex: 8,
                        px: { md: 3 },
                        position: 'absolute',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Tabs value={tabs.value} onChange={tabs.onChange}>
                        {displayedTabs.map((tab) => (
                            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                        ))}
                    </Tabs>
                </Box>
            </Card>

            {tabs.value === 'profile' && <EmployeeInfo info={employee} />}
            {tabs.value === 'declaration' && <EmployeeDeclarations declarations={declarations} />}
            {tabs.value === 'fonction' && <EmployeeJob info={job} />}

        </DashboardContent>
    );
}

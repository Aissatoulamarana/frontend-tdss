'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Form } from 'src/components/hook-form';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    CardContent,
    Button,
    Avatar,
    Card,
    Stack,

} from '@mui/material';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LoadingButton from '@mui/lab/LoadingButton';
// import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'sonner';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';




import { getEntreprises } from 'src/utils/options';

import API from 'src/utils/api';
import axios from 'src/utils/axios';
import { paths } from 'src/routes/paths';


export function UserDetailsView({ slug }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);
    // Ajouter un état showSelect pour afficher ou cacher le <Select>.
    const [showSelect, setShowSelect] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [pageSize] = useState(10);

    const router = useRouter();
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(API.userDetails(slug));
                setUser(data);
            } catch (err) {
                setError(err.message || 'Erreur lors du chargement');
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);
    // useEffect pour fetch avec pagination + recherche
    useEffect(() => {
        const fetchCompanies = async () => {
            const data = await getEntreprises({ page, page_size: pageSize, search });
            setCompanies(data);
        };
        fetchCompanies();
    }, [page, pageSize, search]);

    const methods = useForm({
        mode: 'all',
    });
    const { handleSubmit, formState: { isSubmitting } } = methods;
    const handleChange = (_, newIndex) => setTabIndex(newIndex);

    if (loading) return <Typography>Chargement...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    const iconWrapperStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        bgcolor: 'primary.light',
        color: 'primary.main',
        borderRadius: '50%',
        mr: 1,
        flexShrink: 0,
    };

    const handleEditRow = async (slug) => {
  router.push(paths.dashboard.user.edit(slug));
};


    const onSubmit = handleSubmit(async () => {
        try {
            const formData = {
                profile: selectedCompany.slug,
                user: slug,
            };

            const response = await axios.post(API.addProfileToUser(), formData);

            toast.success('Entreprise liée avec succès !');

            // Masquer le formulaire après une liaison réussie
            setShowSelect(false);

            // Actualiser la liste des entreprises liées sans rechargement manuel
            const { data } = await axios.get(API.userDetails(slug));
            setUser(data);
        } catch (error) {
            console.error('Erreur complète:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Erreur lors de la liaison.');
        }
    });

    return (
        <DashboardContent sx={{ py: 4 }}>
            <CustomBreadcrumbs
                heading="Détails de l'utilisateur"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Utilisateurs', href: paths.dashboard.user.list },
                    { name: user?.first_name },
                ]}
                sx={{ mb: { xs: 4, md: 6 } }}
            />

            <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Gauche: avatar + onglets */}
                <Box sx={{ width: 220, position: 'relative' }}>
                    <Card
                        sx={{
                            boxShadow: 8,
                            borderRadius: 3,
                            pt: 18,
                            pb: 2,
                            px: 1,
                            height: 360,
                        }}
                    >
                        <Tabs
                            orientation="vertical"
                            value={tabIndex}
                            onChange={handleChange}
                            sx={{
                                '& .MuiTab-root': { textTransform: 'none', py: 2, fontWeight: 500 },
                                '& .Mui-selected': {
                                    color: 'primary.main',
                                    borderLeft: '3px solid',
                                    borderColor: 'primary.main',
                                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                                },
                            }}
                        >
                            <Tab label="Détails" />
                            <Tab label="Profil" />
                            <Tab label="Agences" />
                            {(user.type?.name === 'Enteprise') && <Tab label="Entreprises" />}
                        </Tabs>
                    </Card>

                    <Avatar
                        alt={user.first_name}
                        src={user.picture}
                        sx={{
                            position: 'absolute',
                            top: -40,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 120,
                            height: 120,
                            border: '4px solid #fff',
                            boxShadow: 4,
                        }}
                    />
                </Box>

                {/* Droite: contenu */}
                <Card
                    sx={{
                        flex: 1,
                        boxShadow: 8,
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ p: 3,  position: 'relative' }}>
                        {/* Titre de section */}
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            {{
                                0: 'Informations personnelles',
                                1: 'Informations du Profil',
                                2: 'Agences associées',
                                3: 'Entreprises associées',
                            }[tabIndex]}
                        </Typography>
                          <Tooltip title="Modifier">
                            <Button variant='contained' onClick={() => handleEditRow(slug)} sx={{ position: 'absolute', top: 6, right: 8 }}>
                                
                            <Iconify icon="solar:pen-bold" />
                            
                            </Button>
                        </Tooltip>

                        {/* Contenu selon l'onglet */}
                        {tabIndex === 0 && (
                            <Stack spacing={3}>
                                {[
                                    { icon: <PersonIcon />, label: 'Nom', value: user.last_name },
                                    { icon: <PersonIcon />, label: 'Prénom', value: user.first_name },
                                    { icon: <EmailIcon />, label: 'Email', value: user.email },
                                    { icon: <PhoneIcon />, label: 'Téléphone', value: user.phone },
                                    { icon: <WorkIcon />, label: 'Rôle', value: user.type?.name },
                                    { icon: <LocationOnIcon />, label: 'Région', value: user.location?.name },
                                ].map((f) => (
                                    <Box key={f.label} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={iconWrapperStyle}>{f.icon}</Box>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {f.label}
                                            </Typography>
                                            <Typography variant="body1">{f.value || '—'}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        )}

                        {tabIndex === 1 && (
                            user.profile ? (
                                <Stack spacing={3}>
                                    {[
                                        { icon: <PersonIcon />, label: "Nom d'utilisateur", value: user.profile.name },
                                        { icon: <EmailIcon />, label: 'Email', value: user.profile.email },
                                        { icon: <PhoneIcon />, label: 'Contact', value: user.profile.contact },
                                    ].map((f) => (
                                        <Box key={f.label} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={iconWrapperStyle}>{f.icon}</Box>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    {f.label}
                                                </Typography>
                                                <Typography variant="body1">{f.value}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography>Aucun profil associé.</Typography>
                            )
                        )}

                        {tabIndex === 2 && (
                            user.agency ? (
                                <Stack spacing={3}>
                                    {[
                                        { icon: <WorkIcon />, label: "Nom de l'agence", value: user.agency.name },
                                        { icon: <LocationOnIcon />, label: 'Région', value: user.agency.region?.name },
                                    ].map((f) => (
                                        <Box key={f.label} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={iconWrapperStyle}>{f.icon}</Box>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    {f.label}
                                                </Typography>
                                                <Typography variant="body1">{f.value || '—'}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Typography>Aucune agence associée.</Typography>
                            )
                        )}

                        {tabIndex === 3 && (
                            <>
                                {/* Header Entreprises + Bouton */}
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Entreprises
                                    </Typography>
                                    <Button variant="outlined" size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setShowSelect(!showSelect)}>
                                        Ajouter
                                    </Button>
                                </Stack>
                                
                                {showSelect && (
                                        <Form methods={methods} fullWidth onSubmit={onSubmit}>
                                            <Autocomplete
                                                sx={{ display: 'flex', justifyContent: 'flex-end' }}
                                                size="small"
                                                options={companies}
                                                getOptionLabel={(option) => (option && option.name) || ''}
                                                value={selectedCompany}
                                                onChange={(event, newValue) => {
                                                    setSelectedCompany(newValue);
                                                }}
                                                inputValue={search}
                                                onInputChange={(event, newInputValue) => {
                                                    setSearch(newInputValue);
                                                    setPage(1);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Rechercher une entreprise" />
                                                )}
                                            />
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                                <LoadingButton type="submit" variant="contained" size="small" loading={isSubmitting} disabled={!selectedCompany}>
                                                    <Iconify icon="eva:checkmark-circle-2-outline" width={20} height={20} sx={{ mr: 1 }} />
                                                    Lier
                                                </LoadingButton>
                                            </Box>
                                        </Form>
                                )}

                                {user.companies && user.companies?.length > 0 ? (

                                    <Grid container spacing={3}>
                                        {user.companies.map((company) => (
                                            <Grid item xs={12} sm={6} md={4} key={company.slug}>
                                                <Card
                                                    sx={{ p: 2, boxShadow: 4, borderRadius: 2, cursor: 'pointer' }}
                                                    onClick={() => router.push(paths.dashboard.client.details(company.slug))}
                                                >
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Avatar
                                                            alt={company.name}
                                                            src={company.picture}
                                                            sx={{ width: 56, height: 56, mb: 2 }}
                                                        />
                                                        <Typography variant="subtitle1">{company.name}</Typography>
                                                    </Stack>
                                                    <Stack spacing={1}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Contact: {company.contact || '—'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Email: {company.email || '—'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Adresse: {company.adresse || '—'}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Statut: {company.status === 'ON' ? 'Actif' : 'Inactif'}
                                                        </Typography>
                                                    </Stack>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>

                                ) : (
                                    <Typography>Aucune entreprise associée.</Typography>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </DashboardContent>
    );
}


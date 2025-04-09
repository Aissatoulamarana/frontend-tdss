'use client';

import { useEffect, useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    CardContent,
    Button,
    Avatar,
    Card,
    Divider,
    IconButton,
    Stack,

} from '@mui/material';
import Grid from '@mui/material/Grid2';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { paths } from 'src/routes/paths';
import API from 'src/utils/api';
import axios from 'src/utils/axios';

export function UserDetailsView({ slug }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState(0);

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
                            <Tab label="Entreprises" />
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
                    <CardContent sx={{ p: 3 }}>
                        {/* Titre de section */}
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                            {{
                                0: 'Informations personnelles',
                                1: 'Informations du Profil',
                                2: 'Agences associées',

                            }[tabIndex]}
                        </Typography>

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
                                    <Button variant="outlined" size="small">
                                        Ajouter
                                    </Button>
                                </Stack>

                                {user.companies && user.companies.length > 0 ? (
                                    <Grid container spacing={3}>
                                        {user.companies.map((company) => (
                                            <Grid item xs={12} sm={6} md={4} key={company.slug}>
                                                <Card sx={{ p: 2, boxShadow: 4, borderRadius: 2 }}>
                                                    <Stack spacing={2}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <Avatar
                                                                    alt={company.name}
                                                                    src={company.picture}
                                                                    variant="rounded"
                                                                    sx={{ width: 40, height: 40 }}
                                                                />
                                                                <Typography variant="subtitle1" fontWeight={600}>
                                                                    {company.name}
                                                                </Typography>
                                                            </Stack>
                                                            <IconButton size="small">
                                                                <Iconify icon="eva:more-vertical-fill" />
                                                            </IconButton>
                                                        </Stack>

                                                        <Divider sx={{ borderColor: 'grey.300' }} />

                                                        <Stack spacing={1}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={iconWrapperStyle}>
                                                                    <WorkIcon fontSize="small" />
                                                                </Box>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Catégorie: {company.category || '—'}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Box sx={iconWrapperStyle}>
                                                                    <PersonIcon fontSize="small" />
                                                                </Box>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {/* Taille équipe */}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
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

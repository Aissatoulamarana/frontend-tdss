'use client';

import { Container, Stack, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuthContext } from 'src/auth/hooks';

// Components
import { AguipeStats } from './components/AguipeStats';
import { AguipeCharts } from './components/AguipeCharts';
import { AguipeTables } from './components/AguipeTables';

// ----------------------------------------------------------------------

export default function AguipeAppView() {
  const theme = useTheme();

  const { user } = useAuthContext();
  
  // Fonction pour formater le type de profil
  const formatUserRole = (role) => {
    const roles = {
      admin: 'Administrateur',
      agent: 'Agent',
      supervisor: 'Superviseur',
      manager: 'Gestionnaire',
    };
    return roles[role] || role;
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={3}>
        
        
        {/* Titre principal */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Tableau de bord AGUIPE</Typography>
        </Stack>
        {/* En-tête avec informations utilisateur */}
        <Box sx={{ 
          mb: 2,
          p: 2,
          bgcolor: 'background.neutral',
          borderRadius: 1,
          borderLeft: '4px solid',
          borderColor: 'primary.main'
        }}>
          <Typography variant="subtitle1" color="text.secondary">
            Bienvenue Mr/Mme <strong>{user?.name || user?.email || 'Utilisateur'}</strong>
          </Typography>
          {user?.role && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Profil : <strong>{formatUserRole(user.type_name)}</strong>
            </Typography>
          )}
        </Box>

        {/* Section des statistiques */}
        <AguipeStats />

        {/* Section des graphiques */}
        <AguipeCharts />

        {/* Section des tableaux */}
        <AguipeTables />
      </Stack>
    </Container>
  );
}

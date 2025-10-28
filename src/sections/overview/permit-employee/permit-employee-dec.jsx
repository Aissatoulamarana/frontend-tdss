import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function PermitDeclaration({ declaration_number, declaration_slug, type }) {
  const router = useRouter();

  // 🔗 Fonction pour aller au détail de la déclaration
  const handleViewDeclaration = useCallback(() => {
    if (declaration_slug) {
      router.push(paths.dashboard.declaration.details(declaration_slug));
    } else {
      console.warn('Aucune déclaration disponible');
    }
  }, [router, declaration_slug]);

  // Composant réutilisable pour les items d'information
  const InfoItem = ({ icon, label, value, isButton = false, onClick }) => (
    <Box
      sx={{
        minWidth: { xs: '100%', sm: 'calc(50% - 16px)' },
        mb: 2.5,
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.lighter',
          mr: 1.5,
          flexShrink: 0,
        }}
      >
        <Iconify icon={icon} width={22} sx={{ color: 'primary.main' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: 0.5,
            display: 'block',
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        {isButton ? (
          <Button
            variant="text"
            color="primary"
            onClick={onClick}
            startIcon={<Iconify icon="mdi:open-in-new" width={16} />}
            sx={{
              p: 0,
              minWidth: 'auto',
              textTransform: 'none',
              justifyContent: 'flex-start',
              fontWeight: 500,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            {value}
          </Button>
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              color: 'text.primary',
              wordBreak: 'break-word',
            }}
          >
            {value || '-'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  // État vide
  const renderEmpty = (
    <Card
      sx={{
        overflow: 'visible',
        boxShadow: (theme) => theme.customShadows?.card,
      }}
    >
      <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          <Iconify icon="solar:document-add-bold" width={{ xs: 24, sm: 28 }} sx={{ mr: 1.5 }} />
          Déclaration de l'employé
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Iconify icon="solar:document-bold" width={32} sx={{ color: 'text.disabled' }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune déclaration
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Aucune déclaration n'est associée à ce permis
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  // Contenu avec données
  const renderContent = (
    <Card
      sx={{
        overflow: 'visible',
        boxShadow: (theme) => theme.customShadows?.card,
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: (theme) => theme.customShadows?.z8,
        },
      }}
    >
      <Box sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
        {/* ================== Header ================== */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            <Iconify icon="solar:document-add-bold" width={{ xs: 24, sm: 28 }} sx={{ mr: 1.5 }} />
            Déclaration de l'employé
          </Typography>

          <Chip
            icon={<Iconify icon="mdi:check-circle" width={18} />}
            label="Déclaration Active"
            color="success"
            sx={{
              fontWeight: 600,
              px: 1,
              height: { xs: 28, sm: 32 },
              '& .MuiChip-icon': { ml: 0.5 },
              '& .MuiChip-label': {
                px: 1,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ================== Informations ================== */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <InfoItem
            icon="solar:document-add-bold"
            label="Type de Déclaration"
            value={type || 'Non spécifié'}
          />
          <InfoItem
            icon="mdi:link-variant"
            label="Accès à la Déclaration"
            isButton
            value={declaration_number}
            onClick={handleViewDeclaration}
          />
        </Box>

        {/* ================== Action Button (optionnel) ================== */}
        {/* <Box sx={{ mt: 3, pt: 3, borderTop: '1px dashed', borderColor: 'divider' }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<Iconify icon="mdi:file-document-outline" width={20} />}
            onClick={handleViewDeclaration}
            sx={{
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'primary.lighter',
              },
            }}
          >
            Consulter la déclaration complète
          </Button>
        </Box> */}
      </Box>
    </Card>
  );

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Stack spacing={3}>{declaration_slug ? renderContent : renderEmpty}</Stack>
    </Grid>
  );
}

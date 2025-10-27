import { useRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid2';

import { Iconify } from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function EmployeeInfo({ info, posts }) {
  const fileRef = useRef(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      unenrolled: { color: 'warning', label: 'Non Enrôlé', icon: 'mdi:clock-outline' },
      enrolled: { color: 'success', label: 'Enrôlé', icon: 'mdi:check-circle' },
      rejected: { color: 'error', label: 'Rejeté', icon: 'mdi:close-circle' },
    };
    return configs[status] || { color: 'default', label: status, icon: 'mdi:information' };
  };

  const statusConfig = getStatusConfig(info?.status);

  // Composant réutilisable pour les items d'information
  const InfoItem = ({ icon, label, value, isLink = false }) => (
    <Box
      sx={{
        minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
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
        {isLink ? (
          <Link
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: '0.875rem',
              color: 'text.primary',
              textDecoration: 'none',
              wordBreak: 'break-all',
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main',
              },
            }}
          >
            {value || '-'}
          </Link>
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

  // Composant pour les titres de section
  const SectionTitle = ({ title }) => (
    <Typography
      variant="subtitle2"
      sx={{
        color: 'primary.main',
        fontWeight: 700,
        mb: 2.5,
        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          width: 4,
          height: 16,
          bgcolor: 'primary.main',
          borderRadius: 1,
          mr: 1,
        },
      }}
    >
      {title}
    </Typography>
  );

  const renderAbout = (
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
            <Iconify icon="mdi:account-details" width={{ xs: 24, sm: 28 }} sx={{ mr: 1.5 }} />
            Informations Employé
          </Typography>

          <Chip
            icon={<Iconify icon={statusConfig.icon} width={18} />}
            label={statusConfig.label}
            color={statusConfig.color}
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

        {/* ================== Section Identification ================== */}
        <Box sx={{ mb: 3 }}>
          <SectionTitle title="Identification" />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <InfoItem icon="mdi:identifier" label="Référence" value={info?.reference} />
            <InfoItem icon="mdi:passport" label="Passeport" value={info?.passport_number} />
            {/* <InfoItem
              icon="mdi:account"
              label="Nom Complet"
              value={`${info?.first || ''} ${info?.last || ''}`.trim()}
            /> */}
            <InfoItem
              icon={info?.sexe === 'male' ? 'mdi:gender-male' : 'mdi:gender-female'}
              label="Sexe"
              value={info?.sexe === 'male' ? 'Masculin' : 'Féminin'}
            />
            <InfoItem icon="mdi:calendar" label="Date de naissance" value={fDate(info?.birthday)} />
            <InfoItem icon="mdi:map-marker" label="Lieu de naissance" value={info?.birth_place} />
            <InfoItem icon="mdi:flag" label="Nationalité" value={info?.country} />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ================== Section Contact ================== */}
        <Box sx={{ mb: 3 }}>
          <SectionTitle title="Contact" />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <InfoItem icon="ic:baseline-phone" label="Téléphone" value={info?.phone} />
            <InfoItem icon="ic:baseline-email" label="Email" value={info?.email} />
            <InfoItem icon="mdi:home" label="Adresse" value={info?.address} />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ================== Section Contrat ================== */}
        <Box>
          <SectionTitle title="Contrat" />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <InfoItem
              icon="mdi:calendar-start"
              label="Date de Début"
              value={fDate(info?.contract_starts_at)}
            />
            <InfoItem
              icon="mdi:calendar-clock"
              label="Durée"
              value={
                info?.contract_duration
                  ? `${info?.contract_duration} an${info?.contract_duration > 1 ? 's' : ''}`
                  : '-'
              }
            />
            {info?.motif_rejet && (
              <InfoItem icon="mdi:alert-circle" label="Motif de Rejet" value={info?.motif_rejet} />
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Stack spacing={3}>{renderAbout}</Stack>
    </Grid>
  );
}

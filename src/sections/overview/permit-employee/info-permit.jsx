import { useRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { Iconify } from 'src/components/iconify';

import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function PermitInfo({ created_at, permit, expired_at, status }) {
  const fileRef = useRef(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      unenrolled: { color: 'warning', label: 'Non Enrôlé', icon: 'mdi:clock-outline' },
      enrolled: { color: 'success', label: 'Enrôlé', icon: 'mdi:check-circle' },
      rejected: { color: 'error', label: 'Rejeté', icon: 'mdi:close-circle' },
      processing: { color: 'warning', label: 'En cours', icon: 'mdi:clock-outline' },
      validated: { color: 'success', label: 'Validé', icon: 'mdi:check-circle' },
      printed: { color: 'info', label: 'Imprimé', icon: 'mdi:printer' },
      delivered: { color: 'primary', label: 'Délivré', icon: 'mdi:package-variant-closed' },
      submitted: { color: 'success', label: 'Soumis', icon: 'mdi:check-circle' },
      billed: { color: 'info', label: 'Facturé', icon: 'mdi:receipt' },
      paid: { color: 'success', label: 'Payé', icon: 'mdi:check-circle' },
      correction: { color: 'error', label: 'En correction', icon: 'mdi:pen' },
      expired: { color: 'error', label: 'Expiré', icon: 'mdi:calendar-alert' },
    };
    return configs[status] || { color: 'default', label: status, icon: 'mdi:information' };
  };

  const statusConfig = getStatusConfig(status);

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
              wordBreak: 'break-word',
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

  const getRelevantDates = () => {
    const dates = [];

    if (permit?.validated_at) {
      dates.push({
        icon: 'mdi:check-decagram',
        label: 'Date de Validation',
        value: formatDate(permit.validated_at),
      });
    }

    if (permit?.printed_at) {
      dates.push({
        icon: 'mdi:printer-check',
        label: "Date d'Impression",
        value: formatDate(permit.printed_at),
      });
    }

    if (permit?.delivered_at) {
      dates.push({
        icon: 'mdi:package-variant-closed-check',
        label: 'Date de Livraison',
        value: formatDate(permit.delivered_at),
      });
    }

    if (permit?.card_issued_at) {
      dates.push({
        icon: 'mdi:card-account-details',
        label: "Date d'Émission",
        value: formatDate(permit.card_issued_at),
      });
    }

    if (permit?.card_expires_at) {
      dates.push({
        icon: 'mdi:calendar-alert',
        label: "Date d'Expiration",
        value: formatDate(permit.card_expires_at),
      });
    }

    return dates;
  };

  const getResponsibles = () => {
    const responsibles = [];

    if (permit?.submitted_by) {
      responsibles.push({
        icon: 'mdi:account-arrow-up',
        label: 'Soumis par',
        value: submitted_by,
      });
    }

    if (permit?.validated_by) {
      responsibles.push({
        icon: 'mdi:account-check',
        label: 'Validé par',
        value: validated_by,
      });
    }

    if (permit?.rejected_by) {
      responsibles.push({
        icon: 'mdi:account-cancel',
        label: 'Rejeté par',
        value: rejected_by,
      });
    }

    return responsibles;
  };

  const relevantDates = getRelevantDates();
  const responsibles = getResponsibles();

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
              mb: 3,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            <Iconify icon="mdi:card-account-details" width={{ xs: 24, sm: 28 }} sx={{ mr: 1.5 }} />
            Informations Du Permis
          </Typography>
          <Stack direction="row" spacing={1}>
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
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ================== Informations ================== */}
        <Box
          sx={{
            mb: relevantDates.length > 0 || responsibles.length > 0 ? 3 : 0,
          }}
        >
          <SectionTitle title="informations" />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <InfoItem icon="mdi:card-account-details" label="Type de Permis" value={permit} />
            <InfoItem
              icon="mdi:calendar-start"
              label="Date de création"
              value={fDate(created_at)}
            />
            <InfoItem icon="mdi:calendar-end" label="Date d'expiration" value={fDate(expired_at)} />
          </Box>
        </Box>
        {/* ================== Section Dates importantes (selon statut) ================== */}
        {relevantDates.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <SectionTitle title="Suivi du Permis" />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {relevantDates.map((date, index) => (
                  <InfoItem key={index} icon={date.icon} label={date.label} value={date.value} />
                ))}
              </Box>
            </Box>
          </>
        )}
        {/* ================== Section Responsables ================== */}
        {responsibles.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <SectionTitle title="Responsables" />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {responsibles.map((item, index) => (
                  <InfoItem key={index} icon={item.icon} label={item.label} value={item.value} />
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Card>
  );

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Stack spacing={3}>{renderAbout}</Stack>
    </Grid>
  );
}

import PropTypes from 'prop-types';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Card, Grid, Typography, Skeleton } from '@mui/material';
import { Iconify } from 'src/components/iconify';

// Styles personnalisés
const StatCard = styled(Card)(({ theme, color = 'primary' }) => ({
  padding: 0,
  height: '100%',
  background: alpha(theme.palette.background.paper, 0.1),
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.mode === 'dark'
    ? alpha(theme.palette.divider, 0.1) 
    : alpha(theme.palette.divider, 0.15)}`,
  boxShadow: theme.palette.mode === 'dark'
    ? `0 4px 12px 0 ${alpha(theme.palette.common.black, 0.1)}` 
    : `0 4px 12px 0 ${alpha(theme.palette.common.black, 0.04)}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.2),
    boxShadow: `0 6px 18px 0 ${alpha(theme.palette.common.black, 0.06)}`,
    transform: 'translateY(-2px)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    backgroundColor: theme.palette[color].main,
  }
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
  display: 'inline-block',
  letterSpacing: '0.5px',
  fontSize: '1.75rem',
  lineHeight: 1.1
}));

// Composant pour une carte de statistique individuelle
const StatisticCard = ({ title, value, icon, color, loading }) => {
  const theme = useTheme();
  console.log("Voici le theme : ", theme.palette.mode);
  if (loading) {
    return (
      <Card sx={{ 
        p: 2, 
        height: '100%', 
        minHeight: 100, 
        borderRadius: 1,
        backgroundColor: alpha(theme.palette.background.paper, 0.1),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}>
        <Skeleton variant="text" width="60%" height={30} />
        <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
      </Card>
    );
  }

  return (
    <StatCard color={color}>
      <Box sx={{ p: 2, pl: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : undefined, 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px', 
              fontSize: '0.75rem',
              mb: 0.5
            }}>
              {title}
            </Typography>
            <StatNumber>{value}</StatNumber>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette[color].main, 0.1),
            borderRadius: '50%',
            width: 48,
            height: 48,
            mr: 1,
            border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`
          }}>
            <Iconify icon={icon} width={24} height={24} sx={{ color: theme.palette[color].main }} />
          </Box>
        </Box>
      </Box>
    </StatCard>
  );
};

StatisticCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  loading: PropTypes.bool
};

// Composant principal qui regroupe toutes les cartes de statistiques
export default function AgentStatCards({ stats, loading }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <StatisticCard 
          title="Total des déclarations" 
          value={stats.total} 
          icon="mdi:file-document-multiple"
          color="primary"
          loading={loading}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <StatisticCard 
          title="Non soumises" 
          value={stats.pending} 
          icon="mdi:clock-time-four-outline"
          color="secondary"
          loading={loading}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <StatisticCard 
          title="Rejetées" 
          value={stats.rejected} 
          icon="mdi:alert-circle-outline"
          color="error"
          loading={loading}
        />
      </Grid>
    </Grid>
  );
}

AgentStatCards.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    pending: PropTypes.number,
    rejected: PropTypes.number
  }),
  loading: PropTypes.bool
};

AgentStatCards.defaultProps = {
  stats: {
    total: 0,
    pending: 0,
    rejected: 0
  },
  loading: false
};

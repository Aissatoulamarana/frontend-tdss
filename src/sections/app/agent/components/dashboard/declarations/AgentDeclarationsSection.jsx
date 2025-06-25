import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { Box, Card, Alert, Button, Skeleton, Typography } from '@mui/material';
import { AgentRecentDeclarations } from '../../AgentTables';

// Composant de titre de section
const SectionTitle = ({ children, ...other }) => (
  <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      '& .icon': {
        mr: 1,
      },
    }}
    {...other}
  >
    {children}
  </Typography>
);

SectionTitle.propTypes = {
  children: PropTypes.node,
};

export default function AgentDeclarationsSection({ declarations, loading, error, onRetry }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
      ></Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={onRetry} sx={{ ml: 2 }}>
            Réessayer
          </Button>
        </Alert>
      )}

      {loading ? (
        <Card
          sx={{
            p: 3,
            height: '100%',
            minHeight: 300,
            borderRadius: 1,
            boxShadow: (theme) => `0 0 2px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        >
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={50}
            sx={{ mt: 2, borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ mt: 2, borderRadius: 1 }}
          />
        </Card>
      ) : (
        <Card
          sx={{
            p: 0,
            height: '100%',
            borderRadius: 1,
            boxShadow: (theme) => `0 0 2px ${alpha(theme.palette.common.black, 0.2)}`,
            overflow: 'hidden',
          }}
        >
          <AgentRecentDeclarations declarations={declarations} />
        </Card>
      )}
    </Box>
  );
}

AgentDeclarationsSection.propTypes = {
  declarations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      reference: PropTypes.string,
      date: PropTypes.string,
      company: PropTypes.string,
      status: PropTypes.string,
      employees: PropTypes.number,
      title: PropTypes.string,
      comment: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRetry: PropTypes.func,
};

AgentDeclarationsSection.defaultProps = {
  declarations: [],
  loading: false,
  error: '',
  onRetry: () => {},
};

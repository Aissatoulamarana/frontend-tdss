import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

// Les données utilisateur seront obtenues via le contexte d'authentification

// Données mockées pour le développement
const ALL_SUMMARY_DATA = {
  totalEmployees: [
    { agentId: 'AGENT-001', company: 'Entreprise ABC', count: 18 },
    { agentId: 'AGENT-001', company: 'Société XYZ', count: 12 },
    { agentId: 'AGENT-002', company: 'Compagnie 123', count: 30 },
  ],
  totalPayments: [
    { agentId: 'AGENT-001', company: 'Entreprise ABC', count: 48 },
    { agentId: 'AGENT-001', company: 'Société XYZ', count: 5 },
    { agentId: 'AGENT-002', company: 'Compagnie 123', count: 15 },
  ],
  pendingPayments: [
    { agentId: 'AGENT-001', company: 'Entreprise ABC', count: 18 },
    { agentId: 'AGENT-001', company: 'Société XYZ', count: 3 },
    { agentId: 'AGENT-002', company: 'Compagnie 123', count: 10 },
  ],
  totalInvoices: [
    { agentId: 'AGENT-001', company: 'Entreprise ABC', count: 67 },
    { agentId: 'AGENT-001', company: 'Société XYZ', count: 2 },
    { agentId: 'AGENT-002', company: 'Compagnie 123', count: 5 },
  ],
};

// ----------------------------------------------------------------------

export function AgentWidgetSummary({ title, total, icon, color = 'primary', sx, ...other }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        color: theme.palette.common.white,
        bgcolor: isDarkMode 
          ? theme.palette[color].dark
          : theme.palette[color].main,
        borderRadius: 2,
        border: `1px solid ${theme.palette[color].main}`,
        transition: 'all 0.3s ease-in-out',
        height: 140, // Hauteur fixe pour tous les widgets
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
          bgcolor: isDarkMode 
            ? theme.palette[color].main
            : theme.palette[color].dark,
        },
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <div>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.palette.common.white,
                fontWeight: 600,
                mb: 0.5,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                opacity: 0.9,
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                color: theme.palette.common.white,
                fontWeight: 800,
                fontSize: '1.8rem',
                lineHeight: 1.2,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {fShortenNumber(total)}
            </Typography>
          </div>

          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.common.white,
              bgcolor: alpha(theme.palette.common.white, 0.2),
              border: `2px solid ${alpha(theme.palette.common.white, 0.5)}`,
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
                bgcolor: alpha(theme.palette.common.white, 0.25),
                boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
              }
            }}
          >
            {icon}
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}

AgentWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};

// ----------------------------------------------------------------------

// Fonction utilitaire pour filtrer les données par agent et entreprise
export function getAgentSummaryData(dataType, companyFilter = 'all', userId = 'AGENT-001') {
  // Filtrer d'abord par agent
  const agentData = ALL_SUMMARY_DATA[dataType].filter(item => item.agentId === userId);
  
  // Appliquer le filtre d'entreprise si nécessaire
  if (companyFilter !== 'all') {
    return agentData
      .filter(item => item.company === companyFilter)
      .reduce((sum, item) => sum + item.count, 0);
  }
  
  // Sinon, retourner la somme pour toutes les entreprises de l'agent
  return agentData.reduce((sum, item) => sum + item.count, 0);
}
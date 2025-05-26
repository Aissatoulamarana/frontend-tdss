import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useAuthContext } from 'src/auth/hooks';
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
        boxShadow: isDarkMode ? '0 4px 8px 0 rgba(0, 0, 0, 0.4)' : '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        color: isDarkMode 
          ? theme.palette[color].lighter 
          : theme.palette[color].darker,
        bgcolor: isDarkMode 
          ? alpha(theme.palette[color].dark, 0.3) 
          : alpha(theme.palette[color].main, 0.08),
        borderRadius: 1,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isDarkMode ? '0 6px 10px 0 rgba(0, 0, 0, 0.5)' : '0 4px 8px 0 rgba(0, 0, 0, 0.15)',
          bgcolor: isDarkMode 
            ? alpha(theme.palette[color].dark, 0.4) 
            : alpha(theme.palette[color].main, 0.12),
        },
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <div>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: isDarkMode 
                  ? theme.palette[color].lighter 
                  : theme.palette[color].darker,
                fontWeight: 600,
                mb: 0.5,
                fontSize: '0.85rem',
                opacity: 0.9
              }}
            >
              {title}
            </Typography>

            <Typography 
              variant="h3" 
              sx={{ 
                color: isDarkMode 
                  ? theme.palette.common.white 
                  : theme.palette[color].darker,
                fontWeight: 700,
                fontSize: '2rem'
              }}
            >
              {fShortenNumber(total)}
            </Typography>
          </div>

          <Box
            sx={{
              width: 50,
              height: 50,
              display: 'flex',
              borderRadius: '8px',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDarkMode 
                ? theme.palette[color].lighter 
                : theme.palette[color].darker,
              bgcolor: isDarkMode 
                ? alpha(theme.palette[color].dark, 0.5) 
                : alpha(theme.palette[color].main, 0.15),
              boxShadow: isDarkMode ? '0 2px 6px rgba(0,0,0,0.3)' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                bgcolor: isDarkMode 
                  ? alpha(theme.palette[color].dark, 0.6) 
                  : alpha(theme.palette[color].main, 0.2),
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
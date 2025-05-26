import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

// Contexte utilisateur simulé (à remplacer par un vrai contexte d'authentification)
const CURRENT_USER = {
  id: 'AGENT-001',
  name: 'Jean Dupont',
  company: 'Entreprise ABC',
  role: 'agent',
};

// Données mockées pour le développement
const ALL_SUMMARY_DATA = {
  totalEmployees: [
    { agentId: 'AGENT-001', company: 'Entreprise ABC', count: 18765 },
    { agentId: 'AGENT-001', company: 'Société XYZ', count: 12 },
    { agentId: 'AGENT-002', company: 'Compagnie 123', count: 30 },
  ],
  totalPayments: [
    { agentId: 'AGENT-001', company: 'Entreprise ABC', count: 4876 },
    { agentId: 'AGENT-001', company: 'Société XYZ', count: 5 },
    { agentId: 'AGENT-002', company: 'Compagnie 123', count: 15 },
  ],
  pendingPayments: [
    { agentId: 'AGENT-001', company: 'Entreprise ABC', count: 18765 },
    { agentId: 'AGENT-001', company: 'Société XYZ', count: 3 },
    { agentId: 'AGENT-002', company: 'Compagnie 123', count: 10 },
  ],
  totalInvoices: [
    { agentId: 'AGENT-001', company: 'Entreprise ABC', count: 678 },
    { agentId: 'AGENT-001', company: 'Société XYZ', count: 2 },
    { agentId: 'AGENT-002', company: 'Compagnie 123', count: 5 },
  ],
};

// ----------------------------------------------------------------------

export function AgentWidgetSummary({ title, total, icon, color = 'primary', sx, ...other }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        boxShadow: 0,
        color: theme.palette[color].darker,
        bgcolor: alpha(theme.palette[color].main, 0.12),
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <div>
            <Typography variant="subtitle2">{title}</Typography>

            <Typography variant="h3">{fShortenNumber(total)}</Typography>
          </div>

          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1.5,
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette[color].darker,
              bgcolor: alpha(theme.palette[color].dark, 0.12),
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
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};

// ----------------------------------------------------------------------

// Fonction utilitaire pour filtrer les données par agent et entreprise
export function getAgentSummaryData(dataType, companyFilter = 'all') {
  // Filtrer d'abord par agent
  const agentData = ALL_SUMMARY_DATA[dataType].filter(item => item.agentId === CURRENT_USER.id);
  
  // Appliquer le filtre d'entreprise si nécessaire
  if (companyFilter !== 'all') {
    return agentData
      .filter(item => item.company === companyFilter)
      .reduce((sum, item) => sum + item.count, 0);
  }
  
  // Sinon, retourner la somme pour toutes les entreprises de l'agent
  return agentData.reduce((sum, item) => sum + item.count, 0);
}
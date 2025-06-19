import React from "react";
import { Card, CardContent, Typography, Button, Box, Divider } from "@mui/material";
import { Icon } from "@iconify/react";
import { paths } from 'src/routes/paths';
import { status } from "nprogress";
import { fDate } from "src/utils/format-time";
import { fGNF } from "src/utils/format-number";
import { fCurrency } from "src/utils/format-number";

const DashboardAdmin = ({lastData}) => {
  
  const latestYear = "2025";
  const latestMonth = "Déc";
   const data = lastData || {};

  function formatMontantParDevise(amount, devise) {
  if (!amount || isNaN(amount)) return "-";
  switch (devise) {
    case "Franc Guinéen":
      return fGNF(amount);
    case "US dollar":
      return fCurrency(amount); // utilise `$` ou `€` selon config
    default:
      return `${parseFloat(amount).toLocaleString()} ${devise || ''}`;
  }
}

const statusDec = {
    unsubmitted: 'Non soumise',
    submitted: 'Soumise',
    rejected: 'Rejetée',
    validated: 'Validée',
    billed: 'Facturée',
  };

  const statusFac = {
    unpaid: 'Non Payée',
    paid: 'Payée',
   
  };

  const displayData = [
    {
      title: " Dernières Déclarations",
      icon: <Icon icon="mdi:file-document-outline" style={{ color: '#1e88e5', fontSize: 28 }} />,
      items: data.declarations,
      renderItem: (item) => (
        <>
          <Typography variant="subtitle2">{item.number} - {item.company}</Typography>
          <Typography variant="body2">Employés: {item.nb_employees}</Typography>
          <Typography variant="body2">Status: {statusDec[item.status] || 'Inconnu'} </Typography>
        </>
      ),
      link: paths.dashboard.declaration.list
    },
    {
      title: " Dernières Factures",
      icon: <Icon icon="mdi:receipt" style={{ color: '#43a047', fontSize: 28 }} />,
      items: data.factures,
      renderItem: (item) => (
        <>
          <Typography variant="subtitle2">{item.number} - {item.client}</Typography>
          <Typography variant="body2">Montant: {fGNF(item.amount)}</Typography>
          <Typography variant="body2">Statut:  {statusFac[item.status] || 'Inconnu'}</Typography>
        </>
      ),
      link: paths.dashboard.factures.list
    },
    {
      title: "Derniers Paiements",
      icon: <Icon icon="mdi:credit-card-outline" style={{ color: '#8e24aa', fontSize: 28 }} />,
      items: data.payments,
      renderItem: (item) => (
        <>
          <Typography variant="subtitle2">{item.number} - {item.payer}</Typography>
          <Typography variant="body2"> Montant: {formatMontantParDevise(item.amount, item.devise)} </Typography>
           <Typography variant="body2">Date: {fDate (item.created_on)}</Typography>
        </>
      ),
      link: paths.dashboard.paiements.list
    },
  ];

  return (
    <Box display="flex" gap={2} flexWrap="wrap" p={2}>
      {displayData.map(({ title, icon, items, renderItem, link }, idx) => (
        <Card key={idx} sx={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                {icon}
                <Typography variant="h6">{title}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{items?.length} total</Typography>
            </Box>
            {items?.slice(0, 3).map((item, i) => (
              <Box key={i} mb={2}>
                {renderItem(item)}
                {i < 2 && <Divider sx={{ mt: 1 }} />}
              </Box>
            ))}
            <Box display="flex" justifyContent="flex-end">
              <Button href={link} size="small">Voir tout</Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DashboardAdmin;

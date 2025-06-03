import React from "react";
import { Card, CardContent, Typography, Button, Box, Divider } from "@mui/material";
import { Icon } from "@iconify/react";
import { paths } from 'src/routes/paths';
import { status } from "nprogress";

const DashboardAdmin = () => {
  const allMockData = {
    "2025": {
      "Déc": {
        declarations: [
          {
            numero: "DD001",
            entreprise: "Entreprise Omega",
            nbEmployes: 18,
            status: "validée",
          },
          {
            numero: "DD002",
            entreprise: "Entreprise Delta",
            nbEmployes: 12,
           status: "brouillon",
          },
          {
            numero: "DD003",
            entreprise: "Entreprise Alpha",
            nbEmployes: 20,
            status: "non-soumise",
          },
        ],
        factures: [
          {
            numero: "FD001",
            montant: 450000,
            statut: "payé",
            entreprise: "Entreprise Omega",
          },
          {
            numero: "FD002",
            montant: 520000,
            statut: "non payé",
            entreprise: "Entreprise Delta",
          },
          {
            numero: "FD003",
            montant: 500000,
            statut: "non payé",
            entreprise: "Entreprise Alpha",
          },
        ],
        paiements: [
          {
            numero: "PD001",
            montant: 450000,
            entreprise: "Entreprise Omega",
            date : "2025-12-01",
          },
          {
            numero: "PD002",
            montant: 320000,
            entreprise: "Entreprise Alpha",
            date : "2025-12-05",
          },
           {
            numero: "PD003",
            montant: 420000,
            entreprise: "Entreprise Alpha",
            date : "2025-12-07",
          },
        ],
      },
    },
  };

  const latestYear = "2025";
  const latestMonth = "Déc";
  const data = allMockData[latestYear][latestMonth];

  const displayData = [
    {
      title: " Dernières Déclarations",
      icon: <Icon icon="mdi:file-document-outline" style={{ color: '#1e88e5', fontSize: 28 }} />,
      items: data.declarations,
      renderItem: (item) => (
        <>
          <Typography variant="subtitle2">{item.numero} - {item.entreprise}</Typography>
          <Typography variant="body2">Employés: {item.nbEmployes}</Typography>
          <Typography variant="body2">Status: {item.status} </Typography>
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
          <Typography variant="subtitle2">{item.numero} - {item.entreprise}</Typography>
          <Typography variant="body2">Montant: {item.montant.toLocaleString()} FCFA</Typography>
          <Typography variant="body2">Statut: {item.statut}</Typography>
        </>
      ),
      link: paths.dashboard.factures.list
    },
    {
      title: "Derniers Paiements",
      icon: <Icon icon="mdi:credit-card-outline" style={{ color: '#8e24aa', fontSize: 28 }} />,
      items: data.paiements,
      renderItem: (item) => (
        <>
          <Typography variant="subtitle2">{item.numero} - {item.entreprise}</Typography>
          <Typography variant="body2">Montant: {item.montant.toLocaleString()} FCFA</Typography>
           <Typography variant="body2">Date: {item.date}</Typography>
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
              <Typography variant="body2" color="text.secondary">{items.length} total</Typography>
            </Box>
            {items.slice(0, 3).map((item, i) => (
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

'use client';
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  Avatar
} from '@mui/material';
import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { FactureDetails } from '../facture-details';

export function FactureDetailsView({ facture }) {
  if (!facture) {
    return <Typography variant="h6">Aucune facture à afficher.</Typography>;
  }

  const {
    numero_facture,
    create_date,
    montant_usd,
    montant_gnf,
    statut,
    payeur,
    client,
    dec_date
  } = facture;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={facture?.numero_facture}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Factures', href: paths.dashboard.factures.list },
          { name: facture?.numero_facture },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <FactureDetails facture={facture} />
      {/* <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader 
          title={`Facture: ${numero_facture}`}
          subheader={`Créée le: ${fDate(create_date)}`}
          sx={{ backgroundColor: 'primary.light' }}
        />
        <CardContent>
          <Grid container spacing={3}> */}
      {/* Informations de la facture */}
      {/* <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations de la Facture
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>Montant (USD):</strong> {(montant_usd)}
                </Typography>
                <Typography variant="body1">
                  <strong>Montant (GNF):</strong> {(montant_gnf)}
                </Typography>
                <Typography variant="body1">
                  <strong>Statut:</strong> {statut}
                </Typography>
                <Typography variant="body1">
                  <strong>Date de declaration:</strong> {fDate(create_date)}
                </Typography>
              </Box>
            </Grid> */}

      {/* Informations du payeur */}
      {/* <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informations du Payeur
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">
                  <strong>Nom:</strong> {payeur?.nom} {payeur?.prenom}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {payeur?.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Téléphone:</strong> {payeur?.telephone}
                </Typography>
                <Typography variant="body1">
                  <strong>Pays:</strong> {payeur?.pays}
                </Typography>
                <Typography variant="body1">
                  <strong>Numéro de compte:</strong> {payeur?.numero_compte}
                </Typography>
                <Typography variant="body1">
                  <strong>Date d'enregistrement:</strong> {fDate(payeur?.date_enregistrement)}
                </Typography>
              </Box>
            </Grid> */}

      {/* Informations de l'utilisateur */}
      {/* <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informations de l'Utilisateur
              </Typography>
              <Divider />
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={user?.profile_image} 
                  alt={user?.username} 
                  sx={{ width: 56, height: 56, mr: 2 }} 
                />
                <Box>
                  <Typography variant="body1">
                    <strong>Nom d'utilisateur:</strong> {user?.username}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Téléphone:</strong> {user?.phone_number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Adresse:</strong> {user?.address}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Entreprise:</strong> {user?.company}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Rôle:</strong> {user?.role}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> {user?.status}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box> */}
    </DashboardContent>
  );
}

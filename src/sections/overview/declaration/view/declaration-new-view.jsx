'use client';

import { useState, useEffect } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { ImportFilesButton } from '../components/button-import-excel';
import { DeclarationNew } from '../declaration-new';

// ----------------------------------------------------------------------

export function DeclarationNewView() {
  const [formData, setFormData] = useState([]); // État pour stocker les données importées
  const [type, setType] = useState('Nouvelle ');
  const [openDialog, setOpenDialog] = useState(false); // État pour le modal

  useEffect(() => {
    // Récupérer le dernier segment de l'URL
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1] || '';

    // Définir un mapping des types
    const typeMapping = {
      new: 'Nouvelle ',
      renew: 'Renouvellement ',
      duplica: 'Duplicata ',
    };

    const newType = typeMapping[lastSegment] || 'Déclaration Inconnue';
    setType(newType);

    // Vérifier si le type est "Duplicata" ou "Renouvellement"
    if (newType === 'Renouvellement ' || newType === 'Duplicata ') {
      setOpenDialog(true);
    }

  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleImportData = (importedData) => {
    setFormData(importedData); // Met à jour l'état avec les données importées
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={type}
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Déclarations', href: paths.dashboard.declaration.list },
          { name: type },
        ]}
        sx={{ mb: { xs: 3, md: 2 } }} // Marges pour les breadcrumbs
      />

      <div style={{ marginBottom: '20px' }}>
        <ImportFilesButton onImport={handleImportData} />
      </div>

      {/* Ajout d'espace sous ImportFilesButton */}
      <DeclarationNew type={type} formData={formData} setFormData={setFormData} />

      {/* MODAL POUR AVERTIR L'UTILISATEUR */}
      <Dialog
        open={openDialog}
        onClose={() => { }}
        sx={{
          '& .MuiDialog-paper': {
            width: '60%', // Réduction de la largeur
            borderRadius: '12px', // Coins arrondis pour un look plus moderne
            padding: '10px' // Ajout de padding
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          Information Importante
        </DialogTitle>
        <DialogContent sx={{ fontSize: '14px', textAlign: 'center' }}>
          Pour faire un <strong>{type}</strong>, vous devez entrer le numéro d'identifiant de la personne.
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            color="primary"
            sx={{ borderRadius: '8px', padding: '6px 20px', fontSize: '14px' }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </DashboardContent>
  );
}
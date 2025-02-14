'use client';

import { useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ImportFilesButton } from '../components/button-import-excel';
import { DeclarationNew } from '../declaration-new';

// ----------------------------------------------------------------------

export function DeclarationNewView() {
  const [formData, setFormData] = useState([]); // État pour stocker les données importées

  const handleImportData = (importedData) => {
    setFormData(importedData); // Met à jour l'état avec les données importées
  };
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Nouvelle Déclarations"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Déclarations', href: paths.dashboard.declaration.list },
          { name: 'Nouvelle Déclaration' },
        ]}
        sx={{ mb: { xs: 3, md: 2 } }} // Marges pour les breadcrumbs
      />
      <div style={{ marginBottom: '20px' }}>
        <ImportFilesButton onImport={handleImportData} />
      </div>
      {/* Ajout d'espace sous ImportFilesButton */}
      <DeclarationNew formData={formData} setFormData={setFormData} />
    </DashboardContent>
  );
}
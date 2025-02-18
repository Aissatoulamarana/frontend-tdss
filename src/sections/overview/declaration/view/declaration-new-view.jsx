'use client';

import { useState, useEffect } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';
import { useLocation } from 'react-router';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ImportFilesButton } from '../components/button-import-excel';
import { DeclarationNew } from '../declaration-new';

// ----------------------------------------------------------------------

export function DeclarationNewView() {
  // const [formData, setFormData] = useState([]); // État pour stocker les données importées
  const [type, setType] = useState('Nouvelle ');

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

    // Met à jour le state en fonction du type trouvé
    setType(typeMapping[lastSegment] || 'Déclaration Inconnue');
  }, []);

  ;

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
      <DeclarationNew type={type} />
    </DashboardContent>
  );
}
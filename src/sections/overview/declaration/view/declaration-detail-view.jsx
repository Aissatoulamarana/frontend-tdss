'use client';
import { useState, useEffect } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DeclarationDetails } from '../declaration-detail';

import API from 'src/utils/api';
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export function DeclarationDetailsView({ slug }) {
  const [declaration, setDeclaration] = useState(null); // État pour stocker la déclaration
  const [employee, setEmployee] = useState([]); // État pour stocker les employés
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [loading, setLoading] = useState(true); // État pour gérer le chargement

  useEffect(() => {
    const fetchDeclaration = async () => {
      try {
        const response = await axios.get(API.detailsDeclaration(slug)); // Remplacez par votre API
        setDeclaration(response.data); // Mettez à jour l'état avec les données de la déclaration
        console.log('Données de la déclaration:', response.data); // Affichez les données dans la console
      } catch (error) {
        setError(error.message || 'Erreur lors du chargement des données'); // Gérer les erreurs
      } finally {
        setLoading(false); // Fin du chargement
      }
    };
    fetchDeclaration(); // Appel de la fonction pour récupérer la déclaration
  }, [slug]);


  useEffect(() => {
    const fetchEmployees = async () => {
      if (!declaration || !declaration.slug) {
        toast("La déclaration n'est pas définie.");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(API.Employe(declaration.slug));
        const employees = response.data.results;
        setEmployee(employees);
      } catch (error) {
        console.error('Erreur lors de la récupération des employés :', error);
      } finally {
        setLoading(false);
      }
    };

    if (declaration && declaration.slug) {
      fetchEmployees();
    }
  }, [declaration]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={declaration?.declaration_number}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Declarations', href: paths.dashboard.declaration.list },
          { name: declaration?.reference },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DeclarationDetails declaration={declaration} employees={employee} />
    </DashboardContent>
  );
}
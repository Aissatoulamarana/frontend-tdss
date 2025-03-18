'use client';

import { useEffect, useState } from 'react'
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-edit-form';

import API from 'src/utils/api';
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export function UserEditView({ slug }) {
  const [user, setUser] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(API.userDetails(slug));
        setUser(response.data);
        console.log('Données user a modifier ', response.data)
      } catch (error) {
        setError(error.message || 'Erreurs lors du chargement des données');
      } finally {
        setLoading(false);
      }

    }
    fetchUser();
  }, [slug]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Modifier"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Utilisateurs', href: paths.dashboard.user.root },
          { name: user?.first_name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm currentUser={user} />
    </DashboardContent>
  );
}

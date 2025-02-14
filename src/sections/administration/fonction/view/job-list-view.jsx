'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API from 'src/utils/api';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

// import { orderBy } from 'src/utils/helper';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { JobList } from '../job-list';
import { JobSort } from '../job-sort';
import { JobSearch } from '../job-search';

import { JobFiltersResult } from '../job-filters-result';

// ----------------------------------------------------------------------

export function JobListView() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tableData, setTableData] = useState([]);
  const search = useSetState({ query: '', results: [] });

  useEffect(() => {
    const fetchFonctions = async () => {
      try {
        const response = await axios.get(API.listFonctions()); // Remplacez par votre endpoint réel
        setTableData(response.data || []); // Assurez-vous que l'API renvoie un tableau
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchFonctions();
  }, []);

  const dataFiltered = applyFilter({ inputData: tableData, sortBy });

  const notFound = !dataFiltered.length;

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue) => {
      search.setState({ query: inputValue });

      if (inputValue) {
        const results = tableData.filter((job) =>
          job.name.toLowerCase().includes(inputValue.toLowerCase())
        );

        search.setState({ results });
      }
    },
    [tableData, search]
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <JobSearch search={search} onSearch={handleSearch} />

      <Stack direction="row" spacing={1} flexShrink={0}>
        {/* <JobSort sort={sortBy} onSort={handleSortBy} sortOptions /> */}
      </Stack>
    </Stack>
  );

  const renderResults = <JobFiltersResult totalResults={dataFiltered.length} />;

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Listes des fonctions"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Fonction', href: paths.dashboard.fonction.root },
          { name: 'Listes des fonctions' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.fonction.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Nouvelle Fonction
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}s {renderResults}
      </Stack>

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <JobList jobs={dataFiltered} />
    </DashboardContent>
  );
}

const applyFilter = ({ inputData, sortBy }) => {
  // Sort by
  // if (sortBy === 'latest') {
  //   inputData = orderBy(inputData, ['created_at'], ['desc']);
  // }

  // if (sortBy === 'oldest') {
  //   inputData = orderBy(inputData, ['created_at'], ['asc']);
  // }

  // if (sortBy === 'popular') {
  //   inputData = orderBy(inputData, ['total_views'], ['desc']);
  // }

  return inputData;
};
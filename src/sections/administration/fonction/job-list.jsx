import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';
import API from 'src/utils/api';
import { toast } from 'src/components/snackbar';
import { JobItem } from './job-item';

// ----------------------------------------------------------------------

export function JobList({ jobs, pagination, onChangePage }) {
  const router = useRouter();

  /* const handleView = useCallback(
    (slug) => {
      router.push(paths.dashboard.job.details(slug));
    },
    [router]
  ); */

  const handleEdit = useCallback(
    (slug) => {
      router.push(paths.dashboard.fonction.edit(slug));
    },
    [router]
  );

  // const handleDelete = useCallback((slug) => {
  //   console.info('DELETE', slug);
  // }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(API.deleteFonction(slug));
      if (response) {
        toast.success('fonction supprimée avec succès !');
      } else {
        console.error('Erreur lors de la suppression:', response.data.error);
        toast.error(`Erreur : ${response.data.error}`);
      }
    } catch (error) {
      console.error('Erreur réseau ou serveur:', error);
      toast.error('Une erreur est survenue lors de la communication avec le serveur.');
    }
  };

  const handlePageChange = useCallback(
    (event, page) => {
      // Par exemple, l'URL pourrait être modifiée pour inclure ?page=page
      router.push(`${paths.dashboard.fonction.list}?page=${page}`);
    },
    [router]
  );

  const totalPages = pagination.limit ? Math.ceil(pagination.count / pagination.limit) : 1;

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {jobs.map((job) => (
          <JobItem
            key={job.slug}
            job={job}
            onEdit={() => handleEdit(job.slug)}
            onDelete={() => handleDelete(job.slug)}
          />
        ))}
      </Box>

      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={pagination.currentPage || 1}
          onChange={onChangePage}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' }
          }}
        />
      )}
    </>
  );
}

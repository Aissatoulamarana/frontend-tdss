import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { JobItem } from './job-item';
import axios from 'src/utils/axios';
import API from 'src/utils/api';
import toast from 'sonner';

// ----------------------------------------------------------------------

export function JobList({ jobs }) {
  const router = useRouter();

  /* const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.job.details(id));
    },
    [router]
  ); */

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.fonction.edit(id));
    },
    [router]
  );

  // const handleDelete = useCallback((id) => {
  //   console.info('DELETE', id);
  // }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(API.deleteFonction(id));
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

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {jobs.map((job) => (
          <JobItem
            key={job.id}
            job={job}
            onEdit={() => handleEdit(job.id)}
            onDelete={() => handleDelete(job.id)}
          />
        ))}
      </Box>

      {jobs?.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}

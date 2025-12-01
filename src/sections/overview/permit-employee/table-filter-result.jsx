import Chip from '@mui/material/Chip';
import { all } from 'axios';
import { useCallback, useMemo } from 'react';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = {
  new: 'Nouveau',
  renewal: 'Renouvellement',
};

const STATUS_TRANSLATIONS = {
  submitted: 'Soumis',
  validated: 'Validé',
  rejected: 'Rejeté',
  processing: 'En traitement',
  printed: 'Imprimé',
  delivered: 'Livré',
};

export function TableFiltersResult({ filters, onResetPage, totalResults, sx }) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveFilter = useCallback(
    (key, defaultValue = '') => {
      filters.setState({ [key]: defaultValue });
    },
    [filters]
  );

  const handleRemoveType = useCallback(() => {
    handleRemoveFilter('type', 'all');
  }, [handleRemoveFilter]);

  const handleRemoveStatus = useCallback(() => {
    handleRemoveFilter('status', 'all');
  }, [handleRemoveFilter]);

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  const showTypeFilter = useMemo(
    () => filters?.state?.type && filters?.state?.type !== 'all',
    [filters?.state?.type]
  );

  const showStatusFilter = useMemo(
    () => filters.state.status && filters.state.status !== 'all',
    [filters.state.status]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Type:" isShow={showTypeFilter}>
        <Chip
          {...chipProps}
          label={TYPE_OPTIONS[filters?.state?.type]}
          onDelete={handleRemoveType}
        />
      </FiltersBlock>

      {/* Filtre Statut */}
      <FiltersBlock label="Statut:" isShow={showStatusFilter}>
        <Chip
          {...chipProps}
          label={STATUS_TRANSLATIONS[filters.state.status] || filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Keyword:" isShow={!!filters?.state?.name}>
        <Chip {...chipProps} label={filters?.state?.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}

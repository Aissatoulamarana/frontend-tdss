import { useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { fDateRangeShortLabel } from 'src/utils/format-time';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

export function DeclarationreportFilters({
  isDeclaration,
  isFacture,
  isPaiement,
  filters,
  totalResults,
  sx,
}) {
  const handleRemoveFilter = useCallback(
    (key, value = '') => {
      filters.setState({ [key]: value });
    },
    [filters]
  );

  const handleRemoveDate = useCallback(() => {
    filters.setState({ startDate: null, endDate: null });
  }, [filters]);

  const handleRemoveStatus = useCallback(() => {
    handleRemoveFilter('status', 'all');
  }, [handleRemoveFilter]);

  const handleRemovePaymentMethod = useCallback(() => {
    handleRemoveFilter('paymentMethod', 'all');
  }, [handleRemoveFilter]);

  const handleRemoveCompany = useCallback(() => {
    handleRemoveFilter('company', '');
  }, [handleRemoveFilter]);

  const handleRemoveClient = useCallback(() => {
    handleRemoveFilter('client', '');
  }, [handleRemoveFilter]);

  const handleRemoveNumber = useCallback(() => {
    handleRemoveFilter('number', '');
  }, [handleRemoveFilter]);

  const STATUS_TRANSLATIONS = {
    submitted: 'Soumise',
    validated: 'Validée',
    rejected: 'Rejetée',
    billed: 'Facturée',
    unsubmitted: 'Non soumise',
    processing: 'En traitement',
    paid: 'Payée',
    unpaid: 'Non payée',
    pending: 'En attente',
  };

  const PAYMENT_METHOD = {
    transfer: 'Virement',
    cheque: 'Chèque',
    deposit: 'Dépôts',
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={filters.onResetState} sx={sx}>
      <FiltersBlock
        label="Date:"
        isShow={Boolean(filters.state.created_on_before && filters.state.created_on_after)}
      >
        <Chip
          {...chipProps}
          label={fDateRangeShortLabel(
            filters.state.created_on_before,
            filters.state.created_on_after
          )}
          onDelete={handleRemoveDate}
        />
      </FiltersBlock>

      <FiltersBlock label="Status:" isShow={STATUS_TRANSLATIONS[filters.state.status] !== 'all'}>
        <Chip
          {...chipProps}
          label={STATUS_TRANSLATIONS[filters.state.status] || filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      {isPaiement && (
        <FiltersBlock
          label="Méthode de paiement:"
          isShow={PAYMENT_METHOD[filters.state.paymentMethod] !== 'all'}
        >
          <Chip
            {...chipProps}
            label={PAYMENT_METHOD[filters.state.paymentMethod] || filters.state.paymentMethod}
            onDelete={handleRemovePaymentMethod}
            sx={{ textTransform: 'capitalize' }}
          />
        </FiltersBlock>
      )}

      {isDeclaration && (
        <FiltersBlock label="Entreprise:" isShow={!!filters.state.company}>
          <Chip {...chipProps} label={filters.state.company} onDelete={handleRemoveCompany} />
        </FiltersBlock>
      )}

      {isFacture && (
        <FiltersBlock label="Entreprise:" isShow={!!filters.state.client}>
          <Chip {...chipProps} label={filters.state.client} onDelete={handleRemoveClient} />
        </FiltersBlock>
      )}

      <FiltersBlock label="Numéro:" isShow={!!filters.state.number}>
        <Chip {...chipProps} label={filters.state.number} onDelete={handleRemoveNumber} />
      </FiltersBlock>
    </FiltersResult>
  );
}

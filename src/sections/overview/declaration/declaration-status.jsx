import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useFormContext } from 'react-hook-form';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function DeclarationNewEditStatusDate() {
  const { watch } = useFormContext();

  const values = watch();

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <Field.Text
        disabled
        name="invoiceNumber"
        label="Numero de la declaration"
        value={values.declarationNumber}
      />

      <Field.Select
        disabled
        fullWidth
        name="status"
        label="Status"
        InputLabelProps={{ shrink: true }}
      >
        {['paid', 'pending', 'overdue', 'draft'].map((option) => (
          <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
            {option}
          </MenuItem>
        ))}
      </Field.Select>

      <Field.Text
        disabled
        name="invoiceNumber"
        label="Type de la declaration"
        value={values.declarationNumber}
      />

    </Stack>
  );
}
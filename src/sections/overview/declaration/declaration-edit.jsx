import { useState, useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { INVOICE_SERVICE_OPTIONS } from 'src/_mock';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

export function DeclarationEdit() {
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const values = watch();

  const totalOnRow = values.items.map((item) => item.quantity * item.price);
  const subtotal = totalOnRow.reduce((acc, num) => acc + num, 0);
  const totalAmount = subtotal - values.discount - values.shipping + values.taxes;

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [setValue, totalAmount]);

  const handleAdd = () => {
    append({
      fonction: '',
      nom: '',
      nationalité: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleClearService = useCallback(
    (index) => {
      setValue(`items[${index}].quantity`, 1);
      setValue(`items[${index}].price`, 0);
      setValue(`items[${index}].total`, 0);
    },
    [setValue]
  );

  const handleSelectService = useCallback(
    (index, option) => {
      setValue(
        `items[${index}].price`,
        INVOICE_SERVICE_OPTIONS.find((fonction) => fonction.name === option)?.price
      );
      setValue(
        `items[${index}].total`,
        values.items.map((item) => item.quantity * item.price)[index]
      );
    },
    [setValue, values.items]
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Informations Personnelles
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
              <Field.Text
                size="large"
                name={`items[${index}].nom`}
                label="Numero declaration"
                InputLabelProps={{ shrink: true }}
                sx={{ width: '100%' }}
              />
              <Field.Text
                size="large"
                name={`items[${index}].nom`}
                label="Nom & Prénom"
                InputLabelProps={{ shrink: true }}
                sx={{ width: '100%' }}
              />

              <Field.CountrySelect
                size="large"
                name="Nationalités"
                label="Nationalités"
                placeholder="Selectionnez un pays "
                sx={{ width: '100%' }}
              />

              <Field.Select
                name={`items[${index}].fonction`}
                size="large"
                label="Fonction"
                InputLabelProps={{ shrink: true }}
                sx={{ width: '80%' }}
              >
                <MenuItem
                  value=""
                  onClick={() => handleClearService(index)}
                  sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                >
                  None
                </MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {INVOICE_SERVICE_OPTIONS.map((fonction) => (
                  <MenuItem
                    key={fonction.id}
                    value={fonction.name}
                    onClick={() => handleSelectService(index, fonction.name)}
                  >
                    {fonction.name}
                  </MenuItem>
                ))}
              </Field.Select>
            </Stack>

            <Divider flexItem sx={{ borderStyle: 'solid', my: 2 }} />

            <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={() => handleRemove(index)}
            >
              Supprimer
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Add item
        </Button>
      </Stack>
    </Box>
  );
}
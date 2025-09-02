import { Autocomplete, TextField, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';

export function DeviseSelector({ payment, devises, onClick }) {
  const [selectedDevise, setSelectedDevise] = useState(payment?.devise || null);

  const handleChange = (event, newValue) => {
    setSelectedDevise(newValue);
    if (newValue && onClick) {
      onClick(newValue); // on passe l'objet complet
    }
  };
  useEffect(() => {
    if (payment?.devise) {
      const defaultDevise = devises.find((d) => d.slug === payment.devise.slug);
      setSelectedDevise(defaultDevise || null);
    }
  }, [payment, devises]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: '50%', gap: 2 }}
    >
      <Typography
        component="span"
        sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}
      >
        Devise :
      </Typography>

      <Autocomplete
        disableClearable
        options={devises}
        getOptionLabel={(option) => `${option.name} (${option.sign})`}
        value={selectedDevise}
        onChange={handleChange}
        sx={{ minWidth: 150 }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiInputBase-input': {
                p: 0,
              },
            }}
          />
        )}
      />
    </Box>
  );
}

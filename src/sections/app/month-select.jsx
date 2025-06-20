import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const MonthSelect = ({ months, setMonths, allMonths }) => 
 
    <Autocomplete
      multiple
      size="small" 
      options={allMonths}
      getOptionLabel={(option) => option}
      value={months}
      onChange={(event, newValue) => setMonths(newValue)}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Mois"
          placeholder="Choisissez les mois"
        />
      )}
    />;

export default MonthSelect;

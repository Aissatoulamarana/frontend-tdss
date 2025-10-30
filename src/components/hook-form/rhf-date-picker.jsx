import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'src/utils/format-time'; // Ensure this imports the correct dayjs instance
import { Controller, useFormContext } from 'react-hook-form';

import { formatStr } from 'src/utils/format-time';

// ----------------------------------------------------------------------

dayjs.locale('fr'); // Set the default locale to French

export function RHFDatePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            {...field}
            value={dayjs(field.value)}
            onChange={(newValue) =>
              field.onChange(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '')
            }
            format="DD/MM/YYYY"
            slotProps={{
              ...slotProps,
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message ?? slotProps?.textField?.helperText,
                ...slotProps?.textField,
              },
            }}
            {...other}
          />
        )}
      />
    </LocalizationProvider>
  );
}

// ----------------------------------------------------------------------

export function RHFMobileDateTimePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MobileDateTimePicker
            {...field}
            value={dayjs(field.value)}
            onChange={(newValue) => field.onChange(dayjs(newValue).format())}
            format={formatStr.split.dateTime}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message ?? slotProps?.textField?.helperText,
                ...slotProps?.textField,
              },
              ...slotProps,
            }}
            {...other}
          />
        )}
      />
    </LocalizationProvider>
  );
}

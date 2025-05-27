import { RHFCountrySelect } from './rhf-country-select';
import { RHFDatePicker, RHFMobileDateTimePicker } from './rhf-date-picker';
import { RHFPhoneInput } from './rhf-phone-input';
import { RHFSelect, RHFMultiSelect, RHFAutocomplete } from './rhf-select';
import { RHFSwitch } from './rhf-switch';
import { RHFTextField } from './rhf-text-field';
import { RHFUpload, RHFUploadBox, RHFUploadAvatar } from './rhf-upload';
import { RHFCode } from './rhf-code';
// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Select: RHFSelect,
  MobileDateTimePicker: RHFMobileDateTimePicker,
  DatePicker: RHFDatePicker,
  UploadBox: RHFUploadBox,
  UploadAvatar: RHFUploadAvatar,
  Upload: RHFUpload,
  CountrySelect: RHFCountrySelect,
  Switch: RHFSwitch,
  Phone: RHFPhoneInput,
  MultiSelect: RHFMultiSelect,
  Code: RHFCode,
  Autocomplete: RHFAutocomplete,
};

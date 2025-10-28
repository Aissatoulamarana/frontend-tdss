import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Typography } from '@mui/material';

export function FileInputPreview({ label, name, previews, setPreviews, setValue, error, isEdit }) {
  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue(name, file, { shouldValidate: true });
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [name]: previewUrl }));
    }
  };

  const handleRemove = () => {
    setPreviews((prev) => ({ ...prev, [name]: null }));
    setValue(name, null, { shouldValidate: true });
  };

  const currentPreview = previews[name];

  return (
    <Box sx={{ position: 'relative' }}>
      {!currentPreview ? (
        <Button variant="outlined" component="label" fullWidth startIcon={<CloudUploadIcon />}>
          {label}
          <input type="file" hidden accept="image/*,.pdf" onChange={handleChange} />
        </Button>
      ) : (
        <Box
          sx={{
            position: 'relative',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1,
            textAlign: 'center',
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
          }}
        >
          {/* Aperçu PDF ou image */}
          {currentPreview.endsWith('.pdf') ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PictureAsPdfIcon color="error" />
              <Typography variant="body2">PDF sélectionné</Typography>
            </Box>
          ) : (
            <img
              src={currentPreview}
              alt="Aperçu"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />
          )}

          {/* Bouton supprimer */}
          <Tooltip title="Retirer le fichier">
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                bgcolor: 'white',
                boxShadow: 1,
              }}
              onClick={handleRemove}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error.message}
        </Typography>
      )}
    </Box>
  );
}

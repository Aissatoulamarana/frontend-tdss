import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import axios from 'src/utils/axios';
import API from 'src/utils/api';

// ----------------------------------------------------------------------

export function BiometricData({
  declarationSlug,
  employeeSlug,
  picture,
  signature,
  fingerprints_picture,
  onUpdate,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [previewData, setPreviewData] = useState({ type: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [uploadData, setUploadData] = useState({
    picture: null,
    signature: null,
    fingerprints_picture: null,
  });
  const [previewUrls, setPreviewUrls] = useState({
    picture: picture || '',
    signature: signature || '',
    fingerprints_picture: fingerprints_picture || '',
  });

  const handleOpenPreview = (type, url) => {
    setPreviewData({ type, url });
    setOpenPreview(true);
  };

  const handleFileChange = (type, file) => {
    if (file) {
      setUploadData((prev) => ({ ...prev, [type]: file }));
      // Créer une URL de prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (uploadData.picture) {
        formData.append('picture', uploadData.picture);
      }
      if (uploadData.signature) {
        formData.append('signature', uploadData.signature);
      }
      if (uploadData.fingerprints_picture) {
        formData.append('fingerprints_picture', uploadData.fingerprints_picture);
      }

      const response = await axios.patch(
        API.updatePermit(declarationSlug, employeeSlug),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Données biométriques mises à jour avec succès');
      if (onUpdate) {
        onUpdate(response.data);
      }
      setOpenEdit(false);
      setUploadData({
        picture: null,
        signature: null,
        fingerprints_picture: null,
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Erreur lors de la mise à jour des données biométriques';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [declarationSlug, employeeSlug, uploadData, onUpdate]);

  const BiometricCard = ({ type, label, icon, url, color = 'primary' }) => {
    const hasData = !!url;

    return (
      <Card
        sx={{
          p: 3,
          height: '100%',
          boxShadow: (theme) => theme.customShadows?.card,
          transition: 'all 0.3s ease-in-out',
          border: '2px solid',
          borderColor: hasData ? `${color}.lighter` : 'divider',
          '&:hover': {
            boxShadow: (theme) => theme.customShadows?.z8,
            borderColor: `${color}.main`,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: hasData ? `${color}.lighter` : 'action.hover',
              mb: 2,
            }}
          >
            <Iconify
              icon={icon}
              width={40}
              sx={{ color: hasData ? `${color}.main` : 'text.disabled' }}
            />
          </Box>

          {/* Label */}
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              color: 'text.primary',
            }}
          >
            {label}
          </Typography>

          {/* Status */}
          <Chip
            label={hasData ? 'Disponible' : 'Non disponible'}
            size="small"
            color={hasData ? 'success' : 'default'}
            icon={<Iconify icon={hasData ? 'mdi:check' : 'mdi:close'} width={16} />}
            sx={{ mb: 2 }}
          />

          {/* Preview Image */}
          {hasData && (
            <Box
              sx={{
                width: '100%',
                height: 150,
                bgcolor: 'grey.100',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => handleOpenPreview(label, url)}
            >
              <img
                src={url}
                alt={label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ mt: 'auto', width: '100%' }}>
            <Button
              variant={hasData ? 'outlined' : 'contained'}
              color={color}
              fullWidth
              startIcon={<Iconify icon={hasData ? 'mdi:eye' : 'mdi:upload'} />}
              onClick={() => (hasData ? handleOpenPreview(label, url) : setOpenEdit(true))}
              sx={{ fontWeight: 600 }}
            >
              {hasData ? 'Voir' : 'Ajouter'}
            </Button>
          </Box>
        </Box>
      </Card>
    );
  };

  const FileUploadBox = ({ type, label, icon, accept = 'image/*' }) => {
    const currentUrl = previewUrls[type];
    const hasFile = !!uploadData[type] || !!currentUrl;

    return (
      <Box sx={{ width: '100%' }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Iconify icon={icon} width={20} />
          {label}
        </Typography>

        <Box
          sx={{
            border: '2px dashed',
            borderColor: hasFile ? 'primary.main' : 'divider',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            bgcolor: hasFile ? 'primary.lighter' : 'background.neutral',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'primary.lighter',
            },
          }}
        >
          {currentUrl ? (
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  borderRadius: 1,
                  overflow: 'hidden',
                  mb: 2,
                  bgcolor: 'white',
                }}
              >
                <img
                  src={currentUrl}
                  alt={label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Button
                  variant="outlined"
                  size="small"
                  component="label"
                  startIcon={<Iconify icon="mdi:image-edit" />}
                >
                  Changer
                  <input
                    type="file"
                    hidden
                    accept={accept}
                    onChange={(e) => handleFileChange(type, e.target.files[0])}
                  />
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="mdi:delete" />}
                  onClick={() => {
                    setUploadData((prev) => ({ ...prev, [type]: null }));
                    setPreviewUrls((prev) => ({ ...prev, [type]: '' }));
                  }}
                >
                  Supprimer
                </Button>
              </Stack>
            </Box>
          ) : (
            <Button
              variant="outlined"
              component="label"
              startIcon={<Iconify icon="mdi:cloud-upload" />}
              sx={{ width: '100%', py: 3 }}
            >
              Télécharger {label}
              <input
                type="file"
                hidden
                accept={accept}
                onChange={(e) => handleFileChange(type, e.target.files[0])}
              />
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <>
      {/* Carte principale d'affichage */}
      <Card
        sx={{
          p: { xs: 2.5, sm: 3, md: 4 },
          boxShadow: (theme) => theme.customShadows?.card,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            <Iconify icon="mdi:fingerprint" width={{ xs: 24, sm: 28 }} />
            Données Biométriques
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mdi:pencil" />}
            onClick={() => setOpenEdit(true)}
            sx={{ fontWeight: 600 }}
          >
            Modifier
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <BiometricCard
              type="picture"
              label="Photo"
              icon="mdi:camera"
              url={picture}
              color="primary"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <BiometricCard
              type="signature"
              label="Signature"
              icon="mdi:draw"
              url={signature}
              color="secondary"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <BiometricCard
              type="fingerprints_picture"
              label="Empreintes Digitales"
              icon="mdi:fingerprint"
              url={fingerprints_picture}
              color="info"
            />
          </Grid>
        </Grid>

        {!picture && !signature && !fingerprints_picture && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              Aucune donnée biométrique n'a été enregistrée. Cliquez sur "Modifier" pour ajouter les
              informations.
            </Typography>
          </Alert>
        )}
      </Card>

      {/* Dialog de modification */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Modifier les Données Biométriques
            </Typography>
            <IconButton onClick={() => setOpenEdit(false)}>
              <Iconify icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3}>
            <Alert severity="info" icon={<Iconify icon="mdi:information" />}>
              Formats acceptés: JPG, PNG, PDF. Taille maximale: 5MB par fichier.
            </Alert>

            <FileUploadBox
              type="picture"
              label="Photo d'Identité"
              icon="mdi:camera"
              accept="image/*"
            />

            <FileUploadBox type="signature" label="Signature" icon="mdi:draw" accept="image/*" />

            <FileUploadBox
              type="fingerprints_picture"
              label="Empreintes Digitales"
              icon="mdi:fingerprint"
              accept="image/*"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setOpenEdit(false);
              setUploadData({
                picture: null,
                signature: null,
                fingerprints_picture: null,
              });
              setPreviewUrls({
                picture: picture || '',
                signature: signature || '',
                fingerprints_picture: fingerprints_picture || '',
              });
            }}
            color="inherit"
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              loading ||
              (!uploadData.picture && !uploadData.signature && !uploadData.fingerprints_picture)
            }
            startIcon={
              loading ? <CircularProgress size={20} /> : <Iconify icon="mdi:content-save" />
            }
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de prévisualisation */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {previewData.type}
            </Typography>
            <IconButton onClick={() => setOpenPreview(false)}>
              <Iconify icon="mdi:close" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              width: '100%',
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <img
              src={previewData.url}
              alt={previewData.type}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="mdi:download" />}
            component="a"
            href={previewData.url}
            download
          >
            Télécharger
          </Button>
          <Button onClick={() => setOpenPreview(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

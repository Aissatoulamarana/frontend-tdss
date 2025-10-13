import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Iconify } from 'src/components/iconify';
import { toast } from 'sonner';
import axios from 'src/utils/axios';
import API from 'src/utils/api';

const allDocuments = [
  { label: "Déclaration d'attestation", key: 'attestation', icon: 'mdi:file-document' },
  { label: 'Certificat de régulation sociale', key: 'certificat', icon: 'mdi:certificate' },
  { label: 'Contrat de travail', key: 'contrat', icon: 'mdi:file-sign' },
  { label: 'Dossier criminel', key: 'dossierCriminel', icon: 'mdi:police-badge' },
  { label: 'Dossier médical (3 derniers mois)', key: 'dossierMedical', icon: 'mdi:medical-bag' },
  { label: 'Copies des diplômes', key: 'diplomes', icon: 'mdi:school' },
  { label: 'CV', key: 'cv', icon: 'mdi:account-box' },
  { label: 'Passeport', key: 'passeport', icon: 'mdi:passport' },
  { label: 'Plan de panafricanisation', key: 'planPanafricanisation', icon: 'mdi:earth' },
];

export function EmployeeDoc({ documents = [], employee }) {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Mapper les documents existants avec leur type
  const getDocumentByKey = (key) => {
    return documents?.find((doc) => doc.type === key || doc.key === key);
  };

  const openDocument = (document) => {
    if (document?.file || document?.url) {
      const url = document.file || document.url;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('URL du document non disponible');
    }
  };

  const handleAddDocument = (docType) => {
    setSelectedDocType(docType);
    setOpenUploadDialog(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 10MB)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !selectedDocType) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', selectedDocType.key);
      formData.append('label', selectedDocType.label);

      // Remplacer par votre endpoint API
      await axios.post(API.uploadEmployeeDocument(employee?.slug), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Document ajouté avec succès');
      setOpenUploadDialog(false);
      setSelectedFile(null);
      setSelectedDocType(null);

      // Recharger la page ou appeler un callback pour rafraîchir les données
      window.location.reload();
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error(error.response?.data?.message || "Erreur lors de l'ajout du document");
    } finally {
      setUploading(false);
    }
  };

  const handleModifyDocument = (docType, existingDoc) => {
    setSelectedDocType(docType);
    setOpenUploadDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenUploadDialog(false);
    setSelectedFile(null);
    setSelectedDocType(null);
  };

  return (
    <>
      <Card sx={{ overflow: 'visible' }}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Documents de l'employé</Typography>
              <Chip
                label={`${documents?.length || 0}/${allDocuments.length} documents`}
                color={documents?.length === allDocuments.length ? 'success' : 'warning'}
                size="small"
              />
            </Box>

            <Grid container spacing={2}>
              {allDocuments.map((docType) => {
                const existingDoc = getDocumentByKey(docType.key);
                const hasDocument = !!existingDoc;

                return (
                  <Grid key={docType.key} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        p: 2,
                        height: '100%',
                        border: '1px solid',
                        borderColor: hasDocument ? 'success.main' : 'divider',
                        bgcolor: hasDocument ? 'success.lighter' : 'background.paper',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: (theme) => theme.customShadows.z8,
                          borderColor: hasDocument ? 'success.main' : 'primary.main',
                        },
                      }}
                    >
                      <Stack spacing={2}>
                        {/* En-tête avec icône et statut */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1.5,
                              bgcolor: hasDocument ? 'success.main' : 'grey.300',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Iconify icon={docType.icon} width={24} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="subtitle2" noWrap>
                              {docType.label}
                            </Typography>
                            <Chip
                              label={hasDocument ? 'Disponible' : 'Manquant'}
                              size="small"
                              color={hasDocument ? 'success' : 'default'}
                              sx={{ mt: 0.5, height: 20, fontSize: '0.75rem' }}
                            />
                          </Box>
                        </Box>

                        {/* Date d'ajout si disponible */}
                        {hasDocument && existingDoc?.created_at && (
                          <Typography variant="caption" color="text.secondary">
                            Ajouté le {new Date(existingDoc.created_at).toLocaleDateString('fr-FR')}
                          </Typography>
                        )}

                        {/* Actions */}
                        <Stack direction="row" spacing={1}>
                          {hasDocument ? (
                            <>
                              <Tooltip title="Ouvrir le document">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="primary"
                                  startIcon={<Iconify icon="mdi:open-in-new" />}
                                  onClick={() => openDocument(existingDoc)}
                                  fullWidth
                                >
                                  Ouvrir
                                </Button>
                              </Tooltip>
                              <Tooltip title="Remplacer le document">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleModifyDocument(docType, existingDoc)}
                                  sx={{
                                    border: '1px solid',
                                    borderColor: 'info.main',
                                  }}
                                >
                                  <Iconify icon="mdi:pencil" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<Iconify icon="mdi:plus" />}
                              onClick={() => handleAddDocument(docType)}
                              fullWidth
                            >
                              Ajouter
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Box>
      </Card>

      {/* Dialog pour ajouter/modifier un document */}
      <Dialog open={openUploadDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDocType ? `Ajouter - ${selectedDocType.label}` : 'Ajouter un document'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'background.neutral',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.lighter',
                },
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                hidden
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <Iconify icon="mdi:cloud-upload" width={48} sx={{ mb: 2, color: 'text.secondary' }} />
              <Typography variant="body1" gutterBottom>
                {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner un fichier'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PDF, DOC, DOCX, JPG, PNG (Max 10MB)
              </Typography>
            </Box>

            {selectedFile && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'success.lighter',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Iconify icon="mdi:file-check" width={32} color="success.main" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">{selectedFile.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setSelectedFile(null)}>
                  <Iconify icon="mdi:close" />
                </IconButton>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={handleUploadDocument}
            variant="contained"
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

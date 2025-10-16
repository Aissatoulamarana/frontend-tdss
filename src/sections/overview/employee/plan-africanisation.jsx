import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  AlertTitle,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const STATUS_LABELS = {
  RECRUITING: 'En cours de recrutement',
  RESIGNED: 'Employé a démissionné',
  PROBATION: "En période d'essai",
  NO_REPLACEMENT_NEEDED: 'Poste ne requiert pas de suppléant',
};

const STATUS_COLORS = {
  RECRUITING: 'info',
  RESIGNED: 'error',
  PROBATION: 'warning',
  NO_REPLACEMENT_NEEDED: 'default',
};

export function AfricanizationPlanTab({
  employeeId,
  employeeName,
  isExpatriate,
  permitExpiryDate,
}) {
  const [plans, setPlans] = useState([
    {
      id: 'plan-001',
      reference: 'AFR-123456',
      first_name: 'Mamadou',
      last_name: 'Diallo',
      birth_date: '1995-05-12',
      birth_place: 'Conakry',
      residence: 'Ratoma, Conakry',
      hire_date: '2024-02-15',
      phone: '+224 620 55 11 22',
      email: 'mamadou.diallo@example.com',
      id_card_number: 'CIN123456',
      id_card_type: 'CIN',
      duration_months: 12,
      status: 'RECRUITING',
      expatriate_id: 'expat-001',
      expatriate_name: 'John Smith',
      created_at: '2024-02-15T10:00:00Z',
      updated_at: '2024-03-01T10:00:00Z',
      is_active: true,
      permit_expiry_alert: false,
      files: {},
    },
    {
      id: 'plan-002',
      reference: 'AFR-654321',
      first_name: 'Aissatou',
      last_name: 'Bah',
      birth_date: '1993-11-20',
      birth_place: 'Labé',
      residence: 'Kipé, Conakry',
      hire_date: '2023-09-10',
      phone: '+224 622 77 33 44',
      email: 'aissatou.bah@example.com',
      id_card_number: 'CIN987654',
      id_card_type: 'PASSPORT',
      duration_months: 6,
      status: 'PROBATION',
      expatriate_id: 'expat-002',
      expatriate_name: 'Alice Johnson',
      created_at: '2023-09-10T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
      is_active: true,
      permit_expiry_alert: true,
      files: {},
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    birth_place: '',
    residence: '',
    hire_date: '',
    phone: '',
    email: '',
    id_card_number: '',
    id_card_type: '',
    duration_months: '',
    status: '',
  });
  const [files, setFiles] = useState({
    id_card_scan: null,
    contract_scan: null,
    training_plan_scan: null,
  });
  const [previews, setPreviews] = useState({
    id_card_scan: null,
    contract_scan: null,
    training_plan_scan: null,
  });
  const [errors, setErrors] = useState({});

  // Vérifier si le permis expire dans moins d'un mois
  const checkPermitExpiry = () => {
    if (!permitExpiryDate) return false;
    const expiryDate = new Date(permitExpiryDate);
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    return expiryDate <= oneMonthFromNow;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Nettoyer l'erreur du champ
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({
        ...prev,
        [fieldName]: previewUrl,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'Le prénom est obligatoire';
    if (!formData.last_name) newErrors.last_name = 'Le nom est obligatoire';
    if (!formData.birth_date) newErrors.birth_date = 'La date de naissance est obligatoire';
    if (!formData.birth_place) newErrors.birth_place = 'Le lieu de naissance est obligatoire';
    if (!formData.residence) newErrors.residence = 'Le lieu de résidence est obligatoire';
    if (!formData.hire_date) newErrors.hire_date = "La date d'embauche est obligatoire";
    if (!formData.phone) newErrors.phone = 'Le téléphone est obligatoire';
    if (!formData.email) newErrors.email = "L'email est obligatoire";
    if (!formData.id_card_number) newErrors.id_card_number = 'Le numéro de carte est obligatoire';
    if (!formData.id_card_type) newErrors.id_card_type = 'Le type de carte est obligatoire';
    if (!formData.duration_months) newErrors.duration_months = 'La durée est obligatoire';
    if (!formData.status) newErrors.status = 'Le statut est obligatoire';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newPlan = {
      ...formData,
      id: `plan-${Date.now()}`,
      reference: `AFR-${Date.now().toString().slice(-6)}`,
      expatriate_id: employeeId,
      expatriate_name: employeeName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      permit_expiry_alert: checkPermitExpiry(),
      files: files,
    };

    if (selectedPlan) {
      setPlans(plans.map((p) => (p.id === selectedPlan.id ? { ...p, ...newPlan } : p)));
    } else {
      setPlans([...plans, newPlan]);
    }

    handleCloseDialog();
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData({
        first_name: plan.first_name || '',
        last_name: plan.last_name || '',
        birth_date: plan.birth_date || '',
        birth_place: plan.birth_place || '',
        residence: plan.residence || '',
        hire_date: plan.hire_date || '',
        phone: plan.phone || '',
        email: plan.email || '',
        id_card_number: plan.id_card_number || '',
        id_card_type: plan.id_card_type || '',
        duration_months: plan.duration_months || '',
        status: plan.status || '',
      });
    } else {
      setSelectedPlan(null);
      setFormData({
        first_name: '',
        last_name: '',
        birth_date: '',
        birth_place: '',
        residence: '',
        hire_date: '',
        phone: '',
        email: '',
        id_card_number: '',
        id_card_type: '',
        duration_months: '',
        status: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPlan(null);
    setFormData({
      first_name: '',
      last_name: '',
      birth_date: '',
      birth_place: '',
      residence: '',
      hire_date: '',
      phone: '',
      email: '',
      id_card_number: '',
      id_card_type: '',
      duration_months: '',
      status: '',
    });
    setFiles({
      id_card_scan: null,
      contract_scan: null,
      training_plan_scan: null,
    });
    setPreviews({
      id_card_scan: null,
      contract_scan: null,
      training_plan_scan: null,
    });
    setErrors({});
  };

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setViewMode('details');
  };

  if (!isExpatriate) {
    return (
      <Card>
        <CardContent sx={{ pt: 3 }}>
          <Alert severity="info">
            Le plan d'africanisation s'applique uniquement aux employés expatriés.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (viewMode === 'details' && selectedPlan) {
    return (
      <Card>
        <CardHeader
          title={`Détails du Plan d'Africanisation - ${selectedPlan.reference}`}
          subheader={`Assistant guinéen: ${selectedPlan.first_name} ${selectedPlan.last_name}`}
          action={
            <Button variant="outlined" onClick={() => setViewMode('list')}>
              Retour à la liste
            </Button>
          }
        />
        <CardContent>
          {/* Alerte expiration permis */}
          {selectedPlan.permit_expiry_alert && (
            <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
              <AlertTitle>Attention</AlertTitle>
              Le permis de l'expatrié superviseur expire dans moins d'un mois. Alerte envoyée à
              l'AGUIPEE.
            </Alert>
          )}

          {/* Informations personnelles */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> Informations personnelles
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Nom complet
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.first_name} {selectedPlan.last_name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Date de naissance
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.birth_date}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Lieu de naissance
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.birth_place}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Résidence
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.residence}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Téléphone
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Type de carte
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.id_card_type === 'PASSPORT' ? 'Passeport' : 'CIN'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Numéro de carte
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.id_card_number}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Informations professionnelles */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon /> Informations professionnelles
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Date d'embauche
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.hire_date}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Durée avant prise de fonction
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.duration_months} mois
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Statut
                </Typography>
                <Chip
                  label={STATUS_LABELS[selectedPlan.status]}
                  color={STATUS_COLORS[selectedPlan.status]}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Expatrié superviseur
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedPlan.expatriate_name}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Historique des déclarations */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Historique des déclarations
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Détails</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary' }}>
                      Aucune déclaration pour le moment
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Plan d'Africanisation"
        subheader={`Gestion des assistants guinéens pour ${employeeName}`}
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Ajouter un plan
          </Button>
        }
      />
      <CardContent>
        {/* Alerte expiration permis */}
        {checkPermitExpiry() && (
          <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
            <AlertTitle>Attention</AlertTitle>
            Le permis de séjour expire dans moins d'un mois. Alerte envoyée à l'AGUIPEE.
          </Alert>
        )}

        {/* Liste des plans */}
        {plans.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <DescriptionIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              Aucun plan d'africanisation enregistré
            </Typography>
            <Typography variant="body2">Cliquez sur "Ajouter un plan" pour commencer</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Référence</TableCell>
                  <TableCell>Nom complet</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Date d'embauche</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {plan.reference}
                    </TableCell>
                    <TableCell>
                      {plan.first_name} {plan.last_name}
                    </TableCell>
                    <TableCell>{plan.phone}</TableCell>
                    <TableCell>{plan.hire_date}</TableCell>
                    <TableCell>
                      <Chip
                        label={STATUS_LABELS[plan.status]}
                        color={STATUS_COLORS[plan.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewDetails(plan)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(plan)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>

      {/* Dialog pour ajouter/modifier un plan */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPlan ? "Modifier le plan d'africanisation" : "Nouveau plan d'africanisation"}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Informations personnelles */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <PersonIcon fontSize="small" /> Informations personnelles
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom(s) *"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom *"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date de naissance *"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    error={!!errors.birth_date}
                    helperText={errors.birth_date}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Lieu de naissance *"
                    name="birth_place"
                    value={formData.birth_place}
                    onChange={handleInputChange}
                    error={!!errors.birth_place}
                    helperText={errors.birth_place}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Lieu de résidence *"
                    name="residence"
                    value={formData.residence}
                    onChange={handleInputChange}
                    error={!!errors.residence}
                    helperText={errors.residence}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Téléphone *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    placeholder="+224 XX XX XX XX"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Documents d'identité */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <DescriptionIcon fontSize="small" /> Documents d'identité
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.id_card_type}>
                    <InputLabel>Type de carte *</InputLabel>
                    <Select
                      name="id_card_type"
                      value={formData.id_card_type}
                      onChange={handleInputChange}
                      label="Type de carte *"
                    >
                      <MenuItem value="PASSPORT">Passeport</MenuItem>
                      <MenuItem value="CIN">Carte d'identité nationale</MenuItem>
                    </Select>
                    {errors.id_card_type && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {errors.id_card_type}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Numéro de carte *"
                    name="id_card_number"
                    value={formData.id_card_number}
                    onChange={handleInputChange}
                    error={!!errors.id_card_number}
                    helperText={errors.id_card_number}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                  >
                    Scan carte
                    <input
                      type="file"
                      hidden
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'id_card_scan')}
                    />
                  </Button>
                  {previews.id_card_scan && (
                    <Box sx={{ mt: 1 }}>
                      <img
                        src={previews.id_card_scan}
                        alt="Aperçu"
                        style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                  >
                    Scan contrat
                    <input
                      type="file"
                      hidden
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'contract_scan')}
                    />
                  </Button>
                  {previews.contract_scan && (
                    <Box sx={{ mt: 1 }}>
                      <img
                        src={previews.contract_scan}
                        alt="Aperçu"
                        style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                  >
                    Plan formation
                    <input
                      type="file"
                      hidden
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'training_plan_scan')}
                    />
                  </Button>
                  {previews.training_plan_scan && (
                    <Box sx={{ mt: 1 }}>
                      <img
                        src={previews.training_plan_scan}
                        alt="Aperçu"
                        style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4 }}
                      />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Informations professionnelles */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EventIcon fontSize="small" /> Informations professionnelles
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date d'embauche *"
                    name="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={handleInputChange}
                    error={!!errors.hire_date}
                    helperText={errors.hire_date}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Durée avant prise de fonction (mois) *"
                    name="duration_months"
                    type="number"
                    value={formData.duration_months}
                    onChange={handleInputChange}
                    error={!!errors.duration_months}
                    helperText={errors.duration_months}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Statut *</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      label="Statut *"
                    >
                      <MenuItem value="RECRUITING">En cours de recrutement</MenuItem>
                      <MenuItem value="PROBATION">En période d'essai</MenuItem>
                      <MenuItem value="RESIGNED">Employé a démissionné</MenuItem>
                      <MenuItem value="NO_REPLACEMENT_NEEDED">
                        Poste ne requiert pas de suppléant
                      </MenuItem>
                    </Select>
                    {errors.status && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {errors.status}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedPlan ? 'Modifier' : 'Enregistrer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

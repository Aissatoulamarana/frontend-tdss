'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { CustomPopover } from 'src/components/custom-popover';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import axios from 'src/utils/axios';
import { useState, useEffect, useCallback, useRef, use } from 'react';
import { _roles } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import API from 'src/utils/api';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { TableToolbar } from '../table-filter';
import { TableFiltersResult } from '../table-filter-result';
import { TableRowComPermit } from '../permit-employee-table-row';
import { useMockedUser } from 'src/auth/hooks';
import dayjs, { fIsBetween } from 'src/utils/format-time'; // Ensure this imports the correct dayjs instance
import { set } from 'nprogress';
dayjs.locale('fr'); // Set the default locale to French

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'processing', label: 'En traitement' },
  { value: 'billed', label: 'Facturé' },
  { value: 'paid', label: 'Payé' },

  { value: 'submitted', label: 'Soumis' },
  { value: 'validated', label: 'Validé' },
  { value: 'correction', label: 'En correction' },
  // { value: 'rejected', label: 'Rejeté' },

  { value: 'printed', label: 'Imprimé' },
  { value: 'delivered', label: 'Livré' },
  { value: 'expired', label: 'Expiré' },
];

const BASE_TABLE_HEAD = [
  // { id: 'check', width: 88 },
  // { id: 'reference', label: 'Reference' },
  { id: 'passport', label: 'Numéro Passeport' },
  { id: 'name', label: 'Nom Complet' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'function', label: 'Fonction' },
  { id: 'entreprise', label: 'Entreprise' },
  { id: 'contract_starts_at', label: 'Date Contrat' },
  { id: 'contract_duration', label: 'Durée Contrat' },
  { id: 'type', label: ' Permis ' },
  { id: 'typedec', label: 'Type Déclaration ' },
  { id: 'created_on', label: 'Date de création' },
  { id: 'card_expires_at', label: "Date d'expiration" },
  { id: 'statut', label: 'Status' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function PermitListView() {
  const table = useTable();

  const { user } = useMockedUser();
  const type = user?.type_code?.toLowerCase().trim();

  const [RejetReasons, setRejetReasons] = useState([]);
  const [rejectForm, setRejectForm] = useState({
    reject_reason_type: '',
    reject_reason_description: '',
  });

  const isPrinter = type === 'printer';

  const router = useRouter();

  const confirm = useBoolean();

  const TABLE_HEAD = isPrinter
    ? BASE_TABLE_HEAD.filter((col) => col.id !== 'typedec')
    : BASE_TABLE_HEAD;

  const HIDDEN_BY_DEFAULT = ['phone', 'card_expires_at'];

  const DEFAULT_VISIBLE_COLUMNS = TABLE_HEAD.map((column) => column.id).filter(
    (id) => id && !HIDDEN_BY_DEFAULT.includes(id)
  );

  const allColumns = TABLE_HEAD.map((column) => column.id).filter((id) => id);
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);
  const columnSelector = useBoolean();

  const [selectedForPrint, setSelectedForPrint] = useState([]);
  const [openBulkPrint, setOpenBulkPrint] = useState(false);

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const toggleColumn = (id) => {
    if (visibleColumns.includes(id)) {
      setVisibleColumns(visibleColumns.filter((column) => column !== id));
    } else {
      setVisibleColumns([...visibleColumns, id]);
    }
  };

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const fetchRequestIdRef = useRef(0);

  const filters = useSetState(
    {
      name: '',
      declaration: '',
      type: 'all',
      passport_number: '',
      reference: '',
      status: 'all',
      company: '',
      number: '',
      created_on_before: null,
      created_on_after: null,
      not_printed: false,
    },
    { persistByPath: true }
  );

  const dateError = fIsBetween(filters.state.created_on_after, filters.state.created_on_before);

  const canReset =
    !!filters.state.name ||
    !!filters.state.declaration ||
    filters.state.status !== 'all' ||
    filters.state.type !== 'all' ||
    !!filters.state.passport_number ||
    !!filters.state.reference ||
    !!filters.state.company ||
    !!filters.state.number ||
    !!filters.state.not_printed ||
    (!!filters.state.created_on_before && !!filters.state.created_on_after);

  const notFound = pagination.count === 0 && canReset;

  const handleDeleteRow = useCallback(
    (slug) => {
      const deleteRow = tableData.filter((row) => row.slug !== slug);

      toast.success('Suppression reussie!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(tableData.length);
    },
    [table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.slug));

    toast.success('Suppression reussie!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: tableData.length,
      totalRowsFiltered: tableData.length,
    });
  }, [tableData.length, table, tableData]);

  const fetchRejetReasons = async () => {
    try {
      const response = await axios.get(API.listRejectReasons());
      setRejetReasons(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRejetReasons();
  }, []);

  const handleEditRow = useCallback(
    (slug) => {
      router.push(paths.dashboard.permit.edit(slug));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (slug) => {
      router.push(paths.dashboard.permit.details(slug));
    },
    [router]
  );

  const handlSubmitRow = useCallback(async (slug) => {
    try {
      const response = await axios.post(API.submitPermit(slug));
      if (response.data || response.status === 200) {
        toast.success('Permit soumis avec succès!');
        // Mettre à jour l'état local ou refetch les données si nécessaire
        setTableData((prevData) =>
          prevData.map((item) => (item.slug === slug ? { ...item, status: 'submitted' } : item))
        );
      } else {
        toast.error('Échec de la soumission du permit.');
      }
    } catch (error) {
      const errorMessage =
        error?.error ||
        error?.details ||
        error?.message ||
        error?.detail ||
        error?.non_field_errors?.[0];
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error?.non_field_errors?.[0]);
      toast.error(errorMessage);
    }
  }, []);

  const handleUnsubmitRow = useCallback(async (slug) => {
    try {
      const response = await axios.post(API.unsubmitPermit(slug));
      if (response.data || response.status === 200) {
        toast.success('Permit retiré de la soumission avec succès!');
        // Mettre à jour l'état local ou refetch les données si nécessaire
        setTableData((prevData) =>
          prevData.map((item) => (item.slug === slug ? { ...item, status: 'processing' } : item))
        );
      } else {
        toast.error('Échec du retrait de la soumission du permit.');
      }
    } catch (error) {
      const errorMessage =
        error?.error ||
        error?.details ||
        error?.message ||
        error?.detail ||
        error?.non_field_errors?.[0];
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handleValidateRow = useCallback(async (slug) => {
    try {
      const response = await axios.post(API.validatePermit(slug));
      if (response.data || response.status === 200) {
        toast.success('Permit validé avec succès!');

        setTableData((prevData) =>
          prevData.map((item) => (item.slug === slug ? { ...item, status: 'validated' } : item))
        );
      } else {
        console.log('Erreur lors de la validation du permit');
        toast.error('Une erreur est survenue lors de la validation du permit');
      }
    } catch (error) {
      const errorMessage =
        error?.error ||
        error?.details ||
        error?.message ||
        error?.detail ||
        error?.non_field_errors?.[0];
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handleRejetRow = useCallback(async (slug, rejectReasonData) => {
    try {
      const payload = {
        reject_reason_type: rejectReasonData?.reject_reason_type || '',
        reject_reason_description: rejectReasonData?.reject_reason_description || '',
      };

      const response = await axios.post(API.rejectPermit(slug), payload);

      if (response.data || response.status === 200) {
        toast.success('Permit rejeté avec succès!');

        setTableData((prevData) =>
          prevData.map((item) =>
            item.slug === slug
              ? {
                  ...item,
                  status: 'correction',
                  reject_reason_type: payload.reject_reason_type,
                  reject_reason_description: payload.reject_reason_description,
                }
              : item
          )
        );
      } else {
        toast.error('Une erreur est survenue lors du rejet du permit');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.response?.data?.non_field_errors?.[0] ||
        error?.message ||
        'Erreur lors du rejet du permit';

      setError(errorMessage);

      console.error('Erreur réseau ou serveur:', error?.response?.data || error);

      toast.error(errorMessage);
    }
  }, []);

  const handleDeliverRow = useCallback(async (slug) => {
    try {
      const response = await axios.post(API.deliverPermit(slug));
      if (response.data || response.status === 200) {
        toast.success('Permit livré avec succès!');
        setTableData((prevData) =>
          prevData.map((item) => (item.slug === slug ? { ...item, status: 'delivered' } : item))
        );
      } else {
        console.log('Erreur lors de la livraison du permit');
        toast.error('Une erreur est survenue lors de la livraison du permit');
      }
    } catch (error) {
      const errorMessage =
        error?.error ||
        error?.details ||
        error?.message ||
        error?.detail ||
        error?.non_field_errors?.[0];
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handlePrintRow = useCallback(async (slug) => {
    try {
      const response = await axios.get(API.printPermis(slug), {
        responseType: 'blob', // Important pour les fichiers binaires
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      const errorMessage =
        error?.error ||
        error?.details ||
        error?.message ||
        error?.detail ||
        error?.non_field_errors?.[0];
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  });

  const handleBulkPrint = useCallback(async () => {
    if (table.selected.length === 0) {
      toast.error("Aucun permit sélectionné pour l'impression.");
      return;
    }

    const selectedPermits = tableData?.filter((row) => table.selected.includes(row.slug));
    setSelectedForPrint(selectedPermits);
    setOpenBulkPrint(true);
  }, [tableData, table.selected]);

  const handleMultiplePrintConfirm = async (printMode) => {
    try {
      const paylaod = {
        declaration_employee_slugs: table.selected,
      };
      const response = await axios.post(API.printPermis(), paylaod);

      // if (response?.data || response?.status === 200 || response?.status === 201) {
      //   toast.success(`${table.selected.length} permits marqués comme imprimés`);

      //   setTableData((prevData) =>
      //     prevData.map((item) =>
      //       table.selected.includes(item.slug) ? { ...item, status: 'printed' } : item
      //     )
      //   );
      generateBulkPrint(selectedForPrint, printMode);

      setOpenBulkPrint(false);
      table.setSelected([]);
      // } else {
      //   toast.error("Echec lors de l'impression des permits sélectionnés");
      // }
    } catch (error) {
      const errorMessage =
        error?.error ||
        error?.details ||
        error?.message ||
        error?.detail ||
        error?.non_field_errors?.[0];
      setError(errorMessage);
      console.error('Erreur réseau ou serveur:', error);
      toast.error(errorMessage);
    }
  };

  // Fonction pour générer l'impression
  const generateBulkPrint = (permits, printMode) => {
    const printWindow = window.open('', '_blank');
    const printDocument = printWindow.document;

    let cardsHTML = '';

    permits.forEach((permit, index) => {
      const qrData = encodeURIComponent(
        `Permit N° ${permit?.card_number || permit?.reference || 'N/A'}`
      );
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=200x200`;

      cardsHTML += generateCardHTML(permit, qrUrl, index, printMode, permits?.length);
    });

    printDocument.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Impression Multiple - ${permits.length} Permits</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: ${printMode === 'a4' ? '20px' : '0'};
            background: white;
            font-family: Arial, sans-serif;
          }
          
          .print-container {
            display: flex;
            flex-direction: column;
            gap: ${printMode === 'a4' ? '20px' : '0'};
            align-items: center;
          }
          
          .permit-group {
            display: flex;
            flex-direction: column;
            gap: ${printMode === 'a4' ? '15px' : '0'};
            align-items: center;
            width: 100%;
            page-break-after: ${printMode === 'duplex' ? 'always' : 'auto'};
          }
            .permit-group: last-child {
              page-break-after: auto;
            }   

          .card-face {
            width: 86mm;
            height: 54mm;
            background: white;
            position: relative;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
            ${printMode === 'duplex' ? 'page-break-after: always;' : ''}
          }

          .card-back {
          ${printMode === 'duplex' ? 'page-break-after: always;' : ''}
          }
          
          .card-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .card-content {
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 1;
          }
          
          @media print {
            @page {
              margin: 0;
              size: ${printMode === 'duplex' ? '86mm 54mm' : 'A4 '};
            }
            
            body {
              margin: 0 !important;
              padding: ${printMode === 'a4' ? '15mm' : '0'} !important;
            }
            
            .print-container {
              gap: ${printMode === 'a4' ? '10mm' : '0'} !important;
            }
            
            .card-face {
              box-shadow: none !important;
              ${printMode === 'a4' ? 'border: 0.5mm solid #ccc;' : ''}
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${cardsHTML}
        </div>
       <script>
          window.onload = function() {
            // Attendre que toutes les images soient chargées
            const images = document.querySelectorAll('img');
            let loadedCount = 0;
            const totalImages = images.length;
            
            if (totalImages === 0) {
              // Pas d'images, lancer l'impression directement
              setTimeout(() => {
                window.print();
                setTimeout(() => window.close(), 500);
              }, 500);
            } else {
              images.forEach(img => {
                if (img.complete) {
                  loadedCount++;
                } else {
                  img.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                      setTimeout(() => {
                        window.print();
                        setTimeout(() => window.close(), 500);
                      }, 500);
                    }
                  };
                  img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                      setTimeout(() => {
                        window.print();
                        setTimeout(() => window.close(), 500);
                      }, 500);
                    }
                  };
                }
              });
              
              // Si toutes les images sont déjà chargées
              if (loadedCount === totalImages) {
                setTimeout(() => {
                  window.print();
                  setTimeout(() => window.close(), 500);
                }, 500);
              }
            }
          };
        </script>
      </body>
    </html>
  `);

    printDocument.close();
  };

  // Fonction helper pour générer le HTML d'une carte
  const generateCardHTML = (permit, qrUrl, index, printMode, totalPermits) => {
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    const calculateDuration = (duration) => {
      if (!duration) return 'N/A';
      return `${duration} MOIS`;
    };

    const getLabelPermit = (type) => {
      const map = {
        'Permis A': ' A',
        'Permis B': 'B',
        'Permis C': 'C',
      };
      return type ? map[type] || String(type) : 'N/A';
    };

    const createLabelValueHTML = (label, value, options = {}) => {
      const {
        fontSize = 2.5,
        labelWeight = 400,
        valueWeight = 700,
        marginBottom = 1,
        uppercase = true,
      } = options;

      const displayValue = (value && (uppercase ? String(value).toUpperCase() : value)) || 'N/A';
      const shouldLimit =
        label.trim().toUpperCase() === 'FONCTION' || label.trim().toUpperCase() === 'ADRESSE';

      const limitedStyle = shouldLimit
        ? `max-width: 30mm; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
        : '';

      return `
    <div style="
      margin-bottom: ${marginBottom}mm;
      color: #000;
      font-size: ${fontSize}mm;
      display: flex;
      align-items: baseline;
      line-height: 1;
    ">
      <span style="font-weight: ${labelWeight};">
        ${label} :
      </span>     
        <span style="
        font-weight: ${valueWeight};
        letter-spacing: 0.1mm;
        margin-left: 1mm;
        ${limitedStyle}
      ">
        ${displayValue}
      </span>
    </div>`;
    };

    const createEmployerHTML = (label, value) => {
      const text = (value || 'N/A').toUpperCase();
      const length = text.length;

      let fontSize = 2.5;
      if (length > 55) fontSize = 1.6;
      else if (length > 45) fontSize = 1.8;
      else if (length > 35) fontSize = 2.0;
      else if (length > 28) fontSize = 2.2;

      return `
    <div style="
      margin-bottom: 1mm;
      color: #000;
      font-size: 1.8mm;
      line-height: 1;
    ">      
     <span style="font-weight: 400;">
        ${label} :
      </span>
      <span style="
        font-size: ${fontSize}mm;
        font-weight: 700;
        letter-spacing: 0.03mm;
        display: inline-block;
        max-width: 38mm;
        white-space: nowrap;
        overflow: hidden;
        vertical-align: middle;
      ">
        ${text}
      </span>
    </div>`;
    };

    // Déterminer si c'est la dernière carte pour éviter le saut de page
    const isLastCard = index === totalPermits - 1;
    const groupBreak = printMode === 'a4' && !isLastCard ? 'page-break-after: always;' : '';

    return `
    <div class="permit-group" style="${groupBreak}">
      <!-- RECTO -->
      <div class="card-face card-front">
        <div class="card-content" style="padding: 8mm 5mm;">
          <div style="position: absolute; top: 19mm; left: 4mm; width: 20mm; height: 27mm; background: white; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            ${permit?.picture ? `<img src="${permit.picture}" alt="Photo" style="width: 100%; height: 100%; object-fit: cover;" />` : '<div style="color: #999; font-size: 2.5mm;">PHOTO</div>'}
          </div>

          <div style="position: absolute; top: 19mm; left: 28mm; right: 10mm;">
            ${createLabelValueHTML('NOM ', permit?.last)}
            ${createLabelValueHTML('PRÉNOM(S) ', permit?.first)}
            ${createLabelValueHTML('N° INDENTITE ', permit?.passport_number)}
            ${createLabelValueHTML('NÉ(E) LE ', formatDate(permit?.birthday))}
            ${createLabelValueHTML('À ', permit?.birth_place)}
            ${createLabelValueHTML('NATIONALITÉ ', permit?.nationality)}
            ${createLabelValueHTML('SEXE ', permit?.sexe === 'male' ? 'HOMME' : 'FEMME')}
          </div>

          <div style="position: absolute; top: 48mm; left: 4mm; width: 20mm; height: 6mm;  display: flex; align-items: center; justify-content: center; overflow: hidden;">
            ${permit?.signature ? `<img src="${permit.signature}" alt="signature" style="max-height: 100%; max-width: 100%; object-fit: contain;" />` : '<div style="font-size: 1.8mm; color: #000; font-weight: 400;">SIGNATURE DU TITULAIRE</div>'}
          </div>

          <div style="position: absolute; top: 14mm; left: 55mm; font-size: 3mm; font-weight: 700; color: #000;">
            N° ${permit?.card_number}
          </div>
        </div>
      </div>

      <!-- VERSO -->
      <div class="card-face card-back">
        <div class="card-content" style="padding: 8mm 5mm;">
          <div style="position: absolute; top: 4mm; left: 5mm; right: 22mm;">
            ${createEmployerHTML('EMPLOYEUR', permit?.company_sigle)}
            ${createLabelValueHTML('ADRESSE', permit?.company_address || 'N/A')}
            ${createLabelValueHTML('FONCTION ', permit?.job?.name || 'N/A')}
            ${createLabelValueHTML('CATÉGORIE ', 'TYPE ' + (getLabelPermit(permit?.category || permit?.job?.permit) || ''))}
            ${createLabelValueHTML('DURÉE CONTRAT', calculateDuration(permit?.contract_duration))}
            ${createLabelValueHTML('VALIDITÉ ', formatDate(permit?.card_expires_at || permit?.contract_starts_at))}
          </div>

          <div style="position: absolute; top: 7mm; right: 27.5mm; width: 8mm; height: 12mm; background: white;  overflow: hidden; display: flex; align-items: center; justify-content: center;">
            ${permit?.picture ? `<img src="${permit.picture}" alt="Photo" style="width: 100%; height: 100%; object-fit: cover;" />` : '<div style="color: #999; font-size: 2mm;">PHOTO</div>'}
          </div>

          <div style="position: absolute; bottom: 8mm; left: 6mm; width: 17mm; height: 17mm; background: white; border: 0.3mm solid #ccc; display: flex; align-items: center; justify-content: center; overflow: hidden;">
            ${qrUrl ? `<img src="${qrUrl}" alt="QR Code" style="width: 100%; height: 100%;" />` : '<div style="color: #ccc; font-size: 2mm;">QR</div>'}
          </div>
        </div>
      </div>
    </div>
  `;
  };

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  useEffect(() => {
    if (!filters.isHydrated) return;

    const requestId = fetchRequestIdRef.current + 1;
    fetchRequestIdRef.current = requestId;

    // Fonction pour récupérer les permits
    const fetchPermits = async () => {
      setLoading(true);
      try {
        const offset = table.page * table.rowsPerPage;
        const params = {
          limit: table.rowsPerPage,
          offset: offset,
          ...(filters.state.passport_number
            ? { passport_number: filters.state.passport_number }
            : filters.state.reference
              ? { reference: filters.state.reference }
              : filters.state.name
                ? { name: filters.state.name }
                : {}),
          ...(filters.state.type !== 'all' ? { type: filters.state.type } : {}),
          ...(filters.state.status !== 'all' ? { status: filters.state.status } : {}),
          ...(filters.state.declaration ? { declaration: filters.state.declaration } : {}),
          ...(filters.state.company ? { company: filters.state.company } : {}),
          ...(filters.state.number ? { number: filters.state.number } : {}),
          ...(filters.state.not_printed ? { not_printed: filters.state.not_printed } : {}),
          ...(filters.state.created_on_before && !dateError
            ? { created_on_before: dayjs(filters.state.created_on_before).format('YYYY-MM-DD') }
            : {}),
          ...(filters.state.created_on_after && !dateError
            ? { created_on_after: dayjs(filters.state.created_on_after).format('YYYY-MM-DD') }
            : {}),
        };

        const apiRoute = isPrinter ? API.listPendingPermitsEmployees() : API.listPermitsEmployees();

        const response = await axios.get(apiRoute, { params });

        if (requestId !== fetchRequestIdRef.current) return;

        setTableData(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
        });
      } catch (err) {
        if (requestId !== fetchRequestIdRef.current) return;
        setError(err.message || 'Erreur lors du chargement des données.');
      } finally {
        if (requestId !== fetchRequestIdRef.current) return;
        setLoading(false);
      }
    };

    fetchPermits();
  }, [
    filters.isHydrated,
    isPrinter,
    table.page,
    table.rowsPerPage,
    filters.state.name,
    filters.state.declaration,
    filters.state.passport_number,
    filters.state.reference,
    filters.state.type,
    filters.state.status,
    filters.state.company,
    filters.state.number,
    filters.state.created_on_before,
    filters.state.created_on_after,
    filters.state.not_printed,
  ]); // a chaque fois que la page, rowsPerPage, ou les filtres changent , on refetch

  if (loading) {
    console.info('Loading ...');
  }

  if (error) {
    console.error(`Error: ${error}`);
  }
  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Permits"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Permit', href: paths.dashboard.devise.root },
            { name: 'Liste des Permits' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {' '}
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                // icon={
                //   <Label variant="filled" color="main">
                //     {pagination.count}
                //   </Label>
                // }
              />
            ))}
          </Tabs>

          <TableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
            options={{ profil: _roles }}
            onOpenColumnSelector={columnSelector.onTrue}
          />

          {canReset && (
            <TableFiltersResult
              filters={filters}
              totalResults={pagination.count}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            {isPrinter && (
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={pagination.count}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.slug)
                  )
                }
                action={
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Imprimer la sélection">
                      <IconButton color="primary" onClick={handleBulkPrint}>
                        <Iconify icon="solar:printer-minimalistic-bold" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton color="primary" onClick={confirm.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />
            )}

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD.filter((col) => visibleColumns.includes(col.id) || !col.id)}
                  rowCount={pagination.count}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={
                    isPrinter
                      ? (checked) =>
                          table.onSelectAllRows(
                            checked,
                            tableData.map((row) => row.slug)
                          )
                      : undefined
                  }
                />

                {loading ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={100}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 6,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {/* slug, name, sign, value */}
                    {tableData.map((row) => (
                      <TableRowComPermit
                        type={type}
                        key={row.slug}
                        row={row}
                        rejectReasons={RejetReasons}
                        visibleColumns={visibleColumns}
                        selected={table.selected.includes(row.slug)}
                        onSelectRow={isPrinter ? () => table.onSelectRow(row.slug) : undefined}
                        onDeleteRow={() => handleDeleteRow(row.slug)}
                        onEditRow={() => handleEditRow(row.slug)}
                        onViewRow={() => handleViewRow(row.slug)}
                        onRejetRow={(rejectReasonData) =>
                          handleRejetRow(row.slug, rejectReasonData)
                        }
                        onSubmitRow={() => handlSubmitRow(row.slug)}
                        onUnsubmitRow={() => handleUnsubmitRow(row.slug)}
                        onValidateRow={() => handleValidateRow(row.slug)}
                        onDeliverRow={() => handleDeliverRow(row.slug)}
                        onPrintRow={() => handlePrintRow(row.slug)}
                      />
                    ))}

                    {tableData.length > 0 && tableData.length < table.rowsPerPage && (
                      <TableEmptyRows
                        height={table.dense ? 56 : 76}
                        emptyRows={table.rowsPerPage - tableData.length}
                      />
                    )}

                    <TableNoData notFound={notFound} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={pagination.count}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>

        <CustomPopover
          open={columnSelector.value}
          onClose={columnSelector.onFalse}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MenuList dense sx={{ width: 200 }}>
            {TABLE_HEAD.filter((col) => col.id).map((col) => (
              <MenuItem key={col.id} onClick={() => toggleColumn(col.id)}>
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col.id)}
                  readOnly
                  style={{ marginRight: 8 }}
                />
                {col.label}
              </MenuItem>
            ))}
          </MenuList>
        </CustomPopover>
      </DashboardContent>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Etes vous sûr de vouloir supprimer <strong> {table.selected.length} </strong> type
            d'utilisateur?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />

      <Dialog open={openBulkPrint} onClose={() => setOpenBulkPrint(false)} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Impression multiple de {table.selected.length} permit(s)
          </Typography>

          <Box sx={{ mb: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark">
              Vous êtes sur le point d'imprimer {table.selected.length} carte(s) de permis.
              Choisissez le mode d'impression ci-dessous.
            </Typography>
          </Box>

          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleMultiplePrintConfirm('a4')}
              sx={{ justifyContent: 'flex-start', p: 2 }}
            >
              <Stack spacing={1} alignItems="flex-start" sx={{ width: '100%' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Mode Aperçu A4
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Toutes les cartes sur papier A4 (recto et verso visibles)
                </Typography>
              </Stack>
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleMultiplePrintConfirm('duplex')}
              sx={{ justifyContent: 'flex-start', p: 2 }}
            >
              <Stack spacing={1} alignItems="flex-start" sx={{ width: '100%' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Mode Recto-Verso
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Impression professionnelle sur cartes 86mm x 54mm
                </Typography>
              </Stack>
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setOpenBulkPrint(false)} color="inherit">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, profil } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData?.filter(
      (profiltype) => profiltype?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData?.filter((profiltype) => permission?.status === status);
  }

  if (profil.length) {
    inputData = inputData?.filter((permission) => profil?.includes(permission?.profile));
  }

  return inputData;
}

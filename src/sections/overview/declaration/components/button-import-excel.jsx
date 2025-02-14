import React, { useRef } from 'react';
import { Button } from '@mui/material';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export function ImportFilesButton({ onImport }) {
  const fileInputRef = useRef();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      // Traitement des fichiers CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Données CSV importées :', results.data);
          onImport(results.data);
        },
        error: (error) => {
          console.error('Erreur de parsing CSV :', error);
        },
      });
    } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
      // Traitement des fichiers Excel
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Lire le premier onglet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Données Excel importées :', jsonData);
        onImport(jsonData); // Transmet les données importées au parent
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error(
        'Format de fichier non pris en charge. Veuillez importer un fichier CSV ou Excel.'
      );
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Ouvre la boîte de dialogue de sélection de fichier
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleButtonClick}>
          Importer Fichier Excel
        </Button>
      </div>
      <input
        type="file"
        accept=".csv, .xls, .xlsx"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </>
  );
}
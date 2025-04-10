import { Button } from '@mui/material';
import Papa from 'papaparse';
import React, { useRef } from 'react';
import ExcelJS from 'exceljs';

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
      // Traitement des fichiers Excel avec ExcelJS
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data);

        const worksheet = workbook.worksheets[0];
        const jsonData = [];
        let headers = [];

        worksheet.eachRow((row, rowNumber) => {
          const rowValues = row.values.slice(1); // Ignorer l'index 0
          if (rowNumber === 1) {
            // Enregistre la ligne d'en-tête
            headers = rowValues.map(header => header.toString().trim());
          } else {
            const rowObject = {};
            rowValues.forEach((value, index) => {
              rowObject[headers[index]] = value;
            });
            jsonData.push(rowObject);
          }
        });

        console.log('Données Excel importées :', jsonData);
        onImport(jsonData);
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

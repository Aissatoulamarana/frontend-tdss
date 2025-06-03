
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Box, Button, Stack } from "@mui/material"


export function ExportButtons({ data, type , company }) {
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Données")
    XLSX.writeFile(wb, `export_${type}.xlsx`)
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.text(`Export ${type}`, 10, 10)

    let head = []
    let body = []

    if (type === "declarations") {
      head = [["Mois", "Déclarations"]]
      body = data.map(d => [d.mois, d.declarations ?? "-"])
    } else if (type === "factures") {
      head = [["Mois", "Factures"]]
      body = data.map(d => [d.mois, d.factures ?? "-"])
    } else if (type === "paiements") {
      head = [["Mois", "Paiements"]]
      body = data.map(d => [d.mois, d.paiements ?? "-"])
    } else {
      head = [["Mois", "Déclarations", "Factures", "Paiements"]]
      body = data.map(d => [
        d.mois,
        d.declarations ?? "-",
        d.factures ?? "-",
        d.paiements ?? "-"
      ])
    }

    autoTable(doc, {
      head,
      body
    })

    doc.save(`export_${type}.pdf`)
  }

  return (
  <Box display="flex" justifyContent="flex-end" mt={2}>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleExportExcel}>
          Export Excel
        </Button>
        <Button variant="contained" onClick={handleExportPDF}>
          Export PDF
        </Button>
      </Stack>
    </Box>
  )
}
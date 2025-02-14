import { useMemo } from 'react';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

// Enregistrement de la police Roboto
Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        // Mise en page générale
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          padding: '40px 24px 120px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#e9ecef',
        },
        container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        signatureContainer: {
          marginTop: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        signatureText: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        qr: {
          width: 60,
          height: 60,
        },
        // Marges
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        // Textes
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        body2: { fontSize: 9 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        // Tableau
        table: { display: 'flex', width: '100%' },
        row: {
          padding: '10px 0 8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#e9ecef',
        },
        cell_1: { width: '5%' },
        cell_2: { width: '50%' },
        cell_3: { width: '15%', paddingLeft: 32 },
        cell_4: { width: '15%', paddingLeft: 8 },
        cell_5: { width: '15%' },
        noBorder: { paddingTop: '10px', paddingBottom: 0, borderBottomWidth: 0 },
        // Style pour le numéro de facture centré et en gros caractères
        invoiceNumber: {
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          marginVertical: 10,
        },
      }),
    []
  );

export function FacturePDF({ facture }) {
  const styles = useStyles();

  // Calcul de la date d'échéance (date de création + 5 ans)
  const createDate = new Date(facture?.create_date);
  let dueDate = null;
  if (!isNaN(createDate.getTime())) {
    dueDate = new Date(createDate);
    dueDate.setFullYear(dueDate.getFullYear() + 5);
  } else {
    console.error("Invalid date format");
  }

  // Préparation du QR code
  const qrData = encodeURIComponent(`${facture?.numero_facture} - `);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=100x100`;

  // En-tête avec logo à gauche et informations de la facture à droite
  const renderHeader = (
    <View style={styles.mb40}>
      <View style={[styles.container, styles.mb8]}>
        <Image source="/logo/logo-single.png" style={{ width: 48, height: 48 }} />
        <View style={{ textAlign: 'right' }}>
        </View>
      </View>
      {/* Numéro de facture centré */}
      <View>
        <Text style={styles.invoiceNumber}>FACTURE {facture?.numero_facture}</Text>
      </View>
    </View>
  );

  // Informations client dans une section dédiée
  const renderClientInfo = (
    <View style={styles.mb40}>
      <Text style={[styles.subtitle2, styles.mb4]}>CLIENT</Text>
      <Text style={styles.body2}>{facture?.client?.company}</Text>
      <Text style={styles.body2}>{facture?.client?.address}</Text>
      <Text style={styles.body2}>{facture?.client?.phone_number}</Text>
    </View>
  );

  const renderTime = (
    <View style={[styles.container, styles.mb40]}>
      <View style={{ width: '45%' }}>
        <Text style={[styles.subtitle2, styles.mb4]}>Date create</Text>
        <Text style={styles.body2}>{fDate(facture?.create_date)}</Text>
      </View>
      <View style={{ width: '45%' }}>
        <Text style={[styles.subtitle2, styles.mb4]}>Due date</Text>
        <Text style={styles.body2}>{fDate(dueDate)}</Text>
      </View>
      <View style={{ width: '45%' }}>
        <Text style={[styles.subtitle2, styles.mb4]}>Source</Text>
        <Text style={styles.body2}> {facture?.declaration_number}</Text>
      </View>
    </View>
  );

  const renderTable = (
    <View style={styles.table}>
      <View style={styles.row}>
        <View style={styles.cell_1}>
          <Text style={styles.subtitle2}>#</Text>
        </View>
        <View style={styles.cell_2}>
          <Text style={styles.subtitle2}>Categorie</Text>
        </View>
        <View style={styles.cell_3}>
          <Text style={styles.subtitle2}>Quantité</Text>
        </View>
        <View style={styles.cell_4}>
          <Text style={styles.subtitle2}>Prix unitaire</Text>
        </View>
        <View style={[styles.cell_5, { textAlign: 'right' }]}>
          <Text style={styles.subtitle2}>Total</Text>
        </View>
      </View>
      {facture?.details.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.cell_1}>
            <Text>{index + 1}</Text>
          </View>
          <View style={styles.cell_2}>
            <Text style={styles.subtitle2}>{item.category}</Text>
            <Text> Permis {item.permis}</Text>
          </View>
          <View style={styles.cell_3}>
            <Text>{item.quantite}</Text>
          </View>
          <View style={styles.cell_4}>
            <Text>{item.prix_unitaire}</Text>
          </View>
          <View style={[styles.cell_5, { textAlign: 'right' }]}>
            <Text>{fCurrency(item.prix_unitaire * item.quantite)}</Text>
          </View>
        </View>
      ))}
      <View style={[styles.row, styles.noBorder]}>
        <View style={styles.cell_4}>
          <Text style={styles.subtitle2}>TOTAL</Text>
        </View>
        <View style={[styles.cell_4, { textAlign: 'right' }]}>
          <Text>{fCurrency(facture?.montant_usd)}</Text>
        </View>
        <View style={[styles.cell_5, { textAlign: 'right' }]}>
          <Text>{fCurrency(facture?.montant_gnf)}</Text>
        </View>
      </View>
    </View>
  );

  const renderQRCode = (
    <View style={styles.signatureContainer}>
      <Image src={qrUrl} style={styles.qr} />
      <Text style={styles.signatureText}>Le Directeur :</Text>
    </View>
  );

  const renderFooter = (
    <View style={[styles.container, styles.footer]} fixed>
      <View style={{ width: '75%' }}>
        <Text style={styles.subtitle2}>NOTES</Text>
        <Text>
          We appreciate your business. Should you need us to add VAT or extra notes let us know!
        </Text>
      </View>
      <View style={{ width: '25%', textAlign: 'right' }}>
        <Text style={styles.subtitle2}>Have a question?</Text>
        <Text>support@abcapp.com</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader}
        {renderClientInfo}
        {renderTime}
        {renderTable}
        {renderQRCode}
        {renderFooter}
      </Page>
    </Document>
  );
}

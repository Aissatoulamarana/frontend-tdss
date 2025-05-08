import { Page, View, Text, Image, Document, StyleSheet } from '@react-pdf/renderer';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function PaiementPDF({ payment }) {
  // Fonction pour formater les montants
  const formatAmount = (amount) => {
    if (!amount) return '0 GNF';
    return `${Number(amount).toLocaleString()} GNF`;
  };

  // Styles pour le PDF
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontSize: 9,
      fontFamily: 'Helvetica',
      backgroundColor: '#FFFFFF',
    },
    container: {
      flexDirection: 'column',
    },
    headerContainer: {
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    column: {
      flexDirection: 'column',
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 5,
    },
    subtitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    label: {
      fontWeight: 'bold',
    },
    value: {
      marginBottom: 5,
    },
    logo: {
      width: 80,
      height: 50,
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '33%',
    },
    emptySpace: {
      width: '34%',
    },
    smallText: {
      fontSize: 3,
      textAlign: 'center',
      marginTop: 5,
      maxWidth: 100,
      lineHeight: 1.2,
    },
    divider: { 
      borderBottomWidth: 1, 
      borderColor: '#DDDDDD', 
      marginVertical: 5,
      width: '100%',
    },
    
    // Tableau
    table: { 
      marginTop: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#DDDDDD',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#F5F5F5',
      borderBottomWidth: 1,
      borderBottomColor: '#DDDDDD',
      paddingVertical: 4,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#EEEEEE',
      paddingVertical: 4,
    },
    tableCell40: { 
      width: '40%',
      paddingHorizontal: 10,
      borderRightWidth: 1,
      borderRightColor: '#EEEEEE',
    },
    tableCell30: { 
      width: '30%',
      paddingHorizontal: 10,
      borderRightWidth: 1,
      borderRightColor: '#EEEEEE',
    },
    tableCellLast: {
      borderRightWidth: 0,
    },
    tableCellCenter: {
      textAlign: 'center',
    },
    tableCellRight: {
      textAlign: 'right',
    },
    qrCode: {
      width: 100,
      height: 100,
      marginBottom: 5,
    },
    signature: {
      marginTop: 5,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 9,
    },
    signatureLine: {
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      width: '100%',
      marginBottom: 5,
      marginTop: 60,
    },
    clientInfo: {
      marginTop: 5,
      marginBottom: 5,
    },
    infoRow: {
      marginBottom: 2,
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
    infoLabel: {
      fontWeight: 'bold',
    },
    infoValue: {
      marginHorizontal: 5,
    },
    infoTable: {
      display: 'flex',
    },
    infoTableRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 5,
    },
    signatureSection: {
      marginTop: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    signatureColumn: {
      width: '48%',
      alignItems: 'center',
    },
  });

  // URL du QR code
  const qrData = encodeURIComponent(`Paiement: ${payment?.reference} - Facture: ${payment?.facture_number || ''} - Montant: ${payment?.amount || ''} ${payment?.devise?.sign || 'GNF'}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=100x100`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* En-tête avec logos et titre */}
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <View style={styles.logoContainer}>
                <Image src="/logo/logo-single.png" style={styles.logo} />
                <Text style={styles.smallText}>TECH DATA SECURISATION & SYSTEMES</Text>
              </View>
              
              <View style={styles.emptySpace}></View>
              
              <View style={styles.logoContainer}>
                <Image src="/logo/logo-single.png" style={styles.logo} />
                <Text style={styles.smallText}>TECH DATA SECURISATION & SYSTEMES</Text>
              </View>
              
            </View>
            
            <View style={styles.divider} />
            {/* Titre */}
            <Text style={styles.title}>RECU DE PAIEMENT N° {payment?.number || payment?.reference}</Text>
            {/* Ligne horizontale */}
            <View style={styles.divider} />
          </View>
          
          
          
          {/* Informations de facture et date */}
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.infoTable}>
                <View style={styles.infoTableRow}>
                  <Text style={styles.infoLabel}>Facture N° :</Text>
                  <Text style={styles.infoValue}>{payment?.facture_number}</Text>
                </View>
                <View style={styles.infoTableRow}>
                  <Text style={styles.infoLabel}>Référence :</Text>
                  <Text style={styles.infoValue}>{payment?.facture_ref}</Text>
                </View>
                <View style={styles.infoTableRow}>
                  <Text style={styles.infoLabel}>Méthode :</Text>
                  <Text style={styles.infoValue}>{payment?.payment_method}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.column}>
              <View style={styles.infoTable}>
                <View style={styles.infoTableRow}>
                  <Text style={[styles.infoLabel, styles.tableCellRight]}>Date :</Text>
                  <Text style={[styles.infoValue, styles.tableCellRight]}>{payment ? fDate(new Date()) : ''}</Text>
                </View>
                <View style={styles.infoTableRow}>
                  <Text style={[styles.infoLabel, styles.tableCellRight]}>Devise :</Text>
                  <Text style={[styles.infoValue, styles.tableCellRight]}>{payment?.devise?.name} ({payment?.devise?.sign})</Text>
                </View>
                <View style={styles.infoTableRow}>
                  <Text style={[styles.infoLabel, styles.tableCellRight]}>Créé par :</Text>
                  <Text style={[styles.infoValue, styles.tableCellRight]}>{payment?.created_by?.name}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Informations du client */}
          <View style={styles.clientInfo}>
            <View style={styles.infoTable}>
              <View style={styles.infoTableRow}>
                <Text style={styles.infoLabel}>CLIENT :</Text>
                <Text style={styles.infoValue}>{payment?.payer?.employer}</Text>
              </View>
              <View style={styles.infoTableRow}>
                <Text style={styles.infoLabel}>Nom :</Text>
                <Text style={styles.infoValue}>{payment?.payer?.first} {payment?.payer?.last}</Text>
              </View>
              <View style={styles.infoTableRow}>
                <Text style={styles.infoLabel}>Tél :</Text>
                <Text style={styles.infoValue}>{payment?.payer?.phone}</Text>
              </View>
              <View style={styles.infoTableRow}>
                <Text style={styles.infoLabel}>Email :</Text>
                <Text style={styles.infoValue}>{payment?.payer?.email}</Text>
              </View>
              <View style={styles.infoTableRow}>
                <Text style={styles.infoLabel}>Pays :</Text>
                <Text style={styles.infoValue}>{payment?.payer?.country_origin}</Text>
              </View>
            </View>
          </View>
          
          {/* Ligne horizontale */}
          <View style={styles.divider} />
          
          {/* Tableau des détails de paiement */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell30, styles.label]}>Description</Text>
              <Text style={[styles.tableCell40, styles.label, styles.tableCellCenter]}>Types de permis</Text>
              <Text style={[styles.tableCell30, styles.label, styles.tableCellRight, styles.tableCellLast]}>Montant</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={styles.tableCell30}>Frais d'acquisition</Text>
              <Text style={[styles.tableCell40, styles.tableCellCenter]}>
                {payment?.facture_total_cadres && parseInt(payment.facture_total_cadres, 10) > 0 && `Permis A (${payment.facture_total_cadres}) `}
                {payment?.facture_total_agents && parseInt(payment.facture_total_agents, 10) > 0 && `Permis B (${payment.facture_total_agents}) `}
                {payment?.facture_total_ouvriers && parseInt(payment.facture_total_ouvriers, 10) > 0 && `Permis C (${payment.facture_total_ouvriers})`}
              </Text>
              <Text style={[styles.tableCell30, styles.tableCellRight, styles.tableCellLast]}>{formatAmount(payment?.amount)}</Text>
            </View>
            
            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.tableCell40}></Text>
              <Text style={[styles.tableCell30, styles.label, styles.tableCellRight]}>TOTAL TTC</Text>
              <Text style={[styles.tableCell30, styles.label, styles.tableCellRight, styles.tableCellLast]}>{formatAmount(payment?.amount)}</Text>
            </View>
          </View>
          
          {/* Signatures et QR code */}
          <View style={styles.signatureSection}>
            <View style={styles.signatureColumn}>
              <Image src={qrUrl} style={styles.qrCode} />
              <Text style={styles.signature}>Le Client</Text>
            </View>
            
            <View style={styles.signatureColumn}>
              <View style={styles.signatureLine} />
              <Text style={styles.signature}>La Banque</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

PaiementPDF.propTypes = {
  payment: PropTypes.shape({
    number: PropTypes.string,
    reference: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    facture_number: PropTypes.string,
    facture_ref: PropTypes.string,
    payment_method: PropTypes.string,
    devise: PropTypes.shape({
      name: PropTypes.string,
      sign: PropTypes.string,
    }),
    created_by: PropTypes.shape({
      name: PropTypes.string,
    }),
    payer: PropTypes.shape({
      employer: PropTypes.string,
      first: PropTypes.string,
      last: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
      country_origin: PropTypes.string,
    }),
    facture_total_cadres: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    facture_total_agents: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    facture_total_ouvriers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

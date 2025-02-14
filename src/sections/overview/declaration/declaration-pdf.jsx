import {
  Page,
  View,
  Text,
  Font,
  Image,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import React, { useMemo } from 'react';

import { fDate } from 'src/utils/format-time';

// Enregistrement de la police Roboto
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' },
  ],
});

// Création des styles avec useMemo pour éviter des recalculs inutiles
const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        page: {
          fontSize: 9,
          fontFamily: 'Roboto',
          padding: 30,
          backgroundColor: '#ffffff',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#cccccc',
          paddingBottom: 10,
          marginBottom: 20,
        },
        logoContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-start',
        },
        companyDetails: {
          flex: 2,
          justifyContent: 'center',
          alignItems: 'flex-end',
          textAlign: 'right',
        },
        companyName: {
          fontSize: 16,
          fontWeight: 'bold',
          paddingBottom: 5
        },
        companyContact: {
          fontSize: 10,
          paddingBottom: 5
        },
        date: {
          textAlign: 'right',
          fontSize: 10,
          marginBottom: 10,
        },
        declarationNumber: {
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginVertical: 10,
        },
        totalText: {
          fontSize: 10,
          fontWeight: 'bold',
          textAlign: 'right',
          marginBottom: 10,
        },
        rowContainer: {
          flexDirection: 'row', // Affiche les éléments en ligne
          justifyContent: 'space-between', // Espaces égaux entre les éléments
          marginBottom: 10, // Espace entre les lignes
          alignItems: 'center',
        },
        countText: {
          fontSize: 10,
          textAlign: 'center',
        },


        table: {
          display: 'table',
          width: 'auto',
          marginVertical: 10,
          borderWidth: 1,
          borderColor: '#cccccc',
        },
        tableRow: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: '#cccccc',
        },
        tableHeader: {
          backgroundColor: '#f5f5f5',
        },
        tableCell: {
          padding: 8,
          flex: 1,
          fontSize: 9,
        },
        cellSmall: {
          flex: 0.3,
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
      }),
    []
  );

export function DeclarationPDF({ declaration }) {
  const { declaration_number, create_date, items, user } = declaration;
  const styles = useStyles();

  // Calcul du nombre d'items pour le QR code
  const itemsCount = items ? items.length : 0;
  const cadresCount = items?.filter(item => item.fonction__category === "Cadres").length || 0;
  const agentCount = items?.filter(item => item.fonction__category === "Agent").length || 0;
  const ouvrierCount = items?.filter(item => item.fonction__category === "Ouvrier").length || 0;

  const qrData = encodeURIComponent(
    `${declaration_number} - ${itemsCount} personnes`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=100x100`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header : Logo et coordonnées de l'entreprise */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {user.profile_image ? (
              <Image src={user.profile_image} style={{ width: 60, height: 60 }} />
            ) : (
              <Text style={styles.companyName}>{user.company}</Text>
            )}
          </View>
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>{user.company}</Text>
            <Text style={styles.companyContact}>Tél : {user.phone_number}</Text>
            <Text style={styles.companyContact}>{user.address}</Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.date}>{fDate(create_date)}</Text>

        {/* Numéro de déclaration */}
        <Text style={styles.declarationNumber}>{declaration_number}</Text>

        {/* Total des personnes déclarées */}
        <View style={styles.rowContainer}>
          <Text style={styles.countText}>Total</Text>
          <Text style={styles.countText}>Cadres</Text>
          <Text style={styles.countText}>Agents</Text>
          <Text style={styles.countText}>Ouvriers</Text>
        </View>

        <View style={styles.rowContainer}>
          <Text style={styles.countText}>{itemsCount}</Text>
          <Text style={styles.countText}>{cadresCount}</Text>
          <Text style={styles.countText}>{agentCount}</Text>
          <Text style={styles.countText}>{ouvrierCount}</Text>
        </View>



        {/* Tableau des déclarations */}
        <View style={styles.table}>
          {/* En-tête du tableau */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.cellSmall]}>N°</Text>
            <Text style={styles.tableCell}>Passeport</Text>
            <Text style={styles.tableCell}>Nom</Text>
            <Text style={styles.tableCell}>Prénom</Text>
            <Text style={styles.tableCell}>Fonction</Text>

            <Text style={styles.tableCell}>Catégorie</Text>
          </View>

          {/* Lignes du tableau */}
          {items?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.cellSmall]}>
                {index + 1}
              </Text>
              <Text style={styles.tableCell}>{item.numero}</Text>
              <Text style={styles.tableCell}>{item.nom}</Text>
              <Text style={styles.tableCell}>{item.prenom}</Text>
              <Text style={styles.tableCell}>{item.fonction__name}</Text>
              <Text style={styles.tableCell}>{item.fonction__category}</Text>
            </View>
          ))}
        </View>

        {/* Signature et QR code */}
        <View style={styles.signatureContainer}>
          <Text style={styles.signatureText}>L'employé :</Text>
          <Image src={qrUrl} style={styles.qr} />
        </View>
      </Page>
    </Document>
  );
}

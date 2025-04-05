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
  const { reference, created_on, employees, } = declaration;
  const styles = useStyles();

  // Calcul du nombre d'items pour le QR code
  const itemsCount = employees ? employees.length : 0;
  const cadresCount = employees?.filter(employee => employee.category === "Cadre").length || 0;
  const agentCount = employees?.filter(employee => employee.category === "Agent").length || 0;
  const ouvrierCount = employees?.filter(employee => employee.category === "Ouvrier").length || 0;

  const qrData = encodeURIComponent(
    `${reference} - ${itemsCount} personnes`
  );
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${qrData}&size=100x100`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header : Logo et coordonnées de l'entreprise */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* {user?.profile_picture ? (
              <Image src={user?.profile_picture} style={{ width: 60, height: 60 }} />
            ) : (
              <Text style={styles.companyName}>{user?.profile_name}</Text>
            )}
          </View>
          <View style={styles.companyDetails}>
            <Text style={styles.companyName}>{user?.profile_name}</Text>
            <Text style={styles.companyContact}>Tél : {user?.profile_contact}</Text>
            <Text style={styles.companyContact}>{user?.profile_adresse}</Text> */}
          </View>
        </View>

        {/* Date */}
        <Text style={styles.date}>{fDate(created_on)}</Text>

        {/* Numéro de déclaration */}
        <Text style={styles.declarationNumber}>{reference}</Text>

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
          {employees?.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.cellSmall]}>
                {index + 1}
              </Text>
              <Text style={styles.tableCell}>{item.passport_number}</Text>
              <Text style={styles.tableCell}>{item.first}</Text>
              <Text style={styles.tableCell}>{item.last}</Text>
              <Text style={styles.tableCell}>{item.fonction}</Text>
              <Text style={styles.tableCell}>{item.category}</Text>
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

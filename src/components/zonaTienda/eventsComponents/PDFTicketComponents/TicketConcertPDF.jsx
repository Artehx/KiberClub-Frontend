import React from 'react';
import { Page, Document, PDFViewer, View, Text, StyleSheet, Font, Image } from '@react-pdf/renderer';
import TicketConcert from '../TicketConcert'; 
import { useEffect, Fragment } from 'react';
import { createTw } from "react-pdf-tailwind";
import MiniTicketPDF from './MiniTicketPDF';


const TicketConcertPDF = ({ tickets, concierto }) => {
  
  const groupSize = 3; //Número de entradas por página

  //Dividimos las entradas en grupos de tres o menos
 

  Font.register({
    family: 'Staatliches',
    src: 'https://cdn.jsdelivr.net/fontsource/fonts/staatliches@latest/latin-400-normal.ttf'
  })  


  const styles = StyleSheet.create({
    pageNumber: {
      textAlign: 'center',
      alignItems: 'flex-end',
      fontFamily: 'Staatliches'
    }
  });

  const renderPageNumber = (pageNumber, totalPages) => {
    return `${pageNumber}/${totalPages}`;
  };

  
  
  return (
  
    <Document>
      <Page size="A4" style={styles.page}>
        {tickets.map((ticket, index) => (
      
            <MiniTicketPDF
            key={index}
            concierto={concierto}
            ticket={ticket}
            
          />
          )
        )}
        <View>  
          
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => renderPageNumber(pageNumber, totalPages)} fixed />
        
        </View>  
      </Page>
    </Document>
 
  );
};


export default TicketConcertPDF;
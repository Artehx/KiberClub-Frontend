import React, { useState } from 'react';
import { Page, Document, PDFViewer, View, Text, StyleSheet, Font, Image } from '@react-pdf/renderer';
import TicketConcert from '../TicketConcert'; 
import { useEffect, useMemo, Fragment } from 'react';
import { createTw } from "react-pdf-tailwind";
import pedidoRESTService from '../../../../services/restPedido';


function MiniTicketPDF({ ticket, concierto }){

  const [qrCodeBase64, setQrCodeBase64] = useState(null);

  const randomNumber = useMemo(() => {
    const number = Math.floor(Math.random() * 100000000);
    return number.toString().padStart(8, '0');
  }, [])

  //Convierto el objeto entrada a formato JSON
  const entradaJSON = JSON.stringify(ticket);

  //Node.image (PASARLO A PADRE)
  /*
  useEffect(() => {
    async function recuperarQR(entrada) {
      try {
        const response = await pedidoRESTService.recuperarQR(entrada); 
        return response;
      } catch (error) {
        console.log('Error al recuperar el QR: ', error);
       
      }
    }

    const fetchQR = async () => {
      const response = await recuperarQR(entrada);
      setQrCodeBase64(response.qr);
    
    };

    fetchQR();
  }, []);*/
   



  useEffect(() => {
   console.log('Ticket miniTicket -> ', ticket);
  }, [ticket])
  

  //const qrDataURL = QRCode.toDataUrl(entradaJSON, {margin: 1});
    
   const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const fechaConcierto = concierto ? new Date(concierto.fecha) : null;  const dia = fechaConcierto.getDate();
  const mes = meses[fechaConcierto.getMonth()];

   Font.register({
  family: 'Nanum Pen Script',
   src: 'https://cdn.jsdelivr.net/fontsource/fonts/nanum-pen-script@latest/latin-400-normal.ttf' 
  });

  Font.register({
    family: 'Staatliches',
    src: 'https://cdn.jsdelivr.net/fontsource/fonts/staatliches@latest/latin-400-normal.ttf'
  })  

  const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap', // Añadir esta propiedad
        backgroundColor: '#E4E4E4',
        marginBottom: '30px'
      },
    sectionImage: { 
     borderColor: 'red',
     height: 180
    },
    sectionData: {
      fontFamily: 'Staatliches',
      backgroundColor: 'white',
      margin: 0,
      padding: 0,
      flexGrow: 1,
      height: 180,
      width: 130,
      

    },
    sectionQR: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      fontFamily: 'Staatliches',
      backgroundColor: 'white',
      margin: 0,
      padding: 0,
      flexGrow: 1,
      width: 5,
      height: 180,
      borderLeft: '1.2px dotted black',
      textAlign: 'center'


    },
    title: {
      fontFamily: 'Nanum Pen Script'
    },
    author: {
      fontSize: 800

    },
    image: {
      width: '213px',
      height: '180px', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      objectFit: 'cover',
      objectPosition: `${concierto.alignType}`
    },
    hrUp: {
      display: 'flex',
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
      width: '80%',
      marginTop: 10,
      marginBottom: 4.5,
      marginHorizontal: 25,
      alignItems: 'center',
    },
    hrDown: {
      display: 'flex',
      borderBottomColor: 'gray',
      borderBottomWidth: 0.5,
      width: '80%',
      marginTop: 2,
      marginBottom: 4.5,
      marginHorizontal: 25,
      alignItems: 'center',

    },
    dayAndYear: {
      fontSize: 14,
      fontWeight: 'bold', 
      color: 'black', 
      letterSpacing: -0.5 
    },
    monthText: {
      fontSize: 16, 
      color: '#228B22', 
      fontWeight: 'extrabold',
      textTransform: 'uppercase' 
    
    },
    artistTitle: {
     fontSize: 26.5,
     fontFamily: 'Nanum Pen Script',
  
    },
    artistName: {
     fontSize: 20,
     fontFamily: 'Nanum Pen Script',
     color: '#228B22'
    },
    hours: {
      fontSize: 14.5,
      color: '#228B22'
    },
    whiteLetter: {
     color: 'gray'
    },
    kiber: {
      fontSize: '10.8',
      marginHorizontal: '12px'
    },
    iconBolt: {
      width: "20px",
      height: "20px"

    },
    rotatedText: {
      fontSize: 9,
      color: 'gray', 
      transform: 'rotate(-90deg)', 
      marginVertical: '25px', 
    },
    typeTicket: {
      fontFamily: 'Nanum Pen Script',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#228B22',
      textAlign: 'center'
    },
    priceTicket : {
      color: 'red',
      fontSize: '16',
      marginLeft: '4'
    
    },
    iva: {
    color: 'red',
    fontSize: '12'
    },
    qrCode: {
      width: '85',
      height: '75',
    },
    qrKey: {
      fontSize: '12'
    }
    
  });


    return (
        <View style={styles.container}>
            
        <View style={styles.sectionImage}>
         <Image style={styles.image} src={concierto.artistaBASE64}></Image>

        </View>

        <View style={styles.sectionData}>
          <View>
            <View style={styles.hrUp} />
          </View>

          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', 
          alignItems: 'center', textAlign: 'center', marginHorizontal:'25px'}}>
            <Text style={styles.dayAndYear}>{concierto.dia}</Text>
            <Text style={styles.monthText}>{dia} DE {mes.toUpperCase()}</Text>
            <Text style={styles.dayAndYear}>2022</Text>
          </View>

          <View>
            <View style={styles.hrDown} />
          </View>

          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', textAlign: 'center'
          }}>
          <Text style={styles.artistTitle}>{concierto.titulo}</Text>
          
          <View style={{display: 'flex', flexDirection: 'row'}}>
          
          <Text style={styles.artistName}>{concierto.artistaPrincipal.nombre}</Text>

          {concierto.artistasSecundarios?.length > 0 && (
          <>
          <Text style={styles.artistName}> + </Text>
          {concierto.artistasSecundarios.map((artista, index) => (
            <Fragment key={index}>
              {index > 0 && <Text style={styles.artistName}> + </Text>}
              <Text style={styles.artistName}>{artista.nombre}</Text>
            </Fragment>
          ))}
        </>
         )}
         </View>

           <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', textAlign: 'center', marginTop: '2px'
          }}>
            <Text style={styles.hours}>De {concierto.hora} <Text style={styles.whiteLetter}> A </Text> {concierto.horaFinal}</Text>
            <Text style={styles.hours}>PUERTAS <Text style={styles.whiteLetter}> @ </Text> {concierto.puertas}</Text>
           </View>

          </View>

          <View>
            <View style={styles.hrUp} />
          </View>

          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            alignItems: 'center', textAlign: 'center', marginTop: '2px'
          }}>
           <Text style={styles.kiber}>Kiber Club Inc.</Text>
           <Image style={styles.iconBolt} src={"/public/images/bolt_solid.png"}></Image>
           <Text style={styles.kiber}>{concierto.ubicacion}</Text>
          </View>
          

        </View>
        <View style={styles.sectionQR}>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          marginLeft: '-10.8px', height: '100%', width: '40'
         }}>
          <Text style={styles.rotatedText}>KIBER CLUB</Text>
          <Text style={styles.rotatedText}>KIBER CLUB</Text>
          <Text style={styles.rotatedText}>KIBER CLUB</Text>

        </View>

        <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
            alignItems: 'flex-start', width: '78%', marginTop: '15px', marginRight: '6.5px'
          }}>
        <Text style={styles.typeTicket}>
        {ticket.entrada.tipo}
        </Text>

        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
         alignItems: 'center', marginTop: '6.5px', gap: '10px'
        }}>
          <Text style={styles.priceTicket}>{ticket.entrada.precio}€</Text>
          <Text style={styles.iva}>*Iva incluido</Text>
        </View>

        <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', marginTop: '8px'
        }}>
        
        
        <Image style={styles.qrCode} src={ticket.entrada.qr}/>
          
        
        <Text style={styles.qrKey}>#{ticket.entrada.id}</Text>

        </View>
    
        </View>

        </View>

  
     
      </View>

    )

}

export default MiniTicketPDF;
import { useParams } from "react-router-dom";
import { useClienteLoggedContext } from "../../../context-providers/ClienteLoggedContext";
import { useTicketSelectionContext } from "../../../context-providers/TicketSelectionContext";
import { useEffect, useState } from "react";
import indexedDBService from "../../../services/indexedDB";
import { PDFViewer, pdf} from '@react-pdf/renderer';
import TicketConcert from "./TicketConcert";
import StepperCompra from "./StepperCompra";
import TotalTickets from "./TotalTickets";
import StripeCard from "./StripeCard";
import TicketPDF from "./PDFTicketComponents/TicketConcertPDF";
import TicketConcertPDF from "./PDFTicketComponents/TicketConcertPDF";


function FinalizarCompra() {

    const {clienteLogged, dispatch: clienteDispatch} = useClienteLoggedContext();
    const { ticketSelection, dispatch: ticketDispatch } = useTicketSelectionContext();
    
    const [pdfBlob, setPdfBlob] = useState(null);

    const [concierto, setConcierto] = useState(null);
    const [entradas, setEntradas] = useState([]);

    const [activeStep, setActiveStep] = useState(0);
    const [descuentos, setDescuentos] = useState({});
    const [descuentoSelected, setDescuentoSelected] = useState({});
    const [descuentoIdSelected, setDescuentoIdSelected] = useState("0");

    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0.0);
    const [gastosGestion, setGastosGestion] = useState(4.60);
    

    let {id} = useParams();

    console.log('id del concierto: ', id);

    function calcularTotal(ticketSelection) {
      return ticketSelection.reduce((acumulador, ticket) => {
          return acumulador + (ticket.entrada.precio * ticket.cantidad);
      }, 0).toFixed(2);
    }

    const reciboTickets = (tickets) => {
      return tickets.reduce((acc, ticket) => {
        const tipo = ticket.entrada.tipo;
        if (!acc[tipo]) {
          acc[tipo] = {
            tipo: tipo,
            precio: ticket.entrada.precio,
            cantidad: 0
          };
        }
        acc[tipo].cantidad += ticket.cantidad;
        return acc;
      }, {});
    };

    const ticketsAgrupados = reciboTickets(ticketSelection);
    const listaAgrupada = Object.values(ticketsAgrupados);

    useEffect(() => {
    
      console.log("Cambio de descuento: ", descuentoIdSelected);
    
    }, [descuentoIdSelected]);

    


    useEffect(() => {
      async function searchDescuentos() {

          //Buscamos primero los géneros del artista principal para luego con las ids de esos géneros (gustos musicales...)
          // hacer una busqueda en los descuentos del cliente y solo guardar en el state de Descuentos los que coincidan
          const generos = concierto ? concierto.artistaPrincipal.generos.map(genero => genero._id) : [];
          
          console.log('generos del concierto: ', generos);

          const descuentosDisponibles = clienteLogged.datoscliente.descuentosGanados.filter(descuento =>
              generos.includes(descuento.idCategoria)
          );
  
          setDescuentos(descuentosDisponibles);
      }
  
      searchDescuentos();
     }, [concierto]);

     useEffect(() => {
      
      const subTotalTickets = calcularTotal(ticketSelection);
      const subTotal = parseFloat(subTotalTickets);
 
      setSubTotal(subTotal);

      let total = subTotal + gastosGestion;
      console.log('Total -> ', total);
      setTotal(total);
     
       
     }, [subTotal])
     

     useEffect(() => {

      console.log('Descuentos disponibles?? ', descuentos);

     }, [concierto])
    

    useEffect(() => {
      indexedDBService.recuperarConcierto(id, (conciertoRecuperado) => {
          setConcierto(conciertoRecuperado);
      });
     }, [id]);

     useEffect(() => {
     // console.log('ticketSelection finalizarCOMPRA: ', ticketSelection)
      setEntradas(ticketSelection);
     }, [ticketSelection]);

     useEffect(() => {
       
       console.log('Datos del concierto: ', concierto);
       //console.log('Datos de las entradas: ', JSON.stringify(ticketSelection));

       console.log('Entradas -> ', entradas)


     }, [concierto])

     
     const handleChangeDescuento = (ev) => {
       
      if(ev.target.value != "0"){

        const selectedDescuentoId = ev.target.value;
        setDescuentoIdSelected(selectedDescuentoId);
        const selectedDescuento = descuentos.find(descuento => descuento._id === selectedDescuentoId);
        setDescuentoSelected(selectedDescuento);

        const descuento = parseFloat(selectedDescuento.descuento);
        
        console.log('descuento a aplicar: ', descuento);

        const newTotal = total - (total * descuento);
        console.log("Subtotal - descuento ", newTotal);

        setTotal(newTotal);

      } else {

        setDescuentoSelected({});
        setDescuentoIdSelected("0");
        let subtotalDefault = calcularTotal(ticketSelection);

        subtotalDefault = parseFloat(subtotalDefault) + gastosGestion;

        //console.log("Subtotal reiniciado: ", subtotalDefault);
        setTotal(parseFloat(subtotalDefault));
      
      }
     }

     const handleNextStep = () => {
      //Como solo hay dos opciones controlo que no sume más 
      // o menos opciones, solo la opcion ticket(0) y la de pago(1)

      if(activeStep != 1){
        setActiveStep((prevStep) => prevStep + 1);
      }
    };

    const handlePrevStep = () => {

      if(activeStep != 0){
        setActiveStep((prevStep) => prevStep - 1);
      }

      
    };
     
    const stepTitle = activeStep === 0 ? "Datos de la factura" : "Elige la forma de pago";

    //TicketPDF

      function generatePDFBlob (concierto, entradas) {
     
      try {
        
        const pdfTickets = (
          concierto && entradas &&
          <TicketConcertPDF concierto={concierto} tickets={entradas}/>
        );
      
          console.log('Pdf Tickets ', pdfTickets)
        
         return pdf(pdfTickets).toBlob();
   

      } catch (error) {
        console.log('Error en generatePDFBlob -> ', error)
      }
      
    }
    
    useEffect(() => {
      if (concierto != null && concierto.artistaPrincipal != null && entradas) {
        //console.log('Artista principal -> ', concierto.artistaPrincipal.nombre, concierto.artistaBASE64);
        console.log('Entra por aqui..');
        async function generateAndSetPDFBlob() {
          try {
            console.log('Entra aqui');
            
            const blob = await generatePDFBlob(concierto, entradas);
            console.log('Blob ->', blob);
            if (blob) {
              console.log('Guarda el archivo!!');
              setPdfBlob(blob);
              return "Todo bien";
            } else {
              console.log("Error: Concierto o entradas nulos");
            }
          } catch (error) {
            console.error("Error al generar el PDF:", error);
          }
        }
        
       let response = generateAndSetPDFBlob();
       console.log('Respuesta ' , response);
      }
    }, [concierto, entradas]);

    return (

        <div className="flex w-full justify-between pt-24">
        <div className="w-3/5 overflow-y-auto relative ml-2 mr-3 scrollbar-hide">
          {/* Esta parte crea un nuevo array con una longitud igual a la cantidad especificada en la entrada actual
              Array.from({ length: entrada.cantidad }) y luego..Se itera de nuevo*/}
         <div className="w-full absolute">
      
         {concierto && (
          <>
            {entradas.map((entrada, index) => (
                <div key={index} >
                  <TicketConcert ticket={entrada} concierto={concierto} />
                </div>
              )
            )}
            {entradas.length === 1 && entradas[0].cantidad === 1 && (
              <div className="flex h-56 justify-center items-center">
                <p className="text-4xl text-gray-500 staatliches">Sin más entradas adquiridas...</p>
              </div>
            )}
          </>
        )}
        </div>

        </div>

        <div className="w-2/5 border-l-4 shrink-0 min-h-[33rem] bg-blue-gray-50 border-gray-600">
         <div className="flex flex-col ">
          <StepperCompra activeStep={activeStep} onNextStep={handleNextStep} onPrevStep={handlePrevStep}/>
          <div className="text-center flex-col mb-4">
           <span className="silkScreen text-2xl">{stepTitle}</span>
          </div>
        
        {/*Zona factura*/}
        <div className="flex flex-col gap-2 items-center">
        {activeStep === 0 ? (
           <div className="grid grid-cols-1 w-11/12 gap-y-2.5">
           {listaAgrupada.map((elemento, index) => (
           <div key={index} className="flex justify-between">
             <span className="text-lg silkScreen">{elemento.tipo}</span>
             <span className="text-lg text-red-500 silkScreen">{elemento.precio} € 
               <span className="text-lg text-yellow-800 staatliches ml-4"> x {elemento.cantidad}</span>
             </span> 
            </div>
            ))}
   
               <div className="flex justify-between items-center">
                   <span className="text-lg silkScreen">Descuento a aplicar: </span>
                   <select className="bg-white w-2/4 h-10 silkScreen text-sm pl-1 border-gray-400 border-2" value={descuentoIdSelected} onChange={handleChangeDescuento}>
                       {Object.keys(descuentos).length === 0 ? ( //Si no existen descuentos con ese/esos genero/s mostramos un option 
                           <option value="0">Sin descuentos</option>
                           ) : (
                           descuentos.map((descuento, index) => (
                             <>
                               <option value="0">Selecciona un descuento...</option>
                               <option className="silkScreen" key={index} value={descuento._id}>{descuento.porcentaje} {descuento.titulo}</option>
                             </>
                           ))
                       )}
                   </select>
               </div>
   
               <div className="flex justify-between">
                <span className="text-lg silkScreen">Gastos de gestion: </span>
                <span className="text-xl text-red-500 silkScreen">{gastosGestion.toFixed(2)} <span className="text-yellow-800"> € </span></span>
               </div>
   
               <div className="flex justify-between">
               <span className="text-lg silkScreen">Subtotal: </span>
               <span className="text-xl text-red-500 silkScreen">{subTotal.toFixed(2)}  <span className="text-yellow-800"> € </span></span>
               </div>
             
               <div className="flex justify-between">
               <span className="text-lg silkScreen">Total: </span>
               <span className="text-xl text-red-500 silkScreen">{total.toFixed(2)}  <span className="text-yellow-800"> € </span></span>
               </div> 

               <div className="flex flex-col gap-2 items-center">

               <div className="flex w-full justify-center mt-6">
               <button className="inline-block silkScreen py-3 px-8 mb-6 text-center 
                text-lg leading-6 text-white font-extrabold bg-green-700 hover:bg-green-800 border-3
              border-green-900 shadow rounded" onClick={handleNextStep}>Continuar</button>
               </div>

               </div>
    
           </div>
           ) : (
            <div className="w-4/5">
            
            <StripeCard totalPago={total} idConcierto={id} descuentoId={descuentoIdSelected}
            pdfBlob={pdfBlob}
            />
           
            </div>
        )}
        </div>

        
         {/* concierto && entradas &&
           <PDFViewer width="600" height="320">
          <TicketPDF concierto={concierto} tickets={entradas}></TicketPDF>

          </PDFViewer>
         */}
        

        
        </div>
      </div>

        
  </div>
    )
}

export default FinalizarCompra;
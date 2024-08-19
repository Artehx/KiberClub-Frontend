import { useClienteLoggedContext } from "../../../context-providers/ClienteLoggedContext";
import { Elements, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect,  } from "react";
import CheckoutForm from './CheckoutForm';
import pedidoRESTService from '../../../services/restPedido';
import indexedDBService from "../../../services/indexedDB";


function StripeCard({totalPago, idConcierto, descuentoId, pdfBlob}) {

    const {clienteLogged, dispatch: clienteDispatch} = useClienteLoggedContext();
    const [requestSent, setRequestSent] = useState(false);
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
   
    useEffect(() => {
      async function configFetch() {
          if (!requestSent) {
              try {
                  const publishableKey = await pedidoRESTService.configStripe();
                  setStripePromise(loadStripe(publishableKey));
              } catch (error) {

              } finally {
                  setRequestSent(true);
              }
          }
        }

        if(!requestSent){

          configFetch();
        }

    }, [requestSent]);

     useEffect(() => {
      async function createPayment() {
          if (!requestSent) return;
          try {
              console.log('Total pago Stripe: ', totalPago);
              const clientSecret = await pedidoRESTService.createPaymentIntent(totalPago, clienteLogged.datoscliente.cuenta.email);
              setClientSecret(clientSecret);
          } catch (error) {

            console.log('Error -> ', error)
           }
          }
          
          //Con este state 'requestSent' me aseguro de que crea solo un pago
          // No se si era por el comportamiento de react que me renderiza el componente
          // dos veces y me manda la peticion dos veces tambien creando dos pagos
          if (requestSent && !clientSecret) {
            createPayment();
          }
      }, [requestSent, clienteLogged]);

      useEffect(() => {
        
        //AQUI GUARDO EN EL INDEXED DB LA CLAVE DEL PAGO {SECRET KEY, BLOB} Y EL PDF
        //Y LUEGO CUANDO SE COMPLETE EL PAGO EN EL HIJO (CHECKOUTFORM) Y REDIRIJA AL USUARIO 
        // A MIS TICKETS RECUPERANDO LOS DATOS DEL USUARIO Y EN ESA MISMA FUNCION DE FORZAR SESION
        // COMO EL PAGO YA SE HA REALIZADO CON EXITO AGREGO EL PDF A ESA ORDEN correjir...

        async function storePDF() {

          if(pdfBlob != null && clientSecret != null){
            console.log('PDFBlob ', pdfBlob);
            
            await indexedDBService.almacenarPDF(pdfBlob, clientSecret);
          
          } else {
            console.log('El blob viene null...');
          }
        }

        storePDF();

      }, [clientSecret, pdfBlob])
      

      
    return (
    <div>
       {clientSecret && stripePromise && (
      <Elements stripe={stripePromise} options={{clientSecret}} >
       <CheckoutForm clientSecret={clientSecret} idConcierto={idConcierto}
         totalPago={totalPago} descuentoId={descuentoId} />
      </Elements>
        )}
    </div>
    )


}

export default StripeCard;
import { useTicketSelectionContext } from "../../../context-providers/TicketSelectionContext";
import { useClienteLoggedContext } from "../../../context-providers/ClienteLoggedContext";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import {toast} from 'react-toastify';
import SpinnerPayment from "../../../assets/utils/spinnerPayment";
import pedidoRESTService from "../../../services/restPedido";
import TicketPDF from './PDFTicketComponents/TicketConcertPDF';

function CheckoutForm({clientSecret, idConcierto, totalPago, descuentoId}) {
  //Elementos de la tarjeta
  const stripe = useStripe();
  const elements = useElements();

  const { ticketSelection, dispatch: ticketDispatch } = useTicketSelectionContext();
  const {clienteLogged, dispatch: clienteDispatch} = useClienteLoggedContext();


  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    
    console.log('Descuento Id en checkOutForm -> ', descuentoId);
  }, [descuentoId])
  

  
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!stripe || !elements) {
      //Verifica si el objeto elements está presente o definido. 
      //Al igual que stripe, si elements es igual a nulo, undefined o falso 
      //indica que Stripe.js no se ha cargado bien
     console.log('Stripe no se ha cargado correctamente...')
      return;
    }

    setIsProcessing(true);

   // let paymentElement = elements.getElement('payment');
   // console.log('Elementos xd -> ', paymentElement); //In null...

   // No se si es el paquete de stripe que he instalado a ser una version especifica, invalida que
   // pueda mapear correctamente los campos y utilizar los metodos para confirmar el pago peeeero
   // eso no me impide confirmar el pago a mano y no lo he visto tan mala opcion

   //...He probado a instalar la última version y no mapea los campos tampoco (Por probar...)
   // Pero si me funciona la funcion de confirmPayment asi que voy a utilizarla
  
   
    const cardElement = elements.getElement('card');
   
    console.log('CardElement: ', cardElement);

    //Enviar la orden al back 

    let responseOrder = await pedidoRESTService.nuevaOrden(ticketSelection, idConcierto, 
      clientSecret, totalPago);
    console.log('Order checkoutForm: ', responseOrder);
    if(responseOrder.codigo === 0){
   
      console.log('Salio bieeen... ');
      
    } else {

      toast.error('Error en el servidor, vuelva a intentarlo más tarde...')
      setIsProcessing(false);

      return;
    }

    console.log(clienteLogged.datoscliente._id);

    const return_url = `${window.location.origin}/Panel/MisTickets?clienteId=${clienteLogged.datoscliente._id}&descuentoId=${descuentoId}`;
    console.log('Url -> ', return_url);
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: return_url,
      },
    });
 
    if(error){

      console.log(error);

      //SI HAY ALGUN ERROR TENGO QUE ELIMINAR EL PAGO DE MONGO??
      // No deberia por si acaso se corrige el error, ya no tendria la orden almacenada
      // En todo caso crear algun mecanismo que borre las ordenes cada cierto tiempo que esten 'pendientes'

      switch(error.decline_code){

        case 'stolen_card':
          toast.error("Ponganse en contacto con el banco, tarjeta inaccesible");
        break;

        case 'insufficient_funds':
          toast.error("Fondos insuficientes de mileurista, fuuuuck");
        break;

        default:
          toast.error(error.message);

        break;

      }

    } 

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="card"  />
      <div className="flex justify-center py-3">
      <button className="inline-block silkScreen py-1.5 px-8 text-center 
       text-lg leading-6 text-white font-extrabold bg-green-700 hover:bg-green-800 border-3
     border-green-900 shadow rounded" type="submit" disabled={isProcessing || !stripe || !elements} id="submit">
       <span id="button-text">
            {isProcessing ? 
              <SpinnerPayment/> : 
              "Pagar"
            }
       </span>
      </button>
      </div>
    </form>
  );
}

export default CheckoutForm;
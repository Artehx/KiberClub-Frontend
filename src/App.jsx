import 'tailwindcss/tailwind.css';
import './App.css';
import { useState, useEffect } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ClienteLoggedProvider } from './context-providers/ClienteLoggedContext';
import { TicketSelectionProvider } from './context-providers/TicketSelectionContext';
import Layout from "./components/zonaTienda/layoutComponents/Layout";
import Login from "./components/zonaCliente/loginComponent/Login";
import Registro from './components/zonaCliente/registroComponent/Registro';
import MusicaEvents from "./components/zonaTienda/eventsComponents/MusicaEvents";
import MostrarConcierto from './components/zonaTienda/eventsComponents/MostrarConcierto';
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RegistroOK from './components/zonaCliente/registroComponent/RegistroOK';
import tiendaRESTService from './services/restTienda';
import Roulette from './components/zonaCliente/panelComponents/Roulette';
import Calendario from './components/zonaCliente/panelComponents/Calendario';
import MyProfile from './components/zonaCliente/panelComponents/MyProfile';
import FinalizarCompra from './components/zonaTienda/eventsComponents/FinalizarCompra';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import MisTickets from './components/zonaCliente/panelComponents/MisTickets';
import MisChats from './components/zonaCliente/panelComponents/MisChats';


function App() {

  const [stripePromise, setStripePromise] = useState(null);

  
  useEffect(() => {
    fetch("http://localhost:5000/api/Pedido/configStripe").then(async(r) => {
      const {publishableKey} = await r.json();

     setStripePromise(loadStripe(publishableKey));

   })
  }, [])

  const customPositionStyle = {
    top: '110px', 
    right: '20px', 
  };



  const routerObjects = createBrowserRouter([
    {
      element: <Layout/>,
      children: [
        { path: '/', element: <Navigate to="Eventos/Musica"/>},
        { path: 'Cliente/Login', element: <Login/> },
        { path: 'Cliente/Registro', element: <Registro/> },
        { path: 'Cliente/RegistroOK', element: <RegistroOK/>},
        { path: 'Eventos/Musica', element: <MusicaEvents/>, loader: tiendaRESTService.recuperarConciertos  },
        { path: 'Eventos/MostrarConcierto/:id', element: <MostrarConcierto/>},
        { path: 'Panel/Ruleta', element: <Roulette/>},
        { path: 'Panel/Calendario', element: <Calendario/>},
        { path: 'Panel/MiPerfil', element:<MyProfile/>},
        { path: 'Panel/MisTickets', element:<MisTickets/>},
        { path: 'Panel/MisChats', element: <MisChats/>},
        //{ path: 'Eventos/Festivales' },
        //{ path: 'Eventos/Teatro' },
        { path: 'Eventos/FinalizarCompra/:id', element: <FinalizarCompra/> } 
      ]
    }
  ]);

  return (
    <>
      <Elements stripe={stripePromise}>
      <ClienteLoggedProvider>
      <TicketSelectionProvider>
      <RouterProvider router={routerObjects} />
      <ToastContainer autoClose={2800} style={customPositionStyle} position='top-right' />
      </TicketSelectionProvider>
      </ClienteLoggedProvider>
      </Elements>
    
    </>
  );
}

export default App;

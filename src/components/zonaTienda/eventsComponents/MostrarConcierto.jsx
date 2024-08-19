import { useClienteLoggedContext } from "../../../context-providers/ClienteLoggedContext";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import tiendaRESTService from "../../../services/restTienda";
import { animateTitle } from "../../../assets/utils/titleAnimation";
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { faEuro } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SpotifyPlayer from "./SpotifyPlayer";
import EventMap from "./EventMap";
import WeatherCard from "./WeatherCard";
import clienteRESTService from "../../../services/restCliente";
import pedidoRESTService from "../../../services/restPedido";
import {toast} from 'react-toastify';
import PricesEvent from "./PricesEvent";
import { useTicketSelectionContext } from "../../../context-providers/TicketSelectionContext";
import TotalTickets from "./TotalTickets";
import { useNavigate } from 'react-router-dom';
import indexedDBService from "../../../services/indexedDB";


function MostrarConcierto() {

    const navigate = useNavigate();
    let { id } = useParams();

    const {clienteLogged, dispatch: clienteDispatch} = useClienteLoggedContext();
    const { ticketSelection, dispatch: ticketDispatch } = useTicketSelectionContext();
    
    let [evento, setEvento] = useState({});
    let [artistaPrincipal, setArtistaPrincipal] = useState("");
    const [topTracks, setTopTracks] = useState([]);

    const [favorito, setFavorito] = useState(false);

    const [weatherData, setWeatherData] = useState({});
  
    useEffect(() => {
     
      ticketDispatch({ type: 'CLEAR_TICKETS' });
    }, []);

  

    useEffect(
      function() {
       async function petEventoAMostrar(id) {
       let _eventoRecup = await tiendaRESTService.recuperarConcierto(id);
        console.log(`RECUPERADO: ${_eventoRecup}`);
        setEvento(_eventoRecup);
        setArtistaPrincipal(_eventoRecup.artistaPrincipal.nombre);
       }
        petEventoAMostrar(id);
      },
      [id]
    );
   
    useEffect(() => {
      async function petTopTracks(nombre) {
        try {
          const response = await tiendaRESTService.recuperarTopTracksArtista(nombre);
          
          if (response && response.topTracksURIS) {
            setTopTracks(response.topTracksURIS);
          }
        } catch (error) {
          console.error('Error al recuperar los top tracks del artista:', error);
        }
      }
      if (artistaPrincipal != "") {
        petTopTracks(artistaPrincipal);
        
      }
    }, [evento]);

    useEffect(() => {
      
     indexedDBService.almacenarConcierto(evento);
    
    }, [evento.artistaPrincipal]);

    useEffect(
      function() {
       async function petTiempoConcierto(latitud, longitud, fecha) {
        try {
          const response = await tiendaRESTService.recuperarTiempo(latitud, longitud, fecha);
          if(response && response.data) {

           setWeatherData(response.data || {});
          }
          
        } catch (error) {
          console.error('Error al recuperar el tiempo del concierto:', error);
        }
       }
       if(evento.coordenadas){
        //console.log(`Entra en petTiempoConcierto ${evento.coordenadas.longitud} y ${evento.fecha}`)
        petTiempoConcierto(evento.coordenadas.latitud, evento.coordenadas.longitud, evento.fecha)
      }
 
      }, [evento]);

      useEffect(() => {
        //Efecto para comprobar si el concierto que se muestra esta en favoritos para ese cliente
        if (clienteLogged) {
        const esFavorito = clienteLogged.datoscliente.favoritos.some(fav => fav._id === id);

         //console.log('Es favorito?? -> ', esFavorito);

         console.log('Favoritos del cliente: ', clienteLogged.datoscliente.favoritos);

         if(esFavorito){
          setFavorito(esFavorito);
         } else {

          console.log('No esta en favoritos...')
         }
        }


      },[clienteLogged, id]);

      const handleFavoritoClick = async () => {
        try {
          console.log(id, clienteLogged.datoscliente._id);
          const response = await clienteRESTService.manejarFavorito(
            id,
            clienteLogged.datoscliente._id,
            { tipo: favorito ? 'eliminar' : 'agregar' }
          );
      
          if (response.codigo === 0) {
            switch (response.operacion) {
              case 'agregar':
           
                toast.success('¡Evento añadido al calendario!');
                setFavorito(true);
                break;
              case 'eliminar':
    
                toast.warning('Evento eliminado del calendario...');
                setFavorito(false);
                break;
            }
            //console.log(`Nuevos favoritos: ${response.favoritos}`);
            clienteDispatch({ type: 'ACTUALIZAR_FAVORITO', payload: response.favoritos });
          } else {
            console.log('Algo salió mal...');
            toast.error('Error en el servidor, pruebe más tarde...');
          }
        } catch (error) {
          console.log(`Algo salió mal... ${error}`);
        }
      };

      const handleCompraClick = async () => {

        //AQUÍ GENERO LOS QR
        console.log('Aqui entra...');

        if (!clienteLogged) {
          toast.warn('Inicia sesión para comprar entradas', { appearance: 'error' });
        } else if (ticketSelection.length === 0) {
          toast.error('Selecciona al menos una entrada para comprar');
        } else {
          console.log('Aqui entra...');
          const ticketsConQR = await Promise.all(ticketSelection.map(async ticket => {
            try {
              const response = await pedidoRESTService.recuperarQR(ticket);
              //console.log('Nuevo QR: ', response.qr)
              return { ...ticket, entrada: { ...ticket.entrada, qr: response.qr } };
            } catch (error) {
              console.log('Error al recuperar el QR: ', error);
              return ticket;
            }
          }));
          console.log('Tickets con QR -> ', ticketsConQR);
          // Actualizar el estado con los tickets que tienen QR
          ticketDispatch({ type: 'UPDATE_TICKETS', payload: ticketsConQR });

          console.log('Tickets actuales: ', ticketSelection);

          navigate("/Eventos/FinalizarCompra/" + evento._id);
        }
      };

  


  return (

    <div className="flex flex-col pt-4">
      {/*Sección de info y foto de cartelera*/}
      <div className="w-full grid grid-cols-2 items-start pt-28 pb-4 background-gray border-b-4 border-gray-700">
      
      {/* Info artista */}
      <div className="pl-20 text-lg flex flex-col">
      {/* Título y botones en la misma fila */}
      <div className="flex justify-between items-center mb-4 ">
        <span className="silkScreen text-2xl">{animateTitle('¡KIBER CLUB PRESENTA!')} </span>
        {/* Botones  */}
        <div className="ml-4">

        {
          !clienteLogged?
           (
            <Link to={'/Cliente/Login'} className="text-sm silkScreen bg-red-600 text-white px-2 py-2 rounded">
            <i className="far fa-heart fa-md cursor-pointer mr-1">
              <FontAwesomeIcon  icon={farHeart} color='white' />
            </i>
             Seguir
            </Link>
            )
          :
            (
            <button className="text-sm silkScreen bg-red-600 text-white px-2 py-1 rounded"
            onClick={handleFavoritoClick}>
            <i className="far fa-heart fa-md cursor-pointer mr-1">
              <FontAwesomeIcon icon={favorito ? solidHeart : farHeart} color='white' />
            </i>
          
            {favorito ? 'Siguiendo' : 'Seguir'}
          </button>
            )
          }

          <button className="text-sm silkScreen bg-green-700 text-white px-2 ml-2 py-1 rounded">
          <i className="far fa-share fa-md cursor-pointer mr-1">
                <FontAwesomeIcon icon={faShareAlt} color='white' />
            </i>
            Compartir</button>
        </div>
      </div>

      {/* Información del artista */}
      {evento.artistaPrincipal && (
      <>
        <div className="flex justify-between gap-4 ">
          <div className="shrink-0">
        <span className='silkScreen text-sm'>Inicio ➔ <span className='text-red-500'>{evento.artistaPrincipal.generos[0].nombreGenero}</span> ➔ {evento.artistaPrincipal.nombre}</span>        <br />
        <span className={`text-${evento.artistaPrincipal.nombre.length > 10 ? '4xl' : '5xl'} font-extrabold text-green-800 w-full`}>
       {evento.artistaPrincipal.nombre.toUpperCase()}
       </span>       
        <br />
        <span className="font-semibold silkScreen text-sm pt-2"><span className="text-green-700">Ubicación:</span> {evento.ubicacion}</span>
        <div>
          <span className="font-semibold silkScreen text-sm"><span className="text-green-700">Artista Principal:</span> {evento.artistaPrincipal.nombre}</span>
        </div>
          {/* Telenores (si hay...) */}
          {evento.artistasSecundarios && evento.artistasSecundarios.length > 0 && (
          <div>
            <span className="font-semibold silkScreen text-sm">Teloneros: </span>
            {evento.artistasSecundarios.map((telonero, index) => (
              <span className="font-semibold silkScreen text-sm" key={index}>{telonero.nombre} {index !== evento.artistasSecundarios.length - 1 && ','}</span>
            ))}
          </div>
        )}
        <div>
        <span className="font-semibold silkScreen text-sm">Fecha: {new Date(evento.fecha).toLocaleDateString()} </span>        
        </div>
         <span className="font-semibold silkScreen text-sm">Hora: {evento.hora}h</span>
           </div>
           <div className="w-full">    
                {topTracks.length > 0 && <SpotifyPlayer trackUris={topTracks} />}
             </div>
         </div>

         
        {/*Generos del artista*/}
            <div className="shrink">
              <div>
            {evento.artistaPrincipal.generos.map((genero) => (
                        <button key={genero.idGenero}  
                        className={"rounded-lg  silkScreen border-2 border-gray-800 bg-red-600 text-white mt-4 p-1 m-1"}>
                          <span className="text-lg">{genero.icono}</span>{genero.nombreGenero}
                        </button>
                      ))}
             </div>
          
         </div>

       
      
      </>
      )}
     
      </div>
      {/* Cartelera artista */}
      <div className="flex justify-center">
        <img src={evento.artistaBASE64}
          className="w-3/4 max-w-1/2 max-h-80 object-cover rounded-2xl "/>
      </div>
     

     </div>
      
    {/* Sección de precios y compra de tickets white-pattern*/}
    <div className="white-pattern">
    <div className="pt-8 flex gap-8 pl-16 pb-2">
  {/* Primera columna (2/3 del ancho) */}
  {evento.precios && (
     <PricesEvent precios={evento.precios}/>
    )}
  {/* Segunda columna (1/3 del ancho) */}
  {/* <div className="w-1/3 border-4 border-gray-700 flex flex-col justify-start  text-center items-center bg-white mr-16"> */}
  
  <div className="w-1/3 border-4 border-gray-700 flex flex-col justify-start text-center items-center bg-gray-200 mr-16">
  
    {/* Precio y botón de comprar tickets */}
    <div className="p-6 sticky mt-4 top-24 z-20">
      {/* Título */}
      <h3 className="text-lg silkScreen">Ticket total</h3>
      {/* Precio */}
      <span className="text-5xl silkScreen font-bold ">
      <TotalTickets /> 
      <i className="fa-solid fa-xs fa-euro-sign ml-1">
      <FontAwesomeIcon icon={faEuro} color='red'/>
        </i></span>
      <br></br>
      <span className="text-xs silkScreen">Continue para ver las opciones de entrega</span>
      <br></br>
      {/* Contenido (por ejemplo, botón de comprar tickets) */}
      <button onClick={handleCompraClick} className="inline-block w-full silkScreen py-3 px-4 mt-1 text-center text-lg leading-6 text-white font-extrabold bg-green-800 hover:bg-green-900 border-3 border-green-900 shadow rounded transition duration-200">
      Comprar tickets
      </button>

      <p className="text-sm text-gray-600 mb-4">*Puede variar según la selección al finalizar la compra.</p>
    
    </div>
  </div>


  </div>
  
  <div className="flex gap-8"> 

  <div id="mapContainer" className="w-2/3 border-4 border-gray-700 bg-gray-700 ml-16 pb-1 mb-4">
  {evento.coordenadas && (
    <EventMap coordenadas={evento.coordenadas}></EventMap>
  )}
  <span className="flex justify-center text-white text-xl mt-1 font-semibold silkScreen">{evento.direccion}</span>
</div>
  <div className="w-1/3 border-4 border-gray-700 mr-16 mb-4">

   {weatherData.dia ? (
    <WeatherCard datosTiempo={weatherData} />
  ) : (
    <div className="flex items-center bg-gray-200 h-full w-full">
      <span className="text-black text-xl silkScreen text-center">No se encontraron datos disponibles del tiempo...</span>
    </div>
  )}
  </div>
  </div>
  </div>
      


    
   </div>

  )

}

export default MostrarConcierto;
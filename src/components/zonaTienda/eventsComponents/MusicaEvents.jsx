import React, { useEffect } from 'react';
import Carousel from '../CarruselComponent/Carousel';
import { useLoaderData } from 'react-router-dom';
import FilaEvents from '../CarruselComponent/FilaEvents';
import EventCard from './EventCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useClienteLoggedContext } from "../../../context-providers/ClienteLoggedContext";
import { faTicketAlt, faCalendarAlt, faMusic, faMapMarkerAlt, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { faBolt } from '@fortawesome/free-solid-svg-icons';

function MusicaEvents() {
  let _listaConciertos = useLoaderData(); // Recupero los conciertos del loader del componente asociado al path
  let _listaTop = _listaConciertos.filter(ev => ev.prioridad === 5);
  let _nuestrosEventos = _listaConciertos.filter(ev => ev.prioridad != 5);

  const { clienteLogged, dispatch: clienteDispatch } = useClienteLoggedContext();
  
  useEffect(() => {
    if (clienteLogged) {
      console.log(clienteLogged.datoscliente);
      //const jsonString = JSON.stringify(clienteLogged.datoscliente);
      //const sizeInBytes = new Blob([jsonString]).size;
      //console.log('El Json con la info del cliente ocupa -> ', sizeInBytes, 'bytes');
    }
  }, [clienteLogged]);

  return (
    <div className="flex flex-col items-center mt-24 mb-4 ">
      <div className="w-full">
        {/* Carrusel */}
        <div className="flex flex-col w-full gap-2 background-gray pb-4">

          <Carousel eventos={_listaTop} />
          <FilaEvents eventos={_listaTop} />
          <div className='text-center pb-12 pt-12'>
           {/*ENTRADAS DE MÚSICA EN VIVO*/}
             <span className='silkScreen'>Inicio ➔ Generos</span>
            <h1 className='silkScreen text-5xl'>Conciertos en vivo</h1>

          </div>
        </div>

        {/* Botones */}
        <div className='text-center mt-4 '>
        <span className='text-3xl font-extrabold'>
        <FontAwesomeIcon icon={faBolt} className='mr-2' color='green' />          
        NUESTROS EVENTOS
        <FontAwesomeIcon icon={faBolt} className='ml-2' color='green' />        
        </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8 ml-24 mr-24 ">
        <button className="px-2 py-4 border bg-gray-800 rounded-md flex flex-col items-center justify-center space-y-1">
          <FontAwesomeIcon icon={faTicketAlt} color='white' size="lg" />
          <span className='silkScreen text-sm text-white'>En venta hoy</span>
        </button>
        <button className="px-2 py-4 border bg-gray-800 rounded-md flex flex-col items-center justify-center space-y-1">
          <FontAwesomeIcon icon={faCalendarAlt} color='white' size="lg" />
          <span className='silkScreen text-sm text-white'>Pronto a la venta</span>
        </button>
        <button className="px-2 py-4 border bg-gray-800 rounded-md flex flex-col items-center justify-center space-y-1">
          <FontAwesomeIcon icon={faMusic} color='white' size="lg" />
          <span className='silkScreen text-sm text-white'>Buscar por genero</span>
        </button>
        <button className="px-2 py-4 border bg-gray-800 rounded-md flex flex-col items-center justify-center space-y-1">
          <FontAwesomeIcon icon={faMapMarkerAlt} color='white' size="lg" />
          <span className='silkScreen text-sm text-white'>Explorar por ubicacion</span>
        </button>
        <button className="px-2 py-4 border bg-gray-800 rounded-md flex flex-col items-center justify-center space-y-1">
          <FontAwesomeIcon icon={faMapLocation} color='white' size="lg" />
          <span className='silkScreen text-sm text-white'>Cerca de mi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8 mr-4 ml-4">
      {_nuestrosEventos.map((event) => (
        <EventCard key={event._id} evento={event} />
      ))}
    </div>

      </div>
    </div>
  );
}

export default MusicaEvents;




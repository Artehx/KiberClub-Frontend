import { useClienteLoggedContext } from "../../../context-providers/ClienteLoggedContext";
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import CustomToolbar from './CustomToolBar';
import ModalEvento from './ModalEvento'; 
import ModalBusqueda from "./ModalBusqueda";
import { useState, useEffect, useRef, useMemo } from "react";
import NoteEvent from "./NoteEvent";
import clienteRESTService from "../../../services/restCliente";
import {toast} from 'react-toastify';


dayjs.locale("es");


function Calendario() {

  const calendarRef = useRef(null);
  const {clienteLogged, dispatch: clienteDispatch} = useClienteLoggedContext();
  const [eventos, setEventos] = useState([]);
  const [modalEvento, setModalEvento] = useState(false);
  const [modalBusqueda, setModalBusqueda] = useState(false);
  const [mostrarCalendarioSeleccionado, setMostrarCalendarioSeleccionado] = useState(false);


  const [defaultDate, setDefaultDate] = useState(new Date(2022, 3, 1));
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const localizer = dayjsLocalizer(dayjs);
  
  const rotacionesAleatorias = useMemo(() => {
    const rotaciones = ['rotate-0', 'rotate-2', 'rotate-4', 'rotate-6', '-rotate-2', '-rotate-0', '-rotate-2', '-rotate-4', '-rotate-6'];
    return eventos.map(() => {
      const iRandom = Math.floor(Math.random() * rotaciones.length);
      return rotaciones[iRandom];
    });
  }, [eventos]);
  
  const coloresAleatorios = useMemo(() => {
    const colores = ['bg-red-400', 'bg-blue-400', 'bg-green-300', 'bg-yellow-300', 'bg-purple-300', 'bg-pink-300', 'bg-lime-500', 'bg-cyan-300'];
    return eventos.map(() => {
      const iRandom = Math.floor(Math.random() * colores.length);
      return colores[iRandom];
    });
  }, [eventos]);

 const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Sin eventos"

 };

 useEffect(() => {
  
  //Cada vez que se actualizan los favoritos 
  //se reflejara en el calendario
  const eventos = clienteLogged.datoscliente
   .favoritos.map(favorito => ({
    _id: favorito._id,
     start: new Date(favorito.fecha),
     end: new Date(favorito.fecha),
     title: favorito.artistaPrincipal.nombre,
     ubicacion: favorito.ubicacion,
     hora: favorito.hora,
     generos: favorito.artistaPrincipal.generos

   }));
  
  setEventos(eventos);
 }, [clienteLogged])

  const handleMostrarModalEvento = (ev) => {
      setEventoSeleccionado(ev)
      setModalEvento(true);
  }

  const handleCerrarModalEvento = () => {
    setModalEvento(false);
  }

  const handleMostrarModalBusqueda= () => {
      setModalBusqueda(true);
  }

  const handleBuscarFecha = (event) => {
    const selectedDateValue = event.target.value;
    console.log("Fecha seleccionada para buscar:", selectedDateValue);
    setDefaultDate(new Date(selectedDateValue))

    setMostrarCalendarioSeleccionado(true);
    }

  const handleCerrarModalBusqueda= () => {
      setModalBusqueda(false);

  }

  const handleEliminarFavorito = async (idEvento) => {
    console.log("Evento a eliminar:", idEvento);
   
    let _resp = await clienteRESTService.eliminarFavorito(idEvento, clienteLogged.datoscliente._id)
    
    if(_resp.codigo == 0){

      toast.success('¡Favorito eliminado con exito!')
      clienteDispatch({type: 'ACTUALIZAR_FAVORITO', payload: _resp.favoritos});
      setEventos(prevEventos => prevEventos.filter(evento => evento._id !== idEvento));

     } else {
      console.log('Algo salió mal...');
      toast.error('Error en el servidor, pruebe más tarde...');
     }


  };

  

 return (
  
  <>
    <div className="flex flex-col items-center justify-center pt-28 mt-2 background-gray border-b-4 border-gray-700">
    <h1 className="text-4xl silkScreen"><span className='text-green-700'>Tranqui</span>, nosotros te <span className='text-red-700'>damos</span>  un <span className='text-yellow-600'> calendario</span> </h1>
     <span className='text-base silkScreen mb-4'>Tus eventos favoritos se guardan aqui 😌</span>
    </div>

    <div className='flex white-pattern justify-between mr-1'>
    <div className='flex justify-center items-center w-2/4'>
        <div className="border-l-4 relative overflow-y-auto border-gray-700 bg-white w-full h-full ">
          <div className="grid grid-cols-4 absolute w-full bg-white gap-4 justify-items-center py-4 px-2 ">
          
           {/*Post it*/}
           {eventos.map((evento, index) => (
            <NoteEvent
              key={evento._id}
              eventos={evento}
              rotacion={rotacionesAleatorias[index]}
              color={coloresAleatorios[index]}
              eliminarFavorito={handleEliminarFavorito}
            />
          ))}
          

          </div>


        </div>
    </div>
    <div className='w-2/4 border-l-4 border-gray-700' style={{ height: 575 }}>

      <Calendar className='calendario-container' 
      localizer={localizer}
      startAccessor={"start"}
      endAccessor={"end"}
      defaultDate={defaultDate} 
       
      messages={messages}
      style={{ background: 'white' }}   
      components={{
        toolbar: (toolbar) => 
        <CustomToolbar toolbar={toolbar} 
        openSearchModal={handleMostrarModalBusqueda} />
      }}
      events={eventos}
      onSelectEvent={(ev) => {
        handleMostrarModalEvento(ev)
      }} 
      ref={calendarRef}
    >
    </Calendar>
    </div>

    </div>
    <ModalEvento evento={eventoSeleccionado} 
    open={modalEvento} onClose={handleCerrarModalEvento} />
    <ModalBusqueda open={modalBusqueda}
      onClose={handleCerrarModalBusqueda}
      onBuscarFecha={handleBuscarFecha}/>
  </>
 
  )


}

export default Calendario;
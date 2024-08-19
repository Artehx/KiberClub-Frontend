import { Link } from 'react-router-dom';


function FilaEvents({eventos}) {

 return (
    <div className="flex flex-row space-x-7 overflow-x-auto justify-center pt-4 -mx-4 ">
    {eventos.map((evento) => (
      <div key={evento._id} className="flex-none w-48 md:w-40 text-center rounded-md overflow-hidden ">
        <Link to={"/Eventos/MostrarConcierto/" + evento._id}>
        <img src={evento.artistaBASE64} className="size-fila shadow-md"/>
        </Link>
        <span className="silkScreen text-xs">{evento.artistaPrincipal.nombre}</span>
      </div>
    ))}
  </div>
 )


}

export default FilaEvents;
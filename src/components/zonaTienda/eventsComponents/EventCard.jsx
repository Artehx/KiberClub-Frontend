import React from 'react';
import { Link } from 'react-router-dom';

function EventCard({ evento }) {
  return (
    <div className="rounded-md text-center">
     <Link to={"/Eventos/MostrarConcierto/" + evento._id}>
      <img src={evento.artistaBASE64} className="w-full border border-gray-400 h-40 md:h-52 object-cover rounded-t-xl" alt={evento.artista} />
     </Link>
      <div className="p-4">
        <h3 className="text-lg silkScreen font-semibold">{evento.artistaPrincipal.nombre.toUpperCase()}</h3>
        <p className="text-sm font-extrabold text-red-600">¡TICKETS DISPONIBLES!</p>
      </div>
    </div>
  );
}

export default EventCard;
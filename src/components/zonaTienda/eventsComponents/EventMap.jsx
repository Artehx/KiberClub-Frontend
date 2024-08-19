import React from 'react';

function EventMap({ coordenadas }) {
  

  return (
    <div>
    <iframe class="w-full h-6/6" 
    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d480.925171822963!2d${coordenadas.longitud}!3d${coordenadas.latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1711624509904!5m2!1ses!2ses`} 
    className='border-0 w-full h-60' loading="lazy" referrerpolicy="no-referrer-when-downgrade">

    </iframe>
    </div>
  );
}

export default EventMap;

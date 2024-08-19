import Flickity from 'react-flickity-component';
import 'flickity/css/flickity.css';
import { Link } from 'react-router-dom';

//import { animateTitle } from '../../../assets/utils/titleAnimation';

function Carousel({ eventos }){

  const flickityOptions = {
    initialIndex: 2,
    autoPlay: true, 
    pageDots: false, //Ocultar los puntos de paginación
    wrapAround: true, //Permitir rebovinar
    autoPlay: 8000, //Intervalo en milisegundos entre los avances automáticos
  };

 return (
  <div>
    <Flickity
      className={'carousel'}
      elementType={'div'}
      options={flickityOptions}
      disableImagesLoaded={false}
      reloadOnUpdate
      static
    >
      {eventos.map((evento) => (
        <div key={evento._id} className="relative w-full">
          <img src={evento.posterBASE64} className='w-full' style={{minHeight: '490px'}} />
          <div className="caption">
            <Link to={"/Eventos/MostrarConcierto/" + evento._id}>
            <button className="tickets-button bg-red-500 silkScreen">¡Tickets Disponibles!</button>
            </Link>
          </div>
        </div>
      ))}
    </Flickity>
  </div>
);

}

export default Carousel;


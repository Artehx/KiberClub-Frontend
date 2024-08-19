import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';

function MiniTicket({ evento, onSendId, onShare }) {

     const handleOnGetPdf = () => {
        
       onSendId(evento.paymentId);
     }

     const handleOnShare = () => {

       onShare(evento._id);
     }



    return (
     
      <div className="w-full rounded-sm bg-white border-2 h-full border-gray-300 text-center ">
      <img src={evento.concierto.artistaBASE64} className="w-full h-56 shrink-0 object-cover" alt="Artista" />
      
      <div className="flex flex-col bg-gray-200 gap-y-2 pt-2">
        <span className="text-xl silkScreen font-semibold">{evento.concierto.artistaPrincipal.nombre.toUpperCase()}</span>
        <div className="flex justify-between items-center gap-1 ">
          <button className="text-gray-100 text-2xl w-full border-2 border-red-600 
          bg-red-600 focus:outline-none" onClick={handleOnGetPdf}>
            <FontAwesomeIcon icon={faFilePdf} className='w-10 ml-1' />
          </button>
          <button className="text-gray-100 text-2xl w-full border-2 border-green-600 
          bg-green-600 focus:outline-none" onClick={handleOnShare}>
            <FontAwesomeIcon icon={faShareAlt} className='w-8 mr-1'  />
          </button>
          <button className="text-gray-100 text-2xl w-full border-2 border-yellow-800 bg-yellow-800 focus:outline-none">
            <FontAwesomeIcon icon={faBell} className='w-8' />
          </button>
        </div>
      </div>
    </div>

    )


}

export default MiniTicket;

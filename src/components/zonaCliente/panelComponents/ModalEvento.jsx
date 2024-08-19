import { Modal } from "@mui/material";
import {Link } from 'react-router-dom';

function ModalEvento({evento, open, onClose}) {

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      
      onClose();
    }
  };

  return (  
  <Modal open={open} onClose={onClose}>
    <div className="flex justify-center bg-white rounded-lg border"  >
     {evento && (
         <div className="fixed inset-0 flex items-center justify-center" onClick={handleBackdropClick}>
         <div className="bg-yellow-500 rounded-lg shadow-xl">
          <div className="flex justify-between bg-yellow-500 p-1">
            <span className="text-3xl silkScreen text-gray-100">{evento.title}</span>
            <span className=" silkScreen text-xl mr-1" onClick={onClose}>X</span>
          </div>

          <div className="flex flex-col text-center bg-white gap-1 p-4">
          <span className="text-lg silkScreen">Concierto a las <span className="text-green-700 text-xl"> {evento.hora} </span></span>
          <span className="text-xs silkScreen"><span className="text-red-600 text-xl mr-1">en</span>{evento.ubicacion}</span>
          <div className="flex justify-center">
            
            <Link to={`/Eventos/MostrarConcierto/${evento._id}`} className='bg-red-700 silkScreen
            text-white text-sm border-2 px-3 py-1'
            onClick={onClose}>Ir a evento</Link>

          </div>

          </div>
          </div>
         </div>

     )}
    </div>
  
  
  </Modal>
  );

}

export default ModalEvento;
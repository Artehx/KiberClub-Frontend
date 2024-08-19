import { Modal } from "@mui/material";
import { useState } from "react";


   

function ModalBusqueda({open, onClose, onBuscarFecha}) {
   
    const [date, setDate] = useState();
    const [selectedDate, setSelectedDate] = useState(null);
  
    const handleDateChange = (date) => {
        setSelectedDate(date);
      };

      const handleBuscar = () => {
        console.log("Fecha seleccionada:", selectedDate);
        onClose();
        if (selectedDate) {
            onBuscarFecha(selectedDate);
        }
    };

    return (
     <Modal open={open} onClose={onClose}>
     <div className="flex justify-center bg-white rounded-lg border ">
      <div className="fixed inset-0 flex items-center justify-center">
       <div className="bg-gray-700 rounded-lg">
        <div className="flex justify-between gap-2 bg-gray-700 p-3">
         <span className="text-3xl text-white silkScreen">Vista de busqueda...</span>
         <span className=" silkScreen text-white text-xl mr-1" onClick={onClose}>X</span>

        </div>

        <div className="flex flex-col text-center bg-white gap-1 p-4">
        
         <div className="flex flex-col justify-center items-center gap-2 mb-2">
          <label htmlFor="fecha" className="silkScreen">Seleccionar fecha:</label>
          <input
          type="date"
          onChange={handleDateChange}
          className="w-2/3 silkScreen p-3 leading-4 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded"
            />
    

         </div>
        
         <div className="flex justify-center gap-2">
         <button className='bg-red-700 silkScreen
        text-white text-sm border-2 px-3 py-1'
          onClick={handleBuscar}>Buscar</button>
         <button className='bg-green-700 silkScreen
            text-white text-sm border-2 px-3 py-1'
            onClick={onClose}>Cerrar</button>
        </div>
        </div>

       </div>

      </div>
     </div>

     </Modal>

    );
}

export default ModalBusqueda;
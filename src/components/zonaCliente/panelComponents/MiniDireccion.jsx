import {toast} from 'react-toastify';

function MiniDireccion({direccion, onBotonClick, direccionesSize}) {


  function BotonesHandlerClick(operacion) {
    try {
      switch (operacion) {
        case 'editar':
         console.log('Direccion a editar en MiniDireccion -> ', direccion); 
         onBotonClick('editar', direccion);

          break;
        case 'eliminar':
          console.log('Tamaño del array direcciones' , direccionesSize);
          if (direccionesSize === 1) {
            toast.warning('No puedes eliminar la única dirección que tienes');
          } else {
            onBotonClick('eliminar', direccion);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.log('Error al procesar la acción del botón:', error);
    }
  }

    return (

      <div className="bg-blue-gray-600 rounded-sm p-4">
        <h5 className="text-xl text-white silkScreen font-semibold">{direccion.calle}</h5>
        <h6 className="text-sm font-extralight text-white">{direccion._id}</h6>
        <p className="text-white silkScreen text-sm">CP: {direccion.cp}, Municipio: {direccion.municipio.DMUN50} (Provincia: {direccion.provincia.PRO}, Pais: {direccion.pais})</p>
       
        <div className="flex justify-normal mt-2"> 
        <button className="text-white text-bold silkScreen bg-green-600 px-4 py-2 rounded-md mr-2" onClick={() => BotonesHandlerClick('editar')}>Editar Direccion</button>
        <button className="text-white text-bold silkScreen bg-red-500 px-4 py-2 rounded-md" onClick={() => BotonesHandlerClick('eliminar')}>Eliminar Direccion</button>
        </div>
      </div>


    )
}

export default MiniDireccion;
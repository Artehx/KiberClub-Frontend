import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareMinus } from '@fortawesome/free-regular-svg-icons';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons';

function NoteEvent({eventos, rotacion, color, eliminarFavorito}) {

    const handleEliminarEvento = () => {


        eliminarFavorito(eventos._id);
      };

    return (
    
    <div className={`flex flex-col w-36 h-36 shrink-0 shadow-md border-r-2 border-b-2 border-gray-400 ${color} ${rotacion}`}>
     <div className="flex flex-col text-center">
      <span className='flex justify-center my-1'>
      <img src='/public/images/minus-circle.png' className='w-4 h-4' onClick={handleEliminarEvento}/>
      </span>  {/*De momento no controlo el tamaño de la letra... */}             
      <span className={`sticky-font text-center text-5xl text-black ${eventos.title.length >= 12 ? 'text-4xl' : 'text-5xl'}`}>{eventos.title}</span>
      <span className="silkScreen font-bold ">{(eventos.start).toLocaleDateString()}</span>
     </div>


    </div>
    
   )
}

export default NoteEvent;
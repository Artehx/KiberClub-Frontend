import { Modal } from "@mui/material";
import { useState } from "react";

function ModalShare({open, onClose, sendId}) {

     const [user, setUser] = useState('');

     const handleChange = (e) => {
        setUser(e.target.value);
     };

     const handleSend = () => {
        console.log(user);
        sendId(user);
        setUser('');
        
     }

    return (
       <Modal open={open} onClose={onClose}>
        <div className="flex justify-center bg-white rounded-lg border">
             <div className="fixed inset-0 flex items-center justify-center">
             <div className="bg-yellow-500 rounded-lg shadow-xl">
              <div className="flex justify-between p-1">
                <span className="text-3xl silkScreen text-gray-900">Kiber Club</span>
                <span className=" silkScreen text-xl mr-1" onClick={onClose}>X</span>
              </div>
    
              <div className="flex flex-col  text-center bg-white gap-1 p-4">
              <span className="text-lg silkScreen">¡Escribe el usuario de tu amigo y enviale tus tickets!</span>
              
              <div className="flex flex-col justify-center items-center gap-y-2">
              <input id="email" className="w-2/3 p-3 silkScreen leading-6 text-lg 
               bg-white shadow border-2 placeholder-gray-600 border-black rounded" 
              type="email" placeholder="usuario" value={user} onChange={handleChange}/>
                <button className='bg-red-700 w-1/3 silkScreen
                text-white text-sm border-2 px-3 py-2'
                onClick={handleSend}> Enviar tickets</button>
              </div>
                
            
    
              </div>
              </div>
             </div>
 
        </div>
      
      
      </Modal>

    )

}

export default ModalShare;
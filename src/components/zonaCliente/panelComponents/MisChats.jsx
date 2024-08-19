import { useClienteLoggedContext } from '../../../context-providers/ClienteLoggedContext';
import { useEffect, useState } from "react";
import ChatList from './ChatList';
import ChatMessages from './ChatMessages';
import { toast } from 'react-toastify';
import clienteRESTService from '../../../services/restCliente';
import io from 'socket.io-client'; 

//No se si me dara tiempo a completar esta parte peeero bueno, se intenta..

function MisChats() {

  //const socket = io.connect("http://localhost:5000");

    //Hacer una petición entre medias para cuando escoja un chat recuperando los mensajes
    // en lugar de hacer un populate 
    let {clienteLogged, dispatch} = useClienteLoggedContext();

    const [socket, setSocket] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
      const newSocket = io('http://localhost:5000');
  
      setSocket(newSocket);
  
      newSocket.on('connect', () => {
        console.log(`Usuario conectado: ${newSocket.id}`);

      });
      newSocket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${newSocket.id}`);
      });
  
      newSocket.on('receive_message', async (data) => {
        console.log('Recibe el mensaje: ', data);

        let objeto = JSON.stringify(data);
        //alert(objeto);
        console.log('ChatId -> ', data.chatId);
        console.log('SelectedChat -> ', selectedChat);
     
        async function recuperarMensajes(chatId) {
          let _resp = await clienteRESTService.recuperarMensajes(chatId);
           
          if (_resp.codigo === 0) {
              console.log('Respuesta ok -> ', _resp);

              console.log(_resp.chatData.mensajes)
              setChatData(_resp.chatData);
          } else {
              console.log('Error al recuperar el chat:', _resp);
          }

        }

         recuperarMensajes(data.chatId);
        
        
    });
  
      return () => {
        newSocket.close();
      };
    }, []);
  
    const sendMessage = async () => {
      if (socket && mensaje.trim() !== '' && selectedChat) {
        
        const nuevoMensaje = {
          usuarioId: clienteLogged.datoscliente._id,
          mensaje: mensaje,
          chatId: selectedChat
         }
        
        await enviarMensaje(nuevoMensaje); //<--Pet para persistir el mensaje
        socket.emit('send_message', nuevoMensaje );
     
       setMensaje('');

      }
    }
    

    useEffect(() => {
      if (selectedChat != null) {
        console.log('SelectedChat -> ', selectedChat)
          const recuperarChat = async () => {
              let _resp = await clienteRESTService.recuperarMensajes(selectedChat);

              if (_resp.codigo === 0) {
                  console.log('Respuesta ok -> ', _resp);
                  setChatData(_resp.chatData);
              } else {
                  console.log('Error al recuperar el chat:', _resp);
              }
          };

          recuperarChat();
      }
  }, [selectedChat]);

      useEffect(() => {
       
        console.log('Chat data -> ', chatData);
      }, [chatData])

   
    
      

  const handleSelectChat = (chat) => {
      setSelectedChat(chat);
  };

    

    const handleInputChange = (event) => {
      setMensaje(event.target.value);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage(); 
      }
    };

    
    const enviarMensaje = async (nuevoMensaje) => {
      try {
        let _resp = await clienteRESTService.enviarMensaje(nuevoMensaje);
        if (_resp.codigo === 0) {
          setChatData(_resp.chatData);
        }
      } catch (error) {
        console.error('Error al enviar el mensaje: ', error);
      }
    };


return (

    <>
    <div className="flex w-full h-4/5 pt-24">
     <div class="w-1/4 h-full bg-white border-r border-gray-300">
      
          <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-blue-gray-500 text-white">
            <h1 class="text-2xl font-semibold silkScreen">Grupos</h1>
            <div class="relative">
              <button id="menuButton" class="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-100" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
                </svg>
              </button>
           
              <div id="menuDropdown" class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg hidden">
                <ul class="py-2 px-3">
                  <li><a href="#" class="block px-4 py-2 text-gray-800 hover:text-gray-400">Option 1</a></li>
                  <li><a href="#" class="block px-4 py-2 text-gray-800 hover:text-gray-400">Option 2</a></li>
                 
                </ul>
              </div>
            </div>
          </div>
        
            <ChatList chats={clienteLogged.datoscliente.chats} onSelectChat={handleSelectChat} />
       
            </div>
            {/*Zona Chat*/}
            <div class="flex flex-col w-3/4 bg-gray-200">
         
            
         {/* El chat que selecciona el usuario */}
         {selectedChat ? (
          <div className='flex flex-col relative h-full'>
            <div className='flex flex-col absolute w-full h-full'>
           <ChatMessages chat={chatData} datosCliente={clienteLogged.datoscliente}  />

            <div class="bg-white border-t border-gray-300 p-4 relative bottom-0 w-full">
           
            <div class="flex items-center">
                
            <button type="button" class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100
             dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2
             2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg>
            </button>
            <button type="button" class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400
             dark:hover:text-white dark:hover:bg-gray-600">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 
              0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 
              007.072 0z" clip-rule="evenodd"></path></svg>
            </button>
            <input id="chat" rows="1" class="block mx-4 p-2.5 w-full text-base text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none 
            focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-green-500 dark:focus:border-green-500 balsamiq-sans-regular" 
             placeholder="Escribe aqui tu mensaje..." onKeyDown={handleKeyDown} onChange={handleInputChange} value={mensaje} />
                <button type="submit" onClick={sendMessage} class="inline-flex justify-center p-2 text-green-600 rounded-full cursor-pointer hover:bg-green-100 dark:text-green-500 dark:hover:bg-gray-600">
                <svg class="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
            </button>

          
                
            </div>
            </div>
            </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-800 text-3xl nanumPen">Selecciona un chat para ver los mensajes</p>
            </div>

            
          )}
            
    
            </div>
         
      
        </div>
    


    </>
)


}

export default MisChats;

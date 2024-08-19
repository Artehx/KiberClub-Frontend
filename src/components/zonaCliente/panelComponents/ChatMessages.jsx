import React from 'react';
import SpinnerTrack from '../../../assets/utils/spinnerTrack';
import { useState, useEffect } from 'react';
import ToolTipConcierto from './ToolTipConcierto';
import ToolTipUsuarios from './ToolTipUsuarios';

function ChatMessages({ chat, datosCliente }) {

  const [usuariosChat, setUsuariosChat] = useState([]);
 

  useEffect(() => {

    if (chat && chat.mensajes.length > 0) {


      const usuarios = chat.mensajes.reduce((usuariosUnicos, mensaje) => {
        const usuarioEmail = mensaje.usuarioId.cuenta.email;
        if (!usuariosUnicos.find(usuario => usuario.email === usuarioEmail)) {
          usuariosUnicos.push(mensaje.usuarioId.cuenta);
        }
        return usuariosUnicos;
      }, []);
      setUsuariosChat(usuarios);
    } else {

      //Si no hay mensajes no muestro los usuarios que hay
      setUsuariosChat([])
    }
  }, [chat]);

  useEffect(() => {
    console.log('Usuarios del chat -> ', usuariosChat);
  }, [usuariosChat])
  

  if (chat === null) {
    return (
      <div className='h-full flex flex-col justify-center items-center'>
        <SpinnerTrack sizeNumber={200} />
      </div>
    );
  } else if (chat.mensajes.length === 0) {
    return (
      <div className='h-full flex flex-col  '>
          <div className="flex justify-start bg-green-400 p-4 text-white gap-1.5">
          <h1 className="text-2xl font-semibold nanumPen">{chat.concierto.artistaPrincipal.nombre}</h1>
            <div className='flex justify-center items-center gap-2'>
              {
                chat && <ToolTipConcierto concierto={chat.concierto}/>
              }
              {
                usuariosChat && <ToolTipUsuarios usuarios={usuariosChat}/>
              }
            </div>
        </div>
        <div className='flex h-full justify-center items-center'>
        <span className='text-3xl text-gray-800 nanumPen'>Este chat espera tus palabras, ¡adelante!</span>
        </div>
      </div>
    );
  } else {
    return (
       <>
        {/* Cabecera del chat */}
        <div className="flex justify-start bg-green-400 p-4 text-white gap-1.5">
          <h1 className="text-2xl font-semibold nanumPen">{chat.concierto.artistaPrincipal.nombre}</h1>
            <div className='flex justify-center items-center gap-2'>
              {
                chat && <ToolTipConcierto concierto={chat.concierto}/>
              }
              {
                usuariosChat && <ToolTipUsuarios usuarios={usuariosChat}/>
              }
            </div>
        </div>
        <div className="flex flex-col w-full p-4 overflow-y-auto h-full ">
          {chat.mensajes.map(mensaje => (
            <div key={mensaje._id} className={`flex mb-4 cursor-pointer ${mensaje.usuarioId._id === datosCliente._id ? 'justify-end' : ''}`}>
              {mensaje.usuarioId._id !== datosCliente._id && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                  <img src={mensaje.usuarioId.cuenta.imagenAvatarBASE64} alt="User Avatar" className="w-8 h-8 rounded-full" />
                </div>
              )}
              
            
              <div className={`flex max-w-96 relative ${mensaje.usuarioId._id === datosCliente._id ? 'bg-indigo-500 text-white' : 'bg-white text-gray-700'} rounded-lg p-3 `}>
                { //Acumular el mensaje anterior si se repite el mensaje para no poner de nuevo el nombre del usuario
                  mensaje.usuarioId._id !== datosCliente._id && 
                  <span className='absolute -top-2.5 left-0.5 silkScreen text-xs text-gray-700'>{(mensaje.usuarioId.cuenta.usuario).toLowerCase()}</span>
                }
                 
                <span className='text-base balsamiq-sans-regular'>{mensaje.mensaje}</span>
              </div>
              {mensaje.usuarioId._id === datosCliente._id && (
                <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                  <img src={datosCliente.cuenta.imagenAvatarBASE64} alt="My Avatar" className="w-8 h-8 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
        </>
    );
  }
}


export default ChatMessages;
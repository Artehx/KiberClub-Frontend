import {createContext, useContext, useReducer}  from 'react';

const ClienteLoggedContext = createContext();

//funcion REDUCER para usar en el hook useReducer
//REQUISITOS
//  2 PARAMETROS
//      -> 1º EL VALOR DEL STATE QUE QUIERES MODIFICAR 
//      -> 2º LA ACCION QUE TE MANDAN LOS COMPONENTES HIJOS: {TYPE: 'NOMBRE_ACCION' , PAYLOAD:'NUEVO_VALOR_INCLUIR_STATE'}
// -> LA FUNCION DEBE SER PURA , NO PUEDES MODIFICAR EL ANTIGUO VALOR DEL STATE , CREANDO UNA COPIA Y MODIFICANDOLO
//    IMPUROOOOO!!!!

const clienteLoggedReducer = (state, action) => {
  switch(action.type){
     case 'CLIENTE_LOGGED':
        return action.payload;
     case 'CLIENTE_LOGOUT':
        return null;
     case 'GUARDAR_FICHA':
       return {
         'datoscliente': {...state.datoscliente, 'fichasRuleta': [...state.datoscliente.fichasRuleta, action.payload]}
       } 
     case 'ELIMINAR_FICHA':
      const fichasUpdate = state.datoscliente.fichasRuleta.slice(1);
      return {
        datoscliente: {...state.datoscliente, 'fichasRuleta': fichasUpdate } };
     case 'FICHA_USADA':
      return {
        datoscliente: {...state.datoscliente, 'fichasUsadas': [...state.datoscliente.fichasUsadas, action.payload]}
      };
      case 'GUARDAR_DESCUENTO':
        return {
          'datoscliente': {...state.datoscliente, 'descuentosGanados': [...state.datoscliente.descuentosGanados, action.payload]}
      };
      case 'OPERAR_DIRECCIONES':
        return {
          ...state, datoscliente: {...state.datoscliente, direcciones: action.payload}
        }
      case 'ACTUALIZAR_FAVORITO':
        return {
          ...state, 'datoscliente': { ...state.datoscliente,'favoritos': action.payload}
        };
      case 'ACTUALIZAR_GUSTOS':
        return {
          ...state, 'datoscliente': { ...state.datoscliente,'gustosMusicales': action.payload}
        }
      case 'ACTUALIZAR_IMAGEN':
        return {
          ...state, datoscliente: { ...state.datoscliente,
             cuenta: {
               ...state.datoscliente.cuenta,
               imagenAvatarBASE64: action.payload,
               },
            },
       };
       
      
  
     default: 
     console.log(`Cliente logged context: ${action.type}`);
     return state
  }
};



function ClienteLoggedProvider({children})
{

    const [clienteLogged, dispatch] = useReducer(clienteLoggedReducer, null);

    return (
     <>
     <ClienteLoggedContext.Provider value = {{clienteLogged, dispatch}}>
       {children}
     </ClienteLoggedContext.Provider>
     
     </>

    )

}

function useClienteLoggedContext() {

    const _clienteLoggedProvider = useContext(ClienteLoggedContext);
    return _clienteLoggedProvider;

}

export {ClienteLoggedProvider, useClienteLoggedContext};



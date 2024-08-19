import {createContext, useContext, useReducer}  from 'react';

const TicketSelectionContext = createContext();

const ticketSelectionReducer = (state, action) => {


    switch (action.type) {

      case 'ADD_TICKETS':
        // Filtrar las entradas que ya están en el estado para mantener solo las nuevas
        const nuevasEntradas = action.payload.filter(newTicket =>
          !state.some(existingTicket => existingTicket.entrada.id === newTicket.entrada.id)
        );
        //Guardamos las entradas existentes con las ya existentes
        return [...state, ...nuevasEntradas];
      
       case 'BORRAR_TICKETS':
          
          return state.filter(ticket => !action.payload.includes(ticket.entrada.id));

       case 'UPDATE_TICKETS':

          return action.payload;
    
        case 'CLEAR_TICKETS':
            return [];
      
        default:
          return state;
      }
      

};

function TicketSelectionProvider({children}) {

    const [ticketSelection, dispatch] = useReducer(ticketSelectionReducer, []);

    return (
     <>
     <TicketSelectionContext.Provider value = {{ticketSelection, dispatch}}>
      {children}
     </TicketSelectionContext.Provider>
     
     
     </>


    )
}

function useTicketSelectionContext() {

    const _ticketSelectionProvider = useContext(TicketSelectionContext);
    return _ticketSelectionProvider;
}

export {TicketSelectionProvider, useTicketSelectionContext};


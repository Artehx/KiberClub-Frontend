import { faEuro } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import { useTicketSelectionContext } from "../../../context-providers/TicketSelectionContext";
import { useEffect, useState } from "react";

function PricesEvent({precios}) {

    let { ticketSelection, dispatch } = useTicketSelectionContext();
    let [tickets, setTickets] = useState();

    const numbersPrice = [0, 1, 2, 3, 4, 5, 6].map(num => ({ value: num, label: String(num) }));

    useEffect(() => {
      console.log('Estado actualizado:', ticketSelection);
    }, [ticketSelection]);

     //CREAR AQUI UN ARRAY DE ENTRADAS X CANTIDAD
     //CADA VEZ QUE CREA UN OBJETO QUE ME GENERE EL QR EN BASE 64
     // ...QUITAR IDS DE LOS PRECIOS/ENTRADAS DE MONGO...
     // EN EL PAYLOAD METO EL ARRAY 
     // Y CUANDO HAGA EL BUCLE HACERLO CON FOR

    const handleSelectChange = (precio, cantidad) => {
      
      //CREO EL ARRAY
      // {entradaTipo: {}, cantidad: 2} ASI NO..
      
      // -ASI SI-
      // {entradaTipo: {}, cantidad: 1}
      // {entradaTipo: {}, cantidad: 1}
      // recorro en un for para dividirlo 
      
      // AÑADIR LOS QR EN EL BOTON DE COMPRAR DE MOSTRARCONCIERTO.JSX
      // IMPORTANTE!!!
      
      // TENGO QUE CAMBIAR EL BACK TAMBIEN A LA HORA DE CREAR LA ORDEN 

      function generateIdTicket (){
        const number = Math.floor(Math.random() * 100000000);
        return number.toString().padStart(8, '0');
      };

      const entradasIndividuales = [];

      for (let i = 0; i < cantidad; i++) {
        const id = generateIdTicket(); 
        entradasIndividuales.push({ entrada: { ...precio, id }, cantidad: 1 });
      }

      if (cantidad === 0) {
        //Pillamos las IDs de los tickets que se deben borrar
        const idsABorrar = ticketSelection
          .filter(ticket => ticket.entrada._id === precio._id)
          .map(ticket => ticket.entrada.id);
        // Borrar los tickets seleccionados
        dispatch({ type: 'BORRAR_TICKETS', payload: idsABorrar });
      } else {
        //Y filtramos las entradas existentes para eliminar las que son del mismo tipo
        const entradasRestantes = ticketSelection.filter(ticket => ticket.entrada._id !== precio._id);

        const entradasActualizadas = [...entradasRestantes, ...entradasIndividuales];
       
        //Actualizamos los tickets seleccionados
        dispatch({ type: 'UPDATE_TICKETS', payload: entradasActualizadas });
      }
    
       
      setTickets(entradasIndividuales);

      console.log('entradas -> ', entradasIndividuales);
      dispatch({type: 'ADD_TICKETS', payload: entradasIndividuales})
    }

    useEffect(() => {
      console.log('Tickets Reducer-> ', ticketSelection);

    }, [ticketSelection])
    

      //Custom select...
      const customStyles = {
        control: (provided, state) => ({
          ...provided,
          width: '120px',
          minHeight: '40px',
          borderRadius: '2px',
          borderColor: state.isFocused ? '#718096' : '#CBD5E0', 
          boxShadow: state.isFocused ? '0 0 0 1px #718096' : null, 
          '&:hover': {
            borderColor: '#718096' 
          }
        }),
        placeholder: (provided) => ({
          ...provided,
          color: 'black'
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#C53030' : state.data.color, 
          color: state.isSelected ? 'white' : 'black', 
        }),
  
        dropdownIndicator: (provided) => ({
          ...provided,
          color: 'red'
        }),
        
      };

    return (

       <>
        <div className="w-2/3  flex flex-col gap-2 ">
        {/* Iterar sobre los precios */}
        {precios && precios.map((elemento, index) => (
        <div key={index} className="p-4 border-4 border-gray-700 bg-gray-100">
            {/* Título del tipo de precio */}
            <h3 className="text-xl silkScreen">{elemento.tipo}</h3>
            {/* Línea divisoria */}
            <hr className="border-gray-300" />
            {/* Precio y select para cantidad de tickets */}
            <div className="flex justify-between items-center gap-6">
             <div className="font-semibold text-sm">{elemento.descripcion}</div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center">
                <span className="text-2xl silkScreen">
                    {elemento.precio}
                </span>
                <i className="fa-solid fa-sm fa-euro-sign ml-0.5">
                    <FontAwesomeIcon icon={faEuro} color='red'/>
                </i>  
                </div>
                <div className="w-12">
                <span className="text-xs font-mono">*IVA incl</span>
                </div>
              <Select
                className="silkScreen text-base"
                placeholder="0"
                options={numbersPrice}
                styles={customStyles}
                onChange={(selectedOption) => handleSelectChange(elemento, selectedOption.value)}
               />
              </div>
             </div>
            </div>
            ))}
        </div>
       </> 
    )
}

export default PricesEvent;
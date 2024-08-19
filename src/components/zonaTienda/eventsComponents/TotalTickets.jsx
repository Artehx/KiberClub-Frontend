import { useEffect, useState } from "react";
import { useTicketSelectionContext } from "../../../context-providers/TicketSelectionContext";


function TotalTickets() {

    const { ticketSelection, dispatch: ticketDispatch } = useTicketSelectionContext();
    const [precioTotal, setPrecioTotal] = useState(0);

    useEffect(() => {
        //Calculamos el precio total cuando cambia la selección de los tickets
        const total = ticketSelection.reduce((acumulador, ticket) => {
            return acumulador + (ticket.entrada.precio * ticket.cantidad);
        }, 0);

        setPrecioTotal(total);
    }, [ticketSelection]);

    useEffect(() => {
        console.log("Precio Total actual:", precioTotal);
    }, [precioTotal]);

    return precioTotal.toFixed(2);



}

export default TotalTickets;
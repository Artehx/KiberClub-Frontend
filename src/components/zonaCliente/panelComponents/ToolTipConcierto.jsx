import { useState, useEffect } from "react";
import { Progress, Tooltip, Typography } from "@material-tailwind/react";

function ToolTipConcierto({concierto}) {

    const [mesConcierto, setMesConcierto] = useState('');

    useEffect(() => {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const fechaConcierto = concierto ? new Date(concierto.fecha) : null;  
  
    const mes = meses[fechaConcierto.getMonth()];

    setMesConcierto(mes);
    }, [concierto])
    
  

    return ( 
        <>
            <Tooltip className="bg-white p-0 border-0 shadow-xl shadow-black/10"
              content={
                <div className="w-80 border-2 border-gray-700 bg-gray-200 px-4 py-3 ">
                  <Typography variant='h4' color="red" className="silkScreen text-center border-0">
                    Info Event
                  </Typography>
                  <Typography
                    variant="h5"
                    color="black"
                    className="font-bold ml-2 border-0 silkScreen text-xs"
                  >
                    {concierto.ubicacion} abrira sus puertas sobre las {concierto.puertas} presentando {concierto.titulo + " "}  
                     el {concierto.dia} {new Date(concierto.fecha).getDate()} de {mesConcierto} del 2022
                 </Typography>
                </div>
              }>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5 cursor-pointer text-gray-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              </Tooltip>
        
        
        </>
    );

}

export default ToolTipConcierto;
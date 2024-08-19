import { useState, useEffect } from "react";
import { Progress, Tooltip, Typography } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

function ToolTipUsuarios({usuarios}) {
    
    let usuariosEmails = usuarios.map(u => u.usuario).join(', ');

    console.log(usuarios);
    if(usuarios.length < 1){
       usuariosEmails = "Procesando..." 
    }

    return (

        <>
             <Tooltip className="bg-white p-0 border-0 shadow-xl shadow-black/10"
              content={
                <div className="w-80 border-2 border-gray-700 bg-gray-200 px-4 py-3 ">
                  <Typography variant='h4' color="red" className="silkScreen text-center border-0">
                    Info Users
                  </Typography>
                  <Typography
                    variant="h5"
                    color="black"
                    className="font-bold ml-2 border-0 silkScreen text-xs">
                    
                   <span className="text-red-500"> Usuarios</span>: {usuariosEmails}
                   
                 </Typography>
                </div>
              }>
              <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>
              </Tooltip>

        
        
        </>
    )



}

export default ToolTipUsuarios;
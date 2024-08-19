

var clienteRESTService = {

    registrarCliente: async function(datosCliente) {
        try {
            var _petAjax=await fetch('http://localhost:5000/api/Cliente/Registro',
                                     {
                                        method: 'POST',
                                        body: JSON.stringify({datosCliente}),
                                        headers: { 'Content-Type': 'application/json '}
                                     }
                                    );
            return await _petAjax.json();
    
        } catch (error) {
            return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de registrar cliente...' };
        }

    },

    loginCiente: async function(datoslogin){
        try {
            var _petAjax=await fetch('http://localhost:5000/api/Cliente/Login',
                                    {
                                    method: 'POST',
                                    body: JSON.stringify({datoslogin}) ,
                                    headers: { 'Content-Type': 'application/json '}
                                    }
                               );
            return await _petAjax.json();  
              
        } catch (error) {
            return JSON.parse(error);
        }

    },

    recuperarGeneros: async function(){
 
        try {

        var _gens = await fetch(`http://localhost:5000/api/Cliente/RecuperarGeneros`)
        return await _gens.json();

        } catch (error) {
            
            console.log(`Algo ha ido mal: ${error}`);
            return [];
        }


    },

    guardarGeneros: async function(generos, idCliente) {
      
      try {
        
        var _gens = await fetch(`http://localhost:5000/api/Cliente/GuardarGeneros`,
                    {
                    method: 'POST',
                    body: JSON.stringify({generos: generos, idCliente: idCliente}),
                    headers: {'Content-Type':'application/json'}
                    }
                  );

        return await _gens.json();

      } catch (error) {
        console.log(`Algo ha ido mal: ${error}`);
        return [];
      }

    },

    recuperarDescuentos: async function(clientId) {

        try {
    
          const url = 'http://localhost:5000/api/Cliente/RecuperarDescuentos';
          const response = await fetch(url, {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: clientId })
          });
          return await response.json();
          
        } catch (error) {
          console.log(`Algo ha ido mal: ${error}`);
          return [];
        }
    
      },

      recuperarFicha: async function(claveFicha, idCli){

        try {
    
            const url = 'http://localhost:5000/api/Cliente/RecuperarFicha';
            const response = await fetch(url, {
              method:'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ clave: claveFicha, idCliente: idCli })
            });
            return await response.json();
            
          } catch (error) {
            console.log(`Algo ha ido mal: ${error}`);
            return [];
          }

      },

      guardarDescuento: async function(descuento, fichaUsada, idCli){
        
        try {
    
          const url = 'http://localhost:5000/api/Cliente/GuardarDescuento';
          const response = await fetch(url, {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descuento: descuento, fichaUsada: fichaUsada, idCliente: idCli })
          });
          return await response.json();
          
        } catch (error) {
          console.log(`Algo ha ido mal: ${error}`);
          return [];
        }


      },

      manejarFavorito: async function (idConcierto, idcliente, operacion){
        try {
          var _petAjax=await fetch('http://localhost:5000/api/Cliente/ManejarFavoritos',
                                   {
                                      method: 'POST',
                                      body: JSON.stringify({idConcierto: idConcierto, idCliente: idcliente, operacion}),
                                      headers: { 'Content-Type': 'application/json '}
                                   }
                                  );
          return await _petAjax.json();
  
      } catch (error) {
          return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de manejar favoritos...' };
      }

      },

      eliminarFavorito: async function (idEvento, idCliente) {

        try {
          
          var _petAjax = await fetch('http://localhost:5000/api/Cliente/EliminarFavorito',
                        {
                          method: 'DELETE',
                          headers: {
                            'Content-Type':'application/json'
                          },
                          body: JSON.stringify({idEvento: idEvento, idCliente: idCliente})

                        }              

                       );
         return await _petAjax.json();

        } catch (error) {
          return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de eliminar favorito...' };

        }

      },

      actualizarPerfil: async function (datosCliente, idCliente){

        try {
          
         var _petAjax = await fetch(`http://localhost:5000/api/Cliente/ActualizarPerfil`,
                    {
                      method: 'POST',
                      body: JSON.stringify({datosCliente: datosCliente, idCliente: idCliente}),
                      headers: {'Content-Type':'application/json'}
                    }
        );

        return await _petAjax.json();

        } catch (error) {
          return { codigo: 1, mensaje:'algo ha ido mal en pet.ajax al servicio de actualizar el perfil...' };

        }

      },

      actualizarFoto: async function(img, idCli) {

        try {

          var _petAjax = await fetch('http://localhost:5000/api/Cliente/ActualizarFoto',
              {
                method: 'POST',
                body: JSON.stringify({ imagen: img, idCliente: idCli}),
                headers: { 'Content-Type': 'application/json '}
              }
          )

          return await _petAjax.json();
          
        } catch (error) {
          console.log("Error en la solictud: ", error)

        }

      },

      operarDireccion: async function(direccion, operacion, idCliente) {
 
        try {

          var _petAjax = await fetch('http://localhost:5000/api/Cliente/OperarDirecciones',
          {
           method: 'POST',
           body: JSON.stringify({direccion: direccion, operacion: operacion, idCliente: idCliente}),
           headers: {'Content-Type':'application/json'}
          })

          return await _petAjax.json();
          
        } catch (error) {
          console.log("Error en la solictud: ", error)

        }
      },

      recuperarMensajes: async function(chatId) {

        try {

          var _petAjax = await fetch('http://localhost:5000/api/Chat/recuperarMensajes',
          {
           method: 'POST',
           body: JSON.stringify({chatId: chatId}),
           headers: {'Content-Type':'application/json'}
          })

          return await _petAjax.json();
          
        } catch (error) {
          console.log("Error en la solicitud: ", error)

        }

      },

      enviarMensaje: async function(datosMensaje) {

        try {

          var _petAjax = await fetch('http://localhost:5000/api/Chat/nuevoMensaje',
          {
           method: 'POST',
           body: JSON.stringify({datosMensaje: datosMensaje}),
           headers: {'Content-Type':'application/json'}
          })

          return await _petAjax.json();
          
        } catch (error) {
          console.log("Error en la solicitud: ", error)

        }

      },

    


}

export default clienteRESTService;

var pedidoRESTService = {
    configStripe: async function() {
        try {
            var response = await fetch("http://localhost:5000/api/Pedido/configStripe");
           
             let data = await response.json();
             return data.publishableKey;
           
        } catch (error) {
            console.log('Error fetching publishable key:', error);
            throw error;
        }
    },

    createPaymentIntent: async function(totalPago, email) {
        try {
            var response = await fetch("http://localhost:5000/api/Pedido/create-payment-intent", {
                method: 'POST',
                body: JSON.stringify({totalPago: totalPago, email: email}),
                headers: {'Content-Type':'application/json'}
            });
           
              let data = await response.json();
              return data.clientSecret;
           
        } catch (error) {
            console.log('Error creating payment intent:', error);
            throw error;
        }
    },

    nuevaOrden: async function(entradas, idConcierto, paymentId, totalPago){

        try {

            var response = await fetch("http://localhost:5000/api/Pedido/nuevaOrden", {
                method: 'POST',
                body: JSON.stringify({entradas: entradas, idConcierto: idConcierto, paymentId: paymentId,
                                      totalPago: totalPago}),
                headers: {'Content-Type':'application/json'}
                
            });
                let data = await response.json();
                console.log('data -> ', data);
                return data;
            
        } catch (error) {
            console.log('Error nueva orden (pet): ', error);
            throw error;
        }
    },

    forzarSesionConPago: async function(clientId, paymentId, descuentoId, pdfBlob) {
        try {

            function blobToBase64 (blob) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result.split(',')[1]); 
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            }

            //Convertimos el Blob a una cadena de datos en base64
            
            //const pdfBase64 = await blobToBase64(pdfBlob);
    
                const formData = new FormData()
                
                formData.append("clientId", clientId);
                formData.append("paymentId", paymentId);
                formData.append("descuentoId", descuentoId);
                formData.append("pdfBlob", pdfBlob);

                /*
                const reqBody = {
                    clientId: clientId,
                    paymentId: paymentId,
                    descuentoId: descuentoId,
                    pdfData: pdfBlob 
                };
                
                fetch("http://localhost:5000/api/Pedido/forzarSesionConPago", {
                    method: 'POST',
                    body: formData
                }).then(response => response.json())
                 .then(data => {
                    console.log('Respuesta del servidor: ', data);
                    return data;
                })
                 .catch(error => {
                    console.log('Error al enviar la solicitud: ', error);
                    throw error;
                });
                
                */
     
                var response =  await fetch("http://localhost:5000/api/Pedido/forzarSesionConPago", {
                    method: 'POST',
                    body: formData
                });

                let data = await response.json();
                return data;
            
        } catch (error) {
            console.log('Error forzando sesión (pet): ', error);
            throw error;
        }
    },



    recuperarQR: async function(ticket) {

        try {

            var response = await fetch("http://localhost:5000/api/Pedido/nuevoQR", {
                method: 'POST',
                body: JSON.stringify({ticket: ticket}),
                headers: {'Content-Type':'application/json'}
            });
    
            let data = await response.json();
            return data;
    
                
            } catch (error) {
                console.log('Error nuevoQR (pet): ', error);
                throw error;
            }
    },

    recuperarPDF: async function(paymentId) {

        try {

            var response = await fetch("http://localhost:5000/api/Pedido/recuperarPDF", {
                method: 'POST',
                body: JSON.stringify({paymentId: paymentId}),
                headers: {'Content-Type':'application/json'}
            });
    
            let data = await response.blob();
            return data;
        
            
        } catch (error) {
            console.log('Error -> ', error)
        }
    },

    compartirOrden: async function(idOrden, user) {

        try {

          var _petAjax = await fetch('http://localhost:5000/api/Pedido/compartirOrden',
          {
           method: 'POST',
           body: JSON.stringify({idOrden: idOrden, user: user}),
           headers: {'Content-Type':'application/json'}
          })

          return await _petAjax.json();

          
        } catch (error) {
            console.log('Error compartiendo la orden (pet): ', error);
            throw error;
        }

      }



};

export default pedidoRESTService;

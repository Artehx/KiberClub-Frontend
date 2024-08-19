

const restGeoApi={

  obtenerProvincias: async function() {

    try {

        let _respServer = await fetch('http://localhost:5000/api/GeoApi/ObtenerProvincias', {method: 'GET'});
        let _resp= await _respServer.json(); 
       
        if(! _respServer.ok) throw new Error(_resp);

        return JSON.parse(_resp.otrosdatos);

        
    } catch (error) {
        console.log('error al intentar obtener las provincias...', error)
        return [];
    }


  },

  obtenerMunicipios: async function(codpro){

    try {

        let _respServer = await fetch(`http://localhost:5000/api/GeoApi/ObtenerMunicipios/${codpro}`, {method: 'GET'});
        let _resp= await _respServer.json(); 
       
        if(! _respServer.ok) throw new Error(_resp);

        return JSON.parse(_resp.otrosdatos);

        
    } catch (error) {
        console.log('error al intentar obtener municipios...', error)
        return [];
    }

  } 



};

export default restGeoApi;
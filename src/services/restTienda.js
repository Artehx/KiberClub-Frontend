
var tiendaRESTService = {

 recuperarConciertos: async function() {

    try {

    var _concs = await fetch(`http://localhost:5000/api/Tienda/RecuperarConciertos`)
    return await _concs.json();

    } catch (error) {

        console.log(`Algo ha ido mal: ${error}`);
        return [];
    }
 },

 recuperarConcierto: async function(id) {
 
    try {
    
    var _conc = await fetch(`http://localhost:5000/api/Tienda/RecuperarConcierto/${id}`)
    return await _conc.json();
        
    } catch (error) {
        console.log(`Algo ha ido mal: ${error}`);
        return [];
    }

 },

 recuperarTopTracksArtista: async function(nombreArtista) {

    try {
    
     var _artistaPack = await fetch(`http://localhost:5000/api/Tienda/RecuperarTracksArtista/${nombreArtista}`)
     return await _artistaPack.json();   

    } catch (error) {
        console.log(`Algo ha ido mal: ${error}`);
        return [];
    }


 },

 recuperarTiempo: async function (latitud, longitud, fecha) {
    try {
      const url = 'http://localhost:5000/api/Tienda/RecuperarTiempo';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitud, longitud, fecha })
      });
      return await response.json();
    } catch (error) {
      console.log(`Algo ha ido mal: ${error}`);
      return [];
    }
  },

  


}

export default tiendaRESTService;
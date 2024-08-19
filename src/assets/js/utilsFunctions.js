

var utilsFunctions = {

    pause: async function(milisegundos) {
        return new Promise(resolve => {
            setTimeout(resolve, milisegundos);
        });
    }
  
}

export default utilsFunctions;
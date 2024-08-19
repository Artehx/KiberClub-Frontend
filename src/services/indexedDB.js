var indexedDBService = {
 
    crearEsquemaIndexedDB: async function(ev) {
        var db = ev.target.result; 
    
        var conciertosObjectStore = db.createObjectStore('concert', { keyPath: '_id' });
    
        console.log("Esquema de IndexedDB creado correctamente");
    },
    
    almacenarConcierto: function(concierto) {
        return new Promise((resolve, reject) => {
            var reqDB = indexedDB.open('concertDB', 1);
    
            reqDB.addEventListener('upgradeneeded', (ev) => this.crearEsquemaIndexedDB(ev));
            reqDB.addEventListener('error', (error) => {
                console.log('Error al abrir la base de datos en indexedDB:', error);
                reject(error);
            });
            reqDB.addEventListener('success', (ev) => {
                var db = ev.target.result;
    
                var transaction = db.transaction(['concert'], 'readwrite');
                var store = transaction.objectStore('concert');
    
                var getRequest = store.get(concierto._id);
    
                getRequest.onsuccess = (event) => {
                    var existeConcierto = event.target.result;
    
                    if (!existeConcierto) {
                        //Si no existe un concierto con el mismo _id lo agregamos
                        var addRequest = store.add(concierto);
                        addRequest.addEventListener('success', () => {
                            console.log('Concierto almacenado con éxito en indexedDB');
                            resolve();
                        });
                        addRequest.addEventListener('error', (error) => {
                            console.log('Error al almacenar el concierto en indexedDB:', error);
                            reject(error);
                        });
                    } else {
                        console.log('El concierto ya existe en indexedDB, no se agregará de nuevo.');
                        resolve(); 
                    }
                };
    
                getRequest.onerror = (error) => {
                    console.log('Error al obtener el concierto de indexedDB:', error);
                    reject(error);
                };
            });
        });
    },
    
    recuperarConcierto: function(idConcierto, callback) {
        var reqDB = indexedDB.open('concertDB', 1);
    
        reqDB.addEventListener('error', (error) => console.log('Error al abrir la base de datos en indexedDB:', error));
        reqDB.addEventListener('upgradeneeded', (ev) => this.crearEsquemaIndexedDB(ev));
        reqDB.addEventListener('success', (ev) => {
            var db = ev.target.result;
    
            var transaction = db.transaction(['concert'], 'readonly');
            var request = transaction.objectStore('concert').get(idConcierto);
    
            request.addEventListener('success', (evt) => {
                var concierto = evt.target.result;
                callback(concierto);
            });
    
            request.addEventListener('error', (error) => {
                console.log('Error al recuperar el concierto de indexedDB:', error);
            });
        });
    },

    almacenarPDF: function(pdfBlob, secretKey) {
        return new Promise((resolve, reject) => {
            var reqDB = indexedDB.open('pdfDB', 1);
    
            reqDB.addEventListener('upgradeneeded', (ev) => {
                var db = ev.target.result;
                db.createObjectStore('pdf', { keyPath: 'secretKey' });
                console.log("Esquema de IndexedDB para PDF creado correctamente");
            });
    
            reqDB.addEventListener('error', (error) => {
                console.log('Error al abrir la base de datos en indexedDB:', error);
                reject(error);
            });
    
            reqDB.addEventListener('success', (ev) => {
                var db = ev.target.result;
    
                var transaction = db.transaction(['pdf'], 'readwrite');
                var store = transaction.objectStore('pdf');
    
                var clearRequest = store.clear();
                clearRequest.onsuccess = () => {
                    console.log('Tienda de objetos vaciada con éxito');
                    console.log('pdfBlob -> ', pdfBlob);
                    agregarPDF();
                };
                clearRequest.onerror = (error) => {
                    console.log('Error al vaciar la tienda de objetos:', error);
                    reject(error);
                };
    
                function agregarPDF() {
                    console.log('Entra aqui -> ', pdfBlob)
                   
                    var addRequest = store.add({ secretKey: secretKey, pdfBlob: pdfBlob });
                   
                    addRequest.onsuccess = () => {
                        console.log('PDF almacenado con éxito en indexedDB: ', pdfBlob);
                        console.log('SecretKey -> ', secretKey);
                        resolve();
                    };
                    addRequest.onerror = (error) => {
                        console.log('Error al almacenar el PDF en indexedDB:', error);
                        reject(error);
                    };
                }
            });
        });
    },

    recuperarPDF: function(secretKey, callback) {
        var reqDB = indexedDB.open('pdfDB', 1);

        reqDB.addEventListener('error', (error) => console.log('Error al abrir la base de datos en indexedDB:', error));
        reqDB.addEventListener('upgradeneeded', (ev) => {
            var db = ev.target.result;
            db.createObjectStore('pdf', { keyPath: 'secretKey' });
            console.log("Esquema de IndexedDB para PDF creado correctamente");
        });
        reqDB.addEventListener('success', (ev) => {
            var db = ev.target.result;

            var transaction = db.transaction(['pdf'], 'readonly');
            var request = transaction.objectStore('pdf').get(secretKey);

            request.addEventListener('success', (evt) => {
                var pdfData = evt.target.result;
                if (pdfData) {
                    callback(pdfData.pdfBlob);
                } else {
                    console.log('No se encontró el PDF asociado a la clave:', secretKey);
                }
            });

            request.addEventListener('error', (error) => {
                console.log('Error al recuperar el PDF de indexedDB:', error);
            });
        });
    }


};

export default indexedDBService;


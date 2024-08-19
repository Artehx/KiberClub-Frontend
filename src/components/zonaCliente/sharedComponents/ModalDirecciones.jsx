
import { useEffect, useMemo, useState } from "react";
import { Modal, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import geoApiRESTService from '../../../services/restGeoApi';


function ModalDirecciones({onDireccionSubmit, onOpen, onClose, direccionAEditar, editMode, setEditMode, onEditDireccion}) {

     //#region --------------- state manejado por el componente (global por context-api o local) ------------------

     let [listaProvincias, setListaProvincias] = useState([]);
     let [selectProvincia, setSelectProvincia] = useState(0);

     let [listaMunicipios, setListaMunicipios] = useState([]);

     const [validationErrors, setValidationErrors] = useState({});
     const [formValido, setFormValido] = useState(false);

   

     const [direccion, setDireccion] = useState({
      //La id solo voy a utilizarla a la hora de eliminar la direccion en el padre
      calle: '',
      cp: '',
      pais: 'España',
      provincia: { CCOM: '', CPRO: '0', PRO: '' },
      municipio: { CUN: '', CPRO: '', CMUM: '', DMUN50: '' },
      esPrincipal: false,
      esFacturacion: false
     });

     useEffect(() => {
      if (editMode === true) {
          console.log('direccion a editar -> ', direccionAEditar);
          setDireccion({
              _id: direccionAEditar._id ,
              calle: direccionAEditar.calle || '',
              cp: direccionAEditar.cp || '',
              pais: direccionAEditar.pais || 'España',
              provincia: {
                CCOM: direccionAEditar.provincia.CCOM || '',
                CPRO: direccionAEditar.provincia.CPRO || '0',
                PRO: direccionAEditar.provincia.PRO || ''
              },              
              municipio: {
               CUN: direccionAEditar.municipio.CUM || '',
               CPRO: direccionAEditar.municipio.CPRO || '',
               CMUM: direccionAEditar.municipio.CMUM || '',
               DMUN50: direccionAEditar.municipio.DMUN50 || ''

              },
              esPrincipal: direccionAEditar.esPrincipal || false,
              esFacturacion: direccionAEditar.esFacturacion || false
          });
          setSelectProvincia(direccionAEditar.provincia.CPRO);
      
      } 
   }, [editMode]);
   
    

     useEffect(() => {
       console.log('Datos de direccion en ModalDirecciones -> ', direccion);
       
      

      }, [direccion])
     

 

     //#endregion

       //#region --------------- validaciones del form -------------------------------------------------------------

       function validarCampo(campo){

        let isValid = true;
        const mensajeErrores = {...validationErrors};
        //NO UTILIZO EL BREAK PARA QUE ENTRE EN TODOS LOS CASES
        // Y ME ANIDE EN EL ARRAY DE VALIDATIONERRORS TODOS LOS ERRORES
        switch (campo) {
          case "calle":
            if (!direccion.calle) {
              mensajeErrores.calle = "*Calle obligatoria";
              isValid = false;
            }
          case "cp":
            if (!direccion.cp) {
              mensajeErrores.cp = "*Código postal obligatorio";
              isValid = false;
            }
          case "provincia":
            if (!direccion.provincia.PRO) {
              mensajeErrores.provincia = "*Provincia obligatoria";
              isValid = false;
            }
          case "municipio":
            if (!direccion.municipio.CMUM) {
              mensajeErrores.municipio = "*Municipio obligatorio";
              isValid = false;
            }
          default:
            break;
        }
         return {mensajeErrores, isValid};

     }


     //#endregion

     //#region --------------- efectos del componente -------------------------------------------------------------

     useMemo(
      async() => {
  
         let _provs = await geoApiRESTService.obtenerProvincias();
         console.log('provincias obtenidas por useMemo',_provs);
         setListaProvincias(_provs);
    
        },
        []
      );

      useEffect(() => {
        async function recuperarMunicipios() {
            try {
                const _munis = await geoApiRESTService.obtenerMunicipios(selectProvincia);
                console.log('Select provincia -> ', selectProvincia);
                console.log('Municipios obtenidos en el useEffect:', _munis);
                setListaMunicipios(_munis);
            } catch (error) {
                console.error('Error al recuperar municipios:', error);
            }
        }
    
          if(selectProvincia != 0){
            recuperarMunicipios();
          }
        
     }, [selectProvincia])

     useEffect(() => {
      console.log("Provincia selccionada: ", selectProvincia);
      console.log('Municipios -> ', listaMunicipios);
      
     }, [listaMunicipios]);
     //#endregion

     //municipio: { CUN: '', CPRO: '', CMUM: '', DMUN50: ''}

     //#region --------------- funciones manejadoras de eventos ----------------------------------------------------

     const handleChange = (ev) => {
      const {name, value} = ev.target;
      setDireccion({...direccion, [name]: value});
       
      validationErrors[name] && delete validationErrors[name];
      setValidationErrors({ ...validationErrors });
     }


   
     /*
     const handleProvinciaChange = (value) => {
      const [CPRO, PRO, CCOM] = value.split("-");
      setDireccion(prevDireccion => ({
        ...prevDireccion,
        provincia: {
          CPRO: CPRO,
          PRO: PRO,
          CCOM: CCOM || ''  
        }
      }));
      setSelectProvincia(CPRO);
    };

     const handleMunicipioChange = (value) => {
      const [CPRO, CMUM, DMUN50] = value.split("-");
       setDireccion(prevDireccion => ({
          ...prevDireccion,
          municipio: {
           CUN: '',
           CPRO: CPRO,
           CMUM: CMUM,
           DMUN50: DMUN50
          }
       }));
       console.log(direccion.municipio)
     }*/

     const handleProvinciaChange = (value) => {
      direccion.provincia.CPRO = value;
      setSelectProvincia(value);
     };
     
     const handleMunicipioChange = (value) => {
      
      direccion.municipio.CMUM = value;
      setDireccion(prevDireccion => ({
        ...prevDireccion,
        municipio: {
         CMUM: value,
        }
      }));
     
      }

     const handleBlur = (ev) => {
      const { name } = ev.target;
      const { mensajeErrores, isValid } = validarCampo(name);
      setValidationErrors(mensajeErrores);
      console.log('No es valido -> ', mensajeErrores)
      setFormValido(isValid);
      };

      const handleBlurProvincia = () => {
        handleBlur({ target: { name: "provincia" } });
      };
      
      const handleBlurMunicipio = () => {
        handleBlur({ target: { name: "municipio" } });
      };

     function handleOnClose(ev){
      ev.preventDefault();

      console.log('Cerrando modal...')

      setDireccion({
       calle: '',
       cp: '',
       pais: 'España',
       provincia: { CCOM: '', CPRO: '0', PRO: ''},
       municipio: { CUN: '', CPRO: '', CMUM: '', DMUN50: ''},
       esPrincipal: false,
       esFacturacion: false
      });
      
      if(editMode){
        setEditMode(false);
      }
      setFormValido(false);
      onClose();

     }
   
     function modalSubmit(ev){
        ev.preventDefault();
        //Para futuros cambios, hacer la direccion una variable normal
        // Y la provincia y municipio un state
       
        if(editMode === true){
          
          let direccionEditada = direccion;

          console.log('Cambiamos la direccion ya existente')
          //Capturar los valores aparte del codigo para provincia y municipio

          let provincia = listaProvincias.find(p => p.CPRO == direccion.provincia.CPRO);
          console.log('Provincia: ', provincia);

          direccionEditada.provincia = provincia;

          let municipio = listaMunicipios.find(p => p.CMUM == direccion.municipio.CMUM);

          console.log('Municipio: ', municipio);

          direccionEditada.municipio = municipio;

          setDireccion(direccionEditada);
          
          console.log('Direccion a editar: ', direccion);

          onEditDireccion(direccionEditada);
          onClose();

        } else {

          //Esta parte puedo optimizarla para no repetir codigo...(Para más tarde)
          let direccionCreada = direccion;

          let provincia = listaProvincias.find(p => p.CPRO == direccion.provincia.CPRO);
          console.log('Provincia: ', provincia);

          direccionCreada.provincia = provincia;

          let municipio = listaMunicipios.find(p => p.CMUM == direccion.municipio.CMUM);

          console.log('Municipio: ', municipio);

          direccionCreada.municipio = municipio;

          setDireccion(direccionCreada);

          //Enviamos la direccion al padre 
          onDireccionSubmit(direccionCreada);

          setDireccion({
          //idDireccion: window.crypto.randomUUID(),
          calle: '',
          cp: '',
          pais: 'España',
          provincia: { CCOM: '', CPRO: '0', PRO: ''},
          municipio: { CUN: '', CPRO: '', CMUM: '', DMUN50: ''},
          esPrincipal: false,
          esFacturacion: false
          });
      
          setFormValido(false);
          onClose();
        }
      
     }
     //#endregion

     const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        
        onClose();
      }
    };
   
   
  
 return (
    
    <>
  <Modal open={onOpen} onClose={onClose}>
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="relative bg-white p-8 max-w-md m-auto rounded-lg shadow-xl">

        <h2 className="text-2xl text-center bladerunner mb-4"> {editMode ? 'Editar Direccion' : 'Nueva Direccion'}</h2>
        <div className= "bg-gray-700 silkScreen text-white w-full h-10 mb-4 flex justify-center items-center rounded-md">
        {formValido ? (
          <span>Campos completados correctamente</span>
        ) : (
          <span>
            *Debes rellenar todos los campos
            {Object.keys(validationErrors).map((key) => (
              <span className="text-red-500 silkScreen text-xs m-0 p-0" key={key}>
               {/*{validationErrors[key]}*/}
              </span>
            ))}
          </span>
        )}
        </div> 
        <form onSubmit={modalSubmit} className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <input
              id="calle"
              className="w-full p-3 silkScreen leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded"
              type="text"
              placeholder="Calle"
              name="calle"
              value={direccion.calle}
              onChange={handleChange}
              onBlur={(ev) => handleBlur(ev)}
            />
          </div>
          <div className="col-span-1">
            <input
              id="cp"
              className="w-full p-3 silkScreen leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded"
              type="text"
              placeholder="CP"
              name="cp"
              value={direccion.cp}
              onChange={handleChange}
              onBlur={(ev) => handleBlur(ev)}
            />
          </div>
          
          <div className="col-span-1">
            <input
              id="pais"
              className="w-full p-3 silkScreen leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded"
              type="text"
              placeholder="País"
              name="pais"
              value={direccion.pais}
              readOnly
              disabled
              onChange={handleChange}
              onBlur={(ev) => handleBlur(ev)}
            />
          </div>
          <div className="col-span-3 flex justify-between">
          <div className="w-2/4 mr-2">
            <select
              value={direccion.provincia.CPRO}              
              onChange={(e) => handleProvinciaChange(e.target.value)}
              name="provincia"
              className="placeholder-green-900 bg-white shadow border-2 border-green-900 rounded w-full p-3 h-14 font-semibold font-serif leading-6 text-lg"
              style={{ fontFamily: 'slkScreen' }}
              aria-label="Provincia"
              onBlur={handleBlurProvincia}
            >
            <option value="0" defaultValue={false}>Provincia</option>

              {listaProvincias.map((provincia) => (
                <option key={provincia.CPRO} value={provincia.CPRO}>
                  {provincia.PRO}
                </option>
              ))}
            </select>
          </div>
          <div className="w-2/4">
            <select
              value={direccion.municipio.CMUM}
              onChange={(e) => handleMunicipioChange(e.target.value)}
              name="municipio"
              className="placeholder-green-900 bg-white shadow border-2 border-green-900 rounded w-full p-3 h-14 font-semibold font-serif leading-6 text-lg"
              style={{ fontFamily: 'slkScreen' }}
              aria-label="Municipio"
              onBlur={handleBlurMunicipio}
            >
              <option value="0" defaultValue={true}>Municipio</option>
              {listaMunicipios.map((municipio) => (
                <option key={municipio.CMUM} value={municipio.CMUM}>
                  {municipio.DMUN50}
                </option>
              ))}
            </select>
          </div>
        </div>
          <div className="col-span-3">
            <textarea
              id="observaciones"
              className="w-full p-3 silkScreen leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded"
              placeholder="Observaciones"
              name="observaciones"
              value={direccion.observaciones}
              onChange={handleChange}
              
            />
          </div>
          <div className="col-span-3 flex justify-end space-x-4">
            <button className="inline-block w-full silkScreen py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-green-800 hover:bg-green-900 border-3 border-green-900 shadow rounded transition duration-200" disabled={!formValido} onClick={modalSubmit} type="submit"> {editMode ? 'Editar' : 'Crear'}</button>
            <button className="inline-block w-full silkScreen py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-red-700 hover:bg-red-800 border-3 border-red-900 shadow rounded transition duration-200" onClick={handleOnClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </Modal>
    </>


)

}

export default ModalDirecciones;
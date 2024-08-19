import { useState, useEffect, useMemo } from "react";
import {Link, useNavigate } from 'react-router-dom';
import ModalDirecciones from "../sharedComponents/ModalDirecciones";
import Spinner from "../../../assets/utils/spinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import utilsFunctions from "../../../assets/js/utilsFunctions";
import Select from 'react-select';
import {toast} from 'react-toastify';
import clienteRESTService from '../../../services/restCliente';



function Registro() {

 //#region --------------- state manejado por el componente (global por context-api o local) ------------------

   let navigate = useNavigate();

   let [datosCliente, setDatosCliente] = useState({
    nombre: '', apellidos: '', fechaNacimiento: '',
    telefono: '', password: '', repassword: '',
    email: '', usuario: '', genero: 'Hombre'

   })

   //Direcciones del cliente
  const [direcciones, setDirecciones] = useState([]);
  const [selectedDireccion, setSelectedDireccion] = useState(null);

  const [listaGeneros, setListaGeneros] = useState([]);
  //Gustos musicales del cliente
  const [generosCliente, setGenerosCliente] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});

  const [loading, setLoading] = useState(false);

  //...DIRECCIONES...
  

      const agregarDireccion = (newDireccion) => {
        if (direcciones.length < 2) {
         //SI EL ARRAY DE DIRECCIONES YA TIENE 2 DIRECCIONES NO AGREGAMOS UNA NUEVA
         //ENSEÑAREMOS UNA ALERTA DE QUE DEBE BORRAR UNA DIRECCION PARA PODER AGREGAR
         //UNA NUEVA DIRECCION DE NUEVO
          const nuevaDireccion = {
            value: direcciones.length,
            idDireccion: newDireccion.idDireccion,
            label: `${newDireccion.calle}, ${newDireccion.cp}, ${newDireccion.municipio.DMUN50}, 
            ${newDireccion.provincia.PRO}, ${newDireccion.pais}`,
            ...newDireccion 
          }; //Al estar usando un react-select tengo que actualizar el label que se 
            //muestra en el select
          
          console.log('Direccion a añadir: ', newDireccion)
          setDirecciones([...direcciones, newDireccion]);
          setSelectedDireccion(nuevaDireccion);
          toast.success("¡Direccion añadida!");

        } else {
     
          toast.warning("Has alcanzado el limite de direcciones, borra alguna...")
        }
      };
    

      const direccionesSelect = direcciones.map((direccion, index) => ({
        value: index,
        idDireccion: direccion.idDireccion,
        label: `${direccion.calle}, ${direccion.cp}, ${direccion.municipio.DMUN50}, 
        ${direccion.provincia.PRO}, ${direccion.pais}`, 
      }));

 //#endregion

 //#region --------------- validaciones del form -------------------------------------------------------------

 function validarCampo(campo) {
  let isValid = true;
  const mensajeErrores = { ...validationErrors }; //Si hay errores ya...

  switch (campo) {
    case "email":
      if (!datosCliente.email) {
        mensajeErrores.email = "*Email obligatorio";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(datosCliente.email)) {
        mensajeErrores.email = "*El email no es válido";
        isValid = false;
      }
      break;

    case "telefono":
      if (!datosCliente.telefono) {
        mensajeErrores.telefono = "*Teléfono obligatorio";
        isValid = false;
      } else if (!/^\d{9}$/.test(datosCliente.telefono)) {
        mensajeErrores.telefono = "*Formato incorrecto";
        isValid = false;
      }
      break;

    case "nombre":
      if (!datosCliente.nombre) {
        mensajeErrores.nombre = "*Nombre obligatorio";
        isValid = false;
      }
      break;

    case "usuario":
      if (!datosCliente.usuario) {
        mensajeErrores.usuario = "*Usuario obligatorio";
        isValid = false;
      } else if (datosCliente.usuario.length < 4) {
        mensajeErrores.usuario = "*El usuario debe tener al menos 4 caracteres";
        isValid = false;
      }
      break;

    case "password":
      if (!datosCliente.password) {
        mensajeErrores.password = "*Contraseña obligatoria";
        isValid = false;
      } else if (datosCliente.password.length < 8) {
        mensajeErrores.password = "*La contraseña debe tener al menos 8 caracteres";
        isValid = false;
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{9,}/.test(datosCliente.password)) {
        mensajeErrores.password = "*La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial";
        isValid = false;
      }
      break;

    case "repassword":
      if (!datosCliente.repassword) {
        mensajeErrores.repassword = "*Repite la contraseña...";
        isValid = false;
      } else if (datosCliente.password !== datosCliente.repassword) {
        mensajeErrores.repassword = "Las contraseñas no coinciden";
        isValid = false;
      }
      break;

    case "apellidos":
      if (!datosCliente.apellidos) {
        mensajeErrores.apellidos = "Apellido/s obligatorios";
        isValid = false;
      }
      break;

    case "fechaNacimiento":
      if (!datosCliente.fechaNacimiento) {
        mensajeErrores.fechaNacimiento = "Cumpleaños obligatorio";
        isValid = false;
      }
      break;

    case "genero":
      if (!datosCliente.genero) {
        mensajeErrores.genero = "Selecciona un género";
        isValid = false;
      }
      break;


    default:
      break;

  }


  return { mensajeErrores, isValid };
}

 //#endregion

 //#region --------------- efectos del componente -------------------------------------------------------------

 //efecto recuperar generos
 useMemo(async () => {
  async function recuperarGeneros() {
      let _gensRecup = await clienteRESTService.recuperarGeneros();
      setListaGeneros(_gensRecup.slice(0, 13));
      }

  recuperarGeneros();
}, []);

 //Efecto para visualizar los generos, no podemos hacerlo 
 // en el efecto en el que las recuperamos debido a la asincronia

 useEffect(() => {
  console.log('Generos -> ', listaGeneros);
 }, [listaGeneros]);


  
 
 //#endregion

 //#region --------------- funciones manejadoras de eventos ----------------------------------------------------

 const handleChange = (ev) => {
   const {name, value} = ev.target;
   setDatosCliente((prevDatosCliente) => ({
    ...prevDatosCliente,
    [name]: value,
  }));

  validationErrors[name] && delete validationErrors[name];
  setValidationErrors({ ...validationErrors });

 };

  const handleBlur = (ev) => {
  const { name } = ev.target;
  const { mensajeErrores, isValid } = validarCampo(name);
  setValidationErrors(mensajeErrores);
  };

 const handleMostrarModal = () => {
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
  };

  const handleEliminarDireccion = (id) => {
    const filteredDirecciones = direcciones.filter((dir) => dir.idDireccion !== id);
    setDirecciones(filteredDirecciones);
  
    //Verificamos si existe alguna dirección aparte de la que hemos borrado
    if (filteredDirecciones.length === 1) {
      //Si solo queda una dirección, se selecciona directamente
      setSelectedDireccion(filteredDirecciones[0].idDireccion);
    } else {
      setSelectedDireccion(null);
    }
  };

  const handleClickGenero = (genero) => {
 
    const generoExiste = generosCliente.some(item => item.idGenero === genero.idGenero);
    console.log('Entra en el manejador: ', generoExiste)
    if(!generoExiste) {

      generosCliente.length < 5
      ? setGenerosCliente([...generosCliente, genero])
      : toast.warning("Son 5 gustos como máximo en el registro...");
     
    } else {
      //El genero ya esta seleccionado y cambiamos de color a blanco con la fuente en rojo
      setGenerosCliente(generosCliente.filter(item => item.idGenero !== genero.idGenero));

    }
  }

  async function handleSubmit(ev) {
    try {
      ev.preventDefault();

      /*VALIDACIONES DIRECCIONES Y GENEROS*/ 
       let coleccionesValidas = false;

      direcciones.length >= 1
        ? coleccionesValidas = true
        : toast.warning("Añade al menos una direccion...");
  
      generosCliente.length >= 3
        ? coleccionesValidas = true
        : toast.warning("Selecciona tres gustos músicales como minimo...");
     
      /************************************/ 
        
      const camposValidos = Object.keys(datosCliente).every(campo => {
        const { mensajeErrores, isValid } = validarCampo(campo);
         setValidationErrors(prevErrors => ({
         ...prevErrors,
         ...mensajeErrores
        }));
          return isValid;
       });
      
      if (!camposValidos || coleccionesValidas == false) {
        !camposValidos ? toast.warning("Completa todos los campos...")
        : console.log('Campos validos...')

      } else {

        const newCliente = {
          ...datosCliente,
          direcciones: direcciones,
          gustosMusicales: generosCliente
        }

        setLoading(true);

       let _resp = await clienteRESTService.registrarCliente(newCliente);
       console.log('respuesta del servidor... ', _resp);

       await utilsFunctions.pause(2400);

       switch(_resp.codigo){

        case 0:

        navigate("/Cliente/RegistroOK");

        break;

        case 1:

        toast.warning("Error en el servidor, pruebe más tarde...")
        setLoading(false);

        break;

        case 2:

        toast.warning("Usuario o email ya registrados...")
        setLoading(false);

        break;

       }

      }



    } catch (error) {
      console.log("Error al validar el formulario:", error);
    } 
  }
  

 //#region --------------- estilo custom del select -------------------------------------------------------------

 const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '420px',
      minHeight: '40px',
      borderRadius: '2px',
      borderColor: state.isFocused ? '#718096' : '#CBD5E0', 
      boxShadow: state.isFocused ? '0 0 0 1px #718096' : null, 
      '&:hover': {
        borderColor: '#718096' 
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'black'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#C53030' : state.data.color, 
      color: state.isSelected ? 'white' : 'black', 
    }),

    dropdownIndicator: (provided) => ({
        ...provided,
        display: 'none'
      }),
    
  };

 //#endregion

 return (
  
   <>
   <div className="pt-32 pb-8 overflow-hidden flex items-center justify-center background-pattern">
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     <section className="py-4 mr-4 rounded-lg border-4 border-green-600 bg-white" style={{ minWidth: '645px', maxWidth:'820px' }}>
         <div className="container px-4 mx-auto">
             <div className="max-w-lg mx-auto py-8">
                 <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl text-center bladerunner mb-2">B registro B</h2>
                 </div>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <h3 className="text-3xl silkScreen text-center w-full mb-6">Datos Personales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col ">
                            <label className="block mb-2 font-extrabold" htmlFor="nombre">Nombre</label>
                            <input id="nombre" className="w-full h-12 silkScreen p-3 leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" type="text" placeholder="Nombre"
                            onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)} name="nombre" value={datosCliente.nombre} />
                             {validationErrors.nombre && (
                              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.nombre}</span>
                            )} 
                           </div>
                           
                        <div className="flex flex-col">
                            <label className="block mb-2 font-extrabold" htmlFor="apellido">Apellidos</label>
                            <input id="apellido" className="w-full h-12 p-3 silkScreen leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" type="text" placeholder="Apellidos" 
                            onChange={(ev) => handleChange(ev)} name="apellidos" onBlur={(ev) => handleBlur(ev)} value={datosCliente.apellidos}/>
                            {validationErrors.apellidos && (
                              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.apellidos}</span>
                           )}                              
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2 font-extrabold" htmlFor="fechaNacimiento">Cumpleaños</label>
                            <input id="fechaNacimiento" className="w-full h-12 silkScreen p-3 leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" type="date" 
                            onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)} name="fechaNacimiento" value={datosCliente.fechaNacimiento}/>
                             {validationErrors.fechaNacimiento && (
                              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.fechaNacimiento}</span>
                             )}  
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2 font-extrabold" htmlFor="telefono">Teléfono</label>
                            <input id="telefono" className="w-full h-12 p-3 silkScreen leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" type="tel" placeholder="Telefono" 
                            onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)} name="telefono" value={datosCliente.telefono}/>
                              {validationErrors.telefono && (
                              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.telefono}</span>
                             )}  
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2 font-extrabold" htmlFor="password">Contraseña</label>
                            <input id="password" className="w-full h-12 p-3 leading-6 text-lg silkScreen placeholder-red-600 bg-white shadow border-2 border-green-900 rounded" type="password" placeholder="**********"
                            onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)} name="password" value={datosCliente.password} />
                             {validationErrors.password && (
                              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.password}</span>
                             )} 
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2 font-bold" htmlFor="repassword">Repetir contraseña</label>
                            <input id="repassword" className="w-full h-12 p-3 leading-6 text-lg silkScreen placeholder-red-600 bg-white shadow border-2 border-green-900 rounded" type="password" placeholder="**********"
                            onChange={(ev) => handleChange(ev)}  onBlur={(ev) => handleBlur(ev)} name="repassword" value={datosCliente.repassword} />
                           {validationErrors.repassword && (
                              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.repassword}</span>
                             )} 
                        </div>
                          <div className="flex flex-col">
                            <label className="block mb-2 font-extrabold" htmlFor="email">Email</label>
                            <input id="email" className="w-full h-12 p-3 silkScreen leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" type="email" placeholder="Email"
                            onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)} name="email" value={datosCliente.email} />
                             {validationErrors.email && (
                              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.email}</span>
                             )} 
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2 font-extrabold" htmlFor="usuario">Usuario</label>
                            <input id="usuario" className="w-full h-12 p-3 silkScreen leading-6 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" type="text" placeholder="Login"
                            onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}  name="usuario" value={datosCliente.usuario} />
                            {validationErrors.usuario && (
                              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.usuario}</span>
                             )} 
                        </div>
                      
                        <div className="flex flex-col">
                        <label className="block mb-2 font-extrabold" htmlFor="genero">Género</label>
                        <select id="genero" className="w-full h-12 p-3 leading-6 silkScreen text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded"
                          onChange={(ev) => handleChange(ev)} name="genero" value={datosCliente.genero}>
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                            <option value="otro">Otro</option>
                            </select>
                        </div>
                        </div>
                   
                        <button
                        type="submit"
                        className="inline-block w-full silkScreen py-4 px-6 mt-6 text-center text-lg leading-6 text-white font-extrabold bg-green-800 hover:bg-green-900 border-3 border-green-900 shadow rounded transition duration-200"
                        disabled={loading}
                        onClick={handleSubmit}>
                        {loading ? <Spinner /> : 'Registrarse'}
                    </button>                  
                    </form>
                </div>
            </div>
        </section>
        <div className="pt-10 pb-2 overflow-hidden flex items-center justify-center">
            <section className="py-8 mr-4 rounded-lg border-4 border-red-500 bg-white" style={{ minWidth: '645px', maxWidth: '820px' }}>
                <div className="px-4 mx-auto">
                <div className="max-w-lg mx-auto py-8">
                    <div className="text-center mb-8">
                    <h3 className="text-3xl silkScreen text-center w-full mb-6">Direcciones <span className="silkScreen text-lg">MAX {direcciones.length}/2</span></h3>
                    <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" onClick={handleMostrarModal}>AÑADIR DIRECCION</button>
                    </div>
                    <form action="" className="flex flex-col items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ModalDirecciones onOpen={showModal} onClose={handleCerrarModal} onDireccionSubmit={agregarDireccion} />
                    </div>
                    {/*Aqui el select personalizado de colores con un boton a la derecha unido a ese select con una x de fontAwesome para borrar la direccion seleccionada */}
                    <div  className="flex items-center mr-4 ">
                    <Select
                    placeholder="Crea una direccion..."
                    options={direccionesSelect}
                    styles={customStyles}
                    className="silkScreen border-4"
                    value={selectedDireccion} 
                    onChange={(selectedOption) => setSelectedDireccion(selectedOption)}
                    />
                    <FontAwesomeIcon icon={faTimesCircle} className="pl-2" onClick={() => handleEliminarDireccion(selectedDireccion.idDireccion)}   style={{cursor: 'pointer', fontSize: '25px', color: '#9c1111' }} />
                   </div>
                    </form>
                </div>
                <div className="max-w-lg mx-auto pb-4">
                <div className="text-center mb-8">
                  <h3 className="text-3xl silkScreen text-center w-full mb-6">Gustos Musicales <span className="silkScreen text-xl">{generosCliente.length}/5</span></h3>
                </div>
                <div className="flex flex-wrap justify-center">
                  {listaGeneros.map((genero) => (
                    <button key={genero.idGenero}  
                     className={`rounded-lg  silkScreen border-2 border-gray-800 p-1 m-1 ${
                      generosCliente.some(item => item.idGenero === genero.idGenero) ? 'bg-red-600 text-white' : 'font-bold text-red-600'
                    }`}
                    onClick={() => handleClickGenero(genero)}>
                      <span className="text-lg">{genero.icono}</span>{genero.nombreGenero}
                    </button>
                  ))}
                </div>
              </div>
                </div>
            </section>
         </div>   
         </div>  
    </div>
    
    
    </>

 )

}

export default Registro;
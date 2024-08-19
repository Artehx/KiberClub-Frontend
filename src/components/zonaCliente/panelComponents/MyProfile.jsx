import { useClienteLoggedContext } from '../../../context-providers/ClienteLoggedContext';
import { useEffect, useMemo, useState } from "react";
import clienteRESTService from "../../../services/restCliente";
import {toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { Progress, Tooltip, Typography } from "@material-tailwind/react";
import MiniDireccion from './MiniDireccion';
import ModalDirecciones from '../sharedComponents/ModalDirecciones';
import KiberChart from './KiberChart';
import SpotifyPlaylist from './SpotifyPlaylist';
import {Avatar} from "@material-tailwind/react";


function MyProfile() {

  const {clienteLogged, dispatch: clienteDispatch} = useClienteLoggedContext();
  //Los generos estan en clienteLogged.datoscliente.gustosMusicales
  const [fechaParseada, setFechaParseada] = useState('');


  const [datosCliente, setDatosCliente] = useState({
   nombre: clienteLogged.datoscliente.nombre, apellidos: clienteLogged.datoscliente.apellidos, 
   cuenta: {usuario: clienteLogged.datoscliente.cuenta.usuario, email: clienteLogged.datoscliente.cuenta.email,
    password: ''}, fechaNacimiento: clienteLogged.datoscliente.fechaNacimiento, telefono: clienteLogged.datoscliente.telefono,
   genero: clienteLogged.datoscliente.genero, repassword: ''
  });

  const [direccionAEditar, setDireccionAEditar] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [validationErrors, setValidationErrors] = useState({});
 

  const [listaGeneros, setListaGeneros] = useState([]);
  const [generosCliente, setGenerosCliente] = useState([]);
  const [mostrarGeneros, setMostrarGeneros] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    useEffect(() => {
      
      if(clienteLogged){
       const gustosMusicales = clienteLogged.datoscliente.gustosMusicales;
        // Almacenamos los objetos completos de género en lugar de solo los IDs
        setGenerosCliente(gustosMusicales);
      } else {
        setGenerosCliente([]);
      }

    }, [clienteLogged])

    useEffect(() => {

      const fechaCreacion = new Date(clienteLogged.datoscliente.fechaCreacion);
      const dia = fechaCreacion.getDate();
      const anio = fechaCreacion.getFullYear();

  

      let fecha = `Desde el ${dia} de ${meses[fechaCreacion.getMonth()]} de ${anio}`;

      setFechaParseada(fecha);

    }, [clienteLogged])
    

  
    useMemo(async () =>{
     async function recuperarGeneros(){
      let _gensRecup = await clienteRESTService.recuperarGeneros();
      _gensRecup.sort((a, b) => a.nombreGenero.localeCompare(b.nombreGenero));
      setListaGeneros(_gensRecup);
     }

     recuperarGeneros();

    }, []);

    useEffect(() => {
      
      console.log('Generos cliente: ', generosCliente);

    }, [generosCliente])

    useEffect(() => {
      
      console.log('Datos cliente: ', datosCliente);

    }, [datosCliente])

    function validarCampo(campo) {
      let isValid = true;
      const mensajeErrores = { ...validationErrors }; //Si hay errores ya...
    
      switch (campo) {
        case "email":
          if (!datosCliente.cuenta.email) {
            mensajeErrores.email = "*Email obligatorio";
            isValid = false;
          } else if (!/\S+@\S+\.\S+/.test(datosCliente.cuenta.email)) {
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
    
        case "cusuario":
          if (!datosCliente.cuenta.usuario) {
            mensajeErrores.usuario = "*Usuario obligatorio";
            isValid = false;
          } else if (datosCliente.usuario.length < 4) {
            mensajeErrores.usuario = "*El usuario debe tener al menos 4 caracteres";
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
        case "password":

            if (datosCliente.cuenta.password.length < 8) {
              mensajeErrores.password = "*La contraseña debe tener al menos 8 caracteres";
              isValid = false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{9,}/.test(datosCliente.cuenta.password)) {
              mensajeErrores.password = "*La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial";
              isValid = false;
            }
            break;
        case "repassword":

          if (datosCliente.cuenta.password !== datosCliente.repassword) {
           mensajeErrores.repassword = "Las contraseñas no coinciden";
           isValid = false;
          }
          break;
    
    
        default:
          break;
    
      }
    
    
      return { mensajeErrores, isValid };
    }

    const handleChange = (ev) => {
      const {name, value} = ev.target;

      if (name === 'usuario' || name === 'password' || name === 'email') {
        setDatosCliente((prevDatosCliente) => ({
          ...prevDatosCliente,
          cuenta: {
            ...prevDatosCliente.cuenta,
            [name]: value
          }
        }));
      } else {
        setDatosCliente((prevDatosCliente) => ({
          ...prevDatosCliente,
          [name]: value
        }));
      }
    
      validationErrors[name] && delete validationErrors[name];
      setValidationErrors({ ...validationErrors });

    }

    const handleClean = () => {
      setDatosCliente({
        cuenta: {
          email: '', 
          usuario: '',
          password: ''
        },
        nombre: '', 
        apellidos: '',
        fechaNacimiento: '', 
        telefono: '', 
        genero: 'Hombre', 
        repassword: ''
      });

      toast.warn('Borrando campos...');

    }

    const handleBlur = (ev) => {
      const { name } = ev.target;
      const { mensajeErrores, isValid } = validarCampo(name);
      setValidationErrors(mensajeErrores);
      };

    async function handleChangeData(ev) {

      try {
        
        ev.preventDefault();

        const camposValidos = Object.keys(datosCliente).every(campo => {
          const { mensajeErrores, isValid } = validarCampo(campo);
           setValidationErrors(prevErrors => ({
           ...prevErrors,
           ...mensajeErrores
          }));
            return isValid;
         });

        if(!camposValidos){
          !camposValidos ? toast.warning("Completa todos los campos a excepcion de la contraseña")
          : console.log('Campos validos...')
  

        } else {

          let _resp = await clienteRESTService.actualizarPerfil(datosCliente, clienteLogged.datoscliente._id);
          
          switch(_resp.codigo) {

          case 0:

          clienteDispatch(

            {
              type: 'CLIENTE_LOGGED',
              payload: {datoscliente: _resp.datoscliente, jwt: _resp.token}

            }

         );

          toast.success("Datos actualizados...")
          

          break;

          case 1:

          toast.warning("Error en el servidor, pruebe más tarde...")

          break;

          }


        }

      } catch (error) {
        console.log("Error al validar el formulario:", error);

      }

    }

    async function sendImage(img) {

      try {

       //console.log('Id del cliente en SendImage ', _idCliente);
        
       const _resp = await clienteRESTService.actualizarFoto(img, clienteLogged.datoscliente._id);
       
       console.log('Respuesta del actualizar foto ', _resp);
       if(_resp.codigo === 0){
 
        
     

        toast.success("Imagen actualizada!");
       }

      } catch (error) {
        console.log('Error: ', error);
      }

    }

    const handleImageChange = async (ev) => {

      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = async () => {

        console.log('Entra correctamente....')
        const imagenBase64 = reader.result;
        console.log('Imagen....', imagenBase64);

        clienteDispatch(
          {
            type: 'ACTUALIZAR_IMAGEN',
            payload: imagenBase64

          }
       );

        await sendImage(imagenBase64);


      };

      if(file){
        reader.readAsDataURL(file);
      
    }
  }

  const handleMostrarModal = () => {
    
    setShowModal(true);
  
  };

  const handleCerrarModal = () => {
    setShowModal(false);
  };

  const agregarDireccion = async (newDireccion) => {

    console.log('Nueva direccion -> ', newDireccion);

    try {

      let _resp = await clienteRESTService.operarDireccion(newDireccion, "agregar", clienteLogged.datoscliente._id);

      switch(_resp.codigo){
        case 0:
        clienteDispatch({
          type: 'OPERAR_DIRECCIONES',
          payload: _resp.direcciones,
        });
        toast.success("Dirección creada con exito!");
        break;

        case 1:
        toast.error("Error..Pruebe más tarde");
        break;

      }
      
    } catch (error) {

      console.log('Error operando direcciones: ', error)
      toast.error("Error..Pruebe más tarde");

    }



  }

  const handleBotonClick = async (operacion, direccion, editadoOk) => {
    try {
        switch (operacion) {
            case 'editar':
             
            console.log('Seleccionaste -> ', direccion);
            setDireccionAEditar(direccion);
            setEditMode(true);
            handleMostrarModal();

            if(editadoOk == true){
              
              console.log('Recibo la nueva direccion a editar...', direccion)

              let _resp = await clienteRESTService.operarDireccion(direccion, "editar", clienteLogged.datoscliente._id);

              console.log('Respuesta al editar direccion (cliente) ', _resp);
              switch(_resp.codigo){
                case 0:
                clienteDispatch({
                  type: 'OPERAR_DIRECCIONES',
                  payload: _resp.direcciones,
                });
                toast.success("Dirección editada con exito!");
                break;
        
                case 1:
                toast.error("Error..Pruebe más tarde");
                break;
        
              }


            }


            break;
            case 'eliminar':

            let _resp = await clienteRESTService.operarDireccion(direccion, "eliminar", clienteLogged.datoscliente._id);

            switch(_resp.codigo){
              case 0:
              clienteDispatch({
                type: 'OPERAR_DIRECCIONES',
                payload: _resp.direcciones,
              });
              toast.success("Dirección eliminada con exito!");
              break;
      
              case 1:
              toast.error("Error..Pruebe más tarde");
              break;
      
            }

            break;
        }
    } catch (error) {
        console.log('Error al procesar la acción del botón:', error);
    }
}

    const handleShowGeneros = () => {
      setMostrarGeneros(true);
     }
 
    const handleClickGenero = (genero) => {
  
       const generoExiste = generosCliente.some(item => item.idGenero === genero.idGenero);
       console.log('Entra en el manejador: ', generoExiste)
       if(!generoExiste) {
   
         generosCliente.length < 8
         ? setGenerosCliente([...generosCliente, genero])
         : toast.warning("Son 8 gustos como máximo...");
        
       } else {
         //El genero ya esta seleccionado y cambiamos de color a blanco con la fuente en rojo
         setGenerosCliente(generosCliente.filter(item => item.idGenero !== genero.idGenero));
   
       }
     }

    const handleSaveGeneros = async () => {

      try {

      if(generosCliente.length < 3) {

      toast.warning("Son tres gustos músicales como minimo...")

      } else {

        let _resp = await clienteRESTService.guardarGeneros(generosCliente, clienteLogged.datoscliente._id);

        switch(_resp.codigo) {
      
        case 0:

        clienteDispatch({type: 'ACTUALIZAR_GUSTOS', payload: _resp.generos})
        
        toast.success("Gustos guardados...")

        setMostrarGeneros(false);
        break;

        case 1:
        
        toast.warning("Error guardando los nuevos gustos...")

        break;

        }

        
      }

        
      } catch (error) {
        toast.warning("Error en el servidor...")
        console.log('Error -> ', error)
      }


    
    }

    function ProgressDefault() {
      

      return (
        <div className="flex w-full flex-col gap-4 mt-2">
          <Progress value={clienteLogged.datoscliente.dominio.experiencia} className='text-xs'
          color="amber" size='md' />
        </div>
      );
    }

    function RangoUsuario() {
      return (
         <>
         <span className='gap-2'> 
          <span className='text-sm mr-2'>{clienteLogged.datoscliente.dominio.rango.nombre}
          </span>
          <span >
          <FontAwesomeIcon icon={faBolt} size='xl' color={`${clienteLogged.datoscliente.dominio.rango.estiloIcono}`}></FontAwesomeIcon>
          </span>
         </span>
         </>
      )

    }

    return (
     <>
      <div className="flex flex-col items-center justify-center pt-28 mt-2 background-gray border-b-2 border-gray-700">
      <h1 className="text-4xl silkScreen"><span className="text-red-600">Cambia</span> lo que <span className="text-green-700">quieras</span> de tu <span className="text-yellow-700">perfil</span>  </h1>
      <span className='text-base silkScreen mb-4'>Aqui tienes disponible mas generos 🤔</span>
      </div>

      <div className="flex">
      <div className="flex w-4/5 h-full border-4 border-gray-800 my-0 ml-0"> 
      <section className="w-1/4 background-profile justify-start border-r-2 border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
            <span className="text-gray-200 text-sm">{fechaParseada}</span>
            <span className="text-green-400">
            <Tooltip className="bg-white p-0 m-0 border-0 shadow-xl shadow-black/10"
              content={
                <div className="w-96 border-2 border-gray-700 bg-gray-200 px-4 py-3 ">
                  <Typography variant='h4' color="red" className="silkScreen text-center border-0">
                    Info point
                  </Typography>
                  <Typography
                    variant="h5"
                    color="black"
                    className="font-bold ml-2 border-0 silkScreen text-xs "
                  >
                ¡Explora nuevas oportunidades mientras disfrutas de los mejores conciertos en nuestra plataforma! Con cada entrada que compres, subiras de nivel y rango, accediendo a ofertas exclusivas y fichas para nuestra emocionante ruleta! 😱                  </Typography>
                </div>
              }>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5 cursor-pointer text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              </Tooltip>
            </span>
        </div>
        <input
        type="file"
        id="selectorImagen"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Imagen de perfil que activa el input al hacer clic */}
      <div className="mt-3 w-fit mx-auto cursor-pointer">
        <label htmlFor="selectorImagen">
          <Avatar variant='circular'
            src={clienteLogged.datoscliente.cuenta.imagenAvatarBASE64}
            className="rounded-full w-28 h-28 "
       
          />
        </label>
      </div>

        <div className="mt-2 text-center">
            <h2 className="text-white font-bold text-2xl tracking-wide">{clienteLogged.datoscliente.cuenta.usuario}</h2>
        </div>
        <div>
           {ProgressDefault()}
        </div>
        <p className="text-green-500 text-center font-semibold mt-2.5" >
            Online
        </p>

       
        <div className="mt-3 text-white silkScreen text-sm gap-2">
            <div className="gap-1">
            <span className="text-gray-400  font-semibold">Experiencia: </span>
            <span>{clienteLogged.datoscliente.dominio.experiencia}</span>
            </div>
            <div className="gap-1">
            <span className="text-gray-400 font-semibold">Nivel: </span>
            <span>{clienteLogged.datoscliente.dominio.nivel}</span>
            </div>
            <div className="gap-1">
            <span className="text-gray-400 font-semibold">Rango: </span>
            
            {RangoUsuario()}
            </div>
        </div>
      </section>

      <section className="w-3/4 bg-blue-gray-50 pt-4">
        <div className="text-center mb-2 flex justify-center">
        <span className="text-2xl silkScreen">Datos Personales</span>
        </div>

        <div className="grid grid-cols-3  gap-y-4 gap-x-8 place-items-center mx-10">
        {/* Primera fila */}
         
        <div className="flex flex-col">
          <label className="font-extrabold" htmlFor="nombre">Nombre</label>
          <input id="nombre" className="w-full silkScreen p-3 leading-5 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" 
          type="text" placeholder="Nombre" name='nombre' value={datosCliente.nombre}  onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}/>
         {validationErrors.nombre && (
          <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.nombre}</span>
          )} 
        </div>

        <div className="flex flex-col">
          <label className="font-extrabold" htmlFor="apellido">Apellidos</label>
          <input id="apellido" className="w-full p-3 silkScreen leading-5 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" 
          type="text" placeholder="Apellidos" name='apellidos' value={datosCliente.apellidos} onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}/>                   
            {validationErrors.apellidos && (
            <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.apellidos}</span>
            )}  
        </div>

        <div className="flex flex-col w-full">
         <label className="font-extrabold" htmlFor="fechaNacimiento">Cumpleaños</label>
         <div className='w-full'>
         <input id="fechaNacimiento" className="silkScreen p-3 w-full leading-5 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded"
          type="date" name='fechaNacimiento' value={datosCliente.fechaNacimiento} onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}/>
            {validationErrors.fechaNacimiento && (
            <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.fechaNacimiento}</span>
            )}  
            </div>
        </div>

        {/* Segunda fila */}
        <div className="flex flex-col">
         <label className="font-extrabold" htmlFor="telefono">Teléfono</label>
         <input id="telefono" className="w-full p-3 silkScreen leading-5 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" 
         type="tel" placeholder="Telefono" name='telefono' value={datosCliente.telefono} onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}/>
           {validationErrors.telefono && (
           <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.telefono}</span>
           )}
        </div>

        <div className="flex flex-col">
         <label className="font-extrabold" htmlFor="password">Contraseña</label>
         <input id="password" className="w-full p-3 leading-5 text-lg silkScreen placeholder-red-600 bg-white shadow border-2 border-green-900 rounded" 
         type="password" placeholder="**********" name='password' value={datosCliente.cuenta.password} onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}/>
         {validationErrors.password && (
          <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.password}</span>
          )} 
        </div>

        <div className="flex flex-col">
        <label className="font-extrabold" htmlFor="repassword">Repetir contraseña</label>
          <input id="repassword" className="w-full p-3 leading-5 text-lg silkScreen placeholder-red-600 bg-white shadow border-2 border-green-900 rounded" 
          type="password" placeholder="**********" name='repassword' value={datosCliente.repassword} onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}/>
          
        </div>

        {/* Tercera fila */}
        <div className="flex flex-col">
        <label className="font-extrabold" htmlFor="email">Email</label>
         <input id="email" className="w-full p-3 silkScreen leading-5 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" 
         type="email" name='email' placeholder="Email" value={datosCliente.cuenta.email} onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}/>
          {validationErrors.email && (
            <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.email}</span>
          )} 
        </div>

        <div className="flex flex-col">
          <label className="font-extrabold" htmlFor="usuario">Usuario</label>
          <input id="usuario" className="w-full p-3 silkScreen leading-5 text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" 
          type="text" name='usuario' placeholder="Login" value={datosCliente.cuenta.usuario} onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}/>
          {validationErrors.usuario && (
              <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.usuario}</span>
            )} 
        </div>

        <div className="flex flex-col w-full">
         <label className="font-extrabold" htmlFor="genero">Género</label>
         <div className='w-full'>
         <select id="genero" className="w-full p-3 leading-5 silkScreen text-lg placeholder-green-900 bg-white shadow border-2 border-green-900 rounded"
          name="genero"  value={datosCliente.genero} onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)}>
         <option value="hombre">Hombre</option>
         <option value="mujer">Mujer</option>
         <option value="otro">Otro</option>
         </select>
         </div>

        </div>

     
        </div>

      <div className="flex justify-center pb-2 gap-10 mt-4">
        <button
        type="submit"
        onClick={handleChangeData}
        className="inline-block w-32 silkScreen px-2 py-3 text-center text-lg leading-4 text-white font-extrabold bg-green-800 hover:bg-green-900 border-3 border-green-900 shadow rounded transition duration-200">
         Cambiar datos
        </button> 
        <button
        type="submit"
        onClick={handleClean}
        className="inline-block w-32 silkScreen px-2 py-3 text-center text-lg leading-4 text-white font-extrabold bg-red-800 hover:bg-red-900 border-3 border-red-900 shadow rounded transition duration-200">
         Borrar datos
        </button> 
      </div>
      </section>

      </div>

      <div className="flex w-1/5 relative overflow-y-auto justify-center items-center border-2 border-gray-800 bg-blue-gray-800">
       
       <div className="flex flex-col absolute">
       
       {/*Crear un div con un boton para visualizar generos*/}

       {mostrarGeneros ? (
        <div className=''>
        <div className="grid grid-cols-2 mt-36">
            {listaGeneros.map((genero, index) => (
              <button 
               
                className={`rounded-lg silkScreen  border-2 border-b-2 border-gray-800 p-1 m-1
                ${generosCliente.some(g => g.idGenero === genero.idGenero) ? 'bg-red-600 text-white' : 'font-bold text-red-600 bg-gray-100'}`}
                onClick={() => handleClickGenero(genero)}
              >
                <span className="text-lg">{genero.icono}</span>{genero.nombreGenero}
              </button>
            ))}
          </div>
        
          <div className='flex justify-center p-2 '>
          <button
            type="submit"
            onClick={handleSaveGeneros}
            className="inline-block w-full silkScreen px-2 py-3 text-center text-lg leading-4 text-white font-extrabold bg-amber-600 hover:bg-yellow-700 border-3 border-green-900 shadow rounded transition duration-200">
            Guardar
            </button> 
          </div>

          </div>
        ) : (
          <div className="gap-y-2">

          <div>
          <img src="/public/images/guitar-transparent.png"></img>
          </div>

           <div className="flex justify-center pt-4">
           <button
            type="submit"
            onClick={handleShowGeneros}
            className="inline-block w-44 silkScreen px-2 py-3 text-center text-lg leading-4 text-gray-100 font-extrabold bg-amber-600 hover:bg-yellow-800 border-3 border-green-900 shadow rounded transition duration-200">
            Ver generos...
            </button> 

           </div>
            

          </div>
        )}
       
       </div>
      </div>

      </div>

      <div className="flex bg-blue-gray-50">
      <div className="flex justify-center white-pattern w-3/5 h-full border-r-4 border-gray-700 pt-4 overflow-y-auto ">
      
      <div className='flex flex-col py-4 justify-center gap-y-6 relative '>
        
      <div className='flex flex-col gap-y-3  h-40 overflow-x-auto'> 
       
        
        {clienteLogged.datoscliente.direcciones.map((direccion) => (
          <div key={direccion._id} > 
            <MiniDireccion direccion={direccion} onBotonClick={handleBotonClick} direccionesSize={clienteLogged.datoscliente.direcciones.length}/>
          </div>
        ))}
        
      </div>
      

      <div className='flex justify-center pb-5'>
       <FontAwesomeIcon onClick={handleMostrarModal} className='bg-white border-0 rounded-full' size='3x' color='#FFBF00'  icon={faCirclePlus}></FontAwesomeIcon>
      </div>
     
       <ModalDirecciones onOpen={showModal} onClose={handleCerrarModal} onDireccionSubmit={agregarDireccion} 
       direccionAEditar={direccionAEditar} editMode={editMode} setEditMode={setEditMode} onEditDireccion={(dir) => handleBotonClick('editar', dir, true)} />
      </div>

     
      </div>

       <div className="flex w-2/5 h-full bg-blue-gray-50 border-gray-800">
       <div className='w-1/2'>
       <KiberChart clienteLogged={clienteLogged} />
       </div>

       <div className=' w-full flex justify-center pt-5 '>
         <div className='flex flex-col justify-center '>
         <span className='silkScreen text-xl ml-6 '>
           La playlist del mes </span>
          
          <div>
            
         
          <SpotifyPlaylist /> 
         </div>
         </div>

       </div>
       </div>

      </div>

     </>

    );

}

export default MyProfile;
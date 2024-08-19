import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import {toast} from 'react-toastify';
import { Outlet, useLoaderData, Link, useNavigate } from "react-router-dom"; 
import { useState } from 'react';
import { useClienteLoggedContext } from '../../../context-providers/ClienteLoggedContext';
import clienteRESTService from '../../../services/restCliente';
import utilsFunctions from '../../../assets/js/utilsFunctions';

function Login() {

     //#region --------------- state manejado por el componente (global por context-api o local) ------------------

    let [datosLogin, setDatosLogin] = useState({
        email: '', password: ''
    })

    let {ClienteLogged, dispatch} = useClienteLoggedContext();

    let navigate = useNavigate();

    const [validationErrors, setValidationErrors] = useState({});


    //#endregion

    //#region --------------- validaciones del form -------------------------------------------------------------

    function validarCampo(campo){

        let isValid = true;
        const mensajeErrores = {...validationErrors}

        switch(campo) {
            case "email":
             if (!datosLogin.email) {
              mensajeErrores.email = "*Email obligatorio";
              isValid = false;
             } else if (!/\S+@\S+\.\S+/.test(datosLogin.email)) {
              mensajeErrores.email = "*El email no es válido";
              isValid = false;
             }
             break;

            case "password":
              if (!datosLogin.password) {
                mensajeErrores.password = "*Contraseña obligatoria";
                isValid = false;
               } else if (datosLogin.password.length < 8) {
                mensajeErrores.password = "*La contraseña debe tener al menos 8 caracteres";
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


    //#endregion

    //#region --------------- funciones manejadoras de eventos ----------------------------------------------------

    const handleChange = (ev) => {
        const {name, value} = ev.target;
        setDatosLogin((prevDatosCliente) => ({
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

      async function handleSubmit(ev) {

        try {

        ev.preventDefault();

        const camposValidos = Object.keys(datosLogin).every(campo => {
            const { mensajeErrores, isValid } = validarCampo(campo);
             setValidationErrors(prevErrors => ({
             ...prevErrors,
             ...mensajeErrores
            }));
              return isValid;
           });
          
         if(!camposValidos){
            toast.warning("Completa todos los campos...")
         } else {

           let _resp = await clienteRESTService.loginCiente(datosLogin);
           console.log('respuesta del servidor...', _resp);

           switch(_resp.codigo){

            case 0:
            
            dispatch(

                {
                  type: 'CLIENTE_LOGGED',
                  payload: {datoscliente: _resp.datoscliente, jwt: _resp.tokensesion}

                }

            );

            navigate("/Eventos/Musica")

            break;

            case 1:

            toast.error("Login fallido, intentelo de nuevo...")

            console.log('Error en el servidor, login fail...')

           }
             

         }

            
        } catch (error) {
            
        }


      }

    //#endregion

    return (
        <div className="h-screen pt-36 pb-12 overflow-hidden flex items-center justify-center background-pattern">
            <section className="mr-8 rounded-lg border-4 border-green-600 bg-white" style={{ minWidth: '500px', maxWidth:'800' }}>
                <div className="container px-4 mx-auto ">
                    <div className="max-w-lg mx-auto py-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl text-center bladerunner mb-2">B Iniciar Sesion B</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block mb-2 font-extrabold" htmlFor="">Email</label>
                                <input className="inline-block w-full silkScreen p-4 leading-6 text-lg font-extrabold placeholder-green-900 bg-white shadow border-2 border-green-900 rounded" type="email" placeholder="email"
                                onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)} name="email" value={datosLogin.email} />
                                {validationErrors.email && (
                                 <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.email}</span>
                                 )} 
                            </div>
                            <div className="mb-6">
                                <label className="block mb-2 font-extrabold" htmlFor="">Contraseña</label>
                                <input className="inline-block w-full silkScreen  p-4 leading-6 text-lg font-extrabold placeholder-red-600 bg-white shadow border-2 border-green-900 rounded" type="password" placeholder="**********" 
                                onChange={(ev) => handleChange(ev)} onBlur={(ev) => handleBlur(ev)} name="password" value={datosLogin.password} />
                                {validationErrors.password && (
                                 <span className="text-red-500 silkScreen text-xs m-0 p-0">{validationErrors.password}</span>
                                 )} 
                            </div>
                            <div className="flex flex-wrap -mx-4 mb-6 items-center justify-between">
                                <div className="w-full lg:w-auto px-4 mb-4 lg:mb-0">
                                    <label htmlFor="">
                                        <input type="checkbox" />
                                        <span className="ml-1 font-extrabold">Recuérdame</span>
                                    </label>
                                </div>
                                <div className="w-full lg:w-auto px-4"><a className="inline-block font-extrabold hover:underline" href="#">¿Te olvidaste de tu contraseña?</a></div>
                            </div>
                            
                            <button className="inline-block w-full silkScreen py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-green-800 hover:bg-green-900 border-3 border-green-900 shadow rounded transition duration-200">Entrar en tu cuenta</button>
                          
                            <div class=" flex justify-around px-6 max-w-lg">
                            <button type="button" className="text-white w-2/4  bg-[hsl(0,78%,57%)] hover:bg-[#00000]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"><svg class="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z">
                                </path></svg>Login con Google<div></div></button>
                                <button class=" w-2/4 bg-white border border-gray-300 shadow-md font-medium rounded-lg text-sm px-6 py-2 text-center inline-flex items-center justify-between text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
       
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid">
                                    <g>
                                        <path
                                            d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187
                                             192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 
                                             147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                                            fill="#5865F2" fill-rule="nonzero">

                                        </path>
                                    </g>
                                </svg>
                                Login con discord
                            </button>    
                                
                            </div>

                        </form>
                        
                    </div>
                </div>
            </section>

            <section className="py-26 bg-white rounded-lg border-4 border-red-500" style={{ minWidth: '425px', maxWidth:'800' }}>
            <div className="px-4 mx-auto">
                    <div className="max-w-lg mx-auto py-8">
                        <div className="text-center mb-8">
                        <FontAwesomeIcon icon={faHandshake} className="text-5xl text-red-500 mb-2" />
                            <h2 className="text-lg md:text-lg font-extrabold mb-2">¡¡HAZTE SOCIO!!</h2>
                        </div>
                        <div className="text-center mb-6">
                        <ul className="list-none inline-block text-left mx-auto max-w-md">
                            <li className='font-sans'>Se agiliza el proceso de pago <FontAwesomeIcon color='#CFB53B' className='ml-1' icon={faCheck} /></li>
                            <li className='font-sans'>Accede a todos tus futuros pedidos <FontAwesomeIcon color='#CFB53B' className='ml-1' icon={faCheck} /></li>
                            <li className='font-sans'>Ofertas y descuentos especiales <FontAwesomeIcon color='#CFB53B' className='ml-1' icon={faCheck} /></li>
                            <li className='font-sans'>Actualiza tus detalles fácilmente <FontAwesomeIcon color='#CFB53B' className='ml-1' icon={faCheck} /></li>
                        </ul>
                        </div>

                   </div>
               <div className="text-center">
                <Link to="/Cliente/Registro">
               <button className="inline-block silkScreen py-3 px-8 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-red-700 hover:bg-red-900 border-3 border-red-900 shadow rounded transition duration-200">Registrarse</button>
                </Link>
               </div>
             </div>
            
            </section>
           
            
        </div>
    )


}

export default Login;


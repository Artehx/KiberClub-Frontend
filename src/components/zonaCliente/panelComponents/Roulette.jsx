import { useState, useEffect, useRef } from 'react';
//import {Wheel} from 'wheel-of-react'
import React  from 'react'
//import SpiWheel from 'react-spin-to-wheel/index'
import { Wheel } from 'react-custom-roulette';
import { useClienteLoggedContext } from '../../../context-providers/ClienteLoggedContext';
import clienteRESTService from '../../../services/restCliente';
import MiniDescuento from './MiniDescuento';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import {toast} from 'react-toastify';
import utilsFunctions from '../../../assets/js/utilsFunctions';
import Confetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'
import { Tooltip, Typography } from "@material-tailwind/react";

function Roulette() {

    const {clienteLogged, dispatch: clienteDispatch} = useClienteLoggedContext();
    let [descuentos, setDescuentos] = useState([]);
    const [spin, setSpin] = useState(false);
    const [indexDescuento, setIndexDescuento] = useState(0);

    let [getFicha, setGetFicha] = useState('');

    const [confetiActivado, setConfetiActivado] = useState(false);
    const { width, height } = useWindowSize()

    useEffect(() => {
      
      async function petDescuentos(idCliente) {
  
        let listaDescuentos = await clienteRESTService.recuperarDescuentos(idCliente);
        console.log(`DESCUENTOS RECUPERADOS: ${listaDescuentos}`);
        setDescuentos(listaDescuentos);
      }
      console.log('Datos del usuario:', clienteLogged); 
      petDescuentos(clienteLogged.datoscliente._id);
     
        
    }, [clienteLogged]);

    //console.log('Descuentos del cliente -> ', clienteLogged.datoscliente)

    const opcionesRuleta = descuentos.map(descuento => {
      const option = `${descuento.porcentaje}`;
      return {
        option: option,
        style: {
          textColor: 'black',
          fontSize: 28,
          margin: 10,
          fontFamily: 'slkScreen',
          whiteSpace: 'pre-line', 
        },
      };
    });
    
    console.log(`Opciones de la ruleta ${opcionesRuleta}`);
    
    /* datos estaticos (para probar la ruleta al principio...)
    const data = [
        { option: 'Descuento 1', style: {textColor: 'black', fontSize: 18} },
        { option: 'Descuento 2', style: {textColor: 'black', fontSize: 18} },
        { option: 'Descuento 3', style: {textColor: 'black', fontSize: 18} },
        { option: 'Descuento 4', style: {textColor: 'black', fontSize: 18} },
        { option: 'Descuento 5', style: {textColor: 'black', fontSize: 18} },
        { option: 'Descuento 6', style: {textColor: 'black', fontSize: 18} },
    ];*/
    
    const handleSpinClick = async () => {
      if (clienteLogged.datoscliente.fichasRuleta.length === 0 ) {
        toast.warn('¡No tienes fichas!');

      
      } else if (clienteLogged.datoscliente.descuentosGanados.length >= 3){

        toast.warn('¡Has llegado al limite de descuentos!');

      } else {
        const newIndexNumber= Math.floor(Math.random() * descuentos.length);
        setIndexDescuento(newIndexNumber);
        setSpin(true);
        setConfetiActivado(false);

        const primeraFicha = clienteLogged.datoscliente.fichasRuleta[0];

        clienteDispatch({ type: 'ELIMINAR_FICHA' });
        clienteDispatch({ type: 'FICHA_USADA', payload: primeraFicha });

        //Hacemos una pausa ya que el elemento de la ruleta
        // que toca se setea mucho antes de que se pare la ruleta
        // asi que fuerzo una pausa para cuando para el spin
        await utilsFunctions.pause(6750);
        

        await nuevoDescuento(descuentos[newIndexNumber], primeraFicha);

      }
    };

      const handleNuevaFicha = (ev) => {
        const { value } = ev.target;
        setGetFicha(value); 
      }

      async function submitGetFicha(ev){
        ev.preventDefault();
        console.log('Entra en submitGetFicha...')

        let response = await clienteRESTService.recuperarFicha(getFicha, clienteLogged.datoscliente._id);

        switch(response.codigo){

          case 0: //Nueva ficha..Añadir a los datos del cliente a su array de fichas
          
          clienteDispatch({
            type: 'GUARDAR_FICHA',
            payload: response.ficha,
          });

          toast.success('¡Tienes una nueva ficha!')

          break;

          case 1: //Codigo no existente

          toast.error(response.mensaje);

          break;

          case 2: //Codigo ya canjeado

          toast.warning(response.mensaje);

          break;
          

        }

      }

      async function nuevoDescuento(descuento, fichaUsada){
      
        console.log('descuento a mandar -> ', descuento)
        let response = await clienteRESTService.guardarDescuento(descuento, fichaUsada, clienteLogged.datoscliente._id);

        if(response.codigo === 0){

          clienteDispatch({
            type: 'GUARDAR_DESCUENTO',
            payload: response.descuento,
          });

          setDescuentos(prevDescuentos => {
            const nuevosDescuentos = prevDescuentos.filter(desc => desc._id !== response.descuento._id);
            console.log('Nuevos descuentos -> ', nuevosDescuentos);
            return nuevosDescuentos;
        });
          
          toast.success('¡NUEVO DESCUENTO 😎!')
     
          setConfetiActivado(true);


        } else {

          console.log('Algo salio mal guardando el descuento...')
          toast.error('Error en el servidor..Intentelo más tarde')

        }

      }

      

    return (
    
    <>
    {confetiActivado && <Confetti  width={width} height={height} recycle={false} />}
    <div className="flex flex-col items-center justify-center pt-28 mt-2 background-gray border-b-4 border-gray-700">
    <h1 className="text-4xl silkScreen"><span className='text-yellow-600'>BIENVENIDO</span> A TU <span className='text-green-700'> RULETA </span>  <span className='text-red-500'>KIBER</span></h1>
     <span className='text-base silkScreen mb-4'>Busca aqui tus descuentos 😉</span>
    </div>

    <div className="white-pattern">
    <div className='flex p-6 gap-3'>

    {descuentos.length > 0 && ( 
      <>
      <div className="flex flex-col gap-2 items-center w-1/3 shrink-0">
        <Wheel 
          mustStartSpinning={spin}
          prizeNumber={indexDescuento}
          data={opcionesRuleta}
          onStopSpinning={() => {
            setSpin(false);
          }}
          backgroundColors={['#CD5C5C', '#6B8342', '#FFDB58']}
          radiusLineWidth={3.5}
          perpendicularText={true}
          spinDuration={0.6}
          
        />
         <div className="flex items-center justify-center">
        <button 
          className='silkScreen py-3 px-8 text-lg leading-4 text-white font-extrabold bg-red-700 hover:bg-red-900' 
          onClick={handleSpinClick}
        >
          SPIN
        </button>
      </div>
      </div>
      
     
      </>
      )}
    <div className='flex w-full'>
      <div className='flex-col w-full'>
        {/* Primer fila */}
        <div className='flex flex-col border-4 bg-indian-red border-gray-700 w-full h-48 p-6 '>
          <div className='flex h-full gap-2'>
            {[...Array(3)].map((_, index) => (
              <div className="w-1/3" key={index}>
                {clienteLogged.datoscliente.descuentosGanados[index] ? (
                  <MiniDescuento descuento={clienteLogged.datoscliente.descuentosGanados[index]} />
                ) : (
                  <div className="flex items-center silkScreen text-white font-semibold justify-center h-full bg-indian-red">
                    Slot vacio
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Segunda fila */}
        <div className='flex justify-end gap-2 pt-4'>
        <div className='flex flex-col border-4 w-1/3 bg-gray-200 border-gray-700 h-48 p-6 mt-4'>
        <div className='text-center justify-start align-middle'>
          <span className='text-xl silkScreen'>Tus fichas</span>
        </div>
        <div className='flex justify-center items-center h-full gap-1'>
          <span className='text-8xl silkScreen text-red-500'>
          {clienteLogged && clienteLogged.datoscliente.fichasRuleta.length}         
           </span>
          <span className='rounded-full border-yellow-700 border-2'>
            <FontAwesomeIcon className='text-2xl text-yellow-700' icon={farStar} />
            </span>
        </div>
        
        </div>
        <div className='flex-col border-4 bg-gray-200 border-gray-700 w-2/4 h-48 p-6 mt-4 '>
          <div className='flex text-center justify-center gap-2 pb-4'>
           <span className='text-xl silkScreen pb-2'>
            Consigue tus fichas 
            
           </span>
           <Tooltip className="bg-white p-0 m-0 border-0 shadow-xl shadow-black/10"
              content={
                <div className="w-80 border-2 border-gray-700 bg-gray-200 px-4 py-3 ">
                  <Typography variant='h4' color="red" className="silkScreen text-center border-0">
                    Info point
                  </Typography>
                  <Typography
                    variant="h5"
                    color="black"
                    
                    className="font-bold border-0 silkScreen text-xs text-center "
                  >
                    Consigue tus fichas comprando entradas y estando al
                    tanto de todas nuestras noticias 👀
                  </Typography>
                </div>
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5 cursor-pointer text-blue-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
           </Tooltip>
           
          </div>
          <div className='flex justify-center gap-2'>
          <form onSubmit={submitGetFicha} className='flex flex-col gap-4'>
          <input
            type="text"
            name="clave"
            onChange={(ev) => handleNuevaFicha(ev)}
            className="border border-gray-400 p-2 silkScreen focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            className="bg-indian-red text-white silkScreen py-2 rounded-md hover:bg-red-500 transition duration-300">
            Tu le sabes!
          </button>
          </form>
          </div>

        </div>
       
        </div>
     
      </div>
    </div>
    


    </div>

 

   
  </div>
   


    </>

    )

}

export default Roulette;


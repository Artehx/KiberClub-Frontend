import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons'; 
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Text } from '@react-pdf/renderer';

function TicketConcert({ticket, concierto}) {

  const [alignType, setAlignType] = useState('');

  let align = ''; 
  const randomNumber = useMemo(() => {
    const number = Math.floor(Math.random() * 100000000);
    return number.toString().padStart(8, '0');
  }, [])

  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const fechaConcierto = concierto ? new Date(concierto.fecha) : null;  const dia = fechaConcierto.getDate();
  const mes = meses[fechaConcierto.getMonth()];


   useEffect(() => {

    if(concierto.alignType === ''){
    console.log('entra siendo null...')
    
    setAlignType('fill');
    } else {
      console.log('entra aqui...')
      console.log('Tipo centrado: ', concierto.alignType);
      align = concierto.alignType;
     setAlignType(concierto.alignType);
    }

   }, [concierto])
   

    return (
     <>
     <div className="flex w-full staatliches h-full shadow-lg border-2 border-gray-300 my-4">
      {/*FOTO CONCIERTO*/} 
      <div className="w-80 h-full"> 
       <div>  {/*Por defecto estará en el centro pero voy a crear una propiedad para centrar la imagen
              según quede mejor en la entrada, por ejemplo la de David Guetta se ve mal en el centro
              asi que en ese objeto Concierto incluire como propm object-left*/}
       {
        alignType != null &&
        <img className={`object-cover object-${alignType} w-fit h-60`}  src={concierto.artistaBASE64}/>
       }       
       </div> {/*src="/public/images/manoloGarcia.jpg"*/}
      
      </div>
      
      {/*DATOS DEL TICKET*/}
      <div className="w-2/4 pt-4 h-full"> 
      
      <div className="flex justify-center">
       <hr className="border-1 border-gray-400 w-10/12"/>
       </div>

       <div className="flex justify-center">
        <div className="flex justify-between items-center gap-12 ">
          <span className="text-base font-semibold -tracking-tighter">{concierto.dia}</span>
          <span className="text-xl text-green-600 font-semibold">{dia} DE {mes.toUpperCase()}</span>
          <span className="text-base font-semibold -tracking-tighter ">2022</span>
        </div>
       </div>

       <div className="flex justify-center items-center">
       <hr className="border-1 border-gray-400 w-10/12"/>
       </div>

       <div className="flex flex-col justify-center items-center mb-1">
       <span className={`nanumPen ${concierto.titulo.length > 20 ? 'text-4xl' : 'text-5xl'}`}>
        {concierto.titulo}
       </span>
        <span className="nanumPen text-3xl text-green-600">
        
        {concierto.artistaPrincipal.nombre}
        
        {concierto.artistasSecundarios?.length > 0 && (
          <>  {' + '}
            {concierto.artistasSecundarios?.map((artista, index) => (
              <Fragment key={index}>
                {index > 0 && ' + '} 
                <span>{artista.nombre}</span>
              </Fragment>
            ))}
          </>
        )}
      </span>     
        <div className="flex flex-col mt-2 font-bold -tracking-tighter">
        <span className="text-green-600">De {concierto.hora} <span className="text-gray-500 mx-1">A</span><span>{concierto.horaFinal}</span></span>
        <span className="text-green-600">PUERTAS <span className="text-gray-500 mx-1">@</span><span>{concierto.puertas}</span></span>
        </div>
       </div>

       <div className="flex justify-center mt-2">
       <hr className="border-1 border-gray-400 w-10/12"/>
       </div>

       <div className="flex justify-center items-center mt-1">
        <div className="flex justify-between items-center gap-6">
          <span className="text-base -tracking-tighter">KIBER CLUB INC.</span>
          <FontAwesomeIcon color='gold' icon={faBolt} size='lg'/>
          <span className="text-base -tracking-tighter">{concierto.ubicacion}</span>
        </div>
       </div>

      </div>
      
      {/*QR DEL TICKET (OCULTO) + DATOS*/}
      <div className="flex">
       <div className='w-10 h-full border-dotted border-l-2 border-black '>
        
       <div className="flex flex-col h-full justify-center items-start -ml-4 text-darkgray opacity-40 gap-y-16 leading-normal tracking-wide">
          <span className="text-xs transform -rotate-90 w-full mx-0 my-0">KIBER CLUB</span>
          <span className="text-xs transform -rotate-90 w-full mx-0 my-0">KIBER CLUB</span>
          <span className="text-xs transform -rotate-90 w-full mx-0 my-0">KIBER CLUB</span>
       </div>
     
       </div>

       <div className='flex flex-col justify-start w-36 mt-4 gap-y-2 mr-0.5'>
        <span className='nanumPen text-xl font-bold text-green-700'>{ticket.entrada.tipo}</span>
        <div className='flex gap-4 items-center'>
        <span className='text-2xl text-red-500 text-start'>{ticket.entrada.precio}€</span>
        <span className='text-1xl text-red-500 text-right'>*IVA incluido</span>
        </div>
         
         <div className='flex flex-col justify-center items-center mr-4'>
          <img className='w-24 blur-custom' src='/images/QRCode.png'/>
          <span className='text-sm text-center'>#{randomNumber}</span>
         </div>
       </div>
      </div>
     </div>
     
     </>

    )
};

export default TicketConcert;


function MiniDescuento({descuento}) {

    function formatearFecha(fecha){

     const date = new Date(fecha);
     let dia = date.getDate()-1;
     let mes = date.getMonth()+1;
     let anio = date.getFullYear().toString().slice(-2);
     return `${dia}/${mes}/${anio}`;
    }

    const fecha = formatearFecha(descuento.expiracion);

    return (

        <>
        <div className='flex items-center justify-between w-fit gap-6 bg-gray-50 rounded-lg h-full'>
       <div className='bg-indian-red w-10 h-10 -m-5 shrink-0 rounded-full '></div> {/*Bola*/}
         <div className='flex items-center divide-x-4 divide-dotted  divide-black gap-4'>
          <div className='w-20'>
           <img src='https://www.svgrepo.com/show/233208/bolt-thunder.svg'/>
           </div>
          <div className='flex flex-col px-3'>
            <span className='font-bold text-lg silkScreen'>Kiber Club</span>
            <span className='text-3xl staatliches'>{descuento.porcentaje}
            <span className='text-sm'> {descuento.titulo}</span></span>
            <span className='font-light text-base'>Valido hasta {fecha}</span>
          </div>
          </div>
        
       <div className='bg-indian-red w-10 h-10 -m-5 shrink-0 rounded-full '></div> {/*Bola*/}
      </div>
        
        </>
    )


}

export default MiniDescuento;
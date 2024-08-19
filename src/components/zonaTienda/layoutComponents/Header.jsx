import {Link} from 'react-router-dom';
import { faBars, faSearch  } from '@fortawesome/free-solid-svg-icons';
import { faComments as farComments } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faDice, faCalendarDays, faSignOut, faTicket } from "@fortawesome/free-solid-svg-icons";
import { animateWord } from '../../../assets/utils/textAnimation';
import { useClienteLoggedContext } from '../../../context-providers/ClienteLoggedContext';
import {Menu, MenuHandler, MenuList, MenuItem, Avatar, Typography } from "@material-tailwind/react";

function Header() {
   
    let {clienteLogged, dispatch} = useClienteLoggedContext();

    
    
    if(!clienteLogged){
       // console.log(`FALLO EN LA SESION: ${clienteLogged}`);
    } else {
        
     //console.log('CLIENTE LOGEADO PERFECTAMENTE :', clienteLogged.datoscliente)

    }

    const handleLogout = () => {
      dispatch({ type: 'CLIENTE_LOGOUT' });
      
    }

    return (
     <>
     <header className="bg-white shadow-md orbitron w-full flex justify-between px-1 items-center fixed">
         <div className="flex justify-start items-center h-24">
                <div className="flex items-center xl:hidden">
                    <button id="mobile-menu-button" className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none ">
                        <span className="sr-only">Abrir el menu</span>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
                <div className="flex-shrink-0 flex items-center ml-3">
                   <Link to="/Eventos/Musica">
                    <img src="/images/logo.png" className="h-32 md:h-52 w-auto" alt="Logo" />
                    </Link>
                </div>
                <div className="hidden xl:flex md:space-x-8 ">
                <a href="#" className="border-gray-900 text-gray-900 inline-flex items-center px-1 pt-1 text-lg font-medium">
                        {animateWord('Música')}
                    </a>                   
                    <a href="#" className="border-gray-900 text-gray-900 inline-flex items-center px-1 pt-1 text-lg font-medium"> Festivales </a>
                    <a href="#" className="border-gray-900 text-gray-900 inline-flex items-center px-1 pt-1 text-lg font-medium"> Teatro </a>
                    <a href="#" className="border-gray-900 text-gray-900 inline-flex items-center px-1 pt-1 text-lg font-medium"> Nosotros </a>
                    <a href="#" className="border-gray-900 text-gray-900 inline-flex items-center px-1 pt-1 text-lg font-medium"> Experiencias </a>
                </div>
           
        </div>
        

      <div className="flex items-center gap-2 ">
        <div className="hidden xl:flex xl:items-center xs:hidden gap-2">
            <div className='flex items-center border rounded-full px-2'>
            <i className="fas fa-search">
                <FontAwesomeIcon icon={faSearch} />
            </i>
            <input type="text" className="w-full h-10 bg-transparent px-2  shadow-sm focus:outline-none" placeholder="Buscar artistas, eventos..." />
            </div>
           
            <i className="far fa-comments fa-lg cursor-pointer">

                
               {
                  !clienteLogged?
                  ( <Link to="Cliente/Login">
                  <FontAwesomeIcon icon={farComments} color='green' />
                  </Link>) : (
                  <Link to="Panel/MisChats">
                    <FontAwesomeIcon icon={farComments} color='green' />
                  </Link>
                  )
               }

             
            </i>
        </div>

          {
           !clienteLogged?
           (<Link to="/Cliente/Login" className="bg-green-800 hover:bg-green-500 text-white py-2 px-4 mr-2 text-sm lg:text-lg font-medium shadow-lg">
           Login
           </Link>)
           :
           (
            <>
            <Menu>
             <MenuHandler>
             <Avatar variant='circular'
             className='cursor-pointer w-14 h-14 mr-4 rounded-full'
             src={clienteLogged.datoscliente.cuenta.imagenAvatarBASE64}>
             </Avatar>
             </MenuHandler>
             <MenuList className='z-30 absolute left-0 '>
             <Link className='outline-none' to={"/Panel/MiPerfil"}>
             <MenuItem className='flex items-center gap-2 py-2 px-2 menu-item hover:bg-gray-200 '>
             <i className="far fa-user fa-sm cursor-pointer mr-1">
                <FontAwesomeIcon icon={faUser} color='red' />
             </i>
             <Typography variant='small' className='font-xs silkScreen'>
                Mi Perfil
             </Typography>
             </MenuItem>
             </Link>
             <Link className='outline-none' to={"/Panel/Calendario"}>
             <MenuItem className='flex items-center gap-2 py-2 px-2 menu-item hover:bg-gray-200 '>
             <i className="far fa-calendarDays fa-sm cursor-pointer mr-1">
                <FontAwesomeIcon icon={faCalendarDays} color='#CFB53B' />
             </i>
             <Typography variant='small' className='font-xs silkScreen'>
                Calendario
             </Typography>
             
             </MenuItem>
             </Link>

             <Link className='outline-none' to={"/Panel/Ruleta"}>
             <MenuItem className='flex items-center gap-2 py-2 px-2 menu-item hover:bg-gray-200 '>
             <i className="far fa-heart fa-sm cursor-pointer mr-1">
                <FontAwesomeIcon icon={faDice}  color='green' />
             </i>
             <Typography variant='small' className='font-xs silkScreen'>
                Ruleta
             </Typography>
             
             </MenuItem>
             </Link>
             {/*PONER QUE SI EL CLIENTE NO TIENE ORDENES LE SALTE UN AVISO 'No hay compras :('*/}
             {/*ASI QUE..TENGO QUE CREAR UN MANEJADOR*/}
             <Link className='outline-none' to={"/Panel/MisTickets"}>
             <MenuItem className='flex items-center gap-2 py-2 px-2 menu-item hover:bg-gray-200 '>
             <i className="far fa-user fa-sm cursor-pointer mr-1">
                <FontAwesomeIcon icon={faTicket} color='#B197FC' />
             </i>
             <Typography variant='small' className='font-xs silkScreen'>
                Mis Tickets
             </Typography>
             </MenuItem>
             </Link>
             <hr className="my-2 mt-1 border-blue-gray-50" />
             <MenuItem className="flex items-center gap-2 menu-item">
             <i className="far fa-heart fa-sm cursor-pointer">
                <FontAwesomeIcon icon={faSignOut} color='black' />
             </i>
             <Typography variant="small" className="font-xs silkScreen"
             onClick={handleLogout}>
              Desconectar
             </Typography>
             </MenuItem>
            </MenuList>
            </Menu>


        
            </> 
            )

          }
        
     </div>
     </header>

        </>
    )


}

export default Header;
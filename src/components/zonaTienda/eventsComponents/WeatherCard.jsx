import { faSun, faCloud, faCloudRain, faSnowflake, faBolt, faCloudMoon, faMoon, faQuestion, faCloudSun } from '@fortawesome/free-solid-svg-icons';
import { faSun as farSun } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Switch } from "@material-tailwind/react";

function WeatherCard({datosTiempo}) {

    const [cambiarHorario, setCambiarHorario] = useState(true);
   //datosTiempo.dia, datisTiempo.noche
   //console.log('datosTiempo:', datosTiempo);

   if (!datosTiempo) {
    return (
        <div className='bg-gray-200 h-full pt-8 flex flex-col justify-between items-center'>
            <h2>No se encontraron datos disponibles del tiempo...</h2>
        </div>
    );
    }

      function tiempoIcono(clima, esDia) {

        switch (clima) {
            case 'Despejado':
            return <FontAwesomeIcon icon={faMoon} color='#400080'/>;
            case 'Soleado':
                return <FontAwesomeIcon icon={farSun} color='orange' />;
            case 'Cielo cubierto':
                return <FontAwesomeIcon icon={faCloud} color='blue' />;
            case 'Parcialmente nublado':
                return esDia 
                ? <FontAwesomeIcon icon={faCloudSun} color='#ffbc0b'/> 
                : <FontAwesomeIcon icon={faCloudMoon} color='#400080'/>;
            case 'Lluvia  moderada a intervalos':
                return <FontAwesomeIcon icon={faCloudRain} color='blue' />;
            case 'Tormenta':
                return <FontAwesomeIcon icon={faBolt} color='green' />;
            case 'Nieve':
                return <FontAwesomeIcon icon={faSnowflake} />;
            default:
                return <FontAwesomeIcon icon={faQuestion} />;
        }
    }


    return (
       
    <>
        <div className='bg-gray-200 balsamiq-sans-regular h-full pt-8 flex flex-col justify-between items-center'>
     
         
         {/*Las 15:00 de la tarde*/}
        {cambiarHorario ? 
        <div className='flex flex-col gap-1'>
        <div className="flex items-center gap-16 mt-2 pb-4">
        {/* Primera columna */}
        <div className="flex justify-center items-center">
            {/* Icono del tiempo */}
            <span className="text-8xl ">{tiempoIcono(datosTiempo.dia.condition.text, true)}</span>
        </div>
        {/* Segunda columna */}
        <div className="flex flex-col gap-1">
            {/* Grados */}
            <span className='text-6xl font-semibold silkScreen'>{datosTiempo.dia.temp_c}°C</span>
            {/* Localización y condición */}
            <div className="flex flex-col gap-1">
                <span className="text-xs ">{datosTiempo.localizacion.name}, {datosTiempo.localizacion.region}</span>
                <span className="text-xs font-bold ">{datosTiempo.dia.condition.text} a las <span className='text-red-600'> 15:00 </span></span>
            </div>
        </div>
            
        </div>
            <div> {/*Otros datos*/}
            <div className="flex items-center gap-3 mb-2">
            <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Humedad: {datosTiempo.dia.humidity}%
                </li>
                <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Sensación: {datosTiempo.dia.feelslike_c}º
                </li>
                <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Posible lluvia: {datosTiempo.dia.will_it_rain}%
                </li>
            </div>
            <div className="flex items-center gap-3">
            <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Viento en Km: {datosTiempo.dia.wind_kph}
                </li>
                <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Nubosidad: {datosTiempo.dia.cloud}%
                </li>
                <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Lluvia en mm: {datosTiempo.dia.precip_mm}
                </li>
            </div>
            </div>
        
        </div>
            :
         /*Las 22:00 de la tarde*/
            <div className='flex flex-col gap-1'>
            <div className="flex items-center gap-12 mt-2 pb-4">
            {/* Primera columna */}
            <div className="flex justify-center items-center">
                {/* Icono del tiempo */}
                <span className="text-8xl">{tiempoIcono(datosTiempo.noche.condition.text, false)}</span>
            </div>
            {/* Segunda columna */}
            <div className="flex flex-col gap-1">
                {/* Grados */}
                <span className='text-6xl font-semibold silkScreen'>{datosTiempo.noche.temp_c}°C</span>
                {/* Localización y condición */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs ">{datosTiempo.localizacion.name}, {datosTiempo.localizacion.region}</span>
                    <span className="text-xs font-bold ">{datosTiempo.noche.condition.text} a las <span className='text-green-600'> 22:00 </span></span>
                </div>
            </div>
        </div>

        <div> {/*Otros datos*/}
            <div className="flex items-center gap-3 mb-2">
            <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Humedad: {datosTiempo.noche.humidity}%
                </li>
                <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Sensación: {datosTiempo.noche.feelslike_c}º
                </li>
                <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Posible lluvia: {datosTiempo.noche.will_it_rain}%
                </li>
            </div>
            <div className="flex items-center gap-3">
            <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Viento en Km: {datosTiempo.noche.wind_kph}
                </li>
                <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Nubosidad: {datosTiempo.noche.cloud}%
                </li>
                <li className="text-xs font-semibold flex items-center">
                <span className="rounded-full h-2 w-2 bg-gray-500 mr-2"></span>
                Lluvia en mm: {datosTiempo.noche.precip_mm}
                </li>
            </div>
            </div>


            </div>
        }
 
        <div className='inline-flex gap-1'>
        <span className='text-lg'>🌞</span>
        <label class="inline-flex items-center cursor-pointer">
        <input type="checkbox" onClick={() => setCambiarHorario(!cambiarHorario)} value="" class="sr-only peer"/>
        <div class="relative w-11 h-6 mb-2 bg-red-600 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
         peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 
         after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 
         peer-checked:bg-black"></div>
        </label>
        <span className='text-lg'>🌚</span>
        </div> 

        </div>
        

       
        </>
    )


}


export default WeatherCard;


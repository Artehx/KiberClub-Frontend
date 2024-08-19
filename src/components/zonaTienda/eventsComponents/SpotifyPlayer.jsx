import { useState, useEffect } from 'react';
import Spotify from 'react-spotify-embed';
import SpinnerTrack from '../../../assets/utils/spinnerTrack';

function SpotifyPlayer({ trackUris }) {
  const [mainTrack, setMainTrack] = useState('');
  const [loading, setLoading] = useState(true);
  //console.log(trackUris);
   
  
  useEffect(() => {
      if (mainTrack === '') {
          const randomTrack = () => {
              const randomIndex = Math.floor(Math.random() * trackUris.length);
              const randomTrackCode = trackUris[randomIndex].split(':').pop();
              setMainTrack(randomTrackCode);
              // Indicamos que la carga ha terminado
          };


          //Si aqui pongo 0 y setea en el state el track aleatorio pondra
          // uno de los genericos que son 2 los que vienen por defecto, asi que
          // el random track estara disponible cuando haya recibido los url del back
          if (trackUris.length > 2) {
              randomTrack();
              setLoading(false); 
          }
      }
  }, [trackUris, mainTrack]); // Se ejecutará cada vez que cambien las trackUris o mainTrack
  
  useEffect(() => {
      console.log('Main track actualizado:', mainTrack);
      console.log('TrackUris genericos?? ', trackUris)
  }, [mainTrack]); // Se ejecutará cada vez que cambie mainTrack

  return (
      <div className='flex justify-end pt-3.5 '>
          {mainTrack !== '' ? (
              <Spotify link={`https://open.spotify.com/track/${mainTrack}`} width={295} height={185} />
          ) : (
              loading && 
              <div className='mr-24 mt-5'>
              <SpinnerTrack sizeNumber={80} />
              </div>
          )}
          
      </div>
  );
}

export default SpotifyPlayer;
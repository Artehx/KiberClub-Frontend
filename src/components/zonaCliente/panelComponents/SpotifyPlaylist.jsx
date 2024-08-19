import React from 'react';
import Spotify from 'react-spotify-embed';

function SpotifyPlaylist() {

    //Como no voy a hacer ninguna peticion para recuperar ninguna playlist 
    // aprovecho el iframe que me proporciona Spotify para el panel (solo mostraré una playlist de momento...)
    return (
        <div className='pt-3'>
        <iframe src="https://open.spotify.com/embed/playlist/4ryKNW4v16YpgsLWEZOXIw?utm_source=generator" width="100%" height="180" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    )
}

export default SpotifyPlaylist;
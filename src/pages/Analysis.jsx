import React, { useEffect, useState } from 'react';

// Client ID e Client Secret letti dalle variabili d'ambiente
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// ID dell'artista preso dall'URL di Spotify
const ARTIST_ID = '0Y5tJX1MQlPlqiwlOH1tJY';

function Analysis() {
  const [accessToken, setAccessToken] = useState('');
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [error, setError] = useState(null);

  // Funzione per ottenere l'access token usando il Client Credentials Flow
  const getAccessToken = async () => {
    try {
      const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Codifica base64 di "client_id:client_secret"
          'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
        },
        body: 'grant_type=client_credentials'
      });

      const data = await result.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
      } else {
        setError('Errore nell’ottenimento del token');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Richiede il token al montaggio del componente
  useEffect(() => {
    getAccessToken();
  }, []);

  // Una volta ottenuto il token, recupera i dati dell'artista, gli album e le top tracks
  useEffect(() => {
    if (!accessToken) return;

    // Recupero dati artista
    fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error.message);
        } else {
          setArtist(data);
        }
      })
      .catch(err => setError(err.message));

    // Recupero album dell'artista
    fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single,compilation&market=IT`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error.message);
        } else {
          setAlbums(data.items);
        }
      })
      .catch(err => setError(err.message));

    // Recupero top tracks dell'artista
    fetch(`https://api.spotify.com/v1/artists/${ARTIST_ID}/top-tracks?market=IT`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error.message);
        } else {
          setTopTracks(data.tracks);
        }
      })
      .catch(err => setError(err.message));

  }, [accessToken]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dati Artista da Spotify</h1>
      {error && <p style={{ color: 'red' }}>Errore: {error}</p>}
      
      {artist ? (
        <div>
          <h2>{artist.name}</h2>
          {artist.images && artist.images.length > 0 && (
            <img src={artist.images[0].url} alt={artist.name} style={{ width: '300px' }} />
          )}
          <p><strong>ID:</strong> {artist.id}</p>
          <p><strong>Followers:</strong> {artist.followers.total}</p>
          <p><strong>Generi:</strong> {artist.genres.join(', ')}</p>
          <p><strong>Popolarità:</strong> {artist.popularity}</p>
          <p><strong>Tipo:</strong> {artist.type}</p>
          <p>
            <strong>Spotify URL:</strong>{' '}
            <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {artist.external_urls.spotify}
            </a>
          </p>
          <p><strong>Immagini:</strong></p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {artist.images.map((img, index) => (
              <img key={index} src={img.url} alt={`${artist.name} ${index}`} style={{ width: '150px' }} />
            ))}
          </div>

          <h3>Album</h3>
          {albums.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {albums.map(album => (
                <div key={album.id} style={{ width: '200px' }}>
                  {album.images && album.images[0] && (
                    <img src={album.images[0].url} alt={album.name} style={{ width: '100%' }} />
                  )}
                  <p><strong>{album.name}</strong></p>
                  <p>Data: {album.release_date}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Caricamento album...</p>
          )}

          <h3>Top Tracks</h3>
          {topTracks.length > 0 ? (
            <ol>
              {topTracks.map(track => (
                <li key={track.id} style={{ marginBottom: '10px' }}>
                  <p><strong>{track.name}</strong></p>
                  {track.preview_url ? (
                    <audio controls>
                      <source src={track.preview_url} type="audio/mpeg" />
                      Il tuo browser non supporta l'elemento audio.
                    </audio>
                  ) : (
                    <p>Nessun preview disponibile</p>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <p>Caricamento top tracks...</p>
          )}
        </div>
      ) : (
        !error && <p>Caricamento dati...</p>
      )}
    </div>
  );
}

export default Analysis;

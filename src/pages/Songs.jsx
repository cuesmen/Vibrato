// src/pages/Songs.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Songs = () => {
  // Stato per gestire la modalità attuale: 'create' per creare una canzone o 'view' per visualizzarle
  const [mode, setMode] = useState('view');
  // Stato per memorizzare l'elenco delle canzoni dalla tabella "songs"
  const [songs, setSongs] = useState([]);
  // Stato per il titolo della canzone nel form di creazione
  const [songName, setSongName] = useState('');
  // Stato per la descrizione della canzone
  const [description, setDescription] = useState('');
  // Stato per il file immagine selezionato
  const [songImage, setSongImage] = useState(null);
  // Stato per gestire errori
  const [error, setError] = useState(null);
  // Stato per il caricamento dei dati
  const [loading, setLoading] = useState(false);

  // Funzione per recuperare le canzoni dalla tabella "songs"
  const fetchSongs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setSongs(data);
    }
    setLoading(false);
  };

  // Effettua il fetch quando si visualizzano le canzoni
  useEffect(() => {
    if (mode === 'view') {
      fetchSongs();
    }
  }, [mode]);

  /**
   * Funzione per gestire la creazione di una nuova canzone.
   * Valida il file immagine (deve essere PNG o JPG), lo carica nello storage Supabase nel bucket "Prova"
   * sotto la cartella "copertine" rinominandolo con il titolo della canzone.
   * Se tutto va bene, inserisce un nuovo record nella tabella "songs" con i campi name, description e image.
   * Viene mostrato un alert in caso di errori, spiegando il motivo.
   */
  const handleCreateSong = async (e) => {
    e.preventDefault();
    setError(null);

    // Verifica che sia stato selezionato un file immagine
    if (!songImage) {
      alert('Devi selezionare un\'immagine (PNG o JPG).');
      return;
    }

    // Controlla il tipo di file: accetta solo image/png e image/jpeg
    if (songImage.type !== 'image/png' && songImage.type !== 'image/jpeg') {
      alert('Tipo di file non valido. Seleziona un\'immagine in formato PNG o JPG.');
      return;
    }

    // Estrae l'estensione dal file (png o jpg)
    const fileExtension = songImage.type === 'image/png' ? 'png' : 'jpg';
    // Costruisce il percorso per il file nello storage: "copertine/nome-canzone.estensione"
    const filePath = `copertine/${songName.trim().replace(/\s+/g, '_')}.${fileExtension}`;

    // Carica l'immagine nello storage Supabase nel bucket "Prova"
    const { error: uploadError } = await supabase
      .storage
      .from('Prova')
      .upload(filePath, songImage, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      alert(`Errore durante il caricamento dell'immagine: ${uploadError.message}`);
      return;
    }

    // Recupera l'URL pubblico dell'immagine
    let { publicURL } = supabase
      .storage
      .from('Prova')
      .getPublicUrl(filePath);

    // Se l'URL pubblico non è disponibile, prova a creare un URL firmato (valido per 1 ora)
    if (!publicURL) {
      const { data, error: signedUrlError } = await supabase
        .storage
        .from('Prova')
        .createSignedUrl(filePath, 3600);

      if (signedUrlError || !data?.signedUrl) {
        alert(
          `Errore nel recupero del link dell'immagine: URL non disponibile. Verifica le impostazioni del bucket "Prova".`
        );
        return;
      } else {
        publicURL = data.signedUrl;
      }
    }

    // Inserisce un nuovo record nella tabella "songs" con i campi name, description e image (link all'immagine)
    const { error: insertError } = await supabase
      .from('songs')
      .insert([{ name: songName, description, image: publicURL }]);

    if (insertError) {
      alert(`Errore durante l'inserimento della canzone: ${insertError.message}`);
      return;
    }

    // Reset dei campi del form dopo il successo
    setSongName('');
    setDescription('');
    setSongImage(null);
    // Passa alla modalità "view" per visualizzare la lista aggiornata
    setMode('view');
    fetchSongs();
  };

  return (
    <div>
      <h1>Hub Canzoni</h1>
      {/* Hub con pulsanti per selezionare modalità: crea o visualizza */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setMode('create')}>Crea Canzone</button>
        <button onClick={() => setMode('view')}>Visualizza Canzoni</button>
      </div>

      {error && <p style={{ color: 'red' }}>Errore: {error}</p>}

      {/* Modalità di creazione canzone */}
      {mode === 'create' && (
        <div>
          <h2>Crea una nuova canzone</h2>
          <form onSubmit={handleCreateSong}>
            <div style={{ marginBottom: '10px' }}>
              <label>Titolo:</label><br />
              <input
                type="text"
                placeholder="Titolo della canzone"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Descrizione:</label><br />
              <textarea
                placeholder="Descrizione della canzone"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Immagine (PNG o JPG):</label><br />
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setSongImage(e.target.files[0])}
                required
              />
            </div>
            <button type="submit">Carica Canzone</button>
          </form>
        </div>
      )}

      {/* Modalità di visualizzazione canzoni */}
      {mode === 'view' && (
        <div>
          <h2>Lista delle Canzoni</h2>
          {loading ? (
            <p>Caricamento...</p>
          ) : (
            <ul>
              {songs.map((song) => (
                <li key={song.id}>
                  <strong>{song.name}</strong> - {song.description} - {new Date(song.created_at).toLocaleString()}
                  {song.image && (
                    <div>
                      <img
                        src={song.image}
                        alt={`Copertina di ${song.name}`}
                        style={{ width: '200px', marginTop: '10px' }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Songs;

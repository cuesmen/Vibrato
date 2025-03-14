// src/pages/FileStorage.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const FileStorage = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Genera un percorso per il file, ad esempio all'interno di una cartella "uploads"
    const filePath = `uploads/${file.name}`;

    const { data, error } = await supabase
      .storage
      .from('Prova')
      .upload(filePath, file);

    if (error) {
      setUploadMessage(`Errore: ${error.message}`);
    } else {
      setUploadMessage('File caricato con successo!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>File Storage</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>Carica File</button>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
};

export default FileStorage;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Sidebar = () => {
  const navigate = useNavigate();

  const sidebarStyle = {
    width: '200px',
    background: '#f0f0f0',
    height: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const navItemStyle = {
    marginBottom: '15px'
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Errore durante il logout:', error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={sidebarStyle}>
      <div>
        <h2>Team Dashboard</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={navItemStyle}><Link to="/">Dashboard</Link></li>
            <li style={navItemStyle}><Link to="/songs">Canzoni</Link></li>
            <li style={navItemStyle}><Link to="/team">Team</Link></li>
            <li style={navItemStyle}><Link to="/filestorage">File Storage</Link></li>
            <li style={navItemStyle}><Link to="/analysis">Analisi</Link></li>
          </ul>
        </nav>
      </div>
      <div>
        <button onClick={handleLogout} style={{ width: '100%' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

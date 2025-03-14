import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SidebarButton from './SidebarButton';

import { MdSpaceDashboard } from "react-icons/md";
import { FaItunesNote } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { MdStorage } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Errore durante il logout:', error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`Sidebar_MainDiv ${open ? "open" : ""}`}>
      <div className='Sidebar_Img'>
        <img alt="logo" src="images/logo/grande/logo_white.png"></img>
      </div>
      <div className='Sidebar_BtnMain'>
        <SidebarButton Title="Dashboard" Icon={<MdSpaceDashboard/>} GoTo="/dashboard" onClose={onClose} />
        <SidebarButton Title="Canzoni" Icon={<FaItunesNote/>} GoTo="/songs" onClose={onClose} />
        <SidebarButton Title="Team" Icon={<AiOutlineTeam/>} GoTo="/team" onClose={onClose} />
        <SidebarButton Title="File Storage" Icon={<MdStorage/>} GoTo="/filestorage" onClose={onClose} />
        <SidebarButton Title="Analisi" Icon={<SiGoogleanalytics/>} GoTo="/analysis" onClose={onClose} />
      </div>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

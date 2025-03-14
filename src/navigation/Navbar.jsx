import React, { useState, useEffect } from "react";
import { IoMenu } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const location = useLocation();
  const pathName = location.pathname;
  const displayText = pathName === "/" ? "Home" : pathName.substring(1);
  
  // Stato per gestire la visibilità della sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Aggiungi/rimuovi la classe "no-scroll" su body e html
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("no-scroll");
      document.documentElement.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
      document.documentElement.classList.remove("no-scroll");
    }
  }, [sidebarOpen]);

  return (
    <>
      <div className="Navbar_MainDiv">
        <div className="Navbar_MenuBtn" onClick={toggleSidebar}>
          <IoMenu />
        </div>
        <div className="Navbar_MenuImg">
          <img alt="Menu_Img" src="images/logo/piccolo/logo_small_red.png" />
        </div>
        <div className="Navbar_MenuText">{displayText}</div>
      </div>
      {/* Overlay per bloccare l'interazione con il contenuto sottostante */}
      {sidebarOpen && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
      <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
    </>
  );
}

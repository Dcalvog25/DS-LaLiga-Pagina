import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.png";
import "../components/Navbar.css";

function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll <= 80) {
        setHidden(false);
        setMenuOpen(false);
      }
      if (currentScroll > lastScroll.current && currentScroll > 80) {
        setHidden(true);
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setHidden(false);
  };

  const handleSetMenuOpen = (state) => {
    setMenuOpen(state);
    if (state) setHidden(false);
  };

  return (
    <>
      <nav className={`navbar ${hidden && !menuOpen ? "hide" : ""}`}>
        <a className="logo-container" href="#inicio">
          <img src={logo} alt="Logo LaLiga" className="logo" />
          <h1 className="title">LaLiga</h1>
        </a>

        <div className="navbar-right">
          <div className={`links ${menuOpen ? "show" : ""}`}>
            <a href="#inicio" className="link" onClick={handleCloseMenu}>Inicio</a>
            <a href="#equipos" className="link" onClick={handleCloseMenu}>Equipos</a>
            <a href="#clasificacion" className="link" onClick={handleCloseMenu}>Tabla</a>
            <a href="#estadisticas" className="link" onClick={handleCloseMenu}>Estadísticas</a>
            <a href="#noticias" className="link" onClick={handleCloseMenu}>Noticias</a>
          </div>
          
          <div className={`navbar-actions ${menuOpen ? "show" : ""}`}>
            <select className="language-selector">
              <option value="es">🇪🇸 ES</option>
              <option value="en">🇬🇧 EN</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="pt">🇵🇹 PT</option>
            </select>
            
            <a href="#" className="mi-liga-btn">
              👤 MI LIGA
            </a>
          </div>
        </div>

        <button className="menu-btn" onClick={handleToggleMenu}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {hidden && !menuOpen && (
        <button
          className="floating-btn"
          onClick={() => handleSetMenuOpen(true)}
          aria-label="Mostrar menú"
        >
          <img src={logo} alt="Logo LaLiga" className="logo" />
        </button>
      )}
    </>
  );
}

export default Navbar;

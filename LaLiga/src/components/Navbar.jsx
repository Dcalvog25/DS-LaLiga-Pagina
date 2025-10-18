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

  const handleSetMenuOpen = (state) => {
    setMenuOpen(state);
    if (state) setHidden(false);
  };

  return (
    <>
      <nav className={`navbar ${hidden && !menuOpen ? "hide" : ""}`}>
        <a className="logo-container" href="/">
          <img src={logo} alt="Logo LaLiga" className="logo" />
          <h1 className="title">LaLiga</h1>
        </a>

        <div className={`links ${menuOpen ? "show" : ""}`}>
          <a href="/" className="link" onClick={handleCloseMenu}>Inicio</a>
          <a href="/clientes" className="link" onClick={handleCloseMenu}>Equipos</a>
          <a href="/proveedores" className="link" onClick={handleCloseMenu}>Tabla</a>
          <a href="/inventarios" className="link" onClick={handleCloseMenu}>Calendario</a>
          <a href="/ventas" className="link" onClick={handleCloseMenu}>Eventos</a>
          <a href="/estadisticas" className="link" onClick={handleCloseMenu}>Info</a>
        </div>
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

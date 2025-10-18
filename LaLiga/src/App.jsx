import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import logoBlanco from './assets/logo-blanco.png';
import './App.css';
import axios from 'axios';

function App() {
  const [equipos, setEquipos] = useState([]);
  const [clasificacion, setClasificacion] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Llamada a la API de football-data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = "36bcff15d965467e9f8dc83386930c92";

        // Equipos de LaLiga
        const equiposRes = await axios.get('/api-football/v4/competitions/PD/teams', {
          headers: { 'X-Auth-Token': token }
        });
        setEquipos(equiposRes.data.teams);

        // Tabla de posiciones
        const tablaRes = await axios.get('/api-football/v4/competitions/PD/standings', {
          headers: { 'X-Auth-Token': token }
        });

        const standings = tablaRes.data.standings[0]?.table || [];
        setClasificacion(standings);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de LaLiga:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page">
        {/* SECCIÓN PRINCIPAL */}
        <div className="seccion-principal" id="inicio">
          <div className="columna-izq">
            <img src={logoBlanco} alt="LaLiga Logo" className="logo-principal" />
          </div>

          <div className="columna-der">
            <h1 className="titulo-bienvenida">Bienvenido a La Liga</h1>
            <div className="botones-navegacion">
              <button onClick={() => scrollToSection('equipos')} className="btn-seccion">Ver Equipos</button>
              <button onClick={() => scrollToSection('clasificacion')} className="btn-seccion">Clasificación</button>
              <button onClick={() => scrollToSection('noticias')} className="btn-seccion">Noticias</button>
            </div>
          </div>
        </div>

        {/* SECCIÓN EQUIPOS */}
        <div className="seccion" id="equipos">
          <h2>Equipos</h2>
          <p>Descubre a los equipos que compiten en la temporada 2024-2025 de La Liga.</p>

          {loading ? (
            <p>Cargando equipos...</p>
          ) : (
            <div className="cards-container">
              {equipos.map((team) => (
                <div key={team.id} className="card-equipo">
                  <img src={team.crest} alt={team.name} className="escudo-equipo" />
                  <h3>{team.name}</h3>
                  <p>{team.venue}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECCIÓN CLASIFICACIÓN */}
        <div className="seccion" id="clasificacion">
          <h2>Clasificación Actual</h2>
          {loading ? (
            <p>Cargando tabla...</p>
          ) : (
            <table className="tabla-clasificacion">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Equipo</th>
                  <th>PTS</th>
                  <th>G</th>
                  <th>E</th>
                  <th>P</th>
                </tr>
              </thead>
              <tbody>
                {clasificacion.map((row) => (
                  <tr key={row.team.id}>
                    <td>{row.position}</td>
                    <td className="equipo-nombre">
                      <img src={row.team.crest} alt={row.team.name} className="mini-escudo" />
                      {row.team.name}
                    </td>
                    <td>{row.points}</td>
                    <td>{row.won}</td>
                    <td>{row.draw}</td>
                    <td>{row.lost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SECCIÓN NOTICIAS */}
        <div className="seccion" id="noticias">
          <h2>Últimas Noticias</h2>
          <div className="noticias-container">
            <div className="noticia">
              <h3>⚡ El Clásico se jugará el próximo domingo</h3>
              <p>El esperado duelo entre Real Madrid y Barcelona tendrá lugar el 20 de octubre en el Santiago Bernabéu.</p>
            </div>
            <div className="noticia">
              <h3>🔥 Griezmann alcanza los 150 goles con el Atlético</h3>
              <p>El delantero francés sigue haciendo historia en el club rojiblanco.</p>
            </div>
            <div className="noticia">
              <h3>🧤 Ter Stegen renueva con el Barcelona hasta 2028</h3>
              <p>El guardameta alemán continuará defendiendo la portería azulgrana por cuatro temporadas más.</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          <p>&copy; 2024 La Liga. Todos los derechos reservados.</p>
        </div>
      </div>
    </>
  );
}

export default App;

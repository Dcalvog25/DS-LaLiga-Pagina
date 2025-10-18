import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import logoBlanco from './assets/logo-blanco.png';
import './App.css';
import axios from 'axios';

function App() {
  const [equipos, setEquipos] = useState([]);
  const [clasificacion, setClasificacion] = useState([]);
  const [goleadores, setGoleadores] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);


  // referencia al carrusel
  const carouselRef = useRef(null);

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
        setEquipos(equiposRes.data.teams || []);

        // Tabla de posiciones
        const tablaRes = await axios.get('/api-football/v4/competitions/PD/standings', {
          headers: { 'X-Auth-Token': token }
        });

        const standings = tablaRes.data.standings?.[0]?.table || [];
        setClasificacion(standings);

        // Goleadores de LaLiga
        const goalScorersRes = await axios.get('/api-football/v4/competitions/PD/scorers', {
          headers: { 'X-Auth-Token': token }
        });
        setGoleadores(goalScorersRes.data.scorers?.slice(0, 5) || []);

        // Próximos partidos
        const matchesRes = await axios.get('/api-football/v4/competitions/PD/matches?status=SCHEDULED', {
          headers: { 'X-Auth-Token': token }
        });
        setPartidos(matchesRes.data.matches?.slice(0, 6) || []);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos de LaLiga:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para botones (izq / der)
  const scrollCarrusel = (direccion) => {
    const carrusel = carouselRef.current;
    if (!carrusel) return;

    const desplazamiento = Math.round(carrusel.clientWidth * 0.7); // desplaza ~70% del viewport del carrusel
    const nuevoScroll = carrusel.scrollLeft + (direccion === 'left' ? -desplazamiento : desplazamiento);

    carrusel.scrollTo({
      left: nuevoScroll,
      behavior: 'smooth',
    });
  };

  // Auto-scroll suave usando requestAnimationFrame
  useEffect(() => {
    const carrusel = carouselRef.current;
    if (!carrusel) return;

    let rafId = null;
    const velocidad = 0.25;
    let paused = false;

    const step = () => {
      if (!autoScroll || paused) {
        rafId = requestAnimationFrame(step);
        return;
      }

      carrusel.scrollLeft += velocidad;

      if (carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 1) {
        setTimeout(() => {
          carrusel.scrollTo({ left: 0, behavior: 'smooth' });
        }, 400);
      }

      rafId = requestAnimationFrame(step);
    };

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };

    carrusel.addEventListener('mouseenter', onEnter);
    carrusel.addEventListener('mouseleave', onLeave);

    rafId = requestAnimationFrame(step);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      carrusel.removeEventListener('mouseenter', onEnter);
      carrusel.removeEventListener('mouseleave', onLeave);
    };
  }, [autoScroll, carouselRef]);

  return (
    <>
      <Navbar />

      <div className="page">
        {/* SECCIÓN PRINCIPAL */}
        <div className="seccion-principal" id="inicio">
          <div className="columna-izq">
            <img src={logoBlanco} alt="LaLiga Logo" className="logo-principal" />
            
            <div className="stats-hero">
              <div className="stat-item">
                <span className="stat-number">20</span>
                <span className="stat-label">Equipos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">38</span>
                <span className="stat-label">Jornadas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">380</span>
                <span className="stat-label">Partidos</span>
              </div>
            </div>
          </div>

          <div className="columna-der">
            <h1 className="titulo-bienvenida">Bienvenido a La Liga</h1>
            <p className="subtitle-hero">
              La liga más emocionante del mundo te espera. Descubre equipos, estadísticas, 
              clasificaciones y las últimas noticias del fútbol español.
            </p>
            
            <div className="botones-navegacion">
              <button onClick={() => scrollToSection('equipos')} className="btn-seccion">
                🏟️ Ver Equipos
              </button>
              <button onClick={() => scrollToSection('clasificacion')} className="btn-seccion">
                🏆 Clasificación
              </button>
              <button onClick={() => scrollToSection('noticias')} className="btn-seccion">
                📰 Noticias
              </button>
              <button onClick={() => scrollToSection('estadisticas')} className="btn-seccion btn-primary">
                📊 Estadísticas
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN EQUIPOS */}
        <div className="seccion seccion-equipos" id="equipos">
          <h2>Equipos de LaLiga EA Sports</h2>
          <p>
            Conoce a los 20 clubes que luchan por la gloria en la temporada 2024-2025. 
            Cada equipo con su historia, tradición y pasión únicas.
          </p>

          {loading ? (
            <div style={{ padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
              ⚽ Cargando equipos de LaLiga...
            </div>
          ) : (
            <div className="carousel-container">
              <button
                className="carousel-btn left"
                onClick={() => {
                  setAutoScroll(false);
                  scrollCarrusel('left');
                  setTimeout(() => setAutoScroll(true), 1500);
                }}
                aria-label="Equipos anteriores"
              >
                ❮
              </button>

              <div
                className="cards-container"
                ref={carouselRef}
              >
                {equipos.map((team, index) => (
                  <div key={team.id} className="card-equipo">
                    {team.crest && (
                      <img 
                        src={team.crest} 
                        alt={`Escudo de ${team.name}`} 
                        className="escudo-equipo"
                        loading="lazy" 
                      />
                    )}
                    <h3>{team.name}</h3>
                    <p>🏟️ {team.venue || 'Estadio'}</p>
                    <div className="team-stats">
                      <div className="team-stat">
                        <span className="team-stat-value">{team.founded || '---'}</span>
                        <span className="team-stat-label">Fundado</span>
                      </div>
                      <div className="team-stat">
                        <span className="team-stat-value">{index + 1}</span>
                        <span className="team-stat-label">Posición</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-btn right"
                onClick={() => {
                  setAutoScroll(false);
                  scrollCarrusel('right');
                  setTimeout(() => setAutoScroll(true), 1500);
                }}
                aria-label="Siguientes equipos"
              >
                ❯
              </button>
            </div>
          )}

          <div className="carousel-indicators">
            {[...Array(Math.ceil(equipos.length / 4))].map((_, index) => (
              <div 
                key={index} 
                className={`indicator ${index === 0 ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* SECCIÓN CLASIFICACIÓN */}
        <div className="seccion seccion-clasificacion" id="clasificacion">
          <h2>Tabla de Clasificación</h2>
          <p>
            Sigue la lucha por el título, las plazas europeas y la permanencia. 
            Actualizada con los resultados más recientes.
          </p>

          {loading ? (
            <div style={{ padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
              📊 Cargando clasificación actual...
            </div>
          ) : (
            <>
              <div className="tabla-container">
                <table className="tabla-clasificacion">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Equipo</th>
                      <th>Pts</th>
                      <th>PJ</th>
                      <th>G</th>
                      <th>E</th>
                      <th>P</th>
                      <th>GF</th>
                      <th>GC</th>
                      <th>DG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clasificacion.map((row) => (
                      <tr key={row.team.id}>
                        <td>{row.position}</td>
                        <td className="equipo-nombre">
                          {row.team.crest && (
                            <img 
                              src={row.team.crest} 
                              alt={`Escudo ${row.team.name}`} 
                              className="mini-escudo" 
                            />
                          )}
                          {row.team.name}
                        </td>
                        <td className="stat-highlight">{row.points}</td>
                        <td>{row.playedGames}</td>
                        <td>{row.won}</td>
                        <td>{row.draw}</td>
                        <td>{row.lost}</td>
                        <td>{row.goalsFor}</td>
                        <td>{row.goalsAgainst}</td>
                        <td className={row.goalDifference > 0 ? 'goal-difference-positive' : row.goalDifference < 0 ? 'goal-difference-negative' : ''}>
                          {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-legend">
                <div className="legend-item">
                  <div className="legend-color legend-champions"></div>
                  <span>Champions League</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-europa"></div>
                  <span>Europa League</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-conference"></div>
                  <span>Conference League</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color legend-relegation"></div>
                  <span>Descenso</span>
                </div>
              </div>
            </>
          )}
        </div>


        {/* SECCIÓN ESTADÍSTICAS - Estilo FIFA */}
        <div className="seccion-compacta stats-fifa-style" id="estadisticas">
          <div className="section-header-fifa">
            <div className="fifa-badge">⚽</div>
            <h2>Estadísticas LaLiga</h2>
            <div className="section-decoration"></div>
          </div>
          
          {/* Stats Overview con efectos FIFA */}
          <div className="stats-overview-fifa">
            <div className="stat-card-fifa primary">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <span className="stat-number-fifa">
                  {clasificacion.reduce((total, team) => total + team.playedGames, 0) / 2 || 0}
                </span>
                <span className="stat-label-fifa">Partidos Jugados</span>
              </div>
              <div className="card-shine"></div>
            </div>
            
            <div className="stat-card-fifa secondary">
              <div className="stat-icon">⚽</div>
              <div className="stat-content">
                <span className="stat-number-fifa">
                  {clasificacion.reduce((total, team) => total + team.goalsFor, 0)}
                </span>
                <span className="stat-label-fifa">Goles Totales</span>
              </div>
              <div className="card-shine"></div>
            </div>
            
            <div className="stat-card-fifa accent">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-number-fifa">
                  {clasificacion.length > 0 
                    ? (clasificacion.reduce((total, team) => total + team.goalsFor, 0) / 
                       (clasificacion.reduce((total, team) => total + team.playedGames, 0) / 2)).toFixed(1)
                    : '0.0'
                  }
                </span>
                <span className="stat-label-fifa">Promedio por Partido</span>
              </div>
              <div className="card-shine"></div>
            </div>
          </div>

          {/* Líderes LaLiga - Estilo FIFA Player Cards */}
          <div className="leaders-section-fifa">
            <div className="section-title-fifa">
              <span className="title-badge">TOP SCORERS</span>
              <h3>Máximos Goleadores</h3>
            </div>
            
            {loading ? (
              <div className="loading-fifa">
                <div className="loading-spinner"></div>
                <span>Cargando datos...</span>
              </div>
            ) : (
              <div className="leaders-container-fifa">
                {/* Top 5 Goleadores - Cards estilo FIFA */}
                <div className="scorers-fifa-grid">
                  {goleadores.map((scorer, index) => {
                    const cardRarity = index === 0 ? 'gold' : index < 3 ? 'silver' : 'bronze';
                    return (
                      <div key={scorer.player.id} className={`fifa-player-card ${cardRarity}`}>
                        <div className="card-header">
                          <span className="player-rating">{scorer.goals}</span>
                          <span className="card-type">ST</span>
                        </div>
                        
                        <div className="player-image-section">
                          {scorer.team.crest && (
                            <img 
                              src={scorer.team.crest} 
                              alt={scorer.team.name} 
                              className="team-badge-fifa"
                              onError={(e) => {e.target.style.display = 'none'}}
                            />
                          )}
                          <div className="rank-badge">#{index + 1}</div>
                        </div>
                        
                        <div className="player-info-fifa">
                          <h4 className="player-name-fifa">{scorer.player.name}</h4>
                          <p className="team-name-fifa">{scorer.team.shortName || scorer.team.name}</p>
                          
                          <div className="player-stats-fifa">
                            <div className="stat-row">
                              <span>⚽</span>
                              <span>{scorer.goals} Goles</span>
                            </div>
                            <div className="stat-row">
                              <span>🎯</span>
                              <span>{scorer.playedMatches || '--'} Partidos</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="card-glow"></div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Clasificación lateral estilo FIFA */}
                <div className="standings-fifa-sidebar">
                  <div className="sidebar-header">
                    <span className="sidebar-icon">🏆</span>
                    <h4>Clasificación</h4>
                  </div>
                  <div className="standings-list-fifa">
                    {clasificacion.slice(0, 6).map((teamData, index) => (
                      <div key={teamData.team.id} className={`standing-item-fifa position-${teamData.position <= 4 ? 'champion' : teamData.position === 5 ? 'europa' : teamData.position === 6 ? 'conference' : 'normal'}`}>
                        <span className="position-fifa">{teamData.position}</span>
                        {teamData.team.crest && (
                          <img 
                            src={teamData.team.crest} 
                            alt={teamData.team.name} 
                            className="team-crest-fifa"
                            onError={(e) => {e.target.style.display = 'none'}}
                          />
                        )}
                        <div className="team-info-fifa">
                          <span className="team-name-fifa">{teamData.team.shortName || teamData.team.name}</span>
                          <span className="points-fifa">{teamData.points} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN NOTICIAS */}
        <div className="seccion" id="noticias">
          <h2>Centro de Noticias</h2>
          <p>
            Las últimas novedades del mundo LaLiga: resultados, fichajes, análisis y más.
          </p>

          {/* Próximos Partidos - Estilo FIFA */}
          <div className="matches-section-fifa">
            <div className="section-header-matches">
              <div className="matches-badge">🎮</div>
              <h3>Próximos Partidos</h3>
              <div className="live-indicator">LIVE</div>
            </div>
            
            {loading ? (
              <div className="loading-fifa">
                <div className="loading-spinner"></div>
                <span>Cargando partidos...</span>
              </div>
            ) : (
              <div className="matches-fifa-container">
                {/* Próximos partidos del API con diseño FIFA */}
                {partidos.map((match, index) => {
                  const matchDate = new Date(match.utcDate);
                  const formatDate = matchDate.toLocaleDateString('es-ES', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short'
                  }).toUpperCase();
                  
                  const formatTime = matchDate.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  
                  return (
                    <div key={match.id} className="fifa-match-card">
                      <div className="match-header-fifa">
                        <span className="match-date-fifa">{formatDate}</span>
                        <span className="match-time-fifa">{formatTime}</span>
                        <div className="match-status">PRÓXIMO</div>
                      </div>
                      
                      <div className="match-teams-fifa">
                        <div className="team-fifa home">
                          {match.homeTeam.crest && (
                            <img 
                              src={match.homeTeam.crest} 
                              alt={match.homeTeam.name} 
                              className="team-logo-fifa"
                              onError={(e) => {e.target.style.display = 'none'}}
                            />
                          )}
                          <div className="team-details-fifa">
                            <h4 className="team-name-match">{match.homeTeam.shortName || match.homeTeam.name}</h4>
                            <span className="team-form">LOCAL</span>
                          </div>
                        </div>
                        
                        <div className="vs-section-fifa">
                          <div className="vs-circle">VS</div>
                          <div className="match-prediction">
                            <span className="prediction-label">Predicción</span>
                            <div className="prediction-bars">
                              <div className="bar home-bar" style={{width: '45%'}}></div>
                              <div className="bar draw-bar" style={{width: '25%'}}></div>
                              <div className="bar away-bar" style={{width: '30%'}}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="team-fifa away">
                          <div className="team-details-fifa">
                            <h4 className="team-name-match">{match.awayTeam.shortName || match.awayTeam.name}</h4>
                            <span className="team-form">VISITANTE</span>
                          </div>
                          {match.awayTeam.crest && (
                            <img 
                              src={match.awayTeam.crest} 
                              alt={match.awayTeam.name} 
                              className="team-logo-fifa"
                              onError={(e) => {e.target.style.display = 'none'}}
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="match-footer-fifa">
                        <div className="venue-info">
                          <span className="venue-icon">🏟️</span>
                          <span className="venue-name">{match.venue || 'Estadio por confirmar'}</span>
                        </div>
                        <div className="match-actions">
                          <button className="watch-btn">⏯️ SEGUIR</button>
                        </div>
                      </div>
                      
                      <div className="card-glow-match"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Noticias LaLiga - Diseño simplificado */}
          <div className="news-section">
            <h3>Últimas Noticias</h3>
            
            <div className="news-grid">
              <article className="news-card main-news">
                <div className="news-image">
                  <img src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                       alt="Real Madrid vs Barcelona El Clásico" 
                       onError={(e) => {e.target.src = 'https://via.placeholder.com/400x250/ff4b44/white?text=El+Clasico'}} />
                  <div className="news-category-badge">EL CLÁSICO</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">VIE 18.10.2025</span>
                    <span className="news-type">RESUMEN DE PARTIDO</span>
                  </div>
                  <h3>Real Madrid vs Barcelona: El Clásico que define LaLiga</h3>
                  <p>Los dos gigantes del fútbol español se enfrentan en un duelo decisivo 
                     para el liderato de LaLiga EA Sports en el Santiago Bernabéu.</p>
                </div>
              </article>

              <article className="news-card">
                <div className="news-image">
                  <img src="https://s.yimg.com/ny/api/res/1.2/7J_pWoKFhomIy7OzEnntbQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD04NTQ7Y2Y9d2VicA--/https://media.zenfs.com/es/lanacion.com.ar/5ab0a84aad337bd7a768c52ea2d7a18e" 
                       alt="Jugador celebrando gol - Julián Álvarez" 
                       onError={(e) => {e.target.src = 'https://via.placeholder.com/300x180/ff4b44/white?text=Julian+Alvarez'}} />
                  <div className="news-category-badge">HIGHLIGHTS</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">JUE 17.10.2025</span>
                  </div>
                  <h4>Todos los goles de Julián Álvarez</h4>
                  <p>El argentino del Atlético suma 6 goles en LaLiga, 
                     destacando con tantos decisivos.</p>
                </div>
              </article>

              <article className="news-card">
                <div className="news-image">
                  <img src="https://static.tiempo.com.mx/uploads/imagen/imagen/741454/principal_frenkie-de-jong-2.jpg" 
                       alt="Centrocampista con balón - Frenkie de Jong" 
                       onError={(e) => {e.target.src = 'https://via.placeholder.com/300x180/ff4b44/white?text=De+Jong'}} />
                  <div className="news-category-badge">JUGADOR</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">MIE 16.10.2025</span>
                  </div>
                  <h4>Lo mejor de Frenkie de Jong</h4>
                  <p>El centrocampista holandés se consolida como 
                     pieza clave del Barcelona esta temporada.</p>
                </div>
              </article>

              <article className="news-card">
                <div className="news-image">
                  <img src="https://assets-es.imgfoot.com/media/cache/1200x1200/mbappem.jpg" 
                       alt="Delantero estrella corriendo - Mbappé" 
                       onError={(e) => {e.target.src = 'https://via.placeholder.com/300x180/ff4b44/white?text=Mbappe'}} />
                  <div className="news-category-badge">FICHAJE</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">MAR 15.10.2025</span>
                  </div>
                  <h4>Mbappé lidera la tabla goleadora</h4>
                  <p>El francés alcanza los 9 goles en LaLiga 
                     y se consolida como máximo artillero.</p>
                </div>
              </article>

              <article className="news-card">
                <div className="news-image">
                  <img src="https://assets.laliga.com/assets/2023/09/18/hl/a2544f4f41a18c246769997aedb5a429.jpeg" 
                       alt="Estadio durante partido - Jornada LaLiga" 
                       onError={(e) => {e.target.src = 'https://via.placeholder.com/300x180/ff4b44/white?text=Jornada+9'}} />
                  <div className="news-category-badge">JORNADA</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">LUN 14.10.2025</span>
                  </div>
                  <h4>Los mejores momentos de la J9</h4>
                  <p>Repaso a los goles, jugadas y momentos 
                     más destacados de la jornada pasada.</p>
                </div>
              </article>

              <article className="news-card">
                <div className="news-image">
                  <img src="https://s3.abcstatics.com/abc/www/multimedia/deportes/2023/12/13/arep-RL6jWKpQ6VYW8fVQk7xlg7M-1200x840@abc.jpg" 
                       alt="Tecnología VAR - Sistema de videoarbitraje" 
                       onError={(e) => {e.target.src = 'https://via.placeholder.com/300x180/ff4b44/white?text=VAR'}} />
                  <div className="news-category-badge">TECNOLOGÍA</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">DOM 13.10.2025</span>
                  </div>
                  <h4>Las decisiones VAR más polémicas</h4>
                  <p>Análisis de las jugadas más controvertidas 
                     revisadas por el VAR esta temporada.</p>
                </div>
              </article>
            </div>

            <div className="section-footer-news">
              <button className="btn-view-all">Ver todas las noticias</button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer-compact">
          <div className="footer-container">
            <div className="footer-main">
              <div className="footer-brand">
                <img src={logoBlanco} alt="LaLiga Logo" className="footer-logo" />
                <div className="footer-brand-text">
                  <h3>LaLiga EA Sports</h3>
                  <p>La liga más emocionante del mundo</p>
                </div>
              </div>
              
              <div className="footer-nav">
                <div className="footer-section">
                  <h4>Competición</h4>
                  <a href="#clasificacion" className="footer-link">Clasificación</a>
                  <a href="#equipos" className="footer-link">Equipos</a>
                  <a href="#estadisticas" className="footer-link">Estadísticas</a>
                </div>
                
                <div className="footer-section">
                  <h4>Contenido</h4>
                  <a href="#noticias" className="footer-link">Noticias</a>
                  <a href="#" className="footer-link">Calendario</a>
                  <a href="#" className="footer-link">Resultados</a>
                </div>
                
                <div className="footer-section">
                  <h4>Síguenos</h4>
                  <div className="social-links">
                    <a href="#" className="social-link">📱 Twitter</a>
                    <a href="#" className="social-link">📘 Facebook</a>
                    <a href="#" className="social-link">📷 Instagram</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; 2025 LaLiga EA Sports. Todos los derechos reservados.</p>
              <div className="footer-legal">
                <a href="#" className="legal-link">Privacidad</a>
                <a href="#" className="legal-link">Términos</a>
                <a href="#" className="legal-link">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;

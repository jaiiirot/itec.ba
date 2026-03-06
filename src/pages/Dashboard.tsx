import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { InstagramCard } from '../components/molecules/InstagramCard';
import { EventsWidget } from '../components/organisms/EventsWidget';
import { LiveVisitorsWidget } from '../components/organisms/LiveVisitorsWidget';

// Importamos las bases de datos para el Buscador Universal
import { COURSE_DATA } from '../data/courses';
import { RESOURCES_DB } from '../data/resources';
import { GROUPS_DB } from '../data/groups';
import { DIRECTORY_DB } from '../data/directory'; // <-- Nueva DB

// MOCK_NEWS se mantiene igual pero acortado por brevedad
const MOCK_NEWS = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400', caption: '¡Se vienen las Mesas de Final! 📢 Recordá anotarte con 48hs de anticipación. Te contamos todo...', date: 'Hace 2 días', link: '#' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400', caption: '📝 Taller de Inicio a la Vida Universitaria. Todo lo que necesitás saber sobre la facu. ¡Sumate!', date: 'Hace 5 días', link: '#' },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400', caption: '¿Ya pediste tu Boleto Universitario? 🚌 Te dejamos el paso a paso detallado para tramitarlo en SIGA.', date: '1 Feb 2026', link: '#' },
  { id: 4, imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400', caption: '💥 Simulacro Final de Ingreso. ¿Querés poner a prueba tus conocimientos? Este finde hacemos uno.', date: '28 Ene 2026', link: '#' },
  { id: 5, imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400', caption: '🎧 Spotify para Estudiantes. Cómo conseguir la suscripción Premium a mitad de precio.', date: '20 Ene 2026', link: '#' },
  { id: 6, imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400', caption: '¡Nuevos grupos de WhatsApp! 📲 Actualizamos el árbol de enlaces. ¡Buscá el tuyo!', date: '15 Ene 2026', link: '#' },
  { id: 7, imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400', caption: 'Tutorías de programación en Wollok y Haskell. Sumate al discord oficial.', date: '10 Ene 2026', link: '#' },
  { id: 8, imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400', caption: 'Tips para aprobar Sistemas y Procesos de Negocio sin morir en el intento.', date: '5 Ene 2026', link: '#' }
];

export const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Lógica del Buscador Universal
// BUSCADOR UNIVERSAL MEJORADO
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    
    return {
      cursos: COURSE_DATA.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)),
      aportes: RESOURCES_DB.filter(r => r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q)).slice(0, 3),
      grupos: GROUPS_DB.filter(g => g.materia.toLowerCase().includes(q)).slice(0, 3),
      directorio: DIRECTORY_DB.filter(d => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)).slice(0, 4) // <-- Agregado al buscador
    };
  }, [searchQuery]);

  // Cierra el buscador al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      {/* HEADER / BUSCADOR UNIVERSAL */}
      <header className="flex justify-between items-center mb-8 relative z-50">
        <div className="relative w-full max-w-2xl" ref={searchRef}>
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Buscar universalmente apuntes, materias, foros, grupos..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
            onFocus={() => setIsSearchOpen(true)}
            className="bg-itec-surface border border-itec-gray text-white pl-12 pr-4 py-3 rounded-2xl w-full focus:outline-none focus:border-itec-blue transition-colors shadow-lg"
          />
          
          {/* RESULTADOS DEL BUSCADOR */}
          {isSearchOpen && searchResults && (
            <div className="absolute top-full mt-2 w-full bg-itec-surface border border-itec-gray rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden max-h-[70vh] flex flex-col">
              <div className="overflow-y-auto p-4 custom-scrollbar flex flex-col gap-6">
                
                {/* Sección Cursos */}
                {searchResults.cursos.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Cursos & Clases</h4>
                    {searchResults.cursos.map(curso => (
                      <Link to={`/cursos/${curso.id}`} key={curso.id} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <div className="w-10 h-10 rounded bg-itec-blue/20 flex items-center justify-center text-itec-blue"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                        <div>
                          <p className="text-sm font-bold text-white">{curso.title}</p>
                          <p className="text-xs text-gray-400">{curso.videoCount} videos disponibles</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Sección Aportes */}
                {searchResults.aportes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Aportes & Resúmenes</h4>
                    {searchResults.aportes.map(aporte => (
                      <Link to="/explore" key={aporte.id} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <div className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg></div>
                        <div>
                          <p className="text-sm font-bold text-white">{aporte.title}</p>
                          <p className="text-xs text-gray-400">{aporte.subject} • {aporte.type}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Sección Grupos */}
                {searchResults.grupos.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-2">Grupos de WhatsApp</h4>
                    {searchResults.grupos.map(grupo => (
                      <Link to="/grupos" key={grupo.id} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <div className="w-10 h-10 rounded bg-green-500/20 flex items-center justify-center text-green-400"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75"/></svg></div>
                        <div>
                          <p className="text-sm font-bold text-white">{grupo.materia}</p>
                          <p className="text-xs text-gray-400">Comisión: {grupo.comision} • {grupo.carrera.toUpperCase()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Estado vacío */}
                {searchResults.cursos.length === 0 && searchResults.aportes.length === 0 && searchResults.grupos.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">No encontramos resultados para "{searchQuery}"</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 ml-4">
          <button className="text-gray-400 hover:text-white transition bg-itec-surface p-2 rounded-full border border-itec-gray">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center cursor-pointer border border-[#333] hover:border-itec-blue transition overflow-hidden">
             <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Perfil" />
          </div>
        </div>
      </header>

      {/* SALUDO */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-1 text-white">¡Hola, Jairo! 👋</h1>
        <p className="text-gray-400 text-sm">Tu progreso en la UTN BA, en un solo lugar.</p>
      </section>

{/* EL SÚPER HUB: 6 TARJETAS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 relative z-10">
        
        {/* Fila 1 */}
        <Link to="/cursos" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-itec-blue hover:bg-blue-500/5 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
          <div><h3 className="font-bold text-white text-[13px]">Clases y Cursos</h3><p className="text-[11px] text-gray-500">Videos de apoyo</p></div>
        </Link>
        
        <Link to="/explore" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-orange-500 hover:bg-orange-500/5 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/></svg>
          </div>
          <div><h3 className="font-bold text-white text-[13px]">Aportes</h3><p className="text-[11px] text-gray-500">Resúmenes y Finales</p></div>
        </Link>
        
        <Link to="/grupos" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-green-500 hover:bg-green-500/5 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div><h3 className="font-bold text-white text-[13px]">Comunidades WA</h3><p className="text-[11px] text-gray-500">Grupos por comisión</p></div>
        </Link>

        {/* Fila 2 (Nuevas Páginas) */}
        <Link to="/ingreso" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-purple-500 hover:bg-purple-500/5 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <div><h3 className="font-bold text-white text-[13px]">Ingreso UTN</h3><p className="text-[11px] text-gray-500">TIVU y Módulo B</p></div>
        </Link>
        
        <Link to="/grado" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-yellow-500 hover:bg-yellow-500/5 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          </div>
          <div><h3 className="font-bold text-white text-[13px]">Grado (Planes 23)</h3><p className="text-[11px] text-gray-500">Planes y correlativas</p></div>
        </Link>
        
        <Link to="/nosotros" className="bg-itec-surface border border-itec-gray rounded-xl p-3.5 flex items-center gap-3 hover:border-pink-500 hover:bg-pink-500/5 transition-all group">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <div><h3 className="font-bold text-white text-[13px]">Sobre ✳️TEC</h3><p className="text-[11px] text-gray-500">Valores y Contacto</p></div>
        </Link>

      </div>

      {/* GRILLA PRINCIPAL DE CONTENIDO */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* LADO IZQUIERDO: Feed de Noticias (Cambiado a 4 columnas en pantallas grandes para que sean pequeñas) */}
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-white">Novedades <span className="text-itec-blue">ITEC</span></h2>
             <a href="https://instagram.com/itecba" target="_blank" className="text-xs text-itec-blue hover:underline font-medium">Ver Instagram</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MOCK_NEWS.map((news) => (
              <InstagramCard 
                key={news.id}
                imageUrl={news.imageUrl}
                caption={news.caption}
                date={news.date}
                link={news.link}
              />
            ))}
          </div>
        </div>
        
        {/* LADO DERECHO: Widgets Funcionales */}
        <div className="xl:col-span-1 flex flex-col gap-6 pt-10">
           <EventsWidget />
           <LiveVisitorsWidget />
        </div>

      </div>
    </DashboardLayout>
  );
};
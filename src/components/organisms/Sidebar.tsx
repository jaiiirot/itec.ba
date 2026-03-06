import React from 'react';
import { SidebarItem } from '../molecules/SidebarItem';
import logoItec from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext'; // <-- Importa el hook

interface SidebarProps {
  isOpen: boolean;
  closeMobile: () => void;
}

// Iconos SVG minimalistas (Estilo Instagram)
const Icons = {
  home: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  search: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  compass: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.328 7.672l-2.828 8.484-8.484 2.828 2.828-8.484 8.484-2.828zM12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  play: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  message: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  heart: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>,
  plus: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>,
  menu: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>,
  users: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75"/></svg>,
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobile }) => {
  const { isAuthenticated } = useAuth(); // <-- Usa el hook
  return (
    <>
      {/* Fondo oscuro para móvil (Cierra el menú al tocar afuera) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-itec-sidebar z-40 md:hidden transition-opacity" 
          onClick={closeMobile}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen bg-itec-sidebar  z-50 flex flex-col justify-between
        transition-all duration-300 ease-in-out group/sidebar
        /* Lógica Desktop: 80px cerrado, 260px al hacer hover */
        md:translate-x-0 md:w-20 hover:md:w-64
        /* Lógica Mobile: 260px y sale/entra de la pantalla */
        w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full px-3 py-4 overflow-x-hidden">
          
          {/* Logo */}
          <div className="flex items-center gap-4 p-3 mb-6 mt-2 shrink-0">
            <img src={logoItec} alt="ITEC Logo" className="w-10 h-10 object-contain" />
            {/* Texto del logo con la misma animación de expansión */}
            <span className="font-bold text-xl tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 max-w-[200px] opacity-100 md:max-w-0 md:opacity-0 group-hover/sidebar:max-w-[200px] group-hover/sidebar:opacity-100">
              ITEC UTN
            </span>
          </div>
          
          {/* Navegación Principal */}
          <nav className="flex flex-col gap-1 flex-1">
            <SidebarItem path="/" icon={Icons.home} label="Home" onClick={closeMobile} />
            <SidebarItem path="/explore" icon={Icons.compass} label="Explore" onClick={closeMobile} />
            <SidebarItem path="/cursos" icon={Icons.play} label="Mis Cursos" onClick={closeMobile} />
            <SidebarItem path="/chat" icon={Icons.message} label="Chat" badge={2} onClick={closeMobile} />
            <SidebarItem path="/grupos" icon={Icons.users} label="Grupos de WA" onClick={closeMobile} />
            <SidebarItem path="/ingreso" icon={<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>} label="Ingreso" onClick={closeMobile} />
            <SidebarItem path="/grado" icon={<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>} label="Grado" onClick={closeMobile} />            
            {/* Perfil (Con foto en vez de ícono) */}
            <SidebarItem 
              path="/perfil" 
              icon={<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} 
              label={isAuthenticated ? "Mi Perfil" : "Iniciar Sesión"} 
              onClick={closeMobile} 
            />
          </nav>

          {/* Acciones Inferiores (More) */}
          <div className="mt-auto pt-4 flex flex-col gap-1">
            <SidebarItem path="#more" icon={Icons.menu} label="More" onClick={closeMobile} />
          </div>
        </div>
      </aside>
    </>
  );
};
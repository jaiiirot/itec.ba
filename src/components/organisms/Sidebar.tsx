import React from 'react';
import logoItec from '../../assets/logo.png';
import { Icons } from '../atoms/Icons';
import { SidebarItem } from '../molecules/SidebarItem';
import { useAuth } from '../../context/AuthContext'; 

interface SidebarProps {
  isOpen: boolean;
  closeMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobile }) => {
  const { isAuthenticated } = useAuth(); 

  // Helper para envolver los íconos y darles tamaño
  const getIcon = (type: string) => (
    <div className="w-6 h-6 shrink-0">
      <Icons type={type} />
    </div>
  );

  return (
    <>
      {/* Fondo oscuro para móvil (Cierra el menú al tocar afuera) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-itec-sidebar/80 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={closeMobile}
        />
      )}
      <aside className={`
        fixed top-0 left-0 h-screen bg-itec-sidebar z-50 flex flex-col justify-between
        transition-all duration-300 ease-in-out group/sidebar
        /* Lógica Desktop: 80px cerrado, 260px al hacer hover */
        md:translate-x-0 md:w-20 hover:md:w-64
        /* Lógica Mobile: 260px y sale/entra de la pantalla */
        w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full px-3 py-4 overflow-x-hidden">
          
          {/* Logo */}
          <div className="flex items-center gap-4 p-3 mb-4 mt-2 shrink-0">
            <img src={logoItec} alt="ITEC Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 max-w-50 opacity-100 md:max-w-0 md:opacity-0 group-hover/sidebar:max-w-50 group-hover/sidebar:opacity-100 text-white">
              ITEC UTN
            </span>
          </div>
          
          {/* NAVEGACIÓN */}
          <nav className="flex flex-col gap-1 flex-1">
            <SidebarItem path="/" icon={getIcon("home")} label="Home" onClick={closeMobile} />
            
            {/* ÍTEMS BLOQUEADOS */}
            <SidebarItem path="/explore" icon={getIcon("compass")} label="Recursos" disabled />
            <SidebarItem path="/cursos" icon={getIcon("play")} label="Cursos" disabled />
            
            <SidebarItem path="/chat" icon={getIcon("message")} label="Preguntas Frecuentes" badge={2} onClick={closeMobile} />
            <SidebarItem path="/grupos" icon={getIcon("users")} label="Grupos de WA" onClick={closeMobile} />
            <SidebarItem path="/grado" icon={getIcon("degree")} label="Grado" onClick={closeMobile} />            
            <SidebarItem path="/ingreso" icon={getIcon("entry")} label="Ingreso" onClick={closeMobile} />
            <SidebarItem path="/nosotros" icon={getIcon("info")} label="Nosotros" onClick={closeMobile} />
          </nav>

          <div className="mt-auto pt-4 flex flex-col gap-1 border-t border-itec-gray">
            <SidebarItem path="/perfil" icon={getIcon("profile")} label={isAuthenticated ? "Mi Perfil" : "Iniciar Sesión"} onClick={closeMobile} />
          </div>
        </div>
      </aside>
    </>
  );
};
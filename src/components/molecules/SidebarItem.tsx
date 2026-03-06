import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number | 'dot'; // Soporta un número (ej: 2) o un puntito rojo
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path, badge, onClick }) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group/item hover:bg-white/10
        ${isActive ? 'font-bold text-white' : 'font-normal text-gray-300'}
      `}
    >
      {({ isActive }) => (
        <>
          <div className="relative flex-shrink-0">
            {/* Animación sutil al hacer hover en el ítem */}
            <div className={`transition-transform duration-200 group-hover/item:scale-105 ${isActive ? 'text-white' : ''}`}>
              {icon}
            </div>
            
            {/* Lógica de Notificaciones (Badge) */}
            {badge === 'dot' && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-itec-bg rounded-full"></span>
            )}
            {typeof badge === 'number' && badge > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-itec-bg flex items-center justify-center">
                {badge}
              </span>
            )}
          </div>

          {/* MAGIA RESPONSIVE Y HOVER:
            - Mobile: Visible por defecto (max-w-[200px] opacity-100)
            - Desktop (md): Oculto por defecto (md:max-w-0 md:opacity-0)
            - Desktop Hover (group-hover/sidebar): Visible (group-hover/sidebar:max-w-[200px] ...)
          */}
          <span className="whitespace-nowrap overflow-hidden transition-all duration-300 max-w-[200px] opacity-100 md:max-w-0 md:opacity-0 group-hover/sidebar:max-w-[200px] group-hover/sidebar:opacity-100">
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};
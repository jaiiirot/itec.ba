import React from 'react';

interface ResourceRowProps {
  title: string;
  author: string;
  type: string;
  subject: string;
  date: string;
  isImportant?: boolean;
}

export const ResourceRow: React.FC<ResourceRowProps> = ({ title, author, type, subject, date, isImportant }) => {
  return (
    // Contenedor principal de la fila
    // Usamos itec-bg para el fondo base y itec-gray para el borde inferior sutil.
    // Al hacer hover, aplicamos itec-surface (un tono más claro) para destacarlo.
    <div className={`
      grid grid-cols-1 md:grid-cols-[1fr,auto,auto,auto] items-center 
      gap-x-4 gap-y-1 p-4 border-b border-itec-gray/50 
      hover:bg-itec-surface transition-colors group cursor-pointer
      ${isImportant ? 'bg-itec-surface/40' : 'bg-itec-bg'}
    `}>
      
      {/* --- COLUMNA 1: TEMA Y AUTOR (Principal) --- */}
      <div className="flex items-start gap-3 md:pr-4">
        {/* Ícono/Pin */}
        <div className="mt-1 flex-shrink-0 w-5 flex justify-center">
          {isImportant ? (
             // Usamos itec-red para el pin de importante, muy sutil
             <span className="text-itec-red text-lg" title="Tema Importante">📌</span>
          ) : (
             // Usamos itec-blue para el ícono normal de documento
             <span className="text-itec-blue group-hover:text-itec-text transition-colors" title="Documento">📄</span>
          )}
        </div>
        
        {/* Título y Autor */}
        <div className="flex-1 overflow-hidden">
          <h4 className={`
            text-sm md:text-[15px] font-medium leading-snug truncate
            transition-colors group-hover:text-white
            ${isImportant ? 'text-white font-bold' : 'text-itec-text'}
          `}>
            {title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            por <span className="text-gray-400 group-hover:text-gray-300">{author}</span>
          </p>
        </div>
      </div>

      {/* --- COLUMNA 2: TIPO DE APORTE (Alineado) --- */}
      <div className="flex md:justify-center pl-8 md:pl-0 md:w-32">
        <span className="text-xs font-bold text-gray-400 bg-itec-gray/30 px-3 py-1 rounded-full border border-itec-gray">
          {type}
        </span>
      </div>

      {/* --- COLUMNA 3: MATERIA (Alineado) --- */}
      <div className="flex md:justify-start pl-8 md:pl-0 md:w-56 overflow-hidden">
        <span className="text-xs text-gray-400 group-hover:text-gray-300 truncate">
          {subject}
        </span>
      </div>

      {/* --- COLUMNA 4: FECHA / ÚLTIMO MENSAJE (Alineado a la derecha) --- */}
      <div className="flex md:justify-end pl-8 md:pl-0 md:w-32 md:text-right">
        <span className="text-xs text-gray-500 group-hover:text-gray-400 font-medium">
          {date}
        </span>
      </div>
      
    </div>
  );
};
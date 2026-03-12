import React from 'react';

interface TimelineItemProps {
  title: string;
  date: string;
  isActive?: boolean;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ title, date, isActive = false, isLast = false }) => {
  return (
    <div className="flex relative pb-6">
      {/* Línea conectora vertical */}
      {!isLast && (
        <div className="absolute top-2 left-2 w-0.5 h-full bg-itec-gray -ml-px"></div>
      )}
      
      {/* Círculo indicador (Dot) */}
      <div className="relative z-10 w-4 h-4 mt-1 shrink-0 flex items-center justify-center bg-itec-surface">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-[#ff1919] shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'border-2 border-itec-gray bg-transparent'}`}></div>
      </div>
      
      {/* Contenido (Texto y Fecha) */}
      <div className="ml-4 flex flex-col">
        <span className={`text-sm ${isActive ? 'text-itec-text font-semibold' : 'text-gray-400'}`}>
          {title}
        </span>
        <span className="text-xs text-gray-500 mt-0.5">{date}</span>
      </div>
    </div>
  );
};
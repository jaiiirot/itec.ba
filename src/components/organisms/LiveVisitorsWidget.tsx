import React, { useState, useEffect } from 'react';
import { WidgetHeader } from '../molecules/WidgetHeader';

export const LiveVisitorsWidget: React.FC = () => {
  // Estado inicial aleatorio entre 120 y 160
  const [visitors, setVisitors] = useState(() => Math.floor(Math.random() * 40) + 120);

  // Efecto para hacer fluctuar el número cada 3-5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors(prev => {
        // Sube o baja entre -3 y +3 usuarios al azar
        const change = Math.floor(Math.random() * 7) - 3;
        // Evitamos que baje de 50 o suba de 300 para mantenerlo realista
        if (prev + change < 50) return 50;
        if (prev + change > 300) return 300;
        return prev + change;
      });
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#111] border border-[#262626] rounded-xl p-6 shadow-lg flex flex-col">
      <WidgetHeader title="Tráfico del Sitio" />
      
      <div className="flex-1 flex flex-col items-center justify-center mt-2 py-4">
        <div className="flex items-center gap-3">
          {/* Punto parpadeante "Live" (Usando itec-blue o verde suave) */}
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-itec-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-itec-blue"></span>
          </span>
          <span className="text-gray-400 font-medium text-sm uppercase tracking-widest">En Línea Ahora</span>
        </div>
        
        {/* El número dinámico */}
        <h2 className="text-6xl font-bold text-white mt-4 tracking-tighter">
          {visitors}
        </h2>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Estudiantes navegando
        </p>
      </div>
    </div>
  );
};
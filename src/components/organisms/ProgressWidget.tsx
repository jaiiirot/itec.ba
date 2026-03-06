import React from 'react';
import { WidgetHeader } from '../molecules/WidgetHeader';

export const ProgressWidget: React.FC = () => {
  // Configuración del gráfico circular (Donut)
  const percentage = 75; // 75% de progreso
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-itec-surface border border-itec-gray rounded-xl p-6 shadow-lg flex flex-col h-full">
      <WidgetHeader title="Mi Progreso Semanal" />
      
      <div className="flex-1 flex items-center justify-center mt-4">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Círculo de fondo (Gris) */}
            <circle
              stroke="#474747" // Tu color --color-itec-gray
              fill="transparent"
              strokeWidth={strokeWidth}
              r={radius}
              cx={size / 2}
              cy={size / 2}
            />
            {/* Círculo de progreso (Azul) */}
            <circle
              stroke="#022A5E" // Tu color --color-itec-blue
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Texto en el centro */}
          <div className="absolute flex flex-col items-center">
             <span className="text-3xl font-bold text-itec-text">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
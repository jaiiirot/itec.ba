import React from 'react';
import { WidgetHeader } from '../molecules/WidgetHeader';
import { ProgressCircle } from '../atoms/Icons'; // <-- Asegurate de que la ruta coincida con tu proyecto

export const ProgressWidget: React.FC = () => {
  const percentage = 75;

  return (
    <div className="bg-itec-surface border border-itec-gray rounded-xl p-6 shadow-lg flex flex-col h-full">
      <WidgetHeader title="Mi Progreso Semanal" />
      
      <div className="flex-1 flex items-center justify-center mt-4">
        <div className="relative flex items-center justify-center">
      
          {/*SVG DINÁMICO */}
          <ProgressCircle percentage={percentage} />

          {/* Texto en el centro */}
          <div className="absolute flex flex-col items-center">
             <span className="text-3xl font-bold text-itec-text">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
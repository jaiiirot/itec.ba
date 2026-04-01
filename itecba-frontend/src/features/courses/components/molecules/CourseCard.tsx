import React from 'react';
import { ProgressBar } from '../atoms/ProgressBar';
import { Icons } from "@/components/atoms/Icons";

interface CourseCardProps {
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, description, progress, imageUrl }) => {
  const isCompleted = progress === 100;

  return (
    <div className="bg-itec-surface border border-itec-gray hover:border-itec-blue/50 rounded-2xl p-4 flex flex-col gap-4 shadow-xl transition-all duration-300 h-full group relative overflow-hidden">
      
      {/* Contenedor de Imagen con Efecto Hover */}
      <div className="w-full h-36 bg-itec-bg rounded-xl overflow-hidden relative isolate">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" 
        />
        
        {/* Overlay Play Button */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-12 h-12 bg-itec-blue/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <div className="w-5 h-5 ml-1"><Icons type="playFill" /></div>
          </div>
        </div>

        {/* Badge Completado */}
        {isCompleted && (
          <div className="absolute top-2 left-2 z-20 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-green-400 shadow-lg flex items-center gap-1">
            <div className="w-3 h-3"><Icons type="check" /></div>
            COMPLETADO
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-bold text-white mb-1.5 line-clamp-2 leading-tight group-hover:text-itec-blue-skye transition-colors">{title}</h3>
        <p className="text-[13px] text-gray-400 line-clamp-2 mb-4 flex-1">{description}</p>
        
        {/* Progreso */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tu Progreso</span>
            <span className={`text-[11px] font-bold ${isCompleted ? 'text-green-400' : 'text-itec-blue-skye'}`}>{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>
    </div>
  );
};
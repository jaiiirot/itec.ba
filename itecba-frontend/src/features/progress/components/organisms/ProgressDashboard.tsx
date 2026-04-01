// src/features/progress/components/organisms/ProgressDashboard.tsx
import React, { useMemo } from 'react';
import { ProgressTable } from '../molecules/ProgressTable';
import type { CareerProgress } from '../../types/progress';
import type { ProgressMetrics } from '../../hooks/useProgress';

interface Props {
  data: CareerProgress & { metrics: ProgressMetrics };
  onUpdateStatus: (id: string, status: 'aprobada' | 'regular' | 'disponible') => void;
}

export const ProgressDashboard: React.FC<Props> = ({ data, onUpdateStatus }) => {
  
  // Calcula dinámicamente cuántos niveles tiene la carrera (Ej: 1 al 5, o 1 al 6)
  const levels = useMemo(() => {
    const allLevels = data.subjects.map(s => s.level);
    return Array.from(new Set(allLevels)).sort((a, b) => a - b);
  }, [data.subjects]);

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-itec-gray shadow-2xl p-6 md:p-8 bg-itec-surface" style={{ background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%)' }}>
        {/* ... (Mantén los SVG decorativos y el encabezado igual) ... */}
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-itec-blue to-purple-500">
              MI PROGRESO
            </h1>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🎓 <span className="text-itec-blue-skye">{data.careerName}</span>
            </h2>
            <p className="text-gray-400 text-sm">Visualizá tu avance académico, calculá tu promedio y planificá tus materias.</p>
          </div>

          <div className="flex gap-8 bg-itec-bg/50 px-8 py-5 rounded-3xl border border-itec-gray backdrop-blur-md shadow-2xl">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">Promedio</span>
              <span className="text-4xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.2)]">{data.averageGrade}</span>
            </div>
            <div className="w-[1px] h-12 bg-itec-gray self-center"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">Progreso</span>
              <span className="text-4xl font-black text-itec-blue drop-shadow-[0_0_10px_rgba(56,189,248,0.2)]">{data.totalProgress}%</span>
            </div>
          </div>
        </div>

        {/* 🔴 BARRA DE PROGRESO DINÁMICA */}
        <div className="mt-8 space-y-3">
          <div className="w-full bg-itec-bg rounded-full h-3 overflow-hidden flex border border-itec-gray">
            <div className="bg-green-500 transition-all duration-1000" style={{ width: `${data.metrics.porcentajeAprobadas}%` }}></div>
            <div className="bg-fuchsia-500 transition-all duration-1000" style={{ width: `${data.metrics.porcentajeRegulares}%` }}></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>APROBADAS ({data.metrics.aprobadas})</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500"></span>REGULARES ({data.metrics.regulares})</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-itec-bg border border-itec-gray"></span>FALTANTES ({data.metrics.total - data.metrics.aprobadas})</div>
          </div>
        </div>
      </section>

      {/* Renderizado Dinámico de Niveles */}
      <div className="space-y-12">
        {levels.map(level => {
          const levelSubjects = data.subjects.filter((s: any) => s.level === level);
          return (
            <ProgressTable 
              key={level} 
              level={level} 
              subjects={levelSubjects} 
              onUpdateStatus={onUpdateStatus}
            />
          );
        })}
      </div>
    </div>
  );
};
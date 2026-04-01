import React from 'react';
import { ProgressTable } from '../molecules/ProgressTable';
import type { CareerProgress } from '../../types/progress';

interface Props {
  data: CareerProgress;
}

export const ProgressDashboard: React.FC<Props> = ({ data }) => {
  // Agrupar materias por nivel
  const levels = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col gap-10">
      {/* Header Interactivo Mantenido de tu HTML */}
      <section className="relative overflow-hidden rounded-3xl border border-itec-gray shadow-2xl p-6 md:p-8 bg-itec-surface" style={{ background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%)' }}>
        <div className="absolute -top-10 -right-10 pointer-events-none opacity-[0.05] animate-[float_10s_ease-in-out_infinite]">
          <svg width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-itec-blue transform rotate-12"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
        </div>
        
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

        {/* Barra de colores unificada */}
        <div className="mt-8 space-y-3">
          <div className="w-full bg-itec-bg rounded-full h-3 overflow-hidden flex border border-itec-gray">
            <div className="bg-green-500" style={{ width: '12%' }}></div>
            <div className="bg-fuchsia-500" style={{ width: '8%' }}></div>
            <div className="bg-yellow-400" style={{ width: '5%' }}></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>APROBADAS</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500"></span>REGULARIZADAS</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>CURSANDO</div>
          </div>
        </div>
      </section>

      {/* Renderizado Dinámico de Niveles */}
      <div className="space-y-12">
        {levels.map(level => {
          const levelSubjects = data.subjects.filter(s => s.level === level);
          if (levelSubjects.length === 0) return null;

          return (
            <section key={`level-${level}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-itec-blue to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                    {level}
                  </div>
                  <h2 className="text-2xl font-bold text-white">Nivel {level}</h2>
                </div>
                <div className="flex-1 md:ml-8 hidden md:block">
                   <div className="w-full h-[1px] bg-itec-gray"></div>
                </div>
              </div>

            <div className="space-y-8">
            {[1, 2, 3, 4, 5].map(level => {
                const levelSubjects = data.subjects.filter(s => s.level === level);
                return <ProgressTable key={level} level={level} subjects={levelSubjects} />;
            })}
            </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
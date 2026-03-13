import React from 'react';
import { ESPECIALIDADES_DB } from '../../data/specialties';

interface Props {
  onSpecialtyClick: (val: string) => void;
}

export const SpecialtyGrid: React.FC<Props> = ({ onSpecialtyClick }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Explorar por Especialidad</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {ESPECIALIDADES_DB.map((esp, i) => (
          <div 
            key={i} 
            onClick={() => onSpecialtyClick(esp.carreraValue)} 
            className={`group bg-itec-surface border ${esp.colorClass} rounded-xl p-3 cursor-pointer flex items-center justify-between hover:bg-itec-bg transition-all hover:-translate-y-0.5`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-itec-sidebar border border-itec-gray flex items-center justify-center text-sm font-bold text-white group-hover:bg-white/5">
                {esp.code}
              </div>
              <span className="font-bold text-[11px] text-gray-400 tracking-wide">{esp.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
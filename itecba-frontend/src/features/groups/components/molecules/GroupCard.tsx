import React from 'react';
import type { GroupData } from '../../services/groupsService';

interface Props {
  group: GroupData;
}

export const GroupCard: React.FC<Props> = ({ group }) => {
  return (
    <div className="bg-itec-surface border border-itec-gray rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-itec-blue/50 transition-colors">
      <div className="absolute -right-6 top-3 bg-itec-sidebar border border-itec-gray text-[9px] font-bold text-gray-400 px-6 py-1 rotate-45">
        {group.tipo || 'General'}
      </div>
      <div>
        <span className="text-[10px] font-bold text-itec-blue-skye uppercase tracking-widest block mb-1">
          Nivel {group.nivel}
        </span>
        <h4 className="font-bold text-white text-sm mb-1 pr-4">{group.materia}</h4>
        <p className="text-xs text-gray-400">
          Comisión: <strong className="text-white text-[13px]">{group.comision}</strong>
        </p>
      </div>
      <a 
        href={group.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-4 flex items-center justify-center gap-2 w-full bg-itec-bg hover:bg-itec-blue border border-itec-gray hover:border-itec-blue-skye text-gray-300 hover:text-white py-2 rounded-lg text-xs font-bold transition-all"
      >
        Unirme al Grupo
      </a>
    </div>
  );
};
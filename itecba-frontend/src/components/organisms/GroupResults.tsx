import React from 'react';
import { Button } from '../atoms/Button';
import type { GroupData } from '../../services/groupsService';

interface Props {
  results: GroupData[];
  onClear: () => void;
  onAddClick: () => void;
}

export const GroupResults: React.FC<Props> = ({ results, onClear, onAddClick }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Resultados ({results.length})</h3>
        <button onClick={onClear} className="text-xs text-itec-blue-skye hover:underline transition-colors">Volver a Especialidades</button>
      </div>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((g) => (
            <div key={g.id || (g as any)._id} className="bg-itec-surface border border-itec-gray rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-itec-blue/50 transition-colors">
              <div className="absolute -right-6 top-3 bg-itec-sidebar border border-itec-gray text-[9px] font-bold text-gray-400 px-6 py-1 rotate-45">{g.tipo}</div>
              <div>
                <span className="text-[10px] font-bold text-itec-blue-skye uppercase tracking-widest block mb-1">Nivel {g.nivel}</span>
                <h4 className="font-bold text-white text-sm mb-1 pr-4">{g.materia}</h4>
                <p className="text-xs text-gray-400">Comisión: <strong className="text-white text-[13px]">{g.comision}</strong></p>
              </div>
              <a href={g.link} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full bg-itec-bg hover:bg-itec-blue border border-itec-gray hover:border-itec-blue-skye text-gray-300 hover:text-white py-2 rounded-lg text-xs font-bold transition-all">
                Unirme al Grupo
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-itec-surface border border-itec-gray rounded-xl p-10 shadow-lg">
          <span className="text-4xl block mb-3 opacity-50">👥</span>
          <p className="text-gray-300 font-bold mb-2">No encontramos tu grupo</p>
          <p className="text-gray-500 mb-6 text-sm">Parece que nadie ha subido el grupo de WhatsApp para esta comisión.</p>
          <Button variant="primary" onClick={onAddClick} className="text-xs bg-itec-blue hover:bg-itec-blue-skye border-none">
            ¡Crealo y aportalo vos mismo!
          </Button>
        </div>
      )}
    </div>
  );
};
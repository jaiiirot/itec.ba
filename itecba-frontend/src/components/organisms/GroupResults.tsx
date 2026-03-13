import React from 'react';
import { Button } from '../atoms/Button';
import { GroupCard } from '../molecules/GroupCard'; // 🔴 IMPORTAMOS LA MOLÉCULA
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
            // 🔴 SOPORTE MONGODB: Usamos id o _id para la key, y renderizamos la molécula limpia
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <GroupCard key={g.id || (g as any)._id} group={g} />
          ))}
        </div>
      ) : (
        <div className="text-center bg-itec-surface border border-itec-gray rounded-xl p-10 shadow-lg">
          <span className="text-4xl block mb-3 opacity-50">👥</span>
          <p className="text-gray-300 font-bold mb-2">No encontramos tu grupo</p>
          <p className="text-gray-500 mb-6 text-sm">Parece que nadie ha subido el grupo de WhatsApp para esta comisión o materia.</p>
          <Button variant="primary" onClick={onAddClick} className="text-xs bg-itec-blue hover:bg-itec-blue-skye border-none">
            ¡Crealo y aportalo vos mismo!
          </Button>
        </div>
      )}
    </div>
  );
};
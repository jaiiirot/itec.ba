import React from 'react';
import { GroupCard } from '../molecules/GroupCard';
import { EmptyGroupState } from '../molecules/EmptyGroupState';
import type { GroupData } from '../../services/groupsService';

interface Props {
  results: GroupData[];
  onClear: () => void;
  onAddClick: () => void;
}

export const GroupResults: React.FC<Props> = ({ results, onClear, onAddClick }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 px-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1.5 h-6 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            <h3 className="text-xl font-bold text-white tracking-tight">Resultados de la Búsqueda</h3>
          </div>
          <p className="text-xs font-medium text-gray-400 ml-5 uppercase tracking-widest">
            Encontramos <span className="text-green-400">{results.length}</span> comunidade{results.length === 1 ? '' : 's'}
          </p>
        </div>

        <button 
          onClick={onClear} 
          className="cursor-pointer text-xs font-bold text-gray-400 hover:text-white bg-itec-bg hover:bg-itec-surface px-5 py-2.5 rounded-xl transition-all border border-itec-gray self-start md:self-auto shadow-sm active:scale-95"
        >
          ← Volver al Panel
        </button>
      </div>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((g) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <GroupCard key={g.id || (g as any)._id} group={g} />
          ))}
        </div>
      ) : (
        <EmptyGroupState onAddClick={onAddClick} />
      )}
    </div>
  );
};
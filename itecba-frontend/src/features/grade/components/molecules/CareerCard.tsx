import React from 'react';

export interface CareerOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  border: string;
  shadow: string;
}

interface Props {
  career: CareerOption;
  isAvailable: boolean;
  onClick: (id: string) => void;
}

export const CareerCard: React.FC<Props> = ({ career, isAvailable, onClick }) => {
  return (
    <div 
      onClick={() => isAvailable && onClick(career.id)}
      className={`bg-itec-surface border rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 group
        ${isAvailable 
          ? `border-itec-gray cursor-pointer ${career.border} hover:shadow-2xl ${career.shadow} hover:-translate-y-2` 
          : 'border-itec-gray/50 cursor-not-allowed opacity-60 hover:opacity-80 grayscale'}`}
    >
      <div className={`text-5xl mb-6 transition-transform ${isAvailable ? 'group-hover:scale-110' : ''} ${career.color} drop-shadow-lg`}>
        {career.icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2 leading-tight">{career.name}</h3>
      
      {isAvailable ? (
        <span className="mt-2 bg-green-500/10 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/20 shadow-sm">
          MAPA DISPONIBLE
        </span>
      ) : (
        <span className="mt-2 bg-itec-bg text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full border border-itec-gray uppercase tracking-widest">
          Próximamente
        </span>
      )}
    </div>
  );
};
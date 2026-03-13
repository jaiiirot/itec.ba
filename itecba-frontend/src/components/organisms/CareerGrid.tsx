import React from 'react';
import { CareerCard, type CareerOption } from '../molecules/CareerCard';
import { PLANES_DB } from '../../data/correlativas';

const CAREER_CARDS: CareerOption[] = [
  { id: 'sistemas', name: 'Sistemas de Información', icon: '💻', color: 'text-blue-400', border: 'hover:border-blue-500', shadow: 'hover:shadow-blue-500/20' },
  { id: 'electrica', name: 'Ingeniería Eléctrica', icon: '⚡', color: 'text-amber-400', border: 'hover:border-amber-500', shadow: 'hover:shadow-amber-500/20' },
  { id: 'industrial', name: 'Ingeniería Industrial', icon: '⚙️', color: 'text-yellow-400', border: 'hover:border-yellow-500', shadow: 'hover:shadow-yellow-500/20' },
  { id: 'electronica', name: 'Ingeniería Electrónica', icon: '🔌', color: 'text-red-400', border: 'hover:border-red-500', shadow: 'hover:shadow-red-500/20' },
  { id: 'civil', name: 'Ingeniería Civil', icon: '🏗️', color: 'text-orange-400', border: 'hover:border-orange-500', shadow: 'hover:shadow-orange-500/20' },
  { id: 'mecanica', name: 'Ingeniería Mecánica', icon: '🔧', color: 'text-gray-400', border: 'hover:border-gray-500', shadow: 'hover:shadow-gray-500/20' },
  { id: 'quimica', name: 'Ingeniería Química', icon: '🧪', color: 'text-purple-400', border: 'hover:border-purple-500', shadow: 'hover:shadow-purple-500/20' },
];

interface Props {
  onSelect: (id: string) => void;
}

export const CareerGrid: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500 pb-10">
      {CAREER_CARDS.map(career => {
        const isAvailable = !!PLANES_DB[career.id];
        return (
          <CareerCard 
            key={career.id} 
            career={career} 
            isAvailable={isAvailable} 
            onClick={onSelect} 
          />
        );
      })}
    </div>
  );
};
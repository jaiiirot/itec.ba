import React from 'react';
import { Button } from '../atoms/Button';

interface VideoDetailsProps {
  title: string;
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({ title }) => {
  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold text-itec-text mb-3">{title}</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-itec-gray pb-4">
        {/* Info del Canal */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full overflow-hidden border border-gray-600 flex items-center justify-center">
             <span className="text-xs">I</span>
          </div>
          <div>
            <h3 className="font-bold text-itec-text text-sm">✳️TEC UTN BA</h3>
            <p className="text-xs text-gray-400">Comunidad</p>
          </div>
          <Button variant="secondary" className="ml-2 py-1.5 px-3 text-sm rounded-full">
            Suscribirme
          </Button>
        </div>
        
        {/* Botones de acción (simulados) */}
        <div className="flex items-center gap-2">
          <div className="bg-itec-surface rounded-full flex overflow-hidden border border-itec-gray">
            <button className="px-4 py-2 text-sm hover:bg-gray-700 transition flex items-center gap-2 border-r border-itec-gray">
              👍 Me gusta
            </button>
            <button className="px-4 py-2 text-sm hover:bg-gray-700 transition">
              👎
            </button>
          </div>
          <button className="bg-itec-surface border border-itec-gray rounded-full px-4 py-2 text-sm hover:bg-gray-700 transition flex items-center gap-2">
            🔗 Compartir
          </button>
        </div>
      </div>
    </div>
  );
};
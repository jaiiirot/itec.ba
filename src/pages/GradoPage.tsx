import React, { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { CareerGraph } from '../components/organisms/CareerGraph';
import { PLANES_DB } from '../data/correlativas';

const CAREER_CARDS = [
  { id: 'sistemas', name: 'Sistemas de Información', icon: '💻', color: 'text-blue-400', border: 'hover:border-blue-500', shadow: 'hover:shadow-blue-500/20' },
  { id: 'electrica', name: 'Ingeniería Eléctrica', icon: '⚡', color: 'text-amber-400', border: 'hover:border-amber-500', shadow: 'hover:shadow-amber-500/20' },
  { id: 'industrial', name: 'Ingeniería Industrial', icon: '⚙️', color: 'text-yellow-400', border: 'hover:border-yellow-500', shadow: 'hover:shadow-yellow-500/20' },
  { id: 'electronica', name: 'Ingeniería Electrónica', icon: '🔌', color: 'text-red-400', border: 'hover:border-red-500', shadow: 'hover:shadow-red-500/20' },
  { id: 'civil', name: 'Ingeniería Civil', icon: '🏗️', color: 'text-orange-400', border: 'hover:border-orange-500', shadow: 'hover:shadow-orange-500/20' },
  { id: 'mecanica', name: 'Ingeniería Mecánica', icon: '🔧', color: 'text-gray-400', border: 'hover:border-gray-500', shadow: 'hover:shadow-gray-500/20' },
  { id: 'quimica', name: 'Ingeniería Química', icon: '🧪', color: 'text-purple-400', border: 'hover:border-purple-500', shadow: 'hover:shadow-purple-500/20' },
];

export const GradoPage: React.FC = () => {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    // Verificamos si la carrera existe en la base de datos de correlativas
    if (!PLANES_DB[id]) {
      alert(`El mapa interactivo para ${id.toUpperCase()} estará disponible próximamente.`);
      return;
    }
    setSelectedCareer(id);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-100px)] flex flex-col max-w-full mx-auto w-full relative z-10 px-2">
        
        {/* ENCABEZADO Y BOTÓN DE RETROCESO */}
        <div className="flex justify-between items-end mb-6 shrink-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Planes de Estudio</h1>
            <p className="text-gray-400 text-sm">Explora el mapa de materias y correlatividades interactivas.</p>
          </div>
          
          {selectedCareer && (
            <button 
              onClick={() => setSelectedCareer(null)}
              className="bg-[#111] border border-itec-gray hover:bg-white hover:text-black text-gray-300 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver a Carreras
            </button>
          )}
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex-1 w-full relative">
          
          {/* MODO SELECCIÓN */}
          {!selectedCareer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-500">
              {CAREER_CARDS.map(career => {
                const isAvailable = !!PLANES_DB[career.id];
                
                return (
                  <div 
                    key={career.id} onClick={() => handleSelect(career.id)}
                    className={`bg-itec-surface border border-itec-gray rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${career.border} hover:shadow-2xl ${career.shadow} hover:-translate-y-2`}
                  >
                    <div className={`text-5xl mb-6 group-hover:scale-110 transition-transform ${career.color} drop-shadow-lg`}>{career.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{career.name}</h3>
                    
                    {isAvailable ? (
                      <span className="mt-2 bg-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/30">
                        MAPA 100% FUNCIONAL
                      </span>
                    ) : (
                      <span className="mt-2 text-xs text-gray-500 font-medium uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                        Próximamente
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* MODO MAPA INTERACTIVO */}
          {selectedCareer && PLANES_DB[selectedCareer] && (
            <div className="w-full h-full animate-in fade-in duration-700">
              <CareerGraph planData={PLANES_DB[selectedCareer]} />
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};
import React, { useState, Suspense } from 'react';
import { Icons } from '@/components/atoms/Icons';

const AddDateModal = React.lazy(() => import('./AddDateModal').then(m => ({ default: m.AddDateModal })));

export interface ImportantDate {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface Props {
  isAdmin: boolean;
}

export const ImportantDatesWidget: React.FC<Props> = ({ isAdmin }) => {
  const [dates, setDates] = useState<ImportantDate[]>([
    { id: '1', title: 'Inscripción a Cursada', date: '15 al 20 de Marzo', description: 'A través del sistema SIGA.' },
    { id: '2', title: 'Inicio 1er Cuatrimestre', date: '25 de Marzo', description: 'Comienzo oficial de clases.' },
    { id: '3', title: 'Exámenes Finales', date: '10 de Julio', description: 'Turno de julio. Anotarse 48hs antes.' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="bg-itec-surface border border-itec-gray rounded-3xl p-6 shadow-2xl h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center text-sm">📅</span> 
          Calendario
        </h2>
        {isAdmin && (
           <button 
             onClick={() => setIsModalOpen(true)}
             className="w-8 h-8 flex items-center justify-center rounded-full bg-itec-bg border border-itec-gray text-gray-400 hover:text-white hover:border-orange-500 transition-colors"
             title="Agregar Fecha"
             >
               <Icons type="plus" className="w-4 h-4" />
           </button>
        )}
      </div>

      {dates.length > 0 ? (
        // 🟢 NUEVO: Diseño de Línea de Tiempo (Timeline)
        <div className="relative border-l border-itec-gray/50 ml-3 space-y-8 pb-4">
          {dates.map((item, index) => (
            <div key={item.id} className="relative pl-6 group">
              {/* Punto de la línea de tiempo */}
              <span className={`absolute -left-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-itec-surface transition-colors ${index === 0 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'bg-gray-500 group-hover:bg-orange-400'}`}></span>
              
              <div>
                <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mb-1">{item.date}</p>
                <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">{item.title}</h3>
                <p className="text-[12px] text-gray-400 leading-relaxed bg-itec-bg/50 p-2.5 rounded-lg border border-itec-gray/30">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-itec-bg border border-itec-gray border-dashed rounded-xl">
          <p className="text-gray-500 text-sm">No hay fechas próximas.</p>
        </div>
      )}

      {isAdmin && isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />}>
          <AddDateModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onAdd={(newDate: ImportantDate) => setDates(prev => [...prev, newDate])}
          />
        </Suspense>
      )}
    </section>
  );
};
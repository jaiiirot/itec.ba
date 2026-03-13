import React, { useState, Suspense } from 'react';
import { Icons } from '../atoms/Icons';

// 🔴 LAZY LOADING DEL MODAL
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
  // TODO: Conectar esto a tu servicio de Base de Datos (ej: datesService.getDates())
  const [dates, setDates] = useState<ImportantDate[]>([
    { id: '1', title: 'Inscripción a Cursada', date: '15 al 20 de Marzo', description: 'A través del sistema SIGA.' },
    { id: '2', title: 'Inicio 1er Cuatrimestre', date: '25 de Marzo', description: 'Comienzo oficial de clases para todas las carreras.' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mt-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6 border-b border-itec-gray pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-orange-500">📅</span> Calendario Académico
        </h2>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-xs bg-itec-surface border border-itec-gray hover:bg-itec-gray text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <Icons type="plus" className="w-3 h-3" /> Agregar Fecha
          </button>
        )}
      </div>

      {dates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dates.map((item) => (
            <div key={item.id} className="bg-itec-surface border border-itec-gray rounded-xl p-4 shadow-lg flex gap-4 items-start group hover:border-orange-500/50 transition-colors">
              
              {/* Icono de Calendario visual */}
              <div className="flex flex-col items-center justify-center w-12 shrink-0 bg-itec-bg border border-itec-gray rounded-lg overflow-hidden text-center shadow-sm">
                <div className="bg-orange-600 text-white text-[9px] font-bold uppercase tracking-widest w-full py-0.5">FCA</div>
                <div className="py-1 text-gray-300">
                  <Icons type="clock" className="w-5 h-5 mx-auto opacity-70" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1 leading-snug">{item.title}</h3>
                <p className="text-xs text-orange-400 font-medium mb-1.5">{item.date}</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-itec-surface border border-itec-gray border-dashed rounded-xl">
          <p className="text-gray-500 text-sm">No hay fechas importantes próximas.</p>
        </div>
      )}

      {/* Renderizado Perezoso del Modal */}
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
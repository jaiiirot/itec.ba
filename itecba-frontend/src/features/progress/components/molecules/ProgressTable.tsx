// src/features/progress/components/molecules/ProgressTable.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@/components/atoms/Icons'; 
import type { CalculatedSubject } from '../../hooks/useProgress';

interface Props {
  level: number;
  subjects: CalculatedSubject[];
  onUpdateStatus: (id: string, status: 'aprobada' | 'regular' | 'disponible') => void;
}

export const ProgressTable: React.FC<Props> = ({ level, subjects, onUpdateStatus }) => {
  if (subjects.length === 0) return null;

  const statusStyles = {
    aprobada: { badge: 'bg-green-500/10 text-green-500 border border-green-500/20', text: 'Aprobada' },
    regular: { badge: 'bg-fuchsia-500/10 text-fuchsia-500 border border-fuchsia-500/20', text: 'Regularizada' },
    disponible: { badge: 'bg-itec-blue/10 text-itec-blue-skye border border-itec-blue/20', text: 'Disponible' },
    bloqueada: { badge: 'bg-gray-500/10 text-gray-500 border border-gray-500/20', text: 'Bloqueada' },
  };

  return (
    <div className="mb-10">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-itec-blue to-purple-600 text-white flex items-center justify-center font-black shadow-lg shrink-0">
          {level}
        </div>
        <h2 className="text-2xl font-bold text-white whitespace-nowrap">Nivel {level}</h2>
        <div className="flex-1 h-[1px] bg-itec-gray ml-4 hidden sm:block"></div>
      </div>

      <div className="bg-itec-surface border border-itec-gray rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-itec-bg/50 border-b border-itec-gray text-xs uppercase tracking-wider text-gray-400">
                <th className="p-4 font-semibold w-16 text-center">Cod</th>
                <th className="p-4 font-semibold">Materia</th>
                <th className="p-4 font-semibold text-center w-36">Estado</th>
                <th className="p-4 font-semibold text-center w-64">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-itec-gray">
              {subjects.map((sub) => {
                const style = statusStyles[sub.status];
                const isLocked = sub.status === 'bloqueada';

                return (
                  <tr key={sub.id} className={`transition-colors hover:bg-white/[0.02] ${isLocked ? 'opacity-50' : ''}`}>
                    <td className="p-4 text-xs font-mono font-bold text-gray-500 text-center">{sub.code}</td>
                    <td className="p-4">
                      <p className={`font-bold ${isLocked ? 'text-gray-400' : 'text-white'}`}>{sub.name}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>
                        {style.text}
                      </span>
                    </td>
                    
                    <td className="p-4 flex gap-2 justify-center items-center">
                      {isLocked ? (
                        <span className="text-xl opacity-50" title="Correlativas pendientes">🔒</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          
                          {/* Botón interactivo para cambiar estado */}
                          {sub.status !== 'aprobada' && (
                             <button 
                               onClick={() => onUpdateStatus(sub.id, 'aprobada')}
                               className="px-2 py-1 rounded bg-green-500/10 hover:bg-green-500/20 text-green-500 text-xs font-bold transition-colors border border-transparent hover:border-green-500/30"
                             >
                               Aprobar
                             </button>
                          )}
                          
                          {sub.status === 'disponible' && (
                             <button 
                               onClick={() => onUpdateStatus(sub.id, 'regular')}
                               className="px-2 py-1 rounded bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-500 text-xs font-bold transition-colors border border-transparent hover:border-fuchsia-500/30"
                             >
                               Regularizar
                             </button>
                          )}

                          {/* Botón Deshacer */}
                          {(sub.status === 'aprobada' || sub.status === 'regular') && (
                             <button 
                               onClick={() => onUpdateStatus(sub.id, 'disponible')}
                               className="px-2 py-1 rounded bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 text-xs font-bold transition-colors"
                               title="Deshacer cambio"
                             >
                               ↺
                             </button>
                          )}

                          {/* Botón de Vinculación a Cursos de ITEC */}
                          {(sub.status === 'regular' || sub.status === 'disponible') && (
                            <Link 
                              to={`/cursos?search=${encodeURIComponent(sub.name)}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-itec-bg hover:bg-itec-blue text-itec-blue-skye hover:text-white border border-itec-blue/30 transition-all rounded-lg text-xs font-bold whitespace-nowrap shadow-[0_0_10px_rgba(56,189,248,0.1)] hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                            >
                              <div className="w-3 h-3"><Icons type="playFill" /></div>
                              Estudiar
                            </Link>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
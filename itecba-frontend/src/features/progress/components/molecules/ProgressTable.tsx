import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@/components/atoms/Icons'; // Asegúrate de tener un icono de Play o Book
import type { CalculatedSubject } from '../../hooks/useProgress';

interface Props {
  level: number;
  subjects: CalculatedSubject[];
}

export const ProgressTable: React.FC<Props> = ({ level, subjects }) => {
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-itec-blue to-purple-600 text-white flex items-center justify-center font-black shadow-lg">
          {level}
        </div>
        <h2 className="text-2xl font-bold text-white">Nivel {level}</h2>
        <div className="flex-1 h-[1px] bg-itec-gray ml-4 hidden sm:block"></div>
      </div>

      <div className="bg-itec-surface border border-itec-gray rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-itec-bg/50 border-b border-itec-gray text-xs uppercase tracking-wider text-gray-400">
                <th className="p-4 font-semibold w-12 text-center">Cod</th>
                <th className="p-4 font-semibold">Materia</th>
                <th className="p-4 font-semibold text-center">Estado</th>
                <th className="p-4 font-semibold text-center w-24">Nota</th>
                <th className="p-4 font-semibold text-center w-32">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-itec-gray">
              {subjects.map((sub) => {
                const style = statusStyles[sub.status];
                const isLocked = sub.status === 'bloqueada';

                return (
                  <tr key={sub.id} className={`transition-colors hover:bg-white/[0.02] ${isLocked ? 'opacity-50 grayscale' : ''}`}>
                    <td className="p-4 text-xs font-mono font-bold text-gray-500 text-center">{sub.code}</td>
                    
                    <td className="p-4">
                      <p className={`font-bold ${isLocked ? 'text-gray-400' : 'text-white'}`}>{sub.name}</p>
                    </td>
                    
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>
                        {style.text}
                      </span>
                    </td>
                    
                    <td className="p-4 text-center">
                      {sub.status === 'aprobada' ? (
                        <span className="font-black text-green-400">{sub.grade || '-'}</span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    
                    <td className="p-4 text-center">
                      {/* Si está regular o cursando, le damos un botón directo a los cursos para preparar el final */}
                      {(sub.status === 'regular' || sub.status === 'disponible') ? (
                        <Link 
                          to={`/cursos?search=${encodeURIComponent(sub.name)}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-itec-bg hover:bg-itec-blue/20 text-itec-blue-skye hover:text-white border border-itec-gray hover:border-itec-blue transition-all rounded-lg text-xs font-bold whitespace-nowrap"
                        >
                          <div className="w-3 h-3"><Icons type="playFill" /></div>
                          Estudiar
                        </Link>
                      ) : isLocked ? (
                        <span className="text-xl">🔒</span>
                      ) : (
                        <span className="text-xl">✅</span>
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
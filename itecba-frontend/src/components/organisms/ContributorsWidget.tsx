import React, { useState, useEffect } from 'react';
import { Icons } from '../atoms/Icons';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { User } from '../../context/AuthContext';

export const ContributorsWidget: React.FC = () => {
  // 🔴 1. CORRECCIÓN: El estado DEBE inicializarse con un array vacío []
  const [team, setTeam] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const snap = await getDocs(q);
        const adminsData = snap.docs.map(doc => doc.data() as User);
        
        setTeam(adminsData || []); // Nos aseguramos de que nunca guarde "undefined"
      } catch (error) {
        console.error("Error cargando la comunidad:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 mb-10">
      <div className="bg-itec-surface border border-itec-gray rounded-3xl p-6 md:p-8 shadow-xl">
        <h3 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center justify-center md:justify-start gap-2">
          <span className="text-red-500">❤️</span> Comunidad ITEC
        </h3>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start pl-2">
          {isLoading ? (
             <div className="w-8 h-8 border-2 border-itec-gray border-t-red-500 rounded-full animate-spin ml-4"></div>
          ) : (
            <>
              {/* 🔴 2. BLINDAJE: Usamos team?.map (el signo de interrogación previene el crash si team no existe) */}
              {team?.map((user, index) => {
                
                // 🔴 3. BLINDAJE EXTRA: Si un admin en Firebase no tiene nombre, no queremos que el ".split()" rompa la página.
                const displayName = user?.name || 'Admin';
                const initial = displayName.charAt(0).toUpperCase();
                const firstName = displayName.split(' ')[0];

                return (
                  <div 
                    key={index}
                    className="group relative -ml-3 transition-transform hover:scale-110 hover:z-20 cursor-default"
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-itec-surface bg-itec-sidebar overflow-hidden shadow-md flex items-center justify-center text-xl font-bold text-gray-500">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        initial
                      )}
                    </div>
                    
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-itec-bg border border-itec-gray text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-30 shadow-xl pointer-events-none">
                      <span className="font-bold block text-center text-xs">{firstName}</span>
                      <span className="text-red-400">Equipo ITEC</span>
                    </div>
                  </div>
                );
              })}

              {/* EL BOTÓN "+" */}
              <a 
                href="https://github.com/jaiiirot/itec.ba" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative -ml-3 transition-transform hover:scale-110 hover:z-20"
              >
                 <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-itec-surface bg-itec-bg border-dashed hover:border-solid hover:border-red-500 flex flex-col items-center justify-center text-gray-500 hover:text-red-400 transition-colors shadow-md z-10">
                    <Icons type="plus" className="w-5 h-5 mb-0.5" />
                 </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-itec-bg border border-itec-gray text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-30 shadow-xl pointer-events-none font-bold">
                    Sumate
                  </div>
              </a>
            </>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-itec-gray/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            El código de ITEC es <strong className="text-white">100% open-source</strong>. Sumá código, reportá bugs o danos una estrella en GitHub.
          </p>
          <a href="https://github.com/jaiiirot/itec.ba" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-full text-sm font-bold transition-all shadow-lg shrink-0">
            <Icons type="github" className="w-5 h-5" /> Ver Repositorio
          </a>
        </div>
      </div>
    </section>
  );
};
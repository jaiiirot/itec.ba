import React, { useState, useEffect } from 'react';
import { Icons } from '../atoms/Icons';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { User } from '../../context/AuthContext';

export const ContributorsWidget: React.FC = () => {
  const [team, setTeam] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const snap = await getDocs(q);
        const adminsData = snap.docs.map(doc => doc.data() as User);
        
        // 🔴 Se eliminó el "sort" forzado. Ahora todos son iguales 
        // y salen en el orden natural de la base de datos.
        setTeam(adminsData);
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
           Comunidad ITEC
        </h3>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start pl-2">
          {isLoading ? (
             <div className="w-8 h-8 border-2 border-itec-gray border-t-red-500 rounded-full animate-spin ml-4"></div>
          ) : (
            <>
              {/* Lista dinámica de Admins */}
              {team.map((user, index) => (
                <div 
                  key={index}
                  className="group relative -ml-3 transition-transform hover:scale-110 hover:z-20 cursor-default"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-itec-surface bg-itec-sidebar overflow-hidden shadow-md flex items-center justify-center text-xl font-bold text-gray-500">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-itec-bg border border-itec-gray text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-30 shadow-xl pointer-events-none">
                    <span className="font-bold block text-center text-xs">{user.name.split(' ')[0]}</span>
                    <span className="text-red-400">Equipo ITEC</span>
                  </div>
                </div>
              ))}

              {/* 🔴 VUELVE EL BOTÓN "+" */}
              <a 
                href="https://www.instagram.com/itecba/" 
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
      </div>
    </section>
  );
};
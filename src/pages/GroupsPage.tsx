import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { Button } from '../components/atoms/Button';
import { ESPECIALIDADES_DB } from '../data/specialties';

import { useAuth } from '../context/AuthContext';
import { groupsService, type GroupData } from '../services/groupsService';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS, MATERIAS_POR_CARRERA } from '../data/groups';
import { AddGroupModal } from '../components/organisms/AddGroupModal';
import { AdminPendingGroupsModal } from '../components/organisms/AdminPendingGroupsModal';

export const GroupsPage: React.FC = () => {
  // Extraemos isAdmin directamente del AuthContext
  const { user, isAdmin } = useAuth();

  const [allGroups, setAllGroups] = useState<GroupData[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  useEffect(() => {
    setIsLoadingGroups(true);
    groupsService.getApprovedGroups()
      .then(dbGroups => {
        setAllGroups(dbGroups);
      })
      .catch(err => console.error("Error al cargar grupos:", err))
      .finally(() => setIsLoadingGroups(false));

    if (isAdmin) {
      groupsService.getPendingGroups().then(pendings => {
        setPendingCount(pendings.length);
      });
    }
  }, [isAdmin]);

  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');
  const [comision, setComision] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<GroupData[]>([]);

  const [showMateriaDropdown, setShowMateriaDropdown] = useState(false);
  const searchMateriaRef = useRef<HTMLDivElement>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const materiasSearchDisponibles = (carrera && nivel && MATERIAS_POR_CARRERA[carrera] && MATERIAS_POR_CARRERA[carrera][nivel])
    ? MATERIAS_POR_CARRERA[carrera][nivel]
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchMateriaRef.current && !searchMateriaRef.current.contains(e.target as Node)) setShowMateriaDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleClear = () => {
    setCarrera(''); setNivel(''); setMateria(''); setComision('');
    setHasSearched(false); setResults([]);
  };

  const handleSearch = () => {
    const filtered = allGroups.filter(g => {
      return (carrera === '' || g.carrera === carrera) &&
             (nivel === '' || g.nivel === nivel) &&
             (materia === '' || g.materia === materia) &&
             (comision === '' || g.comision.toLowerCase().includes(comision.toLowerCase()));
    });
    setResults(filtered);
    setHasSearched(true);
  };

  const handleSpecialtyClick = (val: string) => {
    setCarrera(val); 
    setNivel(val === 'ingreso' ? '0' : ''); 
    setMateria(''); 
    setComision('');
    setResults(allGroups.filter(g => g.carrera === val));
    setHasSearched(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-10 relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Grupos de WhatsApp</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
            Encontrá la comunidad de tu materia o comisión.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} className="text-xs bg-itec-surface border-itec-gray hover:bg-white hover:text-black">
              + Aportar nuevo grupo
            </Button>
            
            {isAdmin && (
              <Button variant="primary" onClick={() => setIsAdminModalOpen(true)} className="relative text-xs bg-itec-blue/20 text-itec-blue-skye hover:bg-itec-blue hover:text-white border-none">
                Ver solicitudes
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-itec-red-skye opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-itec-red-skye text-white text-[10px] items-center justify-center font-bold">{pendingCount}</span>
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* CONTENEDOR DE FILTROS EN CASCADA */}
        <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Carrera</label>
              <Select fullWidth options={CARRERAS_OPTIONS} value={carrera} onChange={e => { setCarrera(e.target.value); setNivel(e.target.value === 'ingreso' ? '0' : ''); setMateria(''); }} className="text-sm py-2 bg-itec-bg border-itec-gray" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nivel</label>
              <Select fullWidth disabled={!carrera} options={NIVEL_OPTIONS} value={nivel} onChange={e => { setNivel(e.target.value); setMateria(''); }} className="text-sm py-2 bg-itec-bg border-itec-gray disabled:opacity-50" />
            </div>
            
            <div ref={searchMateriaRef} className="relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Materia</label>
              <Input 
                fullWidth 
                disabled={!carrera || !nivel}
                placeholder={(!carrera || !nivel) ? "Seleccioná Carrera y Nivel..." : "Ej: Análisis..."} 
                value={materia} 
                onChange={e => { setMateria(e.target.value); setShowMateriaDropdown(true); }} 
                onFocus={() => setShowMateriaDropdown(true)} 
                className="text-sm py-2 bg-itec-bg border-itec-gray disabled:opacity-50" 
              />
              {showMateriaDropdown && materiasSearchDisponibles.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-itec-sidebar border border-itec-gray rounded-lg shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                  {materiasSearchDisponibles.filter(m => m.toLowerCase().includes(materia.toLowerCase())).map(m => (
                    <li key={m} onClick={() => { setMateria(m); setShowMateriaDropdown(false); }} className="px-3 py-2 text-sm text-gray-300 hover:bg-itec-blue hover:text-white cursor-pointer border-b border-itec-gray/50 last:border-0">
                      {m}
                    </li>
                  ))}
                  {materiasSearchDisponibles.filter(m => m.toLowerCase().includes(materia.toLowerCase())).length === 0 && (
                     <li className="px-3 py-2 text-sm text-gray-500 text-center">No hay materias</li>
                  )}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Comisión</label>
              <Input fullWidth className="text-sm py-2 bg-itec-bg border-itec-gray uppercase" placeholder="Ej: K1043" value={comision} onChange={e => setComision(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>
          </div>
          <div className="flex justify-center gap-3 border-t border-itec-gray pt-5">
            <Button variant="secondary" onClick={handleClear} className="text-sm py-2 bg-itec-red/10 text-itec-red-skye border-itec-red/30 hover:bg-itec-red hover:text-white transition-colors">Limpiar</Button>
            <Button variant="primary" onClick={handleSearch} disabled={isLoadingGroups} className="text-sm py-2 bg-itec-blue text-white hover:bg-itec-blue-skye border-none shadow-lg disabled:opacity-50">
              {isLoadingGroups ? 'Cargando...' : 'Buscar'}
            </Button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL: LOADING / RESULTADOS / ESPECIALIDADES */}
        {isLoadingGroups ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Sincronizando comunidades...</p>
          </div>
        ) : hasSearched ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Resultados ({results.length})</h3>
              <button onClick={handleClear} className="text-xs text-itec-blue-skye hover:underline">Volver a Especialidades</button>
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((g) => (
                  <div key={g.id} className="bg-itec-surface border border-itec-gray rounded-xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-itec-blue/50 transition-colors">
                    <div className="absolute -right-6 top-3 bg-itec-sidebar border border-itec-gray text-[9px] font-bold text-gray-400 px-6 py-1 rotate-45">{g.tipo}</div>
                    <div>
                      <span className="text-[10px] font-bold text-itec-blue-skye uppercase tracking-widest block mb-1">Nivel {g.nivel}</span>
                      <h4 className="font-bold text-white text-sm mb-1 pr-4">{g.materia}</h4>
                      <p className="text-xs text-gray-400">Comisión: <strong className="text-white text-[13px]">{g.comision}</strong></p>
                    </div>
                    <a href={g.link} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full bg-itec-bg hover:bg-itec-blue border border-itec-gray hover:border-itec-blue-skye text-gray-300 hover:text-white py-2 rounded-lg text-xs font-bold transition-all">
                      Unirme al Grupo
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-itec-surface border border-itec-gray rounded-xl p-10">
                <p className="text-gray-400 mb-4">No encontramos el grupo de WhatsApp que buscas.</p>
                <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="text-xs bg-itec-blue hover:bg-itec-blue-skye border-none">¡Aportalo vos mismo!</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Explorar por Especialidad</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ESPECIALIDADES_DB.map((esp, i) => (
                <div key={i} onClick={() => handleSpecialtyClick(esp.carreraValue)} className={`group bg-itec-surface border ${esp.colorClass} rounded-xl p-3 cursor-pointer flex items-center justify-between hover:bg-itec-bg transition-all hover:-translate-y-0.5`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-itec-sidebar border border-itec-gray flex items-center justify-center text-sm font-bold text-white group-hover:bg-white/5">{esp.code}</div>
                    <span className="font-bold text-[11px] text-gray-400 tracking-wide">{esp.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddGroupModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        isAdmin={isAdmin} 
        userEmail={user?.email || 'invitado'} 
        existingGroups={allGroups}
        onGroupAdded={(newGroup, isDirectPublish) => {
          if (isDirectPublish) setAllGroups(prev => [...prev, newGroup]);
          else if (isAdmin) setPendingCount(prev => prev + 1);
        }}
      />

      <AdminPendingGroupsModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onGroupApproved={(group) => {
          setAllGroups(prev => [...prev, group]);
          setPendingCount(prev => prev - 1);
        }}
      />
    </DashboardLayout>
  );
};
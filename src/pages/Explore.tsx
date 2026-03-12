import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { Button } from '../components/atoms/Button';

import { useAuth } from '../context/AuthContext';
import { resourcesService } from '../services/resourcesService';
import type { ResourceData } from '../services/resourcesService';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS, MATERIAS_POR_CARRERA } from '../data/groups'; 

import { AddResourceModal } from '../components/organisms/AddResourceModal';
import { AdminPendingResourcesModal } from '../components/organisms/AdminPendingResourcesModal';
import { Icons } from '../components/atoms/Icons';

export const Explore: React.FC = () => {
  const { isAdmin } = useAuth();

  const [allResources, setAllResources] = useState<ResourceData[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');

  const [showMateriaDropdown, setShowMateriaDropdown] = useState(false);
  const searchMateriaRef = useRef<HTMLDivElement>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    resourcesService.getApprovedResources()
      .then(res => {
        const sorted = res.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setAllResources(sorted);
      })
      .catch(err => console.error("Error al traer recursos:", err))
      .finally(() => setIsLoading(false));

    if (isAdmin) {
      resourcesService.getPendingResources().then(res => setPendingCount(res.length));
    }
  }, [isAdmin]);

  // Juntamos TODAS las materias de la UTN si el usuario no seleccionó carrera
  const todasLasMaterias = useMemo(() => {
    const materias = new Set<string>();
    Object.values(MATERIAS_POR_CARRERA).forEach(niveles => {
      Object.values(niveles).forEach(mats => {
        mats.forEach(m => materias.add(m));
      });
    });
    return Array.from(materias);
  }, []);

  const materiasSearchDisponibles = (carrera && nivel && MATERIAS_POR_CARRERA[carrera] && MATERIAS_POR_CARRERA[carrera][nivel])
    ? MATERIAS_POR_CARRERA[carrera][nivel] : todasLasMaterias;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { 
      if (searchMateriaRef.current && !searchMateriaRef.current.contains(e.target as Node)) {
        setShowMateriaDropdown(false); 
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleClear = () => {
    setSearchQuery(''); setCarrera(''); setNivel(''); setMateria('');
  };

  const filteredResources = useMemo(() => {
    return allResources.filter(r => {
      const matchText = searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCarrera = carrera === '' || r.carrera === carrera;
      const matchNivel = nivel === '' || r.nivel === nivel;
      // Ahora la materia busca directo sobre lo que el usuario tipea
      const matchMateria = materia === '' || r.materia.toLowerCase().includes(materia.toLowerCase());
      return matchText && matchCarrera && matchNivel && matchMateria;
    });
  }, [allResources, searchQuery, carrera, nivel, materia]);

  const getFormatIcon = (format: string) => {
    if (format === 'PDF') return <span className="text-red-400 font-bold">PDF</span>;
    if (format === 'Drive') return <span className="text-green-400 font-bold">DRV</span>;
    return <span className="text-blue-400 font-bold">WEB</span>;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10 relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Explorar Aportes</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
            Resúmenes, parciales y guías compartidas por la comunidad de ITEC.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} className="text-xs bg-orange-600/20 text-orange-500 border-none hover:bg-orange-600 hover:text-white transition-all">
              + Aportar Archivo (+1 Punto)
            </Button>
            {isAdmin && (
              <Button variant="primary" onClick={() => setIsAdminModalOpen(true)} className="relative text-xs bg-itec-surface border-itec-gray hover:bg-itec-gray transition-all shadow-lg">
                Moderar Archivos
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 text-white text-[10px] items-center justify-center font-bold">{pendingCount}</span>
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Buscar por Título</label>
              <Input fullWidth placeholder="Ej: Resumen Primer Parcial..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="text-sm py-2 bg-itec-bg border-itec-gray" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Carrera</label>
              <Select fullWidth options={CARRERAS_OPTIONS} value={carrera} onChange={e => { setCarrera(e.target.value); setNivel(e.target.value === 'ingreso' ? '0' : ''); }} className="text-sm py-2 bg-itec-bg border-itec-gray" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nivel</label>
              <Select fullWidth disabled={!carrera} options={NIVEL_OPTIONS} value={nivel} onChange={e => { setNivel(e.target.value); }} className="text-sm py-2 bg-itec-bg border-itec-gray disabled:opacity-50" />
            </div>
            <div ref={searchMateriaRef} className="relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Materia (Libre)</label>
              {/* INPUT LIBERADO (No está disabled) */}
              <Input 
                fullWidth 
                placeholder="Ej: Análisis Matemático..." 
                value={materia} 
                onChange={e => { setMateria(e.target.value); setShowMateriaDropdown(true); }} 
                onFocus={() => setShowMateriaDropdown(true)} 
                className="text-sm py-2 bg-itec-bg border-itec-gray focus:border-orange-500" 
              />
              {showMateriaDropdown && materiasSearchDisponibles.length > 0 && (
                <ul className="absolute z-50 w-full mt-1 bg-itec-sidebar border border-itec-gray rounded-lg shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                  {materiasSearchDisponibles.filter(m => m.toLowerCase().includes(materia.toLowerCase())).map(m => (
                    <li key={m} onClick={() => { setMateria(m); setShowMateriaDropdown(false); }} className="px-3 py-2 text-sm text-gray-300 hover:bg-orange-500 hover:text-white cursor-pointer border-b border-itec-gray/50">{m}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {(searchQuery || carrera || nivel || materia) && (
             <div className="flex justify-end mt-4 pt-4 border-t border-itec-gray">
               <Button variant="secondary" onClick={handleClear} className="text-xs py-1.5 bg-itec-red/10 text-itec-red-skye border-itec-red/30 hover:bg-itec-red hover:text-white transition-colors">
                 Limpiar Filtros
               </Button>
             </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-itec-gray border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4 text-sm font-medium">Cargando aportes de la comunidad...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Mostrando {filteredResources.length} Aporte{filteredResources.length !== 1 ? 's' : ''}
              </h3>
            </div>

            {filteredResources.length > 0 ? (
              <div className="bg-itec-surface border border-itec-gray rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-itec-bg border-b border-itec-gray">
                      <tr>
                        <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Archivo / Título</th>
                        <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Materia & Nivel</th>
                        <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                        {/* COLUMNA "SUBIDO POR" ELIMINADA */}
                        <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResources.map((res) => (
                        <tr key={res.id} className="border-b border-itec-gray/30 hover:bg-itec-gray/30 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-itec-sidebar border border-itec-gray flex items-center justify-center shrink-0 text-gray-400 group-hover:text-orange-400 transition-colors">
                                <div className="w-5 h-5"><Icons type="documentFill" /></div>
                              </div>
                              <div>
                                <p className="text-white font-bold text-sm truncate max-w-[250px] sm:max-w-sm">{res.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                                  Formato: {getFormatIcon(res.formato)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-gray-300 font-medium text-sm truncate max-w-[150px]">{res.materia}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5"><span className="capitalize text-orange-400">{res.carrera}</span> • Nivel {res.nivel}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-1 rounded-md text-xs font-bold">
                              {res.tipo}
                            </span>
                          </td>
                          {/* CELDA "SUBIDO POR" ELIMINADA */}
                          <td className="p-4 text-right pr-6">
                            <div className="flex justify-end gap-2">
                              <a 
                                href={res.link} 
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center justify-center p-2.5 bg-itec-bg hover:bg-itec-sidebar border border-itec-gray text-gray-300 hover:text-white rounded-xl transition-all"
                                title="Ver Archivo"
                              >
                                <div className="w-4 h-4"><Icons type="externalLink" /></div>
                              </a>
                              <a 
                                href={res.link} 
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-itec-bg hover:bg-orange-600 border border-itec-gray hover:border-orange-500 text-gray-300 hover:text-white py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                <div className="w-4 h-4"><Icons type="download" /></div>
                                Descargar
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center bg-itec-surface border border-itec-gray rounded-xl p-16">
                <span className="text-5xl block mb-4 opacity-50">📂</span>
                <p className="text-gray-300 text-lg font-bold mb-2">No se encontraron resultados</p>
                <p className="text-gray-500 mb-6 text-sm">No hay apuntes que coincidan con la materia o filtro aplicado.</p>
                <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="bg-orange-600 border-none hover:bg-orange-500 shadow-lg px-6">
                  ¡Sé el primero en subir un apunte! (+1 Punto)
                </Button>
              </div>
            )}
          </div>
        )}

      </div>

      <AddResourceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        isAdmin={isAdmin} 
        onResourceAdded={(newRes, isDirect) => {
          if (isDirect) setAllResources(prev => [newRes, ...prev]);
          else if (isAdmin) setPendingCount(prev => prev + 1);
        }}
      />

      <AdminPendingResourcesModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onResourceApproved={(res) => {
          setAllResources(prev => [res, ...prev]);
          setPendingCount(prev => prev - 1);
        }}
      />
    </DashboardLayout>
  );
};
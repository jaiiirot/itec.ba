import React, { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { RESOURCES_DB } from '../data/resources';
import { FileIcon } from '../components/atoms/FileIcon'; 
import { Icons } from '../components/atoms/Icons'; // <-- IMPORTAMOS EL SISTEMA DE ÍCONOS

const STORAGE_KEY_SAVED = 'itec_saved_resources';

export const Explore: React.FC = () => {
  // Estados de Filtros
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [type, setType] = useState('');
  
  // Estado de Pestañas y Guardados (Bookmarks)
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SAVED);
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en el navegador cada vez que cambia la lista de guardados
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedIds));
  }, [savedIds]);

  // Extraer valores únicos para los selects
  const specialties = Array.from(new Set(RESOURCES_DB.map(r => r.specialty))).sort();
  const types = Array.from(new Set(RESOURCES_DB.map(r => r.type))).sort();

  // Filtrar los datos
  const filteredData = useMemo(() => {
    return RESOURCES_DB.filter(res => {
      if (activeTab === 'saved' && !savedIds.includes(res.id)) return false;

      const matchSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          res.subject.toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = specialty === '' || res.specialty === specialty;
      const matchType = type === '' || res.type === type;
      
      return matchSearch && matchSpecialty && matchType;
    });
  }, [search, specialty, type, activeTab, savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSpecialty('');
    setType('');
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col pt-2 pb-10 relative">
        
        {/* HEADER SUPERIOR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Material de Estudio</h1>
          <button className="bg-itec-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg">
            <div className="w-4 h-4">
              <Icons type="uploadCloud" />
            </div>
            Aportar archivo
          </button>
        </div>

        {/* NAVEGACIÓN ESTILO PESTAÑAS (TABS) */}
        <div className="flex items-center gap-6 border-b border-itec-gray mb-4 overflow-x-auto custom-scrollbar pb-px">
          <button 
            onClick={() => setActiveTab('all')}
            className={`font-medium pb-3 px-1 whitespace-nowrap text-sm transition-colors ${activeTab === 'all' ? 'text-white border-b-2 border-itec-blue' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Todos los aportes
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`font-medium pb-3 px-1 whitespace-nowrap text-sm transition-colors flex items-center gap-2 ${activeTab === 'saved' ? 'text-white border-b-2 border-itec-blue' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Mis Guardados
            {savedIds.length > 0 && (
              <span className="bg-itec-blue/20 text-itec-blue text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {savedIds.length}
              </span>
            )}
          </button>
        </div>

        {/* BARRA DE HERRAMIENTAS Y FILTROS */}
        <div className="bg-itec-surface border border-itec-gray rounded-t-xl p-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative bg-itec-bg border border-itec-gray rounded-lg overflow-hidden flex items-center px-3 h-9 w-full md:w-64 focus-within:border-itec-blue transition-colors">
              <div className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0">
                <Icons type="search" />
              </div>
              <input 
                type="text" 
                placeholder="Buscar materia, tema..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm text-white w-full outline-none"
              />
            </div>

            <select 
              value={specialty} 
              onChange={(e) => setSpecialty(e.target.value)}
              className="bg-itec-bg border border-itec-gray text-sm text-white h-9 px-3 rounded-lg outline-none focus:border-itec-blue cursor-pointer appearance-none"
            >
              <option value="">Especialidad: Todas</option>
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="bg-itec-bg border border-itec-gray text-sm text-white h-9 px-3 rounded-lg outline-none focus:border-itec-blue cursor-pointer appearance-none"
            >
              <option value="">Tipo: Todos</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* CHIPS DE FILTROS ACTIVOS */}
        {(search || specialty || type) && (
          <div className="bg-itec-surface border-x border-b border-itec-gray px-4 py-2 flex flex-wrap items-center gap-3">
             <span className="text-xs text-gray-500 font-medium">Filtrado por:</span>
             {search && (
               <span className="bg-itec-bg border border-itec-gray text-xs text-gray-300 px-2.5 py-1 rounded flex items-center gap-2">
                 Búsqueda: {search} <button onClick={() => setSearch('')} className="hover:text-white">✕</button>
               </span>
             )}
             {specialty && (
               <span className="bg-itec-bg border border-itec-gray text-xs text-gray-300 px-2.5 py-1 rounded flex items-center gap-2">
                 Carrera: {specialty} <button onClick={() => setSpecialty('')} className="hover:text-white">✕</button>
               </span>
             )}
             {type && (
               <span className="bg-itec-bg border border-itec-gray text-xs text-gray-300 px-2.5 py-1 rounded flex items-center gap-2">
                 Tipo: {type} <button onClick={() => setType('')} className="hover:text-white">✕</button>
               </span>
             )}
             <button onClick={clearFilters} className="text-xs text-itec-red font-medium hover:underline ml-2">Limpiar filtros</button>
          </div>
        )}

        {/* TABLA COMPACTA */}
        <div className={`bg-itec-bg border border-itec-gray rounded-b-xl overflow-hidden flex-1 flex flex-col ${(search || specialty || type) ? 'border-t-0 rounded-t-none' : ''}`}>
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-itec-sidebar sticky top-0 z-10">
                <tr>
                  <th className="p-3 w-12 border-b border-itec-gray text-center"></th>
                  <th className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-itec-gray">Archivo</th>
                  <th className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-itec-gray">Materia</th>
                  <th className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-itec-gray">Especialidad</th>
                  <th className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-itec-gray">Tipo</th>
                  <th className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-itec-gray">Fecha</th>
                  <th className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-itec-gray text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => {
                  const isSaved = savedIds.includes(row.id);
                  const isZipType = ['Software', 'Código', 'TP'].includes(row.type);
                  
                  return (
                    <tr 
                      key={row.id} 
                      className={`transition-colors group hover:bg-white/[.04] ${isSaved ? 'bg-white/5' : 'even:bg-white/[.02]'}`}
                    >
                      {/* BOTÓN GUARDAR (BOOKMARK) */}
                      <td className="p-2 border-b border-white/10 text-center align-middle w-12">
                        <button 
                          onClick={() => toggleSave(row.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/10 transition-colors focus:outline-none"
                          title={isSaved ? "Quitar de guardados" : "Guardar apunte"}
                        >
                          <div className={`w-4 h-4 transition-transform ${isSaved ? 'text-itec-blue scale-110' : 'text-gray-500 group-hover:text-white'}`}>
                            <Icons type={isSaved ? "bookmarkFilled" : "bookmark"} />
                          </div>
                        </button>
                      </td>
                      
                      {/* ARCHIVO CON FILEICON */}
                      <td className="p-2 border-b border-white/10 align-middle">
                        <div className="flex items-center gap-2.5">
                          <FileIcon type={isZipType ? 'zip' : 'pdf'} />
                          <span className="text-[13px] font-medium text-white group-hover:text-white transition-colors">{row.title}</span>
                        </div>
                      </td>

                      <td className="p-2 text-[13px] text-gray-300 border-b border-white/10 align-middle">{row.subject}</td>
                      <td className="p-2 text-[13px] text-gray-400 border-b border-white/10 align-middle">{row.specialty}</td>
                      <td className="p-2 border-b border-white/10 align-middle">
                        <span className="bg-white/10 text-gray-300 border border-white/20 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide">
                          {row.type}
                        </span>
                      </td>
                      <td className="p-2 text-[13px] text-gray-500 border-b border-white/10 align-middle">{row.date}</td>
                      
                      {/* ACCIONES (ABRIR Y DESCARGAR) */}
                      <td className="p-2 border-b border-white/10 text-right pr-4 align-middle">
                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                           <a href={row.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-7 h-7 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors" title="Abrir vista previa">
                             <div className="w-3.5 h-3.5"><Icons type="externalLink" /></div>
                           </a>
                           <a href={row.fileUrl} download className="inline-flex items-center justify-center w-7 h-7 bg-itec-blue hover:bg-blue-600 rounded-md text-white transition-colors shadow-md" title="Descargar archivo">
                             <div className="w-3.5 h-3.5"><Icons type="download" /></div>
                           </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-gray-500 text-sm bg-white/[.02] align-middle">
                      <span className="text-4xl block mb-3">📭</span>
                      {activeTab === 'saved' ? 'Aún no tienes apuntes guardados. Haz clic en el ícono del marcador para guardar uno.' : 'No se encontraron aportes con esos filtros.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER TABLA */}
          <div className="bg-itec-sidebar p-3 text-xs text-gray-500 border-t border-itec-gray flex justify-between items-center">
            <span>Mostrando {filteredData.length} resultados</span>
            <div className="flex gap-2">
              <button disabled className="px-2 py-1 bg-white/5 rounded text-gray-600">Anterior</button>
              <button disabled className="px-2 py-1 bg-white/5 rounded text-gray-600">Siguiente</button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
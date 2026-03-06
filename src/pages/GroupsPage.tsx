import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { Button } from '../components/atoms/Button';
import { ESPECIALIDADES_DB } from '../data/specialties';
import { GROUPS_DB } from '../data/groups';
import type { GroupData } from '../data/groups';

const CARRERAS_OPTIONS = [
  { value: 'ingreso', label: 'Ingreso' },
  { value: 'sistemas', label: 'Ingeniería en Sistemas' },
  { value: 'industrial', label: 'Ingeniería Industrial' },
  { value: 'civil', label: 'Ingeniería Civil' },
  { value: 'electronica', label: 'Ingeniería Electrónica' },
  { value: 'electrica', label: 'Ingeniería Eléctrica' },
  { value: 'mecanica', label: 'Ingeniería Mecánica' },
  { value: 'quimica', label: 'Ingeniería Química' },
  { value: 'homogeneas1', label: 'Homogéneas Nivel 1' },
];

const NIVEL_OPTIONS = [
  { value: '0', label: 'Ingreso' },
  { value: '1', label: 'Nivel 1 (Primer Año)' },
  { value: '2', label: 'Nivel 2 (Segundo Año)' },
  { value: '3', label: 'Nivel 3 (Tercer Año)' },
  { value: '4', label: 'Nivel 4 (Cuarto Año)' },
];

// Base de datos estandarizada de materias (Evita AM2 vs Análisis Matemático II)
const MATERIAS_ESTANDAR = [
  "Algebra y Geometria Analitica",
  "Algoritmos y Estructuras de Datos",
  "Analisis Matematico I",
  "Analisis Matematico II",
  "Arquitectura de Computadoras",
  "Diseño de Sistemas",
  "Electronica Aplicada I",
  "Estudio del Trabajo",
  "Física I",
  "Física II",
  "Informática I",
  "Ingeniería y Sociedad",
  "Módulo B",
  "Probabilidad y Estadística",
  "Seminario de Ingreso",
  "Sintaxis y Semántica de los Lenguajes",
  "Sistemas y Procesos de Negocio"
].sort();

const STORAGE_KEY_GROUPS = 'itec_custom_groups';

export const GroupsPage: React.FC = () => {
  // --- ESTADOS DE BASE DE DATOS LOCAL ---
  const [allGroups, setAllGroups] = useState<GroupData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
    const customGroups = saved ? JSON.parse(saved) : [];
    return [...GROUPS_DB, ...customGroups]; // Combinamos los fijos con los agregados
  });

  useEffect(() => {
    // Guardamos solo los grupos agregados por usuarios (los que tienen ID generado por Date)
    const customGroups = allGroups.filter(g => g.id.length > 10);
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(customGroups));
  }, [allGroups]);

  // --- ESTADOS DEL BUSCADOR ---
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');
  const [comision, setComision] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<GroupData[]>([]);

  // Búsqueda Inteligente para el filtro principal (Materia)
  const [showMateriaDropdown, setShowMateriaDropdown] = useState(false);
  const searchMateriaRef = useRef<HTMLDivElement>(null);

  // --- ESTADOS DEL MODAL AGREGAR GRUPO ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ carrera: '', nivel: '', materia: '', comision: '', link: '' });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  
  // Búsqueda Inteligente para el Modal (Materia)
  const [showModalMateriaDropdown, setShowModalMateriaDropdown] = useState(false);
  const modalMateriaRef = useRef<HTMLDivElement>(null);

  // --- EFECTOS PARA CERRAR DROPDOWNS AL HACER CLIC AFUERA ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchMateriaRef.current && !searchMateriaRef.current.contains(event.target as Node)) {
        setShowMateriaDropdown(false);
      }
      if (modalMateriaRef.current && !modalMateriaRef.current.contains(event.target as Node)) {
        setShowModalMateriaDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LÓGICA DE BÚSQUEDA ---
  const handleClear = () => {
    setCarrera(''); setNivel(''); setMateria(''); setComision('');
    setHasSearched(false); setResults([]);
  };

  const handleSearch = () => {
    const filtered = allGroups.filter(group => {
      const matchCarrera = carrera === '' || group.carrera === carrera;
      const matchNivel = nivel === '' || group.nivel === nivel;
      const matchMateria = materia === '' || group.materia === materia; // Ahora es exacto por el select
      const matchComision = comision === '' || group.comision.toLowerCase().includes(comision.toLowerCase());
      return matchCarrera && matchNivel && matchMateria && matchComision;
    });
    setResults(filtered);
    setHasSearched(true);
  };

  const handleSpecialtyClick = (carreraValue: string) => {
    setCarrera(carreraValue); setNivel(''); setMateria(''); setComision('');
    const filtered = allGroups.filter(group => group.carrera === carreraValue);
    setResults(filtered);
    setHasSearched(true);
  };

  // --- LÓGICA DE AGREGAR GRUPO ---
  const handleOpenModal = () => {
    setAddForm({ carrera: carrera, nivel: nivel, materia: materia, comision: '', link: '' });
    setAddError(''); setAddSuccess(false); setIsModalOpen(true);
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    
    // 1. Validar campos vacíos
    if (!addForm.carrera || !addForm.nivel || !addForm.materia || !addForm.comision || !addForm.link) {
      setAddError('Por favor, completa todos los campos.'); return;
    }

    // 2. Validar que la materia sea una estandarizada
    if (!MATERIAS_ESTANDAR.includes(addForm.materia)) {
      setAddError('Por favor, selecciona una materia válida de la lista.'); return;
    }

    // 3. Validar si ya existe exactamente el mismo grupo
    const exists = allGroups.some(g => 
      g.carrera === addForm.carrera && 
      g.nivel === addForm.nivel && 
      g.materia === addForm.materia && 
      g.comision.toLowerCase() === addForm.comision.toLowerCase()
    );

    if (exists) {
      setAddError(`El grupo de la comisión ${addForm.comision.toUpperCase()} para ${addForm.materia} ya existe.`); return;
    }

    // 4. Agregar a la base de datos
    const newGroup: GroupData = {
      id: Date.now().toString(), // ID único para los agregados por usuarios
      carrera: addForm.carrera,
      nivel: addForm.nivel,
      materia: addForm.materia,
      comision: addForm.comision.toUpperCase(),
      link: addForm.link,
      tipo: 'Alumnos' // Todo lo que suben los usuarios es tipo Alumnos
    };

    setAllGroups(prev => [...prev, newGroup]);
    setAddSuccess(true);
    
    // Limpiar modal y actualizar búsqueda si está activa
    setTimeout(() => {
      setIsModalOpen(false);
      setAddSuccess(false);
      if (hasSearched) handleSearch(); // Refrescar resultados
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-10 relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Grupos de WhatsApp</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
            Encontrá la comunidad de tu materia o comisión. Conectate con tus compañeros.
          </p>
          <Button variant="secondary" onClick={handleOpenModal} className="text-xs bg-[#1a1a1a] hover:bg-white hover:text-black transition-all">
            + Aportar nuevo grupo de comisión
          </Button>
        </div>

        {/* CONTENEDOR DE FILTROS */}
        <div className="bg-itec-bg rounded-2xl p-6 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Carrera / Área</label>
              <Select fullWidth options={CARRERAS_OPTIONS} value={carrera} onChange={e => setCarrera(e.target.value)} className="text-sm py-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nivel</label>
              <Select fullWidth options={NIVEL_OPTIONS} value={nivel} onChange={e => setNivel(e.target.value)} className="text-sm py-2" />
            </div>
            
            {/* SEARCHABLE SELECT MATERIA (Buscador Principal) */}
            <div ref={searchMateriaRef} className="relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Materia</label>
              <Input 
                fullWidth 
                placeholder="Ej: Análisis Matemático..." 
                value={materia}
                onChange={e => { setMateria(e.target.value); setShowMateriaDropdown(true); }}
                onFocus={() => setShowMateriaDropdown(true)}
                className="text-sm py-2"
              />
              {showMateriaDropdown && (
                <ul className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                  {MATERIAS_ESTANDAR.filter(m => m.toLowerCase().includes(materia.toLowerCase())).map(m => (
                    <li 
                      key={m} 
                      onClick={() => { setMateria(m); setShowMateriaDropdown(false); }}
                      className="px-3 py-2 text-sm text-gray-300 hover:bg-itec-blue hover:text-white cursor-pointer transition-colors"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Comisión</label>
              <Input 
                fullWidth 
                className="text-sm py-2" 
                placeholder="Ej: K1043" 
                value={comision}
                onChange={e => setComision(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 border-t border-[#262626] pt-5">
            <Button variant="secondary" onClick={handleClear} className="w-full sm:w-auto min-w-[120px] text-sm py-2 bg-itec-red/20 hover:bg-itec-red/50 border-none">
              Limpiar
            </Button>
            <Button variant="primary" onClick={handleSearch} className="w-full sm:w-auto min-w-[120px] flex justify-center items-center gap-2 text-sm py-2 bg-itec-blue/20 hover:bg-itec-blue border-none">
              Buscar
            </Button>
          </div>
        </div>

        {/* RESULTADOS / ESPECIALIDADES */}
        {hasSearched ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Resultados ({results.length})</h3>
              <button onClick={handleClear} className="text-xs text-itec-blue hover:underline">Volver a Especialidades</button>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((group) => (
                  <div key={group.id} className="bg-[#111] border border-[#262626] rounded-xl p-4 flex flex-col justify-between shadow-lg hover:border-green-500/50 transition-colors group relative overflow-hidden">
                    {/* Etiqueta Visual */}
                    <div className="absolute -right-6 top-3 bg-[#1a1a1a] border border-[#333] text-[9px] font-bold text-gray-400 px-6 py-1 rotate-45">
                      {group.tipo}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-itec-blue uppercase tracking-widest block mb-1">Nivel {group.nivel}</span>
                      <h4 className="font-bold text-white text-sm mb-1 pr-4 leading-tight">{group.materia}</h4>
                      <p className="text-xs text-gray-400">Comisión: <strong className="text-white text-[13px]">{group.comision}</strong></p>
                    </div>
                    <a 
                      href={group.link} 
                      target="_blank" rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full bg-[#1a1a1a] hover:bg-green-600 border border-[#333] hover:border-green-500 text-gray-300 hover:text-white py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Unirme al Grupo
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-[#111] border border-[#262626] rounded-xl p-10">
                <span className="text-4xl mb-3 block">😕</span>
                <p className="text-gray-400 mb-4">No encontramos el grupo de WhatsApp que buscas.</p>
                <Button variant="primary" onClick={handleOpenModal} className="text-xs">¡Aportalo vos mismo!</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Explorar por Especialidad</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ESPECIALIDADES_DB.map((esp, index) => (
                <div key={index} onClick={() => handleSpecialtyClick(esp.carreraValue)} className={`group bg-[#111]/80 hover:bg-[#1a1a1a] border ${esp.colorClass} rounded-xl p-3 cursor-pointer transition-all duration-300 flex items-center justify-between shadow-md hover:-translate-y-0.5`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-[#1a1a1a] border border-[#333] flex items-center justify-center font-bold text-sm text-white group-hover:bg-white/5 transition-colors">{esp.code}</div>
                    <span className="font-bold text-[11px] tracking-wide text-gray-400 transition-colors">{esp.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: AGREGAR GRUPO DE WHATSAPP                        */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-itec-bg border border-itec-bg rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              ✖
            </button>
            
            <h2 className="text-xl font-bold text-white mb-2">Aportar Grupo de WhatsApp</h2>
            <p className="text-xs text-gray-400 mb-6">Ayudá a la comunidad agregando el link del grupo de tu cursada.</p>

            {addSuccess ? (
              <div className="text-center py-10">
                <span className="text-5xl block mb-4">🎉</span>
                <h3 className="text-lg font-bold text-green-500 mb-2">¡Grupo Agregado!</h3>
                <p className="text-gray-400 text-sm">Gracias por aportar a la comunidad de ITEC.</p>
              </div>
            ) : (
              <form onSubmit={handleAddGroup} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Carrera / Área</label>
                    <Select fullWidth options={CARRERAS_OPTIONS} value={addForm.carrera} onChange={e => setAddForm({...addForm, carrera: e.target.value})} className="text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nivel</label>
                    <Select fullWidth options={NIVEL_OPTIONS} value={addForm.nivel} onChange={e => setAddForm({...addForm, nivel: e.target.value})} className="text-sm" />
                  </div>
                </div>

                {/* SEARCHABLE SELECT MATERIA (Modal) */}
                <div ref={modalMateriaRef} className="relative">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Materia Oficial</label>
                  <Input 
                    fullWidth 
                    placeholder="Escribí para buscar la materia exacta..." 
                    value={addForm.materia}
                    onChange={e => { setAddForm({...addForm, materia: e.target.value}); setShowModalMateriaDropdown(true); }}
                    onFocus={() => setShowModalMateriaDropdown(true)}
                    className="text-sm"
                  />
                  {showModalMateriaDropdown && (
                    <ul className="absolute z-50 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-2xl max-h-40 overflow-y-auto custom-scrollbar">
                      {MATERIAS_ESTANDAR.filter(m => m.toLowerCase().includes(addForm.materia.toLowerCase())).map(m => (
                        <li 
                          key={m} 
                          onClick={() => { setAddForm({...addForm, materia: m}); setShowModalMateriaDropdown(false); }}
                          className="px-3 py-2 text-sm text-gray-300 hover:bg-itec-blue hover:text-white cursor-pointer transition-colors"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Comisión</label>
                    <Input fullWidth placeholder="Ej: K1043" value={addForm.comision} onChange={e => setAddForm({...addForm, comision: e.target.value.toUpperCase()})} className="text-sm uppercase" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Link de Invitación</label>
                    <Input fullWidth placeholder="https://chat.whatsapp.com/..." value={addForm.link} onChange={e => setAddForm({...addForm, link: e.target.value})} className="text-sm" />
                  </div>
                </div>

                {addError && <p className="text-red-500 text-xs font-bold mt-2">{addError}</p>}

                <div className="pt-4 flex justify-end gap-3 border-t border-[#262626]">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" variant="primary" className="bg-itec-blue/30 hover:bg-itec-blue border-none">Subir Grupo</Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
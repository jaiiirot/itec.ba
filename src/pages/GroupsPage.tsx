import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Input } from '../components/atoms/Input';
import { Select } from '../components/atoms/Select';
import { Button } from '../components/atoms/Button';
import { ESPECIALIDADES_DB } from '../data/specialties';
import { GROUPS_DB } from '../data/groups';
import type { GroupData } from '../data/groups';

import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

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

export const GroupsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.email === 'jtumiricuellar@frba.utn.edu.ar';

  const [allGroups, setAllGroups] = useState<GroupData[]>(GROUPS_DB);

  useEffect(() => {
    const fetchFirebaseGroups = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'groups'));
        const firebaseGroups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GroupData[];
        
        setAllGroups([...GROUPS_DB, ...firebaseGroups]);
      } catch (error) {
        console.error("Error cargando grupos de Firebase:", error);
      }
    };

    fetchFirebaseGroups();
  }, []);

  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');
  const [comision, setComision] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<GroupData[]>([]);

  const [showMateriaDropdown, setShowMateriaDropdown] = useState(false);
  const searchMateriaRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ carrera: '', nivel: '', materia: '', comision: '', link: '' });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', desc: '' });
  
  const [showModalMateriaDropdown, setShowModalMateriaDropdown] = useState(false);
  const modalMateriaRef = useRef<HTMLDivElement>(null);

  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [pendingGroups, setPendingGroups] = useState<GroupData[]>([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);

  const fetchPendingGroups = async () => {
    setIsLoadingPending(true);
    setIsPendingModalOpen(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'pending_groups'));
      const groups = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GroupData[];
      setPendingGroups(groups);
    } catch (error) {
      console.error("Error buscando grupos pendientes:", error);
      alert("Hubo un error al buscar las solicitudes. Revisa tus permisos de Firebase.");
    } finally {
      setIsLoadingPending(false);
    }
  };

  const handleApproveGroup = async (group: GroupData) => {
    try {
      const { id, ...groupDataWithoutId } = group; 
      const docRef = await addDoc(collection(db, 'groups'), groupDataWithoutId);
      await deleteDoc(doc(db, 'pending_groups', group.id));

      setPendingGroups(prev => prev.filter(g => g.id !== group.id));
      setAllGroups(prev => [...prev, { ...groupDataWithoutId, id: docRef.id } as GroupData]);
      
      alert(`✅ Grupo ${group.comision} aprobado y publicado.`);
    } catch (error) {
      console.error("Error aprobando grupo:", error);
      alert("Error al aprobar el grupo.");
    }
  };

  const handleRejectGroup = async (groupId: string) => {
    const confirmReject = window.confirm("¿Estás seguro de que quieres rechazar y eliminar esta solicitud?");
    if (!confirmReject) return;

    try {
      await deleteDoc(doc(db, 'pending_groups', groupId));
      setPendingGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (error) {
      console.error("Error rechazando grupo:", error);
      alert("Error al eliminar la solicitud.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchMateriaRef.current && !searchMateriaRef.current.contains(event.target as Node)) setShowMateriaDropdown(false);
      if (modalMateriaRef.current && !modalMateriaRef.current.contains(event.target as Node)) setShowModalMateriaDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setCarrera(''); setNivel(''); setMateria(''); setComision('');
    setHasSearched(false); setResults([]);
  };

  const handleSearch = () => {
    const filtered = allGroups.filter(group => {
      const matchCarrera = carrera === '' || group.carrera === carrera;
      const matchNivel = nivel === '' || group.nivel === nivel;
      const matchMateria = materia === '' || group.materia === materia; 
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

  const handleOpenModal = () => {
    setAddForm({ carrera: carrera, nivel: nivel, materia: materia, comision: '', link: '' });
    setAddError(''); setAddSuccess(false); setIsModalOpen(true);
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    
    if (!addForm.carrera || !addForm.nivel || !addForm.materia || !addForm.comision || !addForm.link) {
      setAddError('Por favor, completa todos los campos.'); return;
    }
    if (!MATERIAS_ESTANDAR.includes(addForm.materia)) {
      setAddError('Por favor, selecciona una materia válida de la lista.'); return;
    }

    const exists = allGroups.some(g => 
      g.carrera === addForm.carrera && g.nivel === addForm.nivel && 
      g.materia === addForm.materia && g.comision.toLowerCase() === addForm.comision.toLowerCase()
    );

    if (exists) {
      setAddError(`El grupo de la comisión ${addForm.comision.toUpperCase()} para ${addForm.materia} ya existe.`); return;
    }

    const newGroupData = {
      carrera: addForm.carrera,
      nivel: addForm.nivel,
      materia: addForm.materia,
      comision: addForm.comision.toUpperCase(),
      link: addForm.link,
      tipo: 'Alumnos',
      createdAt: serverTimestamp(),
      submittedBy: user?.email || 'invitado'
    };

    try {
      if (isAuthenticated) {
        const docRef = await addDoc(collection(db, 'groups'), newGroupData);
        setAllGroups(prev => [...prev, { id: docRef.id, ...newGroupData } as GroupData]);
        setSuccessInfo({ title: '¡Grupo Agregado!', desc: 'Gracias por aportar a la comunidad de ITEC.' });
      } else {
        await addDoc(collection(db, 'pending_groups'), newGroupData);
        setSuccessInfo({ title: '¡Solicitud Enviada!', desc: 'Tu grupo fue enviado a revisión. Un administrador lo publicará pronto.' });
      }

      setAddSuccess(true);
      
      setTimeout(() => {
        setIsModalOpen(false);
        setAddSuccess(false);
        if (hasSearched && isAuthenticated) handleSearch(); 
      }, 2500);

    } catch (error) {
      console.error(error);
      setAddError('Ocurrió un error al enviar el grupo. Intenta nuevamente.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-10 relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Grupos de WhatsApp</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
            Encontrá la comunidad de tu materia o comisión. Conectate con tus compañeros.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="secondary" onClick={handleOpenModal} className="text-xs bg-itec-surface border border-itec-gray hover:bg-white hover:text-black transition-all">
              + Aportar nuevo grupo de comisión
            </Button>
            
            {isAdmin && (
              <Button 
                variant="primary" 
                onClick={fetchPendingGroups} 
                className="text-xs bg-itec-blue/20 text-itec-blue-skye hover:bg-itec-blue hover:text-white border-none transition-all shadow-lg"
              >
                Ver solicitudes de grupos
              </Button>
            )}
          </div>
        </div>

        {/* CONTENEDOR DE FILTROS */}
        <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Carrera / Área</label>
              <Select fullWidth options={CARRERAS_OPTIONS} value={carrera} onChange={e => setCarrera(e.target.value)} className="text-sm py-2 bg-itec-bg border-itec-gray" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nivel</label>
              <Select fullWidth options={NIVEL_OPTIONS} value={nivel} onChange={e => setNivel(e.target.value)} className="text-sm py-2 bg-itec-bg border-itec-gray" />
            </div>
            
            <div ref={searchMateriaRef} className="relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Materia</label>
              <Input 
                fullWidth 
                placeholder="Ej: Análisis Matemático..." 
                value={materia}
                onChange={e => { setMateria(e.target.value); setShowMateriaDropdown(true); }}
                onFocus={() => setShowMateriaDropdown(true)}
                className="text-sm py-2 bg-itec-bg border-itec-gray"
              />
              {showMateriaDropdown && (
                <ul className="absolute z-50 w-full mt-1 bg-itec-sidebar border border-itec-gray rounded-lg shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
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
                className="text-sm py-2 bg-itec-bg border-itec-gray" 
                placeholder="Ej: K1043" 
                value={comision}
                onChange={e => setComision(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 border-t border-itec-gray pt-5">
            <Button variant="secondary" onClick={handleClear} className="w-full sm:w-auto min-w-[120px] text-sm py-2 bg-itec-red/10 text-itec-red-skye hover:bg-itec-red hover:text-white border border-itec-red/30 transition-colors">
              Limpiar
            </Button>
            <Button variant="primary" onClick={handleSearch} className="w-full sm:w-auto min-w-[120px] flex justify-center items-center gap-2 text-sm py-2 bg-itec-blue text-white hover:bg-itec-blue-skye border-none shadow-lg">
              Buscar
            </Button>
          </div>
        </div>

        {/* RESULTADOS / ESPECIALIDADES */}
        {hasSearched ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Resultados ({results.length})</h3>
              <button onClick={handleClear} className="text-xs text-itec-blue-skye hover:underline">Volver a Especialidades</button>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((group) => (
                  <div key={group.id} className="bg-itec-surface border border-itec-gray rounded-xl p-4 flex flex-col justify-between shadow-lg hover:border-itec-blue/50 transition-colors group relative overflow-hidden">
                    <div className="absolute -right-6 top-3 bg-itec-sidebar border border-itec-gray text-[9px] font-bold text-gray-400 px-6 py-1 rotate-45">
                      {group.tipo}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-itec-blue-skye uppercase tracking-widest block mb-1">Nivel {group.nivel}</span>
                      <h4 className="font-bold text-white text-sm mb-1 pr-4 leading-tight">{group.materia}</h4>
                      <p className="text-xs text-gray-400">Comisión: <strong className="text-white text-[13px]">{group.comision}</strong></p>
                    </div>
                    <a 
                      href={group.link} 
                      target="_blank" rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full bg-itec-bg hover:bg-itec-blue border border-itec-gray hover:border-itec-blue-skye text-gray-300 hover:text-white py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      Unirme al Grupo
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-itec-surface border border-itec-gray rounded-xl p-10">
                <span className="text-4xl mb-3 block">😕</span>
                <p className="text-gray-400 mb-4">No encontramos el grupo de WhatsApp que buscas.</p>
                <Button variant="primary" onClick={handleOpenModal} className="text-xs bg-itec-blue hover:bg-itec-blue-skye border-none">¡Aportalo vos mismo!</Button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Explorar por Especialidad</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ESPECIALIDADES_DB.map((esp, index) => (
                <div key={index} onClick={() => handleSpecialtyClick(esp.carreraValue)} className={`group bg-itec-surface hover:bg-itec-bg border ${esp.colorClass} rounded-xl p-3 cursor-pointer transition-all duration-300 flex items-center justify-between shadow-md hover:-translate-y-0.5`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md bg-itec-sidebar border border-itec-gray flex items-center justify-center font-bold text-sm text-white group-hover:bg-white/5 transition-colors">{esp.code}</div>
                    <span className="font-bold text-[11px] tracking-wide text-gray-400 transition-colors">{esp.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: AGREGAR GRUPO DE WHATSAPP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-itec-surface border border-itec-gray rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✖</button>
            <h2 className="text-xl font-bold text-white mb-2">Aportar Grupo de WhatsApp</h2>
            <p className="text-xs text-gray-400 mb-6">Ayudá a la comunidad agregando el link del grupo de tu cursada.</p>

            {addSuccess ? (
              <div className="text-center py-10">
                <span className="text-5xl block mb-4">🎉</span>
                <h3 className="text-lg font-bold text-green-500 mb-2">{successInfo.title}</h3>
                <p className="text-gray-400 text-sm">{successInfo.desc}</p>
              </div>
            ) : (
              <form onSubmit={handleAddGroup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Carrera / Área</label>
                    <Select fullWidth options={CARRERAS_OPTIONS} value={addForm.carrera} onChange={e => setAddForm({...addForm, carrera: e.target.value})} className="text-sm bg-itec-bg border-itec-gray" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nivel</label>
                    <Select fullWidth options={NIVEL_OPTIONS} value={addForm.nivel} onChange={e => setAddForm({...addForm, nivel: e.target.value})} className="text-sm bg-itec-bg border-itec-gray" />
                  </div>
                </div>

                <div ref={modalMateriaRef} className="relative">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Materia Oficial</label>
                  <Input 
                    fullWidth 
                    placeholder="Escribí para buscar la materia exacta..." 
                    value={addForm.materia}
                    onChange={e => { setAddForm({...addForm, materia: e.target.value}); setShowModalMateriaDropdown(true); }}
                    onFocus={() => setShowModalMateriaDropdown(true)}
                    className="text-sm bg-itec-bg border-itec-gray"
                  />
                  {showModalMateriaDropdown && (
                    <ul className="absolute z-50 w-full mt-1 bg-itec-sidebar border border-itec-gray rounded-lg shadow-2xl max-h-40 overflow-y-auto custom-scrollbar">
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
                    <Input fullWidth placeholder="Ej: K1043" value={addForm.comision} onChange={e => setAddForm({...addForm, comision: e.target.value.toUpperCase()})} className="text-sm uppercase bg-itec-bg border-itec-gray" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Link de Invitación</label>
                    <Input fullWidth placeholder="https://chat.whatsapp.com/..." value={addForm.link} onChange={e => setAddForm({...addForm, link: e.target.value})} className="text-sm bg-itec-bg border-itec-gray" />
                  </div>
                </div>

                {addError && <p className="text-itec-red-skye text-xs font-bold mt-2">{addError}</p>}

                <div className="pt-4 flex justify-end gap-3 border-t border-itec-gray">
                  <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="bg-transparent text-gray-400 hover:text-white border-none">Cancelar</Button>
                  <Button type="submit" variant="primary" className="bg-itec-blue text-white hover:bg-itec-blue-skye border-none">Subir Grupo</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL ADMIN: REVISIÓN DE GRUPOS EN FORMATO TABLA          */}
      {/* ========================================================= */}
      {isPendingModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-itec-surface border border-itec-gray rounded-2xl w-full max-w-5xl shadow-2xl p-6 relative flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden">
            <button onClick={() => setIsPendingModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10">✖</button>
            
            {/* Header del Modal */}
            <div className="mb-6 pr-8">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-itec-blue/20 border border-itec-blue/50 flex items-center justify-center text-itec-blue-skye text-sm">🛡️</span>
                Panel de Moderación
              </h2>
              <p className="text-xs text-gray-400 mt-2">Revisá y aprobá los grupos enviados por usuarios no registrados.</p>
            </div>

            {/* Contenedor de la Tabla */}
            <div className="flex-1 overflow-auto custom-scrollbar border border-itec-gray rounded-xl bg-itec-bg">
              {isLoadingPending ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-2 border-itec-gray border-t-itec-blue rounded-full animate-spin"></div>
                </div>
              ) : pendingGroups.length > 0 ? (
                <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
                  <thead className="bg-itec-surface sticky top-0 z-10 border-b border-itec-gray shadow-sm">
                    <tr>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Materia</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Comisión</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Carrera / Nivel</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Link</th>
                      <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right pr-6">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingGroups.map((group) => (
                      <tr key={group.id} className="border-b border-itec-gray/50 hover:bg-itec-surface/50 transition-colors">
                        <td className="p-3 text-white font-medium">{group.materia}</td>
                        <td className="p-3">
                          <span className="bg-itec-blue/20 text-itec-blue-skye px-2 py-0.5 rounded text-xs font-bold border border-itec-blue/30">
                            {group.comision}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400 text-xs">
                          <span className="capitalize">{group.carrera}</span> <span className="mx-1">•</span> Nivel {group.nivel}
                        </td>
                        <td className="p-3">
                          <a href={group.link} target="_blank" rel="noreferrer" className="text-itec-blue-skye hover:text-white underline text-xs inline-block max-w-[150px] truncate align-middle transition-colors">
                            {group.link}
                          </a>
                        </td>
                        <td className="p-3 text-right pr-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleRejectGroup(group.id)} className="px-3 py-1.5 text-xs font-bold bg-itec-red/10 border border-itec-red/30 text-itec-red-skye hover:bg-itec-red hover:text-white rounded-lg transition-colors">
                              Rechazar
                            </button>
                            <button onClick={() => handleApproveGroup(group)} className="px-3 py-1.5 text-xs font-bold bg-itec-blue border border-itec-blue-skye text-white hover:bg-itec-blue-skye rounded-lg transition-colors shadow-lg">
                              Aprobar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-20">
                  <span className="text-5xl mb-4 block opacity-50">📋</span>
                  <p className="text-gray-400 font-medium">No hay grupos pendientes.</p>
                  <p className="text-xs text-gray-500 mt-1">¡Todo está al día!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};  
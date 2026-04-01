import React, { useState, useRef, useEffect } from 'react';
import { Input } from '../../../../components/atoms/Input';
import { Select } from '../../../../components/atoms/Select';
import { Button } from '../../../../components/atoms/Button';
import { Icons } from '../../../../components/atoms/Icons'; // Importamos los íconos para el botón de Google
import { CARRERAS_OPTIONS, NIVEL_OPTIONS, MATERIAS_POR_CARRERA } from '../../types/groups';
import { groupsService, type GroupData } from '../../services/groupsService';
import { useAuth } from '../../../../context/AuthContext'; // Importamos el contexto de Auth

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  userEmail: string;
  existingGroups: GroupData[];
  onGroupAdded: (newGroup: GroupData, isDirectPublish: boolean) => void;
}

export const AddGroupModal: React.FC<Props> = ({ isOpen, onClose, isAdmin, existingGroups, onGroupAdded }) => {
  // Extraemos el estado de sesión directamente en el modal
  const { user, isAuthenticated, loginWithGoogle } = useAuth();

  const [form, setForm] = useState<{carrera: string, nivel: string, materia: string, comision: string, link: string, tipo: 'Alumnos' | 'Oficial'}>({ carrera: '', nivel: '', materia: '', comision: '', link: '', tipo: 'Alumnos' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ title: '', desc: '' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const materiasDisponibles = (form.carrera && form.nivel && MATERIAS_POR_CARRERA[form.carrera] && MATERIAS_POR_CARRERA[form.carrera][form.nivel])
    ? MATERIAS_POR_CARRERA[form.carrera][form.nivel]
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCarreraChange = (val: string) => {
    if (val === 'ingreso') {
      setForm({ ...form, carrera: val, nivel: '0', materia: '' });
    } else {
      setForm({ ...form, carrera: val, nivel: '', materia: '' });
    }
  };

  const handleNivelChange = (val: string) => {
    setForm({ ...form, nivel: val, materia: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    
    if (!form.carrera || !form.nivel || !form.materia || !form.comision || !form.link) {
      setError('Por favor, completa todos los campos.'); return;
    }
    if (!materiasDisponibles.includes(form.materia)) {
      setError('Por favor, selecciona una materia válida de la lista desplegable.'); return;
    }

    setIsSubmitting(true);

    try {
      const isDupApproved = existingGroups.some(g => 
        (g.materia === form.materia && g.comision.toLowerCase() === form.comision.toLowerCase()) || g.link === form.link
      );

      if (isDupApproved) {
        setError(`Este link o la comisión ${form.comision.toUpperCase()} ya están registrados.`);
        setIsSubmitting(false); return;
      }

      // Evitamos que los invitados manden spam revisando la cola de pendientes
      const isDupPending = await groupsService.checkIsDuplicatePending(form.materia, form.comision, form.link);
      if (isDupPending) {
        setError('Este grupo ya fue sugerido por otra persona y está esperando aprobación.');
        setIsSubmitting(false); return;
      }

      // Si el usuario está logueado, publica directamente. Si no, va a revisión.
      const isDirectPublish = isAuthenticated;

      const newGroupData = {
        carrera: form.carrera,
        nivel: form.nivel,
        materia: form.materia,
        comision: form.comision.toUpperCase(),
        link: form.link,
        tipo: isAdmin ? form.tipo : 'Alumnos',
        submittedBy: user?.email || 'invitado' // Toma el mail real si se logueó
      };

      const newId = await groupsService.submitNewGroup(newGroupData, isDirectPublish);

      if (isDirectPublish) {
        setSuccessInfo({ title: '¡Grupo Publicado!', desc: 'Gracias por tu aporte. Tu grupo ya está visible para todos.' });
        onGroupAdded({ id: newId, ...newGroupData }, true);
      } else {
        setSuccessInfo({ title: '¡Solicitud Enviada!', desc: 'Tu grupo fue enviado a revisión. Un administrador lo publicará pronto.' });
        onGroupAdded({ id: newId, ...newGroupData }, false);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 3000);

    } catch {
      setError('Ocurrió un error al enviar el grupo. Revisa tu conexión.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-3xl w-full max-w-lg shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} disabled={isSubmitting} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-itec-bg border border-itec-gray text-gray-500 hover:text-white hover:bg-itec-gray transition-colors disabled:opacity-50">✖</button>
        <h2 className="text-2xl font-bold text-white mb-2">Aportar Grupo</h2>
        <p className="text-sm text-gray-400 mb-6">Seleccioná tu carrera y año para encontrar tu materia.</p>

        {success ? (
          <div className="text-center py-10 animate-in fade-in duration-300">
            <span className="text-6xl block mb-4">🎉</span>
            <h3 className="text-xl font-bold text-green-500 mb-2">{successInfo.title}</h3>
            <p className="text-gray-400 text-sm">{successInfo.desc}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* === BANNER INVITANDO A INICIAR SESIÓN (Solo si es visitante) === */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-itec-blue/20 to-transparent border border-itec-blue/30 rounded-xl p-4 mb-2 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-in fade-in">
                <div>
                  <h4 className="text-[13px] font-bold text-white mb-1 flex items-center gap-1.5">
                    <span className="text-itec-blue-skye text-base">🎓</span> ¿Sos de la UTN?
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-tight">
                    Iniciá sesión para publicar sin revisión y solicitar tu <strong className="text-white">TarjeTEC</strong> con beneficios exclusivos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="shrink-0 bg-white hover:bg-gray-200 text-black text-[11px] font-bold py-2 px-3 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <div className="w-4 h-4 text-blue-600"><Icons type="google" /></div>
                  Iniciar Sesión
                </button>
              </div>
            )}
            
            {/* CASCADA PASO 1 y 2 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Carrera / Área</label>
                <Select fullWidth options={CARRERAS_OPTIONS} value={form.carrera} onChange={e => handleCarreraChange(e.target.value)} className="text-sm py-2.5 bg-itec-bg border-itec-gray focus:border-itec-blue transition-colors text-white" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Año / Nivel</label>
                <Select fullWidth disabled={!form.carrera} options={NIVEL_OPTIONS} value={form.nivel} onChange={e => handleNivelChange(e.target.value)} className="text-sm py-2.5 bg-itec-bg border-itec-gray focus:border-itec-blue transition-colors text-white disabled:opacity-50" />
              </div>
            </div>

            {/* CASCADA PASO 3 (Materia Automática) */}
            <div ref={dropdownRef} className="relative">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Materia Oficial</label>
              <Input 
                fullWidth 
                disabled={!form.carrera || !form.nivel}
                placeholder={!form.carrera || !form.nivel ? "Seleccioná Carrera y Año primero..." : "Hacé click para buscar..."} 
                value={form.materia} 
                onChange={e => { setForm({...form, materia: e.target.value}); setShowDropdown(true); }} 
                onFocus={() => setShowDropdown(true)} 
                className="text-sm py-2.5 bg-itec-bg border-itec-gray focus:border-itec-blue transition-colors text-white disabled:opacity-50" 
              />
              {showDropdown && materiasDisponibles.length > 0 && (
                <ul className="absolute z-50 w-full mt-2 bg-itec-sidebar border border-itec-gray rounded-xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                  {materiasDisponibles.filter(m => m.toLowerCase().includes(form.materia.toLowerCase())).map(m => (
                    <li key={m} onClick={() => { setForm({...form, materia: m}); setShowDropdown(false); }} className="px-4 py-2.5 text-sm text-gray-300 hover:bg-itec-blue hover:text-white cursor-pointer transition-colors border-b border-itec-gray/50 last:border-0">
                      {m}
                    </li>
                  ))}
                  {materiasDisponibles.filter(m => m.toLowerCase().includes(form.materia.toLowerCase())).length === 0 && (
                     <li className="px-4 py-2.5 text-sm text-gray-500 text-center">No se encontraron materias</li>
                  )}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Comisión</label>
                <Input fullWidth placeholder="Ej: K1043" value={form.comision} onChange={e => setForm({...form, comision: e.target.value.toUpperCase()})} className="text-sm py-2.5 uppercase bg-itec-bg border-itec-gray focus:border-itec-blue text-white" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Link de WhatsApp</label>
                <Input fullWidth placeholder="https://chat.whatsapp.com/..." value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="text-sm py-2.5 bg-itec-bg border-itec-gray focus:border-itec-blue text-white" />
              </div>
            </div>

            {isAdmin && (
              <div className="p-4 bg-itec-blue/5 border border-itec-blue/20 rounded-xl mt-2">
                <label className="block text-[11px] font-bold text-itec-blue-skye uppercase tracking-wider mb-2">Privilegio Admin: Tipo de Grupo</label>
                <Select fullWidth options={[{value: 'Alumnos', label: 'Grupo de Alumnos'}, {value: 'Oficial', label: 'Grupo Oficial (ITEC)'}]} value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value as 'Alumnos' | 'Oficial'})} className="text-sm py-2 bg-itec-bg border-itec-blue/30 focus:border-itec-blue text-white" />
              </div>
            )}

            {error && (
              <div className="bg-itec-red/10 border border-itec-red/30 p-3 rounded-xl flex items-center gap-2">
                <span className="text-itec-red-skye text-lg">⚠️</span>
                <p className="text-itec-red-skye text-xs font-medium leading-tight">{error}</p>
              </div>
            )}

            <div className="pt-6 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} className="bg-itec-bg border-itec-gray hover:bg-itec-gray text-gray-300">Cancelar</Button>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="bg-itec-blue hover:bg-itec-blue-skye border-none text-white shadow-lg min-w-32 cursor-pointer">
                {isSubmitting ? 'Enviando...' : 'Subir Grupo'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
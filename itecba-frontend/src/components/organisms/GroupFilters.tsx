import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { Button } from '../atoms/Button';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS, MATERIAS_POR_CARRERA } from '../../data/groups';

interface Props {
  carrera: string; setCarrera: (v: string) => void;
  nivel: string; setNivel: (v: string) => void;
  materia: string; setMateria: (v: string) => void;
  comision: string; setComision: (v: string) => void;
  isLoading: boolean;
  onSearch: () => void;
  onClear: () => void;
}

export const GroupFilters: React.FC<Props> = ({
  carrera, setCarrera, nivel, setNivel, materia, setMateria, comision, setComision, isLoading, onSearch, onClear
}) => {
  const [showMateriaDropdown, setShowMateriaDropdown] = useState(false);
  const searchMateriaRef = useRef<HTMLDivElement>(null);

  // Obtener materias disponibles basadas en la carrera y nivel
  const materiasSearchDisponibles = useMemo(() => {
    if (carrera && nivel && MATERIAS_POR_CARRERA[carrera] && MATERIAS_POR_CARRERA[carrera][nivel]) {
      return MATERIAS_POR_CARRERA[carrera][nivel];
    }
    return [];
  }, [carrera, nivel]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchMateriaRef.current && !searchMateriaRef.current.contains(e.target as Node)) {
        setShowMateriaDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
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
            </ul>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Comisión</label>
          <Input fullWidth className="text-sm py-2 bg-itec-bg border-itec-gray uppercase" placeholder="Ej: K1043" value={comision} onChange={e => setComision(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSearch()} />
        </div>
      </div>
      <div className="flex justify-center gap-3 border-t border-itec-gray pt-5">
        <Button variant="secondary" onClick={onClear} className="text-sm py-2 bg-itec-red/10 text-itec-red-skye border-itec-red/30 hover:bg-itec-red hover:text-white transition-colors">Limpiar</Button>
        <Button variant="primary" onClick={onSearch} disabled={isLoading} className="text-sm py-2 bg-itec-blue text-white hover:bg-itec-blue-skye border-none shadow-lg disabled:opacity-50">
          {isLoading ? 'Cargando...' : 'Buscar Grupo'}
        </Button>
      </div>
    </div>
  );
};
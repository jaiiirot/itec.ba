import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Icons } from '@/components/atoms/Icons';
import { CARRERAS_OPTIONS, NIVEL_OPTIONS } from '../../types/groups';
import { useGroupFilters } from '../../hooks/useGroupFilters';

interface Props {
  filters: ReturnType<typeof useGroupFilters>;
  isLoading: boolean;
}

export const GroupFilters: React.FC<Props> = ({ filters, isLoading }) => {
  const { 
    carrera, setCarrera, nivel, setNivel, materia, setMateria, comision, setComision,
    showMateriaDropdown, setShowMateriaDropdown, searchMateriaRef, materiasSearchDisponibles,
    handleClear, handleSearch 
  } = filters;

  const isSearchDisabled = isLoading || (!carrera && !materia && !comision);

  return (
    <div className="bg-itec-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl mb-10 relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
      
      {/* Detalle visual sutil */}
      <div className="absolute top-0 left-10 w-32 h-1 bg-gradient-to-r from-green-400 to-emerald-500 blur-sm opacity-50"></div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-2 bg-green-500/10 rounded-xl border border-green-500/20 text-green-500 shadow-sm">
          <Icons type="search" className="w-5 h-5" />
        </div>
        <h3 className="text-white font-bold text-lg">Radar de Grupos</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 relative z-10">
        
        {/* CARRERA */}
        <div className="group flex flex-col">
          <label className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2 pl-1 transition-colors">1. Especialidad</label>
          <Select 
            fullWidth options={CARRERAS_OPTIONS} value={carrera} 
            onChange={e => { setCarrera(e.target.value); setNivel(e.target.value === 'ingreso' ? '0' : ''); setMateria(''); }} 
            className="cursor-pointer text-sm py-3.5 bg-black/40 border-white/10 hover:border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all rounded-xl" 
          />
        </div>

        {/* NIVEL */}
        <div className={`transition-all duration-300 flex flex-col ${!carrera ? 'opacity-40 grayscale' : ''}`}>
          <label className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2 pl-1">2. Nivel Académico</label>
          <Select 
            fullWidth disabled={!carrera} options={NIVEL_OPTIONS} value={nivel} 
            onChange={e => { setNivel(e.target.value); setMateria(''); }} 
            className="cursor-pointer text-sm py-3.5 bg-black/40 border-white/10 hover:border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all rounded-xl disabled:cursor-not-allowed" 
          />
        </div>
        
        {/* MATERIA AUTOSUGERIDA */}
        <div ref={searchMateriaRef} className={`relative flex flex-col transition-all duration-300 ${(!carrera || !nivel) ? 'opacity-40 grayscale' : ''}`}>
          <label className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2 pl-1">3. Materia</label>
          <Input 
            fullWidth disabled={!carrera || !nivel}
            placeholder={(!carrera || !nivel) ? "Requerido..." : "Ej: Análisis Matemático I"} 
            value={materia} 
            onChange={e => { setMateria(e.target.value); setShowMateriaDropdown(true); }} 
            onFocus={() => setShowMateriaDropdown(true)} 
            className="cursor-text text-sm py-3.5 bg-black/40 border-white/10 hover:border-green-500/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all rounded-xl disabled:cursor-not-allowed" 
          />
          {showMateriaDropdown && materiasSearchDisponibles.length > 0 && (
            <ul className="absolute z-50 w-full top-full mt-2 bg-itec-sidebar border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar overflow-hidden backdrop-blur-xl">
              {materiasSearchDisponibles.filter(m => m.toLowerCase().includes(materia.toLowerCase())).map((m, idx) => (
                <li 
                  key={idx} onClick={() => { setMateria(m); setShowMateriaDropdown(false); }} 
                  className="cursor-pointer px-5 py-3 text-sm text-gray-300 hover:bg-green-600 hover:text-white border-b border-white/5 last:border-0 transition-colors"
                >
                  {m}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* COMISIÓN */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">4. Comisión (Opcional)</label>
          <Input 
            fullWidth placeholder="Ej: K1043" value={comision} 
            onChange={e => setComision(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && !isSearchDisabled && handleSearch()} 
            className="cursor-text text-sm py-3.5 bg-black/40 border-white/10 hover:border-gray-500/50 focus:border-gray-500 focus:ring-1 focus:ring-gray-500/50 transition-all rounded-xl uppercase" 
          />
        </div>

      </div>

      {/* BOTONERA MODO "DASHBOARD" */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6 relative z-10">
        <div className="text-xs text-gray-500 font-medium hidden md:block">
           Tip: Filtrá por Homogéneas (Z) para materias básicas.
        </div>
        
        <div className="flex w-full md:w-auto justify-end gap-4">
          {(carrera || nivel || materia || comision) && (
            <button 
              onClick={handleClear} 
              className="cursor-pointer px-5 py-3 text-sm font-bold text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              Resetear
            </button>
          )}
          <button 
            onClick={handleSearch} 
            disabled={isSearchDisabled} 
            className={`cursor-pointer px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg w-full md:w-auto ${
              isSearchDisabled 
                ? 'bg-black/50 text-gray-600 border border-white/5 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:scale-[1.02] border-none shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95'
            }`}
          >
            {isLoading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Escaneando...</>
            ) : (
              <>Buscar Redes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
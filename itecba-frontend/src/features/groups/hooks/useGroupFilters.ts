import { useState, useMemo, useRef, useEffect } from 'react';
import { MATERIAS_POR_CARRERA, MATERIAS_HOMOGENEAS } from '../types/groups';

export const useGroupFilters = (onSearchTrigger: () => void) => {
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');
  const [comision, setComision] = useState('');
  
  const [showMateriaDropdown, setShowMateriaDropdown] = useState(false);
  const searchMateriaRef = useRef<HTMLDivElement>(null);

  // Lógica para mezclar materias troncales con homogéneas (Ciencias Básicas)
  const materiasSearchDisponibles = useMemo(() => {
    if (!carrera || !nivel) return [];
    
    let materias = MATERIAS_POR_CARRERA[carrera]?.[nivel] || [];
    
    // Si busca en 1er o 2do año de cualquier carrera, le sugerimos también las Homogéneas automáticamente
    if (carrera !== 'homogeneas' && carrera !== 'ingreso') {
      if (nivel === '1') materias = [...materias, ...(MATERIAS_HOMOGENEAS['1'] || [])];
      if (nivel === '2') materias = [...materias, ...(MATERIAS_HOMOGENEAS['2'] || [])];
    }
    
    // Quitamos duplicados y ordenamos alfabéticamente
    return Array.from(new Set(materias)).sort();
  }, [carrera, nivel]);

  // Cerrar dropdown al hacer click afuera
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
    setCarrera(''); setNivel(''); setMateria(''); setComision('');
  };

  const handleSearch = () => {
    onSearchTrigger();
    setShowMateriaDropdown(false);
  };

  return {
    carrera, setCarrera,
    nivel, setNivel,
    materia, setMateria,
    comision, setComision,
    showMateriaDropdown, setShowMateriaDropdown,
    searchMateriaRef,
    materiasSearchDisponibles,
    handleClear,
    handleSearch
  };
};
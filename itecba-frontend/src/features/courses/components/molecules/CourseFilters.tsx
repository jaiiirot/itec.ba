import React from 'react';

interface CourseFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedMateria: string;
  setSelectedMateria: (materia: string) => void;
  selectedCategoria: string;
  setSelectedCategoria: (cat: string) => void;
  materiasDisponibles: string[];
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedMateria,
  setSelectedMateria,
  selectedCategoria,
  setSelectedCategoria,
  materiasDisponibles
}) => {
  return (
    <div className="bg-itec-surface border border-itec-gray/30 rounded-2xl p-5 mb-8 shadow-lg flex flex-col gap-4 relative z-10">
      
      {/* Fila Superior: Búsqueda y Materia */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Input de Búsqueda */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Buscar por título, descripción o tema..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-itec-sidebar border border-itec-gray/50 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-itec-blue focus:ring-1 focus:ring-itec-blue transition-all"
          />
        </div>

        {/* Select de Materias */}
        <div className="md:w-64">
          <select
            value={selectedMateria}
            onChange={(e) => setSelectedMateria(e.target.value)}
            className="w-full bg-itec-sidebar border border-itec-gray/50 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-itec-blue focus:ring-1 focus:ring-itec-blue transition-all cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em' }}
          >
            <option value="">Todas las materias</option>
            {materiasDisponibles.map((materia) => (
              <option key={materia} value={materia}>
                {materia}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fila Inferior: Tags / Categorías */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <span className="text-sm font-semibold text-gray-400 mr-2 whitespace-nowrap">Categoría:</span>
        
        {['Todos', 'Oficial', 'Comunidad'].map((cat) => {
          const isActive = selectedCategoria === cat || (cat === 'Todos' && selectedCategoria === '');
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategoria(cat === 'Todos' ? '' : cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? 'bg-itec-blue text-white border border-itec-blue shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                  : 'bg-transparent text-gray-400 border border-itec-gray hover:text-white hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
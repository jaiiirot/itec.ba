import React from 'react';
import { Link } from 'react-router-dom';
import { CourseCard } from '../molecules/CourseCard';
import type { CourseData } from '../../services/coursesService';

export interface CourseWithLocalProgress extends CourseData {
  localProgress: number;
}

interface Props {
  courses: CourseWithLocalProgress[];
  isLoading: boolean;
  isAdmin: boolean;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const CourseGrid: React.FC<Props> = ({ courses, isLoading, isAdmin, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Cargando tus clases...</p>
      </div>
    );
  }

  // MEJORA: Mensaje más amigable si los filtros no arrojan resultados
  if (courses.length === 0) {
    return (
      <div className="text-center py-20 bg-itec-surface border border-itec-gray rounded-2xl shadow-xl animate-in fade-in duration-500">
        <span className="text-5xl block mb-4 opacity-50">🔍</span>
        <h3 className="text-xl font-bold text-white mb-2">No se encontraron cursos</h3>
        <p className="text-gray-400 font-medium">Intenta ajustando tu búsqueda o cambiando los filtros.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in duration-500">
      {courses.map((curso) => {
        const cursoId = curso.id || (curso as any)._id;
        const isOficial = cursoId.startsWith('seminario') || cursoId.startsWith('analisis');
        const isSystemCourse = isOficial || cursoId.startsWith('arquitectura') || cursoId.startsWith('podcast');

        return (
          <div key={cursoId} className="relative group h-full">
            <Link to={`/cursos/${cursoId}`} className="block h-full transition-transform hover:-translate-y-1 duration-300">
              {isOficial && (
                <span className="absolute top-3 right-3 z-10 bg-itec-sidebar/90 text-white text-[9px] font-bold px-2 py-1 rounded border border-white/10 shadow-lg uppercase tracking-wider">
                  Oficial
                </span>
              )}
              
              <CourseCard 
                title={curso.title} 
                description={curso.description || ''} 
                progress={curso.localProgress} 
                imageUrl={curso.imageUrl} 
              />
            </Link>

            {isAdmin && !isSystemCourse && (
              <button 
                onClick={(e) => onDelete(e, cursoId)}
                className="absolute top-3 left-3 z-20 bg-red-600/90 hover:bg-red-500 text-white w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Eliminar curso"
              >
                <span className="text-sm">🗑️</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
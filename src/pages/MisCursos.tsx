import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { CourseCard } from '../components/molecules/CourseCard';
import { Button } from '../components/atoms/Button';
import { COURSE_DATA } from '../data/courses'; 

import { useAuth } from '../context/AuthContext';
import { coursesService } from '../services/coursesService';
import type { CourseData } from '../services/coursesService';
import { AddCourseModal } from '../components/organisms/AddCourseModal';

// Interfaz extendida para incluir el progreso local calculado
interface CourseWithLocalProgress extends CourseData {
  localProgress: number;
}

export const MisCursos: React.FC = () => {
  const { isAdmin } = useAuth();

  const [courses, setCourses] = useState<CourseWithLocalProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para calcular progreso desde localStorage
  const calculateLocalProgress = (courseId: string, totalVideos: number): number => {
    if (totalVideos === 0) return 0;
    try {
      const savedData = localStorage.getItem(`itec_course_${courseId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const watchedCount = parsed.watched ? parsed.watched.length : 0;
        return Math.min(100, Math.round((watchedCount / totalVideos) * 100));
      }
    } catch {
      console.error("Error leyendo progreso local");
    }
    return 0;
  };

  useEffect(() => {
    setIsLoading(true);
    coursesService.getCourses()
      .then(dbCourses => {
        // Unimos Firebase + Datos estáticos
        const combined = [...COURSE_DATA, ...dbCourses] as CourseData[];
        
        // Mapeamos para inyectarles el progreso local
        const coursesWithProgress = combined.map(course => ({
          ...course,
          localProgress: calculateLocalProgress(course.id, course.videos?.length || 0)
        }));

        setCourses(coursesWithProgress);
      })
      .catch(err => console.error("Error cargando cursos:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    if (!window.confirm("¿Seguro que deseas eliminar este curso de la base de datos?")) return;
    
    try {
      await coursesService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      localStorage.removeItem(`itec_course_${id}`); // Limpiamos su progreso
    } catch  {
      alert("Error al eliminar el curso.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Cursos ITEC</h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">Clases de consulta y material audiovisual oficial. Continuá donde lo dejaste.</p>
        </div>

        {isAdmin && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="bg-itec-blue/20 text-itec-blue-skye hover:bg-itec-blue hover:text-white border-none transition-all shadow-lg text-sm shrink-0">
            + Subir Clase / Curso
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Cargando tus clases...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-in fade-in duration-500">
          {courses.map((curso) => (
            <div key={curso.id} className="relative group h-full">
              <Link to={`/cursos/${curso.id}`} className="block h-full">
                {/* Badge visual de tipo */}
                {curso.id.startsWith('seminario') || curso.id.startsWith('analisis') ? (
                  <span className="absolute top-3 right-3 z-10 bg-itec-sidebar/90 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded border border-white/10 shadow-lg uppercase tracking-wider">
                    Oficial
                  </span>
                ) : null}
                
                <CourseCard 
                  title={curso.title} 
                  description={curso.description} 
                  progress={curso.localProgress} // Usamos el progreso calculado localmente
                  imageUrl={curso.imageUrl} 
                />
              </Link>

              {isAdmin && !curso.id.startsWith('seminario') && !curso.id.startsWith('analisis') && !curso.id.startsWith('arquitectura') && !curso.id.startsWith('podcast') && (
                <button 
                  onClick={(e) => handleDelete(e, curso.id)}
                  className="absolute top-3 left-3 z-20 bg-red-600/90 hover:bg-red-500 text-white w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="Eliminar curso"
                >
                  <span className="text-sm">🗑️</span>
                </button>
              )}
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full text-center py-20 bg-itec-surface border border-itec-gray rounded-2xl shadow-xl">
              <span className="text-5xl block mb-4 opacity-50">🎓</span>
              <p className="text-gray-400 font-medium">Aún no hay cursos publicados.</p>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <AddCourseModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onCourseAdded={(newCourse) => setCourses(prev => [{...newCourse, localProgress: 0}, ...prev])}
        />
      )}
    </DashboardLayout>
  );
};
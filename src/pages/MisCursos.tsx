import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { CourseCard } from '../components/molecules/CourseCard';
import { COURSE_DATA } from '../data/courses'; // Importamos la data real

export const MisCursos: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-itec-text">Mis Cursos</h1>
        <p className="text-gray-400 mt-2">Continuá con tu aprendizaje desde donde lo dejaste.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {COURSE_DATA.map((curso) => (
          <Link 
            to={`/cursos/${curso.id}`} 
            key={curso.id} 
            className="transition-transform hover:scale-101"
          >
            <CourseCard 
              title={curso.title} 
              description={curso.description} 
              progress={curso.progress} 
              imageUrl={curso.imageUrl} 
            />
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};
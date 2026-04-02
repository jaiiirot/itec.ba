// src/pages/Courses.tsx
import React, { useState, Suspense, useMemo } from "react";
// Ya no necesitamos importar useQueryClient aquí directamente

// Importaciones con Alias Global
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { Button } from "@/components/atoms/Button";
import { PageHeader } from "@/components/molecules/PageHeader";
import { useAuth } from "@/context/AuthContext";

// Importaciones con Alias de Features
import { useCourses, useDeleteCourse } from "@features/courses/hooks/useCourses"; 
import { CourseGrid, type CourseWithLocalProgress } from "@features/courses/components/organisms/CourseGrid";
import { CourseFilters } from "@features/courses/components/molecules/CourseFilters";

// Lazy load del modal con Alias
const AddCourseModal = React.lazy(() =>
  import("@features/courses/components/organisms/AddCourseModal").then((m) => ({ default: m.AddCourseModal }))
);

export const CoursesPage: React.FC = () => {
  const { isAdmin } = useAuth();

  // 1. OBTENEMOS LOS DATOS Y MUTACIONES CON REACT QUERY
  const { data: dbCourses = [], isLoading } = useCourses();
  const deleteCourseMutation = useDeleteCourse(); // 🟢 NUEVO: Traemos nuestra mutación para borrar

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados de los filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(""); 

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

  const coursesWithProgress: CourseWithLocalProgress[] = useMemo(() => {
    return dbCourses.map((course: any) => {
      const courseId = course.id || course._id;
      return {
        ...course,
        localProgress: calculateLocalProgress(courseId, course.videos?.length || 0),
      };
    });
  }, [dbCourses]);

  // Función de borrado súper limpia
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!window.confirm("¿Seguro que deseas eliminar este curso de la base de datos?")) return;

    // Borramos su historial local
    localStorage.removeItem(`itec_course_${id}`);
    
    // Disparamos la mutación (React Query hará la petición y refrescará la tabla solo)
    deleteCourseMutation.mutate(id, {
      onError: () => alert("Error al eliminar el curso.")
    });
  };

  const materiasDisponibles = useMemo(() => {
    const materias = coursesWithProgress.map(c => c.materia).filter(Boolean) as string[];
    return Array.from(new Set(materias)).sort();
  }, [coursesWithProgress]);

  const filteredCourses = useMemo(() => {
    return coursesWithProgress.filter((curso) => {
      const cursoId = curso.id || (curso as any)._id || "";
      
      const matchesSearch = 
        curso.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (curso.description && curso.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMateria = selectedMateria === "" || curso.materia === selectedMateria;

      const isOficial = curso.categoria === 'Oficial' || cursoId.startsWith('seminario') || cursoId.startsWith('analisis');
      
      let matchesCategoria = true;
      if (selectedCategoria === 'Oficial') matchesCategoria = isOficial;
      if (selectedCategoria === 'Comunidad') matchesCategoria = !isOficial;

      return matchesSearch && matchesMateria && matchesCategoria;
    });
  }, [coursesWithProgress, searchQuery, selectedMateria, selectedCategoria]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10 relative z-10">
        <PageHeader
          title="Cursos ITEC"
          description="Clases de consulta y material audiovisual oficial y no oficial, buscamos poder ayudar de la mejor manera posible a los estudiantes. Continuá donde lo dejaste."
          iconType="playFill"
          colorTheme="blue"
        >
          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              className="bg-itec-blue/20 text-itec-blue-skye hover:bg-itec-blue hover:text-white border-none transition-all shadow-lg text-sm shrink-0"
            >
              + Subir Clase / Curso
            </Button>
          )}
        </PageHeader>

        <CourseFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedMateria={selectedMateria}
          setSelectedMateria={setSelectedMateria}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
          materiasDisponibles={materiasDisponibles}
        />

        <CourseGrid
          courses={filteredCourses}
          isLoading={isLoading} 
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />
      </div>

      {isAdmin && isModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />}>
          <AddCourseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}
    </DashboardLayout>
  );
};
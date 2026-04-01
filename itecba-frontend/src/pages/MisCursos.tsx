// src/pages/MisCursos.tsx
import React, { useState, useEffect, Suspense, useMemo } from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { Button } from "../components/atoms/Button";
import { PageHeader } from "../components/molecules/PageHeader";

import { useAuth } from "../context/AuthContext";
import { coursesService } from "../features/courses/services/coursesService";

import { CourseGrid, type CourseWithLocalProgress } from "../features/courses/components/organisms/CourseGrid";
import { CourseFilters } from "../features/courses/components/molecules/CourseFilters";

const AddCourseModal = React.lazy(() =>
  import("../features/courses/components/organisms/AddCourseModal").then((m) => ({ default: m.AddCourseModal }))
);

export const MisCursos: React.FC = () => {
  const { isAdmin } = useAuth();

  const [courses, setCourses] = useState<CourseWithLocalProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados de los filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(""); // '' | 'Oficial' | 'Comunidad'

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
    coursesService
      .getCourses()
      .then((dbCourses) => {
        const coursesWithProgress = dbCourses.map((course) => {
          const courseId = course.id || (course as any)._id;
          return {
            ...course,
            localProgress: calculateLocalProgress(courseId, course.videos?.length || 0),
          };
        });
        setCourses(coursesWithProgress);
      })
      .catch((err) => console.error("Error cargando cursos:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!window.confirm("¿Seguro que deseas eliminar este curso de la base de datos?")) return;

    try {
      await coursesService.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => (c.id || (c as any)._id) !== id));
      localStorage.removeItem(`itec_course_${id}`);
    } catch {
      alert("Error al eliminar el curso.");
    }
  };

  // Extraer dinámicamente las materias que existen en los cursos cargados
  const materiasDisponibles = useMemo(() => {
    const materias = courses.map(c => c.materia).filter(Boolean) as string[];
    return Array.from(new Set(materias)).sort(); // Array único y ordenado
  }, [courses]);

  // Lógica de filtrado en tiempo real
  const filteredCourses = useMemo(() => {
    return courses.filter((curso) => {
      const cursoId = curso.id || (curso as any)._id || "";
      
      // 1. Filtro por Búsqueda (Texto)
      const matchesSearch = 
        curso.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (curso.description && curso.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Filtro por Materia
      const matchesMateria = selectedMateria === "" || curso.materia === selectedMateria;

      // 3. Filtro por Categoría (Inferimos "Oficial" por el ID temporalmente como lo tenías en CourseGrid, 
      // o usamos la prop 'categoria' si ya viene de MongoDB)
      const isOficial = curso.categoria === 'Oficial' || cursoId.startsWith('seminario') || cursoId.startsWith('analisis');
      
      let matchesCategoria = true;
      if (selectedCategoria === 'Oficial') matchesCategoria = isOficial;
      if (selectedCategoria === 'Comunidad') matchesCategoria = !isOficial;

      return matchesSearch && matchesMateria && matchesCategoria;
    });
  }, [courses, searchQuery, selectedMateria, selectedCategoria]);

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

        {/* COMPONENTE DE FILTROS APLICADO */}
        <CourseFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedMateria={selectedMateria}
          setSelectedMateria={setSelectedMateria}
          selectedCategoria={selectedCategoria}
          setSelectedCategoria={setSelectedCategoria}
          materiasDisponibles={materiasDisponibles}
        />

        {/* GRILLA CON LOS CURSOS FILTRADOS */}
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
            onCourseAdded={(newCourse) =>
              setCourses((prev) => [{ ...newCourse, localProgress: 0 }, ...prev])
            }
          />
        </Suspense>
      )}
    </DashboardLayout>
  );
};
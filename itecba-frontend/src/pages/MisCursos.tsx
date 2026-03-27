import React, { useState, useEffect, Suspense } from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { Button } from "../components/atoms/Button";
import { PageHeader } from "../components/molecules/PageHeader";

import { useAuth } from "../context/AuthContext";
import { coursesService } from "../features/courses/services/coursesService";

// Importamos el nuevo organismo
import {
  CourseGrid,
  type CourseWithLocalProgress,
} from "../features/courses/components/organisms/CourseGrid"

// 🔴 LAZY LOADING: El modal no se importa hasta que el Admin hace clic en "Subir Clase"
const AddCourseModal = React.lazy(() =>
  import("../components/organisms/AddCourseModal").then((m) => ({
    default: m.AddCourseModal,
  })),
);

export const MisCursos: React.FC = () => {
  const { isAdmin } = useAuth();

  const [courses, setCourses] = useState<CourseWithLocalProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para calcular progreso desde localStorage
  const calculateLocalProgress = (
    courseId: string,
    totalVideos: number,
  ): number => {
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
        // Mapeamos para inyectarles el progreso local
        const coursesWithProgress = dbCourses.map((course) => {
          const courseId = course.id || (course as any)._id; // 🔴 Soporte MongoDB
          return {
            ...course,
            localProgress: calculateLocalProgress(
              courseId,
              course.videos?.length || 0,
            ),
          };
        });

        setCourses(coursesWithProgress);
      })
      .catch((err) => console.error("Error cargando cursos:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (
      !window.confirm(
        "¿Seguro que deseas eliminar este curso de la base de datos?",
      )
    )
      return;

    try {
      await coursesService.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => (c.id || (c as any)._id) !== id));
      localStorage.removeItem(`itec_course_${id}`); // Limpiamos su progreso
    } catch {
      alert("Error al eliminar el curso.");
    }
  };

  return (
    <DashboardLayout>
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

      {/* 🔴 ORGANISMO: Toda la parte visual de la grilla ahora vive aquí */}
      <CourseGrid
        courses={courses}
        isLoading={isLoading}
        isAdmin={isAdmin}
        onDelete={handleDelete}
      />

      {/* 🔴 RENDERIZADO PEREZOSO: El modal y todos sus videos solo se montan si se pide */}
      {isAdmin && isModalOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          }
        >
          <AddCourseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCourseAdded={(newCourse) =>
              setCourses((prev) => [
                { ...newCourse, localProgress: 0 },
                ...prev,
              ])
            }
          />
        </Suspense>
      )}
    </DashboardLayout>
  );
};

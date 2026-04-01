import { useQuery } from '@tanstack/react-query';
import { coursesService } from '../services/coursesService'; // Tu servicio actual que hace el fetch

// Hook para obtener todos los cursos
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'], // Clave única para el caché
    queryFn: () => coursesService.getCourses(), // La función que va a Firebase/MongoDB
  });
};

// Si tuvieras una función para traer un solo curso:
export const useCourseById = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesService.getCourseById(courseId),
    enabled: !!courseId, // Solo se ejecuta si hay un ID
  });
};
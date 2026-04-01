// src/features/progress/hooks/useProgress.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { CAREERS_DATA, type SubjectDef } from '@/data/carreras';

export type CalculatedSubject = SubjectDef & {
  status: 'aprobada' | 'regular' | 'disponible' | 'bloqueada';
  grade?: number;
  year?: number;
};

export interface ProgressMetrics {
  total: number;
  aprobadas: number;
  regulares: number;
  porcentajeAprobadas: number;
  porcentajeRegulares: number;
}

export const useProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Clave única para el localStorage de este usuario
  const storageKey = `itec_progress_${user?.uid}`;

  // Cargar datos locales o crear estado inicial
  const loadUserData = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) return JSON.parse(stored);
    return {
      careerId: 'sistemas',
      passedIds: [],
      regularIds: [],
      grades: {},
      years: {}
    };
  };

  const query = useQuery({
    queryKey: ['progress', user?.uid],
    queryFn: () => {
      const userData = loadUserData();
      const careerDef = CAREERS_DATA[userData.careerId];
      
      if (!careerDef) throw new Error("Carrera no encontrada");

      const calculatedSubjects: CalculatedSubject[] = careerDef.map((subject) => {
        let status: CalculatedSubject['status'] = 'bloqueada';

        if (userData.passedIds.includes(subject.id)) {
          status = 'aprobada';
        } else if (userData.regularIds.includes(subject.id)) {
          status = 'regular';
        } else {
          // Motor de Correlativas: Verifica si cumple requisitos
          const hasCursadas = subject.reqCursada.every((reqId: string) => 
            userData.passedIds.includes(reqId) || userData.regularIds.includes(reqId)
          );
          const hasAprobadas = subject.reqAprobada.every((reqId: string) => 
            userData.passedIds.includes(reqId)
          );

          if (hasCursadas && hasAprobadas) {
            status = 'disponible';
          }
        }

        return {
          ...subject,
          status,
          grade: userData.grades[subject.id],
          year: userData.years[subject.id]
        };
      });

      // Calcular métricas reales para la barra de colores
      const total = careerDef.length;
      const aprobadas = userData.passedIds.length;
      const regulares = userData.regularIds.length;

      const metrics: ProgressMetrics = {
        total,
        aprobadas,
        regulares,
        porcentajeAprobadas: (aprobadas / total) * 100,
        porcentajeRegulares: (regulares / total) * 100,
      };

      return {
        careerName: 'Ingeniería en Sistemas de Información',
        averageGrade: 8.50, // Podrías calcularlo promediando el array grades
        totalProgress: Math.round(metrics.porcentajeAprobadas),
        metrics,
        subjects: calculatedSubjects
      };
    },
    enabled: !!user,
  });

  // Mutación para actualizar el estado
  const updateSubjectStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string, newStatus: 'aprobada' | 'regular' | 'disponible' }) => {
      const userData = loadUserData();
      
      // Limpiamos la materia de ambas listas primero
      userData.passedIds = userData.passedIds.filter((item: string) => item !== id);
      userData.regularIds = userData.regularIds.filter((item: string) => item !== id);

      // La agregamos a la lista correspondiente
      if (newStatus === 'aprobada') userData.passedIds.push(id);
      if (newStatus === 'regular') userData.regularIds.push(id);

      localStorage.setItem(storageKey, JSON.stringify(userData));
      return true;
    },
    onSuccess: () => {
      // Recarga los datos instantáneamente
      queryClient.invalidateQueries({ queryKey: ['progress', user?.uid] });
    }
  });

  return { ...query, updateSubjectStatus: updateSubjectStatus.mutate };
};
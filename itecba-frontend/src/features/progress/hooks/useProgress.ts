import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { CAREERS_DATA, type SubjectDef } from '@/data/carreras';

export type CalculatedSubject = SubjectDef & {
  status: 'aprobada' | 'regular' | 'disponible' | 'bloqueada';
  grade?: number;
  year?: number;
};

// Simulamos lo que viene de Firebase/MongoDB: Solo guardamos IDs de lo que el alumno hizo
const mockUserProgress = {
  careerId: 'sistemas',
  passedIds: ['1', '2', '3', '5', '6', '7', '8'], // Materias con final
  regularIds: ['4', '9', '11', '14'], // Materias firmadas
  grades: { '1': 8, '6': 9, '8': 10 },
  years: { '1': 2024, '6': 2024 }
};

export const useProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['progress', user?.uid],
    queryFn: async () => {
      // 1. Obtener la carrera del usuario
      const careerDef = CAREERS_DATA[mockUserProgress.careerId];
      if (!careerDef) throw new Error("Carrera no encontrada");

      // 2. Calcular el estado de cada materia automáticamente
      const calculatedSubjects: CalculatedSubject[] = careerDef.map((subject) => {
        let status: CalculatedSubject['status'] = 'bloqueada';

        if (mockUserProgress.passedIds.includes(subject.id)) {
          status = 'aprobada';
        } else if (mockUserProgress.regularIds.includes(subject.id)) {
          status = 'regular';
        } else {
          // Lógica de Correlativas: ¿Cumple los requisitos para cursar?
          const hasCursadas = subject.reqCursada.every(reqId => 
            mockUserProgress.passedIds.includes(reqId) || mockUserProgress.regularIds.includes(reqId)
          );
          const hasAprobadas = subject.reqAprobada.every(reqId => 
            mockUserProgress.passedIds.includes(reqId)
          );

          if (hasCursadas && hasAprobadas) {
            status = 'disponible';
          }
        }

        return {
          ...subject,
          status,
          grade: mockUserProgress.grades[subject.id as keyof typeof mockUserProgress.grades],
          year: mockUserProgress.years[subject.id as keyof typeof mockUserProgress.years]
        };
      });

      const totalAprobadas = mockUserProgress.passedIds.length;
      const progressPercentage = Math.round((totalAprobadas / careerDef.length) * 100);

      return {
        careerName: 'Ingeniería en Sistemas de Información',
        averageGrade: 9.00,
        totalProgress: progressPercentage,
        subjects: calculatedSubjects
      };
    },
    enabled: !!user,
  });
};
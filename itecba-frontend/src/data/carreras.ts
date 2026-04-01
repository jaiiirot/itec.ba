export interface SubjectDef {
  id: string; // El número de la materia según el plan
  name: string;
  code: string;
  level: number;
  reqCursada: string[]; // IDs de materias que deben estar regulares o aprobadas para cursar
  reqAprobada: string[]; // IDs de materias que deben estar aprobadas (final dado) para cursar
}

export const SISTEMAS_PLAN_2023: SubjectDef[] = [
  // NIVEL 1
  { id: '1', name: 'Análisis Matemático I', code: 'AM1', level: 1, reqCursada: [], reqAprobada: [] },
  { id: '2', name: 'Álgebra y Geometría Analítica', code: 'AGA', level: 1, reqCursada: [], reqAprobada: [] },
  { id: '3', name: 'Física I', code: 'F1', level: 1, reqCursada: [], reqAprobada: [] },
  { id: '4', name: 'Inglés I', code: 'ING1', level: 1, reqCursada: [], reqAprobada: [] },
  { id: '5', name: 'Lógica y Estructuras Discretas', code: 'LyED', level: 1, reqCursada: [], reqAprobada: [] },
  { id: '6', name: 'Algoritmos y Estructuras de Datos', code: 'AyED', level: 1, reqCursada: [], reqAprobada: [] },
  { id: '7', name: 'Arquitectura de Computadoras', code: 'AdC', level: 1, reqCursada: [], reqAprobada: [] },
  { id: '8', name: 'Sistemas y Procesos de Negocio', code: 'SyPN', level: 1, reqCursada: [], reqAprobada: [] },
  
  // NIVEL 2
  { id: '9', name: 'Análisis Matemático II', code: 'AM2', level: 2, reqCursada: ['1', '2'], reqAprobada: [] },
  { id: '10', name: 'Física II', code: 'F2', level: 2, reqCursada: ['1', '3'], reqAprobada: [] },
  { id: '11', name: 'Ingeniería y Sociedad', code: 'IyS', level: 2, reqCursada: [], reqAprobada: [] },
  { id: '12', name: 'Inglés II', code: 'ING2', level: 2, reqCursada: ['4'], reqAprobada: [] },
  { id: '13', name: 'Sintaxis y Semántica de los Lenguajes', code: 'SySL', level: 2, reqCursada: ['5', '6'], reqAprobada: [] },
  { id: '14', name: 'Paradigmas de Programación', code: 'PdP', level: 2, reqCursada: ['5', '6'], reqAprobada: [] },
  { id: '15', name: 'Sistemas Operativos', code: 'SSOO', level: 2, reqCursada: ['7'], reqAprobada: [] },
  { id: '16', name: 'Análisis de Sistemas de Información', code: 'ASI', level: 2, reqCursada: ['6', '8'], reqAprobada: [] },
  { id: '17', name: 'Probabilidad y Estadística', code: 'PyE', level: 2, reqCursada: ['1', '2'], reqAprobada: [] },
  { id: '18', name: 'Economía', code: 'ECO', level: 2, reqCursada: [], reqAprobada: ['1', '2'] },

  // NIVEL 3
  { id: '19', name: 'Bases de Datos', code: 'BD', level: 3, reqCursada: ['13', '16'], reqAprobada: ['5', '6'] },
  { id: '20', name: 'Desarrollo de Software', code: 'DdS', level: 3, reqCursada: ['14', '16'], reqAprobada: ['5', '6'] },
  { id: '21', name: 'Comunicación de Datos', code: 'CD', level: 3, reqCursada: [], reqAprobada: ['3', '7'] },
  { id: '22', name: 'Análisis Numérico', code: 'AN', level: 3, reqCursada: ['9'], reqAprobada: ['1', '2'] },
  { id: '23', name: 'Diseño de Sistemas de Información', code: 'DSI', level: 3, reqCursada: ['14', '16'], reqAprobada: ['4', '6', '8'] },
  { id: '24', name: 'Legislación', code: 'LEG', level: 3, reqCursada: ['11'], reqAprobada: [] },

  // Puedes continuar agregando el Nivel 4 y 5 basándote en la página 43 del PDF
];

export const CAREERS_DATA: Record<string, SubjectDef[]> = {
  'sistemas': SISTEMAS_PLAN_2023,
  // Aquí podrás agregar 'civil': CIVIL_PLAN_2023, etc.
};
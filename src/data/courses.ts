// 1. Interfaz para que TypeScript sepa qué estructura tienen tus cursos
export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  videoCount: number;
  playlistId: string; // ID para abrir la playlist en YouTube o en tu detalle
}

// 2. Base de datos extraída de las listas de reproducción de @itecBA
export const COURSE_DATA: Course[] = [
  {
    id: 'seminario-teoricas',
    title: 'Clases Teóricas - Seminario de Ingreso',
    description: 'Clases completas de todas las unidades del seminario.',
    progress: 0,
    imageUrl: 'https://i.ytimg.com/vi/i5uk2fCBlhE/hqdefault.jpg',
    videoCount: 7,
    playlistId: 'PLwsKzpcUoYOYcjSJl3rGrd8o7C8WXby6s'
  },
  {
    id: 'consulta-ingreso',
    title: 'Espacio de Consultas - Ingreso',
    description: 'Resolución de dudas generales y ejercicios.',
    progress: 45,
    imageUrl: 'https://i.ytimg.com/vi/Ffe3MnBquoo/hqdefault.jpg',
    videoCount: 25,
    playlistId: 'PLwsKzpcUoYOYcjSJl3rGrd8o7C8WXby6s' // Ajustar con el ID real de esta playlist
  },
  {
    id: 'analisis-mat-i',
    title: 'Consultas - Análisis Matemático I',
    description: 'Repaso de integrales, derivadas y límites.',
    progress: 10,
    imageUrl: 'https://i.ytimg.com/vi/i5uk2fCBlhE/hqdefault.jpg',
    videoCount: 1,
    playlistId: 'PLwsKzpcUoYOYcjSJl3rGrd8o7C8WXby6s'
  },
  {
    id: 'algebra',
    title: 'Consultas - Álgebra y Geometría Analítica',
    description: 'Vectores, matrices y espacios vectoriales.',
    progress: 0,
    imageUrl: 'https://i.ytimg.com/vi/RcV851uOm4Q/hqdefault.jpg',
    videoCount: 2,
    playlistId: 'PLwsKzpcUoYOYcjSJl3rGrd8o7C8WXby6s'
  },
  {
    id: 'podcast',
    title: 'Podcast: Entre Mates y Finales',
    description: 'Charlas sobre la vida universitaria y tips.',
    progress: 80,
    imageUrl: 'https://i.ytimg.com/vi/0v7LC-ZlE-U/hqdefault.jpg',
    videoCount: 1,
    playlistId: 'PLwsKzpcUoYOYcjSJl3rGrd8o7C8WXby6s'
  }
];
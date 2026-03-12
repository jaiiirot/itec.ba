// 1. Interfaces
export interface Video {
  id: string;          // ID interno
  youtubeId: string;   // ID real del video de YouTube (lo que va después de ?v=)
  title: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  playlistId: string;
  videos: Video[];     // Agregamos el array de videos
}

// 2. Base de datos simulada de Playlists y Videos
export const COURSE_DATA: Course[] = [
  {
    id: 'seminario-teoricas',
    title: 'Clases Teóricas - Seminario de Ingreso',
    description: 'Clases completas de todas las unidades del seminario de ingreso.',
    progress: 25,
    imageUrl: 'https://i.ytimg.com/vi/1_M0a9vJq_Q/hqdefault.jpg',
    playlistId: 'PLwsKzpcUoYOYcjSJl3rGrd8o7C8WXby6s',
    videos: [
      { id: 'v1', youtubeId: '1_M0a9vJq_Q', title: 'Unidad 1: Números Reales', duration: '1:24:10' },
      { id: 'v2', youtubeId: 'fX94qM_J4vQ', title: 'Unidad 2: Ecuaciones y Polinomios', duration: '1:45:20' },
      { id: 'v3', youtubeId: '7XqJ_5P_q4o', title: 'Unidad 3: Funciones', duration: '1:30:05' },
      { id: 'v4', youtubeId: 'a3_y8qZ4q_U', title: 'Unidad 4: Trigonometría', duration: '2:10:15' },
      { id: 'v5', youtubeId: 'B5_p0Z_k9_Y', title: 'Unidad 10: Introducción a la Física', duration: '1:55:00' },
    ]
  },
  {
    id: 'analisis-mat-i',
    title: 'Clase de Consulta - Análisis Matemático I',
    description: 'Repaso general de funciones, límites, derivadas e integrales para finales.',
    progress: 0,
    imageUrl: 'https://i.ytimg.com/vi/Ffe3MnBquoo/hqdefault.jpg',
    playlistId: 'AM1_PLAYLIST',
    videos: [
      { id: 'v1', youtubeId: 'Ffe3MnBquoo', title: 'Consulta AM1 - Preparación para Finales (Parte 1)', duration: '2:05:33' },
      { id: 'v2', youtubeId: 'X9_M4qJ_8vQ', title: 'Consulta AM1 - Integrales Múltiples', duration: '1:40:12' }
    ]
  },
  {
    id: 'arquitectura',
    title: 'Clase de Consulta - Arquitectura de Computadoras',
    description: 'Resolución de dudas sobre Assembler, Memorias y Procesadores.',
    progress: 100,
    imageUrl: 'https://i.ytimg.com/vi/Z_q3M4_J8vQ/hqdefault.jpg', // Placeholder
    playlistId: 'ARQ_PLAYLIST',
    videos: [
      { id: 'v1', youtubeId: 'dQw4w9WgXcQ', title: 'Repaso Parcial 1: Sistemas de Numeración', duration: '1:15:00' },
      { id: 'v2', youtubeId: 'y6120QOlsfU', title: 'Consulta: Ejercicios de Memoria Caché', duration: '55:20' },
      { id: 'v3', youtubeId: '3JZ_D3ELwOQ', title: 'Programación en Assembly (Intel 8086)', duration: '1:30:00' },
    ]
  },
  {
    id: 'podcast',
    title: 'Podcast: Entre Mates y Finales',
    description: 'Charlas sobre la vida universitaria, tips de estudio y experiencias en la UTN.',
    progress: 0,
    imageUrl: 'https://i.ytimg.com/vi/0v7LC-ZlE-U/hqdefault.jpg',
    playlistId: 'PODCAST_PLAYLIST',
    videos: [
      { id: 'v1', youtubeId: '0v7LC-ZlE-U', title: 'Ep. 1: Cómo sobrevivir al primer año', duration: '45:12' },
      { id: 'v2', youtubeId: '7XqJ_5P_q4o', title: 'Ep. 2: Eligiendo materias electivas', duration: '50:30' },
    ]
  }
];

// Función para simular una llamada a la API (Buscar por ID)
export const getCourseById = (id: string): Course | undefined => {
  return COURSE_DATA.find(course => course.id === id);
};
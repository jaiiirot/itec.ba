export interface DirectoryItem {
  id: string;
  title: string;
  description: string;
  category: 'Ingreso' | 'Grado' | 'Trámites' | 'Nosotros';
  link: string;
}

export const DIRECTORY_DB: DirectoryItem[] = [
  // Inicio / Trámites
  { id: 't1', title: 'tarjeTEC', description: 'Pedí tu tarjeta de beneficios ITEC', category: 'Trámites', link: '/tramites' },
  { id: 't2', title: 'Becas Universitarias YPF', description: 'Información y postulación a becas', category: 'Trámites', link: '/tramites' },
  { id: 't3', title: 'Aulas Virtuales', description: 'Acceso al campus virtual UTN BA', category: 'Trámites', link: '#' },
  { id: 't4', title: 'Mapa Sede Campus', description: 'Ubicación Mozart 2300', category: 'Trámites', link: '#' },
  
  // Ingreso
  { id: 'i1', title: 'Material de Estudio TIVU', description: 'Resumen TIVU y Teoría Matemática/Física', category: 'Ingreso', link: '/ingreso' },
  { id: 'i2', title: 'Parciales y Finales de Ingreso', description: 'Resueltos paso a paso', category: 'Ingreso', link: '/ingreso' },
  { id: 'i3', title: 'Simulacro 2do Parcial', description: 'Inscribite al simulacro de ingreso', category: 'Ingreso', link: '/ingreso' },
  
  // Grado
  { id: 'g1', title: 'Planes de Estudio 23', description: 'Nuevos planes para todas las ingenierías', category: 'Grado', link: '/grado' },
  { id: 'g2', title: 'Materias Electivas', description: 'Catálogo de electivas por carrera', category: 'Grado', link: '/grado' },
  
  // Nosotros
  { id: 'n1', title: 'Sumate a ✳️TEC', description: 'Formulario para unirte a la agrupación', category: 'Nosotros', link: '/nosotros' },
  { id: 'n2', title: 'Balance General', description: 'Transparencia y cuentas claras', category: 'Nosotros', link: '/nosotros' }
];
export interface GroupData {
  id: string;
  carrera: string;
  nivel: string;
  materia: string;
  comision: string;
  link: string;
  tipo: 'Oficial' | 'Alumnos';
}

export const GROUPS_DB: GroupData[] = [
  // Sistemas
  { id: '1', carrera: 'sistemas', nivel: '1', materia: 'Análisis Matemático I', comision: 'K1043', link: '#', tipo: 'Oficial' },
  { id: '2', carrera: 'sistemas', nivel: '1', materia: 'Álgebra y Geometría Analítica', comision: 'K1043', link: '#', tipo: 'Oficial' },
  { id: '3', carrera: 'sistemas', nivel: '1', materia: 'Algoritmos y Estructuras de Datos', comision: 'K1043', link: '#', tipo: 'Oficial' },
  { id: '4', carrera: 'sistemas', nivel: '2', materia: 'Análisis Matemático II', comision: 'K2051', link: '#', tipo: 'Alumnos' },
  { id: '5', carrera: 'sistemas', nivel: '2', materia: 'Sintaxis y Semántica de los Lenguajes', comision: 'K2051', link: '#', tipo: 'Oficial' },
  { id: '6', carrera: 'sistemas', nivel: '3', materia: 'Diseño de Sistemas', comision: 'K3022', link: '#', tipo: 'Alumnos' },
  
  // Ingreso
  { id: '7', carrera: 'ingreso', nivel: '0', materia: 'Módulo B', comision: 'E0012', link: '#', tipo: 'Oficial' },
  { id: '8', carrera: 'ingreso', nivel: '0', materia: 'Seminario de Ingreso', comision: 'General', link: '#', tipo: 'Alumnos' },

  // Industrial
  { id: '9', carrera: 'industrial', nivel: '1', materia: 'Física I', comision: 'I1020', link: '#', tipo: 'Oficial' },
  { id: '10', carrera: 'industrial', nivel: '2', materia: 'Estudio del Trabajo', comision: 'I2015', link: '#', tipo: 'Alumnos' },
  
  // Electrónica
  { id: '11', carrera: 'electronica', nivel: '1', materia: 'Informática I', comision: 'R1011', link: '#', tipo: 'Oficial' },
  { id: '12', carrera: 'electronica', nivel: '3', materia: 'Electrónica Aplicada I', comision: 'R3055', link: '#', tipo: 'Alumnos' },
  
  // Homogéneas
  { id: '13', carrera: 'homogeneas1', nivel: '1', materia: 'Ingeniería y Sociedad', comision: 'Z1099', link: '#', tipo: 'Oficial' },
  { id: '14', carrera: 'homogeneas2', nivel: '2', materia: 'Probabilidad y Estadística', comision: 'Z2014', link: '#', tipo: 'Alumnos' },
];
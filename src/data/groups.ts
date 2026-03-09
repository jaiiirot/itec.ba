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
  // ==========================================
  // COMUNIDADES GENERALES (Oficiales ITEC)
  // ==========================================
  { id: 'itec_basicas_1', carrera: 'homogeneas1', nivel: 'General', materia: 'Comunidad Básicas I', comision: 'General', link: 'https://chat.whatsapp.com/HPEFNAHIqIIABpna0p0Mjj', tipo: 'Oficial' },
  { id: 'itec_basicas_2', carrera: 'homogeneas2', nivel: 'General', materia: 'Comunidad Básicas II', comision: 'General', link: 'https://chat.whatsapp.com/FyDAM5IZERvC7KmhwetR2I', tipo: 'Oficial' },
  { id: 'itec_civil', carrera: 'civil', nivel: 'General', materia: 'Comunidad Civil', comision: 'General', link: 'https://chat.whatsapp.com/JKiTa2rg5RVGdQESAhx9sm', tipo: 'Oficial' },
  { id: 'itec_electrica', carrera: 'electrica', nivel: 'General', materia: 'Comunidad Energía Eléctrica', comision: 'General', link: 'https://chat.whatsapp.com/JCO7s0cskas7q3NyCB2ivA', tipo: 'Oficial' },
  { id: 'itec_electronica', carrera: 'electronica', nivel: 'General', materia: 'Comunidad Electrónica', comision: 'General', link: 'https://chat.whatsapp.com/KTsbXqiRbRx26sBuQ3Z6UV', tipo: 'Oficial' },
  { id: 'itec_industrial', carrera: 'industrial', nivel: 'General', materia: 'Comunidad Industrial', comision: 'General', link: 'https://chat.whatsapp.com/CUyNKsby41tJczZmjaOv7D', tipo: 'Oficial' },
  { id: 'itec_mecanica', carrera: 'mecanica', nivel: 'General', materia: 'Comunidad Mecánica', comision: 'General', link: 'https://chat.whatsapp.com/DVuWxXlVEmsFDh6xAp0Uj0', tipo: 'Oficial' },
  { id: 'itec_naval', carrera: 'naval', nivel: 'General', materia: 'Comunidad Naval (No Formal)', comision: 'General', link: 'https://chat.whatsapp.com/Jrlu9mMUZgn2aEss3nJsbg', tipo: 'Oficial' },
  { id: 'itec_quimica', carrera: 'quimica', nivel: 'General', materia: 'Comunidad Química', comision: 'General', link: 'https://chat.whatsapp.com/CGSo9jNg6EAl1lbPbmGGK2', tipo: 'Oficial' },
  { id: 'itec_sistemas', carrera: 'sistemas', nivel: 'General', materia: 'Comunidad Sistemas', comision: 'General', link: 'https://chat.whatsapp.com/Ktq8BKAZma97cZE9VR228T', tipo: 'Oficial' },
  { id: 'itec_sistemas_materias', carrera: 'sistemas', nivel: 'General', materia: 'Materias de Sistemas', comision: 'General', link: 'https://chat.whatsapp.com/Dknxt7vGxnEAegm8VqJJG6', tipo: 'Oficial' },

  // ==========================================
  // GRUPOS POR MATERIA / COMISIÓN
  // ==========================================
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
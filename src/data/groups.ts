export const CARRERAS_OPTIONS = [
  { value: 'sistemas', label: 'Ingeniería en Sistemas' },
  { value: 'industrial', label: 'Ingeniería Industrial' },
  { value: 'civil', label: 'Ingeniería Civil' },
  { value: 'electronica', label: 'Ingeniería Electrónica' },
  { value: 'electrica', label: 'Ingeniería Eléctrica' },
  { value: 'mecanica', label: 'Ingeniería Mecánica' },
  { value: 'quimica', label: 'Ingeniería Química' },
  { value: 'naval', label: 'Ingeniería Naval' },
  { value: 'ingreso', label: 'Seminario de Ingreso' },
];

export const NIVEL_OPTIONS = [
  { value: '0', label: 'Nivel 0 (Ingreso)' },
  { value: '1', label: 'Nivel 1 (Primer Año)' },
  { value: '2', label: 'Nivel 2 (Segundo Año)' },
  { value: '3', label: 'Nivel 3 (Tercer Año)' },
  { value: '4', label: 'Nivel 4 (Cuarto Año)' },
  { value: '5', label: 'Nivel 5 (Quinto Año)' },
  { value: '6', label: 'Electivas' },
];

// MATERIAS EN CASCADA: Mapeadas desde los PDF Oficiales UTN.BA
export const MATERIAS_POR_CARRERA: Record<string, Record<string, string[]>> = {
  ingreso: {
    '0': ['Matemática', 'Física', 'Módulo B', 'Seminario de Ingreso Universitario']
  },
  sistemas: {
    '1': ['Análisis Matemático I', 'Álgebra y Geometría Analítica', 'Física I', 'Inglés I', 'Lógica y Estructuras Discretas', 'Algoritmos y Estructuras de Datos', 'Arquitectura de Computadoras', 'Sistemas y Procesos de Negocio'],
    '2': ['Análisis Matemático II', 'Física II', 'Ingeniería y Sociedad', 'Inglés II', 'Sintaxis y Semántica de los Lenguajes', 'Paradigmas de Programación', 'Sistemas Operativos', 'Análisis de Sistemas de Información'],
    '3': ['Probabilidad y Estadística', 'Economía', 'Bases de Datos', 'Desarrollo de Software', 'Comunicación de Datos', 'Análisis Numérico', 'Diseño de Sistemas de Información'],
    '4': ['Legislación', 'Ingeniería y Calidad de Software', 'Redes de Datos', 'Investigación Operativa', 'Simulación', 'Tecnologías para la Automatización', 'Administración de Sistemas de Información'],
    '5': ['Inteligencia Artificial', 'Ciencia de Datos', 'Sistemas de Gestión', 'Administración Gerencial', 'Proyecto Final'],
    '6': ['Electivas de Sistemas'] 
  },
  industrial: {
    '1': ['Análisis Matemático I', 'Química General', 'Álgebra y Geometría Analítica', 'Física I', 'Sistemas de Representación', 'Ingeniería y Sociedad', 'Pensamiento Sistémico', 'Informática I'],
    '2': ['Administración General', 'Análisis Matemático II', 'Física II', 'Probabilidad y Estadística', 'Economía General', 'Inglés I', 'Ciencia de los Materiales'],
    '3': ['Estudio del Trabajo', 'Comercialización', 'Termodinámica y Máquinas Térmicas', 'Mecánica de los Fluidos', 'Mecánica y Mecanismos', 'Diseño de Producto', 'Inglés II', 'Costos y Presupuestos', 'Estadística Industrial'],
    '4': ['Mantenimiento', 'Procesos de Fabricación', 'Legislación', 'Electrotecnia', 'Instalaciones Industriales', 'Investigación Operativa', 'Planificación y Control de la Producción'],
    '5': ['Economía de la Empresa', 'Gestión Ambiental', 'Relaciones Industriales', 'Control de Gestión', 'Gestión de la Calidad', 'Proyecto Final'],
    '6': ['Electivas Industrial']
  },
  civil: {
    '1': ['Análisis Matemático I', 'Álgebra y Geometría Analítica', 'Ingeniería y Sociedad', 'Ingeniería Civil I', 'Sistemas de Representación', 'Química General', 'Física I', 'Fundamentos de Informática'],
    '2': ['Análisis Matemático II', 'Física II', 'Probabilidad y Estadística', 'Estática', 'Estudio de Ensayos y Materiales', 'Topografía', 'Inglés I'],
    '3': ['Resistencia de Materiales', 'Tecnología del Hormigón', 'Hidráulica General', 'Geotecnia', 'Inglés II', 'Diseño Arquitectónico'],
    '4': ['Cálculo Estructural', 'Hormigón Armado', 'Instalaciones en Edificios', 'Ingeniería Sanitaria', 'Vías de Comunicación I', 'Hidrología'],
    '5': ['Organización y Conducción de Obras', 'Diseño Estructural', 'Vías de Comunicación II', 'Ingeniería Legal', 'Proyecto Final'],
    '6': ['Electivas Civil']
  },
  electronica: {
    '1': ['Análisis Matemático I', 'Álgebra y Geometría Analítica', 'Física I', 'Química General', 'Ingeniería y Sociedad', 'Sistemas de Representación', 'Fundamentos de Informática'],
    '2': ['Análisis Matemático II', 'Física II', 'Probabilidad y Estadística', 'Informática I', 'Inglés I', 'Teoría de Circuitos I', 'Técnicas Digitales I', 'Dispositivos Electrónicos'],
    '3': ['Legislación', 'Electrónica Aplicada I', 'Medios de Enlace', 'Inglés II', 'Técnicas Digitales II', 'Medidas Electrónicas I', 'Teoría de Circuitos II'],
    '4': ['Máquinas e Instalaciones Eléctricas', 'Sistemas de Comunicaciones', 'Electrónica Aplicada II', 'Seguridad, Higiene y Medio Ambiente', 'Técnicas Digitales III', 'Medidas Electrónicas II', 'Sistemas de Control'],
    '5': ['Organización Industrial', 'Electrónica Aplicada III', 'Sistemas de Control II', 'Comunicaciones Digitales', 'Proyecto Final'],
    '6': ['Electivas Electrónica']
  },
  electrica: {
    '1': ['Análisis Matemático I', 'Álgebra y Geometría Analítica', 'Ingeniería y Sociedad', 'Sistemas de Representación', 'Física I', 'Química General', 'Integración Eléctrica I', 'Fundamentos de Informática'],
    '2': ['Análisis Matemático II', 'Física II', 'Probabilidad y Estadística', 'Inglés I', 'Electrotecnia I', 'Cálculo Numérico', 'Termodinámica'],
    '3': ['Electrotecnia II', 'Máquinas Eléctricas I', 'Materiales Electrotécnicos', 'Inglés II', 'Mecánica de Fluidos', 'Seguridad y Medio Ambiente'],
    '4': ['Máquinas Eléctricas II', 'Transmisión y Distribución', 'Sistemas de Potencia', 'Electrónica Industrial', 'Mediciones Eléctricas'],
    '5': ['Generación de Energía', 'Protecciones Eléctricas', 'Organización y Economía', 'Proyecto Final'],
    '6': ['Electivas Eléctrica']
  },
  mecanica: {
    '1': ['Análisis Matemático I', 'Álgebra y Geometría Analítica', 'Física I', 'Química General', 'Ingeniería y Sociedad', 'Sistemas de Representación', 'Ingeniería Mecánica I', 'Informática'],
    '2': ['Análisis Matemático II', 'Física II', 'Probabilidad y Estadística', 'Estabilidad I', 'Materiales Metálicos', 'Termodinámica', 'Inglés I'],
    '3': ['Estabilidad II', 'Mecánica de Fluidos', 'Mecanismos', 'Electrotecnia', 'Materiales No Metálicos', 'Inglés II'],
    '4': ['Estabilidad III', 'Elementos de Máquinas', 'Máquinas Térmicas', 'Máquinas Fluidodinámicas', 'Electrónica y Sistemas de Control'],
    '5': ['Tecnología de Fabricación', 'Mantenimiento Mecánico', 'Organización Industrial', 'Proyecto Final'],
    '6': ['Electivas Mecánica']
  },
  quimica: {
    '1': ['Introducción a la Ingeniería Química', 'Ingeniería y Sociedad', 'Álgebra y Geometría Analítica', 'Análisis Matemático I', 'Química', 'Sistemas de Representación', 'Inglés I', 'Fundamentos de Informática'],
    '2': ['Introducción a Equipos y Procesos', 'Probabilidad y Estadística', 'Química Inorgánica', 'Física I', 'Análisis Matemático II'],
    '3': ['Física II', 'Fisicoquímica', 'Química Orgánica', 'Termodinámica', 'Inglés II', 'Balances de Masa y Energía'],
    '4': ['Fenómenos de Transporte', 'Operaciones Unitarias I', 'Química Analítica', 'Ingeniería de las Reacciones Químicas', 'Microbiología'],
    '5': ['Operaciones Unitarias II', 'Control de Procesos', 'Diseño de Plantas', 'Proyecto Final'],
    '6': ['Electivas Química']
  },
  naval: {
    '1': ['Álgebra y Geometría Analítica', 'Análisis Matemático I', 'Física I', 'Química General', 'Introducción a la Ing. Naval', 'Sistemas de Representación', 'Inglés I', 'Fundamentos de Informática'],
    '2': ['Análisis Matemático II', 'Física II', 'Probabilidad y Estadística', 'Ingeniería y Sociedad', 'Estática y Resistencia de Materiales', 'Termodinámica'],
    '3': ['Arquitectura Naval I', 'Estructuras Navales I', 'Mecánica de los Fluidos', 'Inglés II', 'Máquinas Marinas I'],
    '4': ['Arquitectura Naval II', 'Estructuras Navales II', 'Máquinas Marinas II', 'Proyecto de Buques I', 'Electricidad Marítima'],
    '5': ['Proyecto de Buques II', 'Construcción Naval', 'Transporte Marítimo', 'Proyecto Final'],
    '6': ['Electivas Naval']
  }
};
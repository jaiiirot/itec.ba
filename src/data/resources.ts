export interface Resource {
  id: string;
  title: string;
  subject: string;
  specialty: string;
  type: string;
  author: string;
  date: string;
  size: string;
  fileUrl: string;
}

export const RESOURCES_DB: Resource[] = [
  // Básicas / Homogéneas
  { id: '1', title: 'Resumen Completo AM1 (Límite a Integrales)', subject: 'Análisis Matemático I', specialty: 'Básicas', type: 'Resumen', author: 'Dem0', date: '12/03/2026', size: '2.4 MB', fileUrl: '#' },
  { id: '2', title: 'Final Resuelto 15/02/2026', subject: 'Álgebra y Geometría', specialty: 'Básicas', type: 'Final', author: 'GuidoM', date: '16/02/2026', size: '1.1 MB', fileUrl: '#' },
  { id: '3', title: 'Guía de Ejercicios Cinemática', subject: 'Física I', specialty: 'Básicas', type: 'Guía', author: 'Catedra', date: '01/03/2026', size: '5.0 MB', fileUrl: '#' },
  { id: '4', title: 'Parcial 1 Tema A Resuelto', subject: 'Química General', specialty: 'Básicas', type: 'Parcial', author: 'Ana_K', date: '10/05/2025', size: '800 KB', fileUrl: '#' },
  { id: '5', title: 'Fórmulas de Probabilidad', subject: 'Probabilidad y Estadística', specialty: 'Básicas', type: 'Resumen', author: 'chilaverto', date: '22/08/2025', size: '400 KB', fileUrl: '#' },
  { id: '6', title: 'TP Laboratorio 1', subject: 'Física II', specialty: 'Básicas', type: 'TP', author: 'Grupo 4', date: '10/04/2025', size: '3.2 MB', fileUrl: '#' },
  { id: '7', title: 'Parcial 2 Resuelto', subject: 'Análisis Matemático II', specialty: 'Básicas', type: 'Parcial', author: 'Jairo', date: '15/11/2025', size: '1.5 MB', fileUrl: '#' },
  { id: '8', title: 'Resumen Teórico Completo', subject: 'Ingeniería y Sociedad', specialty: 'Básicas', type: 'Resumen', author: 'viktorxD', date: '04/04/2025', size: '1.2 MB', fileUrl: '#' },
  { id: '9', title: 'Final Diciembre 2025', subject: 'Álgebra y Geometría', specialty: 'Básicas', type: 'Final', author: 'Dem0', date: '20/12/2025', size: '950 KB', fileUrl: '#' },
  { id: '10', title: 'Tabla de Integrales', subject: 'Análisis Matemático I', specialty: 'Básicas', type: 'Apunte', author: 'Catedra', date: '01/03/2026', size: '250 KB', fileUrl: '#' },
  
  // Sistemas
  { id: '11', title: 'Final ADS 03/03/2026 Resuelto', subject: 'Algoritmos y Estructuras', specialty: 'Sistemas', type: 'Final', author: 'Sebastian1', date: '04/03/2026', size: '1.8 MB', fileUrl: '#' },
  { id: '12', title: 'Parciales DdSI 2025 (Bulgarelli)', subject: 'Diseño de Sistemas', specialty: 'Sistemas', type: 'Parcial', author: 'chilaverto', date: '03/03/2026', size: '4.2 MB', fileUrl: '#' },
  { id: '13', title: 'Resumen Paradigmas (Lógico, Funcional, Objetos)', subject: 'Paradigmas de Programación', specialty: 'Sistemas', type: 'Resumen', author: 'PdeP_Lover', date: '15/09/2025', size: '3.1 MB', fileUrl: '#' },
  { id: '14', title: 'TP Gestión de Datos (SQL)', subject: 'Gestión de Datos', specialty: 'Sistemas', type: 'TP', author: 'SQL_Master', date: '10/10/2025', size: '1.1 MB', fileUrl: '#' },
  { id: '15', title: 'Modelos de Final', subject: 'Sistemas y Procesos de Negocio', specialty: 'Sistemas', type: 'Final', author: 'Jairo', date: '28/02/2026', size: '2.0 MB', fileUrl: '#' },
  { id: '16', title: 'Apunte Arquitectura (RISC/CISC)', subject: 'Arquitectura de Computadoras', specialty: 'Sistemas', type: 'Apunte', author: 'HardwareFan', date: '05/05/2025', size: '5.5 MB', fileUrl: '#' },
  { id: '17', title: 'Ejercicios de Redes (Cisco)', subject: 'Redes de Información', specialty: 'Sistemas', type: 'Guía', author: 'NetAdmin', date: '12/06/2025', size: '8.2 MB', fileUrl: '#' },
  { id: '18', title: 'Resumen Sistemas Operativos', subject: 'Sistemas Operativos', specialty: 'Sistemas', type: 'Resumen', author: 'Dem0', date: '18/07/2025', size: '4.7 MB', fileUrl: '#' },
  { id: '19', title: 'Parcial 1 Resuelto (Mañana)', subject: 'Sintaxis y Semántica', specialty: 'Sistemas', type: 'Parcial', author: 'Compiler', date: '22/05/2025', size: '900 KB', fileUrl: '#' },
  { id: '20', title: 'Glosario de Ingeniería de Software', subject: 'Ingeniería de Software', specialty: 'Sistemas', type: 'Apunte', author: 'IngSoft', date: '30/08/2025', size: '600 KB', fileUrl: '#' },
  { id: '21', title: 'Simulador Assembly', subject: 'Arquitectura de Computadoras', specialty: 'Sistemas', type: 'Software', author: 'Catedra', date: '01/03/2025', size: '12.0 MB', fileUrl: '#' },
  { id: '22', title: 'Final Febrero 2026', subject: 'Diseño de Sistemas', specialty: 'Sistemas', type: 'Final', author: 'GuidoM', date: '20/02/2026', size: '2.2 MB', fileUrl: '#' },

  // Industrial
  { id: '23', title: 'Estudio de Tiempos y Métodos', subject: 'Estudio del Trabajo', specialty: 'Industrial', type: 'Resumen', author: 'Indus101', date: '14/04/2025', size: '3.4 MB', fileUrl: '#' },
  { id: '24', title: 'Parcial Termodinámica', subject: 'Termodinámica', specialty: 'Industrial', type: 'Parcial', author: 'Termo_UTN', date: '25/06/2025', size: '1.7 MB', fileUrl: '#' },
  { id: '25', title: 'Resumen Economía General', subject: 'Economía', specialty: 'Industrial', type: 'Resumen', author: 'EcoUTN', date: '10/03/2025', size: '2.1 MB', fileUrl: '#' },
  { id: '26', title: 'TP Layout Planta', subject: 'Distribución de Planta', specialty: 'Industrial', type: 'TP', author: 'Planta_Grupo1', date: '05/11/2025', size: '15.0 MB', fileUrl: '#' },
  { id: '27', title: 'Final Comercialización', subject: 'Comercialización', specialty: 'Industrial', type: 'Final', author: 'MarketingUTN', date: '18/12/2025', size: '1.3 MB', fileUrl: '#' },
  { id: '28', title: 'Guía Estática de los Fluidos', subject: 'Mecánica de Fluidos', specialty: 'Industrial', type: 'Guía', author: 'FluidoMax', date: '02/09/2025', size: '4.8 MB', fileUrl: '#' },
  { id: '29', title: 'Resumen Procesos Industriales', subject: 'Procesos Industriales', specialty: 'Industrial', type: 'Resumen', author: 'ProcesosOK', date: '20/10/2025', size: '6.2 MB', fileUrl: '#' },
  { id: '30', title: 'Parcial 1 - Turno Noche', subject: 'Estudio del Trabajo', specialty: 'Industrial', type: 'Parcial', author: 'NocheIndus', date: '15/05/2025', size: '1.1 MB', fileUrl: '#' },

  // Electrónica
  { id: '31', title: 'Diseño de PCB (Altium)', subject: 'Técnicas Digitales', specialty: 'Electrónica', type: 'Guía', author: 'Voltio', date: '11/04/2025', size: '8.5 MB', fileUrl: '#' },
  { id: '32', title: 'Resumen Dispositivos Electrónicos', subject: 'Dispositivos Electrónicos', specialty: 'Electrónica', type: 'Resumen', author: 'Transistor', date: '22/05/2025', size: '3.9 MB', fileUrl: '#' },
  { id: '33', title: 'Final Análisis de Señales', subject: 'Análisis de Señales', specialty: 'Electrónica', type: 'Final', author: 'Fourier', date: '10/02/2026', size: '2.5 MB', fileUrl: '#' },
  { id: '34', title: 'Código VHDL Microcontroladores', subject: 'Microcontroladores', specialty: 'Electrónica', type: 'Código', author: 'Catedra', date: '05/08/2025', size: '1.2 MB', fileUrl: '#' },
  { id: '35', title: 'Parcial Sistemas de Control', subject: 'Sistemas de Control', specialty: 'Electrónica', type: 'Parcial', author: 'PID_UTN', date: '18/11/2025', size: '1.6 MB', fileUrl: '#' },

  // Civil
  { id: '36', title: 'Cálculo de Vigas (Excel)', subject: 'Estabilidad', specialty: 'Civil', type: 'Software', author: 'VigaMax', date: '04/04/2025', size: '500 KB', fileUrl: '#' },
  { id: '37', title: 'Resumen Hormigón Armado', subject: 'Tecnología del Hormigón', specialty: 'Civil', type: 'Resumen', author: 'CementoUTN', date: '12/09/2025', size: '4.5 MB', fileUrl: '#' },
  { id: '38', title: 'Final Topografía', subject: 'Topografía', specialty: 'Civil', type: 'Final', author: 'Topo_Civil', date: '20/12/2025', size: '3.0 MB', fileUrl: '#' },
  { id: '39', title: 'Planos Autocad (Estructuras)', subject: 'Diseño Estructural', specialty: 'Civil', type: 'TP', author: 'Grupo Civil', date: '15/10/2025', size: '22.0 MB', fileUrl: '#' },
  { id: '40', title: 'Parcial 1 Resistencia de Materiales', subject: 'Resistencia de Materiales', specialty: 'Civil', type: 'Parcial', author: 'Tension', date: '08/06/2025', size: '2.1 MB', fileUrl: '#' },

  // Química & Naval & Ingreso
  { id: '41', title: 'Apunte Química Orgánica', subject: 'Química Orgánica', specialty: 'Química', type: 'Apunte', author: 'Carbono', date: '14/05/2025', size: '5.2 MB', fileUrl: '#' },
  { id: '42', title: 'Final Operaciones Unitarias', subject: 'Operaciones Unitarias', specialty: 'Química', type: 'Final', author: 'IngQ', date: '10/02/2026', size: '1.9 MB', fileUrl: '#' },
  { id: '43', title: 'Diseño de Casco (Rhino)', subject: 'Arquitectura Naval', specialty: 'Naval', type: 'Guía', author: 'BarcoUTN', date: '03/07/2025', size: '18.0 MB', fileUrl: '#' },
  { id: '44', title: 'Resumen Estabilidad Flotante', subject: 'Estabilidad Naval', specialty: 'Naval', type: 'Resumen', author: 'Flotador', date: '21/11/2025', size: '2.8 MB', fileUrl: '#' },
  
  { id: '45', title: 'Módulo B - Teoría Completa', subject: 'Física y Matemática', specialty: 'Ingreso', type: 'Apunte', author: 'Catedra Ingreso', date: '10/01/2026', size: '8.0 MB', fileUrl: '#' },
  { id: '46', title: 'Simulacro Examen Ingreso', subject: 'Matemática', specialty: 'Ingreso', type: 'Parcial', author: 'CEIT', date: '05/02/2026', size: '1.5 MB', fileUrl: '#' },
  { id: '47', title: 'Respuestas Guía Ingreso', subject: 'Física', specialty: 'Ingreso', type: 'Guía', author: 'CEIT', date: '12/01/2026', size: '2.0 MB', fileUrl: '#' },
  
  // Mix Extras
  { id: '48', title: 'Parcial 2 - Tema B', subject: 'Física II', specialty: 'Básicas', type: 'Parcial', author: 'AlumnoX', date: '02/11/2025', size: '1.3 MB', fileUrl: '#' },
  { id: '49', title: 'TP Redes y Seguridad', subject: 'Redes de Información', specialty: 'Sistemas', type: 'TP', author: 'HackerUTN', date: '30/09/2025', size: '4.1 MB', fileUrl: '#' },
  { id: '50', title: 'Final Julio 2025', subject: 'Análisis Matemático II', specialty: 'Básicas', type: 'Final', author: 'Dem0', date: '15/07/2025', size: '1.4 MB', fileUrl: '#' },
];
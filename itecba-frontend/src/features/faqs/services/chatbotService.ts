import { FAQ_DATABASE, FALLBACK_ANSWER } from '../types/faqs';

const normalizeText = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!.,]/g, "").trim();

export const chatbotService = {
  
  // Búsqueda normal rápida en la Base de Datos Local
  searchFaqAnswer: (query: string): string => {
    const cleanQuery = normalizeText(query);
    const queryWords = cleanQuery.split(' ');

    if (['hola', 'buenas', 'holis', 'que tal', 'saludos', 'buen dia', 'buenas tardes'].includes(cleanQuery)) {
      return "¡Hola! ¿En qué te puedo ayudar hoy? Podes escribirme tu consulta o elegir una de las opciones rápidas.";
    }

    let bestMatch = null;
    let maxScore = 0;

    for (const faq of FAQ_DATABASE) {
      let score = 0;
      for (const kw of faq.keywords) {
        const cleanKw = normalizeText(kw);
        if (cleanKw.includes(' ')) {
          if (cleanQuery.includes(cleanKw)) score += 3;
        } else {
          if (queryWords.includes(cleanKw)) score += 1;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = faq;
      }
    }

    return bestMatch ? bestMatch.answer : FALLBACK_ANSWER;
  },

  // Consulta Avanzada a IA (Aquí conectarás tu backend en el futuro)
  askAdvancedAI: async (query: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `✨ *(Respuesta generada por IA Avanzada)*\n\nHe analizado tu consulta sobre **"${query}"** cruzando datos de nuestra base de conocimientos y actualizaciones web.\n\nTe recomiendo verificar tu situación académica en SIGA y validar las fechas con el departamento correspondiente. Al ser un modelo de IA, esta información te sirve como guía de apoyo.\n\n¿Tienes alguna otra duda técnica que pueda responderte?`
        );
      }, 2500); // Simulamos 2.5s de procesamiento de red
    });
  },

  // Control de Límite de 24hs (Guardado local por usuario)
  canUseAI: (userEmail: string): boolean => {
    const lastUsed = localStorage.getItem(`itec_ai_last_${userEmail}`);
    if (!lastUsed) return true;
    const diff = Date.now() - parseInt(lastUsed, 10);
    return diff > 24 * 60 * 60 * 1000; // 24 horas en milisegundos
  },

  markAIUsed: (userEmail: string) => {
    localStorage.setItem(`itec_ai_last_${userEmail}`, Date.now().toString());
  },

  getTimeLeftToUseAI: (userEmail: string): string | null => {
    const lastUsed = localStorage.getItem(`itec_ai_last_${userEmail}`);
    if (!lastUsed) return null;
    const diff = Date.now() - parseInt(lastUsed, 10);
    const remaining = (24 * 60 * 60 * 1000) - diff;
    if (remaining <= 0) return null;
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
};
import { FAQ_DATABASE, FALLBACK_ANSWER } from '../types/faqs';
import type { Message } from '../components/organisms/ChatInterface';

const normalizeText = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!.,]/g, "").trim();

// Si usas variables de entorno en Vite, sería import.meta.env.VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'; 

export const chatbotService = {
  
  // 1. Búsqueda normal rápida en la Base de Datos Local
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

  // 🟢 2. Consulta REAL al backend con Gemini
  askAdvancedAI: async (query: string, rawHistory: Message[]): Promise<string> => {
    try {
      // Gemini exige un formato específico para el historial: { role: 'user' | 'model', parts: [{ text: '...' }] }
      // Ignoramos el primer mensaje porque es el saludo por defecto del frontend
      const formattedHistory = rawHistory.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user', // Aseguramos los roles correctos
        parts: [{ text: msg.text }]
      }));

      // Hacemos la petición a tu ruta backend (ajusta "/ais/chat" si tu index.js lo monta diferente)
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          history: formattedHistory
        })
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response; 

    } catch (error) {
      console.error("Error comunicándose con la IA:", error);
      return "⚠️ Lo siento, los servidores de IA están congestionados en este momento. Por favor, intenta de nuevo más tarde.";
    }
  },

  // 3. Control de Límite de 24hs (Guardado local por usuario)
  canUseAI: (userEmail: string): boolean => {
    const lastUsed = localStorage.getItem(`itec_ai_last_${userEmail}`);
    if (!lastUsed) return true;
    const diff = Date.now() - parseInt(lastUsed, 10);
    return diff > 24 * 60 * 60 * 1000; 
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
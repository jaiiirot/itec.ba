import { useState, useEffect } from 'react';
import { chatbotService } from '../services/chatbotService';
import { ITEC_FOOTER } from '../types/faqs';
import type { Message } from '../components/organisms/ChatInterface'; // Exportamos el type desde ahí o desde types

const WELCOME_MESSAGE: Message = { 
  role: 'model', 
  text: '¡Hola! Soy **ITEC Bot**.\n\nEstoy aquí para resolver tus dudas rápidas sobre la UTN BA. Selecciona una opción o escríbeme tu consulta abajo.',
  timestamp: new Date()
};

export const useChatbot = (userEmail: string) => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [canUseAI, setCanUseAI] = useState(true);
  const [timeLeftAI, setTimeLeftAI] = useState<string | null>(null);

  // Comprobar disponibilidad de IA al cargar y al enviar mensajes
  const checkAILimits = () => {
    setCanUseAI(chatbotService.canUseAI(userEmail));
    setTimeLeftAI(chatbotService.getTimeLeftToUseAI(userEmail));
  };

  useEffect(() => {
    checkAILimits();
    // Actualizamos el temporizador cada minuto para que la UI se refresque sola
    const interval = setInterval(checkAILimits, 60000); 
    return () => clearInterval(interval);
  }, [userEmail]);

// En useChatbot.ts...
  const handleSendMessage = async (text: string, forceAI: boolean = false) => {
    if (!text.trim()) return;
    
    // Agregamos mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', text, timestamp: new Date() }]);
    setIsTyping(true);

    if (forceAI && canUseAI) {
      chatbotService.markAIUsed(userEmail);
      checkAILimits(); // Bloqueamos el botón inmediatamente

      // 🟢 NUEVO: Le pasamos 'messages' (el historial actual) a la función
      const aiResponse = await chatbotService.askAdvancedAI(text, messages);
      
      setMessages(prev => [...prev, { role: 'model', text: aiResponse, timestamp: new Date(), isAiGenerated: true }]);
    } else {
      // Chat normal de base de datos
      setTimeout(() => {
        const isGreeting = ['hola', 'buenas', 'holis'].includes(text.toLowerCase().trim());
        const finalAnswer = chatbotService.searchFaqAnswer(text) + (isGreeting ? '' : '\n\n' + ITEC_FOOTER);
        setMessages(prev => [...prev, { role: 'model', text: finalAnswer, timestamp: new Date() }]);
      }, Math.floor(Math.random() * 500) + 500);
    }
    
    setIsTyping(false);
  };

  const clearChat = () => {
    if (window.confirm("¿Deseas limpiar el historial de esta conversación?")) {
      setMessages([{ ...WELCOME_MESSAGE, timestamp: new Date() }]);
    }
  };

  return {
    messages,
    isTyping,
    canUseAI,
    timeLeftAI,
    handleSendMessage,
    clearChat
  };
};
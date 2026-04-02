import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../molecules/ChatMessage';
import { ChatInput } from '../molecules/ChatInput';
import { FAQ_DATABASE, FALLBACK_ANSWER, ITEC_FOOTER } from '../../types/faqs';
import { Icons } from '@/components/atoms/Icons';

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const INITIAL_SUGGESTIONS = [
  "¿Cuándo me anoto a cursar?",
  "¿Cómo veo los grupos de WhatsApp?",
  "¿Cuándo son los exámenes finales?"
];

const WELCOME_MESSAGE: Message = { 
  role: 'model', 
  text: '¡Hola! Soy **ITEC Bot**.\n\nEstoy aquí para resolver tus dudas rápidas sobre la UTN BA. Selecciona una opción o escríbeme tu consulta abajo.',
  timestamp: new Date()
};

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const normalizeText = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!.,]/g, "").trim();

  // Búsqueda por "Mejor Coincidencia" y reconocimiento de saludos
  const searchFaqAnswer = (query: string): string => {
    const cleanQuery = normalizeText(query);
    const queryWords = cleanQuery.split(' ');

    // 1. Interceptar saludos básicos
    if (['hola', 'buenas', 'holis', 'que tal', 'saludos', 'buen dia', 'buenas tardes'].includes(cleanQuery)) {
      return "¡Hola! ¿En qué te puedo ayudar hoy? Podes escribirme tu consulta o elegir una de las opciones rápidas.";
    }

    // 2. Sistema de puntuación para encontrar la mejor respuesta
    let bestMatch = null;
    let maxScore = 0;

    for (const faq of FAQ_DATABASE) {
      let score = 0;
      for (const kw of faq.keywords) {
        const cleanKw = normalizeText(kw);
        // Si la keyword es una frase (ej: "aula virtual") y está exacta, vale más puntos
        if (cleanKw.includes(' ')) {
          if (cleanQuery.includes(cleanKw)) score += 3;
        } else {
          // Si es una sola palabra, verificamos si está en las palabras del usuario
          if (queryWords.includes(cleanKw)) score += 1;
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = faq;
      }
    }

    return bestMatch ? bestMatch.answer : FALLBACK_ANSWER;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text, timestamp: new Date() }]);
    setIsTyping(true);
    
    // Simulamos un tiempo de respuesta un poco más natural y aleatorio (entre 600ms y 1200ms)
    const typingDelay = Math.floor(Math.random() * 600) + 600;

    setTimeout(() => {
      const isGreeting = ['hola', 'buenas', 'holis', 'que tal', 'saludos', 'buen dia', 'buenas tardes'].includes(normalizeText(text));
      const footer = isGreeting ? '' : '\n\n' + ITEC_FOOTER; // No ponemos el footer gigante si solo dijo "hola"

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: searchFaqAnswer(text) + footer,
        timestamp: new Date() 
      }]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleClearChat = () => {
    if(window.confirm("¿Deseas limpiar el historial de esta conversación?")) {
      setMessages([{...WELCOME_MESSAGE, timestamp: new Date()}]);
    }
  };

  return (
    <div className="bg-itec-surface border border-itec-gray rounded-3xl shadow-2xl flex flex-col h-[650px] relative overflow-hidden animate-in fade-in duration-500">
      
      {/* 🟢 HEADER: Reemplazamos el emoji por el Logo */}
      <div className="px-6 py-4 border-b border-itec-gray bg-itec-sidebar flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center shadow-md relative p-1">
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2  rounded-full"></span>
             {/* Usamos el logo que tienes en public/logo.png o public/itec.png */}
             <img src="/logo.png" alt="ITEC Logo" className="w-full h-full object-contain rounded-full" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">ITEC Bot</h2>
            <p className="text-[11px] text-teal-400 font-medium uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> En línea
            </p>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          title="Limpiar chat"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-itec-bg border border-itec-gray text-gray-400 hover:text-white hover:bg-itec-gray transition-colors"
        >
          <Icons type="close" className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col gap-6 bg-gradient-to-b from-itec-bg/30 to-itec-bg/10">
        
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} text={msg.text} timestamp={msg.timestamp} />
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-start mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {INITIAL_SUGGESTIONS.map((sug, i) => (
              <button 
                key={i} onClick={() => handleSendMessage(sug)}
                className="bg-itec-bg border border-itec-gray text-gray-300 hover:border-teal-500 hover:text-white transition-all px-4 py-2.5 rounded-xl text-xs shadow-sm hover:shadow-teal-500/10"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {isTyping && (
          <div className="flex w-full justify-start animate-in fade-in duration-200">
            <div className="flex items-end gap-2">
              {/* Animación de "Escribiendo..." con el logo de ITEC */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 overflow-hidden p-1">
                 <img src="/logo.png" alt="ITEC Logo" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }} />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-itec-surface border border-itec-gray flex gap-1.5 items-center h-[42px] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500/70 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500/70 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500/70 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  );
};
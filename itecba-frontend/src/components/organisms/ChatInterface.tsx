import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../molecules/ChatMessage';
import { ChatInput } from '../molecules/ChatInput';
import { FAQ_DATABASE, FALLBACK_ANSWER, ITEC_FOOTER } from '../../data/faqs';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const INITIAL_SUGGESTIONS = [
  "¿Cuándo me anoto a cursar?",
  "¿Cómo veo los grupos de WhatsApp?",
  "¿Cómo tramito el boleto estudiantil?"
];

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy **ITEC Bot** 🤖.\n\nEstoy aquí para resolver tus dudas rápidas sobre la UTN BA. Selecciona una opción o escríbeme tu consulta abajo.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const normalizeText = (text: string) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[¿?¡!.,]/g, "").trim();
  };

  const searchFaqAnswer = (query: string): string => {
    const cleanQuery = normalizeText(query);
    for (const faq of FAQ_DATABASE) {
      const match = faq.keywords.some(kw => cleanQuery.includes(normalizeText(kw)));
      if (match) return faq.answer;
    }
    return FALLBACK_ANSWER;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // 1. Agregamos el mensaje del usuario
    const userMessage: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    
    // 2. Simulamos que el bot está escribiendo (mejor UX)
    setIsTyping(true);
    
    setTimeout(() => {
      const botMessage: Message = { role: 'model', text: searchFaqAnswer(text) + '\n\n' + ITEC_FOOTER };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600); // 600ms de "pensamiento"
  };

  return (
    <div className="bg-itec-surface border border-itec-gray rounded-2xl shadow-2xl flex flex-col h-[600px] relative overflow-hidden">
      
      {/* Header Premium */}
      <div className="px-6 py-4 border-b border-itec-gray bg-gradient-to-r from-itec-sidebar to-itec-surface flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center text-white shadow-md">
            <span className="font-black text-xs tracking-wider">BOT</span>
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">Asistente Virtual</h2>
            <p className="text-[11px] text-green-400 font-medium flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> En línea
            </p>
          </div>
        </div>
      </div>

      {/* Área de Mensajes (Fondo sutil) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col gap-5 bg-itec-bg/50">
        
        {/* Renderizado de Mensajes */}
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} text={msg.text} />
        ))}

        {/* Sugerencias Rápidas (Solo si hay 1 mensaje) */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {INITIAL_SUGGESTIONS.map((sug, i) => (
              <button 
                key={i} onClick={() => handleSendMessage(sug)}
                className="bg-itec-surface border border-itec-gray text-gray-300 hover:border-itec-blue hover:text-white transition-all px-4 py-2 rounded-full text-xs shadow-sm hover:shadow-itec-blue/20"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Indicador de "Escribiendo..." */}
        {isTyping && (
          <div className="flex w-full justify-start animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-itec-surface border border-itec-gray flex items-center justify-center shrink-0">
                <span className="font-bold text-[10px] text-orange-500">BOT</span>
              </div>
              <div className="p-4 rounded-2xl bg-itec-surface border border-itec-gray rounded-tl-sm flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Formulario */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      
    </div>
  );
};
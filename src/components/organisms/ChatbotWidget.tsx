import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Button } from '../atoms/Button';
import logoItec from '../../assets/logo.png'; // <-- IMPORTA

// Inicializamos Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const SYSTEM_INSTRUCTION = `
Eres 'ITEC Bot', el asistente virtual oficial de ITEC UTN BA. 
Tu objetivo es ayudar a estudiantes con dudas sobre la Universidad Tecnológica Nacional (UTN), ingreso, inscripciones, fechas de exámenes, planes de estudio y trámites académicos.
REGLA ESTRICTA: Solo puedes hablar sobre temas universitarios, académicos y de la UTN.
Pide al usuario que sea específico si la pregunta es muy amplia.
`;

const ITEC_FOOTER = "\n\n---\n*💡 Recuerda que siempre puedes consultar en nuestros grupos de WhatsApp o en nuestro [Instagram oficial @itecba](https://instagram.com/itecba).*";

interface Message {
  role: 'user' | 'model';
  text: string;
}

// LÍMITES Y CLAVES DE MEMORIA
const MAX_QUESTIONS = 3; 
const STORAGE_KEY_SESSIONS = 'itec_chat_sessions'; // El disco duro de ChatPage
const WIDGET_STATE_KEY = 'itec_widget_state';      // La memoria temporal del Widget
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;     // 24 horas en milisegundos

// Función para obtener la memoria del widget al cargar la página
const getInitialWidgetState = () => {
  const saved = localStorage.getItem(WIDGET_STATE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    const now = Date.now();
    // Si han pasado MENOS de 24 horas desde la última actividad, recuperamos el chat
    if (now - parsed.lastActivity < TWENTY_FOUR_HOURS) {
      return parsed;
    }
  }
  // Si no hay guardado, o pasaron 24 horas, empezamos de cero limpios
  return {
    sessionId: Date.now().toString(),
    messages: [{ role: 'model', text: '¡Hola! Soy ITEC Bot (IA). ¿En qué te puedo ayudar hoy con respecto a la UTN?' }],
    questionCount: 0,
    lastActivity: Date.now()
  };
};

export const ChatbotWidget: React.FC = () => {
  const initialState = getInitialWidgetState();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialState.messages);
  const [questionCount, setQuestionCount] = useState(initialState.questionCount);
  const [currentSessionId] = useState<string>(initialState.sessionId);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // CADA VEZ que haya un cambio, guardamos la memoria local del widget (Para sobrevivir al cambio de página)
  useEffect(() => {
    const stateToSave = {
      sessionId: currentSessionId,
      messages,
      questionCount,
      lastActivity: Date.now() // Actualizamos el reloj de las 24hs
    };
    localStorage.setItem(WIDGET_STATE_KEY, JSON.stringify(stateToSave));
  }, [messages, questionCount, currentSessionId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || questionCount >= MAX_QUESTIONS || isLoading) return;

    const userText = input;
    setInput('');
    setQuestionCount(prev => prev + 1);
    
    const tempMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(tempMessages);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: SYSTEM_INSTRUCTION
      });

      const formattedHistory = tempMessages
        .filter(m => m.role === 'user' || (m.role === 'model' && !m.text.includes('¡Hola! Soy ITEC Bot')))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(userText);
      const responseText = result.response.text() + ITEC_FOOTER;

      const finalMessages: Message[] = [...tempMessages, { role: 'model', text: responseText }];
      setMessages(finalMessages);

      // ==========================================
      // GUARDAR UNA COPIA PERMANENTE EN CHATPAGE
      // ==========================================
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      const globalSessions = saved ? JSON.parse(saved) : [];

      const existingIndex = globalSessions.findIndex((s: any) => s.id === currentSessionId);
      
      if (existingIndex >= 0) {
        globalSessions[existingIndex].messages = finalMessages;
      } else {
        globalSessions.unshift({
          id: currentSessionId,
          title: userText.length > 25 ? userText.substring(0, 25) + "..." : userText,
          messages: finalMessages
        });
      }
      
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(globalSessions));

    } catch (error) {
      console.error("Error al consultar a Gemini:", error);
      setMessages([...tempMessages, { role: 'model', text: 'Ocurrió un error de conexión. Intenta nuevamente.' }]);
      setQuestionCount(prev => prev - 1); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {isOpen && (
        <div className="bg-itec-surface border border-[#262626] rounded-2xl w-80 sm:w-[400px] h-[550px] shadow-2xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5">
          
          <div className="bg-itec-blue text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logoItec} alt="Bot Logo" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 shadow-md" />
              <div>
                <h3 className="font-bold leading-tight">ITEC Bot (IA)</h3>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest">Asistente Inteligente</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-800 p-1 rounded transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-itec-bg/50">
            {messages.map((msg, index) => (
              <div key={index} className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] ${
                msg.role === 'user' 
                  ? 'bg-itec-blue text-white self-end rounded-tr-sm shadow-md' 
                  : 'bg-[#1a1a1a] text-itec-text border border-[#333] self-start rounded-tl-sm shadow-md'
              }`}>
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <ReactMarkdown 
                    components={{
                      strong: ({ ...props}) => <span className="font-bold text-white" {...props} />,
                      p: ({ ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                      ul: ({ ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                      ol: ({ ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                      li: ({ ...props}) => <li className="pl-1" {...props} />,
                      a: ({ ...props}) => <a className="text-blue-400 font-medium hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      hr: ({ ...props}) => <hr className="border-[#333] my-3" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-[#1a1a1a] text-gray-400 p-3.5 rounded-2xl text-sm self-start rounded-tl-sm w-16 flex justify-center border border-[#333] shadow-md">
                <span className="animate-pulse font-bold tracking-widest">...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-[#262626] bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">
                Consultas (Hoy): <span className={questionCount >= MAX_QUESTIONS ? 'text-red-500' : 'text-itec-blue'}>{MAX_QUESTIONS - questionCount}</span>/3
              </span>
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={questionCount >= MAX_QUESTIONS || isLoading}
                placeholder={questionCount >= MAX_QUESTIONS ? "Límite. Se reinicia en 24hs." : "Escribe tu duda..."}
                className="flex-1 bg-[#1a1a1a] border border-[#333] text-white px-3 py-2.5 rounded-xl focus:outline-none focus:border-itec-blue disabled:opacity-50 text-sm transition-colors"
              />
              <Button type="submit" disabled={questionCount >= MAX_QUESTIONS || isLoading || !input.trim()} className="px-4 rounded-xl flex items-center justify-center">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 flex items-center justify-center cursor-pointer border border-white/10 ${isOpen ? 'bg-[#1a1a1a] text-gray-400' : 'bg-itec-blue text-white'}`}
      >
        {isOpen ? (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>
    </div>
  );
};
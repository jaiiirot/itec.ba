import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Button } from '../components/atoms/Button';
import { FAQ_DATABASE, FALLBACK_ANSWER, ITEC_FOOTER } from '../data/faqs';
import { usePageTitle } from '../hooks/usePageTitle'; // <-- 1. Importar

const STORAGE_KEY_SESSIONS = 'itec_chat_sessions';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

// Botón de Sugerencias Iniciales
const INITIAL_SUGGESTIONS = [
  "¿Cuándo me anoto a cursar?",
  "¿Cómo veo los grupos de WhatsApp?",
  "Quiero pedir el boleto estudiantil",
];

export const ChatPage: React.FC = () => {
  usePageTitle('Preguntas Frecuentes');
  // 1. Estado de las Sesiones
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (saved) return JSON.parse(saved);
    return [{
      id: Date.now().toString(),
      title: 'Nueva conversación',
      messages: [{ role: 'model', text: '¡Hola! Soy ITEC Bot (Modo Local). ¿En qué te puedo ayudar hoy?' }]
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || '');
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Para Móviles
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  // Actualizar la sesión actual
  const updateActiveSession = (newMessages: Message[], newTitle?: string) => {
    setSessions(prev => prev.map(session => 
      session.id === activeSessionId 
        ? { ...session, messages: newMessages, title: newTitle || session.title } 
        : session
    ));
  };

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'Nueva conversación',
      messages: [{ role: 'model', text: '¡Hola! Soy ITEC Bot. ¿En qué te puedo ayudar hoy?' }]
    };
    setSessions(prev => [newChat, ...prev]);
    setActiveSessionId(newChat.id);
    setIsSidebarOpen(false);
  };

  const deleteChat = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== idToDelete);
    if (filtered.length === 0) {
      createNewChat();
    } else {
      setSessions(filtered);
      if (activeSessionId === idToDelete) setActiveSessionId(filtered[0].id);
    }
  };

  // BUSCADOR EN BASE DE DATOS LOCAL
  const searchFaqAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Busca si alguna palabra clave coincide con el texto del usuario
    for (const faq of FAQ_DATABASE) {
      if (faq.keywords.some(kw => lowerQuery.includes(kw))) {
        return faq.answer;
      }
    }
    return FALLBACK_ANSWER;
  };

  // Enviar mensaje al bot local
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setInput('');

    let title = activeSession.title;
    if (activeSession.messages.length === 1) {
      title = text.length > 25 ? text.substring(0, 25) + "..." : text;
    }

    const userMessage: Message = { role: 'user', text };
    
    // Obtenemos la respuesta sin IA
    const botAnswer = searchFaqAnswer(text) + ITEC_FOOTER;
    const botMessage: Message = { role: 'model', text: botAnswer };

    updateActiveSession([...activeSession.messages, userMessage, botMessage], title);
  };

  return (
    <DashboardLayout>
      {/* Magia CSS: El -m-4 md:-m-8 rompe el padding del DashboardLayout 
        para que la vista ocupe absolutamente todo el espacio, como Gemini web. 
      */}
        <div className="flex h-[calc(100vh-70px)] md:h-[calc(100vh-2px)] w-full -m-4 md:-m-8 overflow-hidden relative">
        {/* === SIDEBAR (Historial) === */}
        {/* Fondo negro semitransparente en móvil */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-itec-bg z-40 md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <div className={`
          absolute md:relative z-50 h-full w-72 bg-itec-bg flex flex-col transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-[#262626] flex justify-between items-center">
            <button 
              onClick={createNewChat}
              className="flex-1 bg-white hover:bg-gray-200 text-black font-semibold py-2.5 px-4 rounded-xl flex items-center gap-3 transition-colors text-sm"
            >
              <span className="text-xl leading-none">+</span> Nueva conversación
            </button>
            <button className="md:hidden ml-4 text-gray-400" onClick={() => setIsSidebarOpen(false)}>✖</button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
            <p className="text-xs text-gray-500 font-bold px-3 mt-4 mb-2 uppercase tracking-wider">Recientes</p>
            {sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => { setActiveSessionId(session.id); setIsSidebarOpen(false); }}
                className={`w-full group text-left px-3 py-2.5 rounded-xl text-sm mb-1 cursor-pointer flex justify-between items-center transition-colors ${
                  activeSessionId === session.id ? 'bg-[#2a2a2a] text-white font-medium' : 'text-gray-400 hover:bg-[#1a1a1a]'
                }`}
              >
                <span className="truncate flex-1 pr-2">
                  {session.title}
                </span>
                <button 
                  onClick={(e) => deleteChat(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-opacity"
                  title="Borrar chat"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* === MAIN CHAT AREA === */}
        <div className="flex-1 flex flex-col relative w-full">
          
          {/* Header móvil para abrir el menú */}
          <div className="md:hidden flex items-center p-4 border-b border-[#262626] bg-[#0a0a0a]">
             <button onClick={() => setIsSidebarOpen(true)} className="mr-3 text-white">
               <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
             </button>
             <h2 className="font-bold text-itec-text">ITEC Bot</h2>
          </div>

          {/* MENSAJES */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center custom-scrollbar pb-32">
            <div className="w-full max-w-3xl flex flex-col gap-6">
              {activeSession?.messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  
                  {/* Avatar ITEC (Solo si es Bot) */}
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-itec-blue flex items-center justify-center font-bold text-white text-xs mr-3 shrink-0 mt-1">I</div>
                  )}

                  <div className={`p-4 rounded-2xl text-[15px] ${
                    msg.role === 'user' 
                      ? 'bg-[#2a2a2a] text-white rounded-tr-sm max-w-[85%]' 
                      : 'text-gray-300 w-full md:max-w-[90%]'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <ReactMarkdown 
                        components={{
                          strong: ({...props}) => <span className="font-bold text-white" {...props} />,
                          p: ({...props}) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
                          ul: ({...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                          a: ({...props}) => <a className="text-blue-400 font-medium hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          hr: ({...props}) => <hr className="border-[#333] my-4" {...props} />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* SUGERENCIAS (Solo visibles al inicio de un chat nuevo) */}
          {activeSession?.messages.length === 1 && (
            <div className="absolute bottom-36 w-full flex justify-center px-4">
               <div className="flex flex-wrap gap-2 justify-center max-w-3xl w-full">
                 {INITIAL_SUGGESTIONS.map((sug, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="bg-[#1a1a1a] border border-[#333] text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors px-4 py-2 rounded-xl text-sm shadow-sm"
                    >
                      {sug}
                    </button>
                 ))}
               </div>
            </div>
          )}

          {/* INPUT FIXED AL FONDO (Estilo Gemini) */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-itec-bg via-itec-bg to-transparent pb-6 pt-10 px-4 flex justify-center">
            <div className="w-full max-w-3xl">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} 
                className="flex items-center gap-3 bg-[#1a1a1a] border border-[#333] p-2 rounded-2xl shadow-xl focus-within:border-[#555] transition-colors"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu consulta sobre la UTN..."
                  className="flex-1 bg-transparent text-white px-4 py-3 focus:outline-none text-[15px]"
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim()} 
                  className={`rounded-xl px-4 py-3 flex items-center justify-center transition-all ${input.trim() ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#333] text-gray-500 cursor-not-allowed'}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Button>
              </form>
              <p className="text-center text-[11px] text-gray-500 mt-3">
                ITEC Bot puede cometer errores. Considera verificar siempre la información en los canales oficiales de la UTN.
              </p>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
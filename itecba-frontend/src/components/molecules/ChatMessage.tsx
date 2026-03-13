import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Icons } from '../atoms/Icons';

interface Props {
  role: 'user' | 'model';
  text: string;
}

export const ChatMessage: React.FC<Props> = ({ role, text }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
          isUser 
            ? 'bg-gradient-to-tr from-blue-600 to-blue-400 text-white' 
            : 'bg-itec-surface border border-itec-gray text-orange-500'
        }`}>
          {isUser ? <div className="w-4 h-4"><Icons type="user" /></div> : <span className="font-bold text-[10px]">BOT</span>}
        </div>

        {/* Burbuja de Mensaje */}
        <div className={`p-4 rounded-2xl text-[14px] shadow-md ${
          isUser 
            ? 'bg-itec-blue text-white rounded-tr-sm border border-blue-600/50' 
            : 'bg-itec-surface border border-itec-gray text-gray-200 rounded-tl-sm'
        }`}>
          {isUser ? (
            <p className="leading-relaxed">{text}</p>
          ) : (
            <ReactMarkdown 
              components={{
                strong: ({...props}) => <span className="font-bold text-white" {...props} />,
                p: ({...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-300" {...props} />,
                li: ({...props}) => <li className="marker:text-orange-500" {...props} />,
                a: ({...props}) => <a className="text-orange-400 font-medium hover:underline flex items-center gap-1" target="_blank" rel="noopener noreferrer" {...props} />,
              }}
            >
              {text}
            </ReactMarkdown>
          )}
        </div>

      </div>
    </div>
  );
};
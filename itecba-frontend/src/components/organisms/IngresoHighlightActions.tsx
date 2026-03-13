import React from 'react';
import { Icons } from '../atoms/Icons';

interface ActionItem {
  id: string;
  url: string;
  title: string;
  subtitle: string;
}

interface Props {
  actions: ActionItem[];
}

export const IngresoHighlightActions: React.FC<Props> = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {actions.map(action => (
        <a 
          key={action.id}
          href={action.url} 
          target="_blank" rel="noopener noreferrer"
          className="bg-itec-surface border border-itec-gray hover:border-purple-500 p-6 rounded-2xl flex items-center justify-between group transition-all shadow-lg hover:shadow-purple-500/10"
        >
          <div>
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-purple-400 transition-colors">
              {action.title}
            </h3>
            <p className="text-xs text-gray-500">{action.subtitle}</p>
          </div>
          <div className="bg-purple-500/10 p-3 rounded-full text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all group-hover:scale-110 shadow-sm">
            <div className="w-6 h-6">
              <Icons type="edit" />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};
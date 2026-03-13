import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../atoms/Icons';
import type { ResourceData } from '../../services/resourcesService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  relatedResources: ResourceData[];
}

export const CourseMaterialModal: React.FC<Props> = ({ isOpen, onClose, relatedResources }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-3xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-itec-bg border border-itec-gray flex items-center justify-center text-gray-500 hover:text-white transition-colors">
          <div className="w-4 h-4"><Icons type="close" /></div>
        </button>
        
        <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <span className="text-orange-500">📚</span> Material de Apoyo
        </h2>
        <p className="text-xs text-gray-400 mb-6">Archivos de Firebase relacionados a este curso.</p>

        {relatedResources.length > 0 ? (
          <div className="space-y-3">
            {relatedResources.map(res => (
              <div key={res.id} className="bg-itec-bg border border-itec-gray rounded-xl p-3 flex items-center justify-between group hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-itec-surface border border-itec-gray flex items-center justify-center text-gray-400 group-hover:text-orange-400 transition-colors shrink-0">
                    <div className="w-[18px] h-[18px]"><Icons type="documentFill" /></div>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white leading-tight mb-1 truncate max-w-[200px] sm:max-w-[250px]">{res.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{res.tipo}</span>
                      <span className="text-[10px] text-gray-500">Por {res.autor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={res.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-itec-surface hover:bg-itec-gray border border-itec-gray rounded-lg text-gray-300 hover:text-white transition-colors" title="Abrir vista previa">
                    <div className="w-4 h-4"><Icons type="externalLink" /></div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-itec-bg rounded-2xl border border-itec-gray border-dashed">
            <span className="text-4xl block mb-3 opacity-50">📂</span>
            <p className="text-gray-400 text-sm font-medium">Aún no hay apuntes para esta materia.</p>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-itec-gray text-center">
          <Link to="/explore" className="text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors flex items-center justify-center gap-2">
            Buscar más en Aportes <div className="w-4 h-4"><Icons type="arrowRight" /></div>
          </Link>
        </div>
      </div>
    </div>
  );
};
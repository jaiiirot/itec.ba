import React from 'react';
import { Icons } from '@/components/atoms/Icons';

interface Material { id: string; url: string; emoji: string; title: string; subtitle: string; }
interface SiuLink { id: string; url: string; title: string; subtitle: string; }

interface Props {
  materials: Material[];
  siuLinks: SiuLink[];
}

export const IngresoAcademicGrid: React.FC<Props> = ({ materials, siuLinks }) => {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Material de Estudio */}
      <div className="mb-10">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 pl-1">Material de Estudio</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {materials.map(material => (
            <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer" className="bg-itec-bg border border-itec-gray hover:border-itec-blue rounded-xl p-5 text-center transition-all group hover:bg-itec-surface shadow-sm">
              <div className="w-14 h-14 mx-auto bg-itec-sidebar border border-itec-gray rounded-full mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform group-hover:border-itec-blue shadow-inner">
                {material.emoji}
              </div>
              <h4 className="font-bold text-white text-sm mb-1">{material.title}</h4>
              <span className="text-[10px] text-gray-500">{material.subtitle}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Sistemas Oficiales */}
      <div>
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 pl-1">Sistemas Oficiales UTN</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {siuLinks.map((siu, index) => (
            <a key={siu.id} href={siu.url} target="_blank" rel="noopener noreferrer" className="bg-white text-black p-5 rounded-xl flex items-center gap-4 hover:bg-gray-200 transition-colors group shadow-lg">
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <div className="w-6 h-6">
                  <Icons type={index === 0 ? "siuGuarani" : "aulasVirtuales"} />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg leading-tight">{siu.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{siu.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </section>
  );
};
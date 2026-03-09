import React from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { INGRESO_DATA } from '../data/ingresoLinks';
import { Icons } from '../components/atoms/Icons'; // <-- IMPORTAMOS EL COMPONENTE CENTRALIZADO

// Función Helper para renderizar iconos según el tipo usando tu componente Icons
const renderIcon = (type: string, colorClass: string) => {
  const containerClasses = `w-7 h-7 mb-3 group-hover:scale-110 transition-transform ${colorClass}`;

  // Mapeamos el 'type' que viene de tu BD con el 'type' que recibe Icons.tsx
  let iconType = type;
  if (type === 'whatsapp') iconType = 'whatsapp';
  if (type === 'instagram') iconType = 'instagram';
  if (type === 'youtube') iconType = 'youtube';
  if (type === 'sheets') iconType = 'sheets';

  return (
    <div className={containerClasses}>
      <Icons type={iconType} />
    </div>
  );
};

export const IngresoPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-12 relative z-10">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-500/20">
             <div className="w-8 h-8">
               <Icons type="entry" />
             </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Ingreso UTN BA</h1>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Todo lo necesario para el Seminario Universitario. Links oficiales, grupos y material de estudio.
          </p>
        </div>

        {/* 1. ACCIONES DESTACADAS (Formularios) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {INGRESO_DATA.actions.map(action => (
            <a 
              key={action.id}
              href={action.url} 
              target="_blank" rel="noopener noreferrer"
              className="bg-itec-surface border border-itec-gray hover:border-purple-500 p-6 rounded-2xl flex items-center justify-between group transition-all shadow-lg hover:shadow-purple-500/10"
            >
               <div>
                 <h3 className="font-bold text-white text-lg mb-1 group-hover:text-purple-400 transition-colors">{action.title}</h3>
                 <p className="text-xs text-gray-500">{action.subtitle}</p>
               </div>
               <div className="bg-purple-500/10 p-3 rounded-full text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all group-hover:scale-110">
                 <div className="w-6 h-6">
                    <Icons type="edit" />
                 </div>
               </div>
            </a>
          ))}
        </div>

        {/* 2. LINKS PRINCIPALES (Redes y Grupos) */}
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Links Principales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {INGRESO_DATA.mainLinks.map(link => (
             <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`bg-itec-surface border border-itec-gray ${link.hoverClass} p-4 rounded-xl flex flex-col items-center text-center group transition-all hover:-translate-y-1`}>
                {renderIcon(link.iconType, link.colorClass)}
                <h4 className="font-bold text-white text-sm mb-0.5">{link.title}</h4>
                <span className="text-[10px] text-gray-500">{link.subtitle}</span>
             </a>
          ))}
        </div>

        {/* 3. MATERIAL DE ESTUDIO */}
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Material de Estudio</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {INGRESO_DATA.materials.map(material => (
            <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer" className="bg-itec-bg border border-itec-gray hover:border-itec-blue rounded-xl p-5 text-center transition-all group hover:bg-itec-surface">
               <div className="w-14 h-14 mx-auto bg-itec-sidebar border border-itec-gray rounded-full mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform group-hover:border-itec-blue">
                 {material.emoji}
               </div>
               <h4 className="font-bold text-white text-sm mb-1">{material.title}</h4>
               <span className="text-[10px] text-gray-500">{material.subtitle}</span>
            </a>
          ))}
        </div>

        {/* 4. SISTEMAS OFICIALES (SIU) */}
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Sistemas Oficiales de la UTN</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {INGRESO_DATA.siuLinks.map((siu, index) => (
             <a key={siu.id} href={siu.url} target="_blank" rel="noopener noreferrer" className="bg-white text-black p-5 rounded-xl flex items-center gap-4 hover:bg-gray-200 transition-colors group">
               <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
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
    </DashboardLayout>
  );
};
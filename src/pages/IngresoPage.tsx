import React from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { INGRESO_DATA } from '../data/ingresoLinks';

// Función Helper para renderizar iconos según el tipo de red social
const renderIcon = (type: string, colorClass: string) => {
  const baseClasses = `${colorClass} mb-3 group-hover:scale-110 transition-transform`;
  switch (type) {
    case 'whatsapp':
      return <svg className={baseClasses} width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>;
    case 'instagram':
      return <svg className={baseClasses} width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
    case 'youtube':
      return <svg className={baseClasses} width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
    case 'sheets':
      return <svg className={baseClasses} width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h8M8 17h8M8 9h2"></path></svg>;
    default:
      return null;
  }
};

export const IngresoPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-12 relative z-10">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-purple-500/20">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
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
              className="bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-[#333] hover:border-purple-500 p-6 rounded-2xl flex items-center justify-between group transition-all shadow-lg hover:shadow-purple-500/10"
            >
               <div>
                 <h3 className="font-bold text-white text-lg mb-1 group-hover:text-purple-400 transition-colors">{action.title}</h3>
                 <p className="text-xs text-gray-500">{action.subtitle}</p>
               </div>
               <div className="bg-purple-500/10 p-3 rounded-full text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all group-hover:scale-110">
                 <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
               </div>
            </a>
          ))}
        </div>

        {/* 2. LINKS PRINCIPALES (Redes y Grupos) */}
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Links Principales</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {INGRESO_DATA.mainLinks.map(link => (
             <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className={`bg-[#111] border border-[#262626] ${link.hoverClass} p-4 rounded-xl flex flex-col items-center text-center group transition-all hover:-translate-y-1`}>
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
            <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer" className="bg-[#1a1a1a] border border-[#333] hover:border-itec-blue rounded-xl p-5 text-center transition-all group hover:bg-[#222]">
               <div className="w-14 h-14 mx-auto bg-[#111] border border-[#262626] rounded-full mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform group-hover:border-itec-blue">
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
                 {/* Icono diferente para cada SIU */}
                 {index === 0 ? (
                   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                 ) : (
                   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                 )}
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
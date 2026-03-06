import React from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { NOSOTROS_DATA } from '../data/nosotrosLinks';

// Función Helper para renderizar los iconos de documentos
const renderIcon = (type: string, colorClass: string) => {
  const baseClasses = `${colorClass} w-10 h-10 mb-3 group-hover:scale-110 transition-transform`;
  switch (type) {
    case 'document':
      return <svg className={baseClasses} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>;
    case 'spreadsheet':
      return <svg className={baseClasses} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h8M8 17h8M8 9h2"></path></svg>;
    case 'folder':
      return <svg className={baseClasses} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
    default:
      return null;
  }
};

export const NosotrosPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-itec-blue text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-[0_0_30px_rgba(0,64,147,0.5)]">I</div>
          <h1 className="text-4xl font-bold text-white mb-2">Acerca de Nosotros</h1>
          <p className="text-gray-400 text-sm">Estudiantes dedicados a defender tus derechos en la UTNBA.</p>
        </div>

        {/* LINKS INSTITUCIONALES */}
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Transparencia y Documentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {NOSOTROS_DATA.map(link => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`bg-[#111] border border-[#262626] ${link.hoverClass} rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all group hover:-translate-y-1 hover:shadow-xl`}
            >
              {renderIcon(link.iconType, link.colorClass)}
              <h3 className="font-bold text-white mb-1 group-hover:text-white">{link.title}</h3>
              <p className="text-xs text-gray-500">{link.subtitle}</p>
            </a>
          ))}
        </div>

        {/* FORMULARIO "SUMATE" (Diseño Premium) */}
        <div className="max-w-xl mx-auto bg-itec-surface border border-itec-gray rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Brillo decorativo de fondo */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-itec-blue/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Sumate a ✳️TEC</h2>
            <p className="text-sm text-gray-400 mb-8 text-center">Si querés sumarte o saber de qué se trata, dejanos tu contacto y te escribimos.</p>
            
            <form className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Nombre Completo</label>
                <Input fullWidth placeholder="Ej: Juan Pérez" className="py-3 bg-[#111] text-sm" />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Teléfono (WhatsApp)</label>
                <Input fullWidth placeholder="+54 9 11..." className="py-3 bg-[#111] text-sm" />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Especialidad</label>
                <Input fullWidth placeholder="Ej: Ingeniería en Sistemas" className="py-3 bg-[#111] text-sm" />
              </div>
              
              <Button variant="primary" className="py-3.5 mt-4 font-bold text-sm uppercase tracking-wider bg-white text-black hover:bg-gray-200 border-none transition-colors shadow-lg">
                Enviar mis datos
              </Button>
            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
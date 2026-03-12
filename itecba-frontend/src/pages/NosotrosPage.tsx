import React from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { Icons } from '../components/atoms/Icons';
import { NOSOTROS_DATA } from '../data/nosotrosLinks';
import logoItec from '../assets/logo.png'; // <-- IMPORTAMOS EL LOGO OFICIAL

// Función Helper para renderizar los iconos usando el componente Icons
const renderIcon = (type: string, colorClass: string) => {
  // Envolvemos el Icons en un div que controle su tamaño (w-10 h-10) y animaciones
  const containerClasses = `w-10 h-10 mb-3 group-hover:scale-110 transition-transform ${colorClass}`;
  
  return (
    <div className={containerClasses}>
      <Icons type={type} />
    </div>
  );
};

export const NosotrosPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* HEADER CON LOGO */}
        <div className="text-center mb-12 mt-4">
          <div className="relative w-28 h-28 mx-auto mb-6">
            {/* Efecto de resplandor detrás del logo */}
            <div className="absolute inset-0 bg-itec-blue/40 blur-2xl rounded-full"></div>
            {/* Contenedor del logo */}
            <div className="relative w-full h-full bg-[#050505] border border-itec-gray rounded-full flex items-center justify-center shadow-2xl p-1">
              <img 
                src={logoItec} 
                alt="ITEC Logo" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">Acerca de TEC</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto ">
            Estudiantes de ingeniería dedicados a acompañarte, informarte y defender tus derechos en la UTN BA.
          </p>
        </div>

        {/* LINKS INSTITUCIONALES */}
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 text-center">Transparencia y Documentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {NOSOTROS_DATA.map(link => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`bg-itec-surface border border-itec-gray ${link.hoverClass} rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all group hover:-translate-y-1 hover:shadow-xl`}
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
                <Input fullWidth placeholder="Ej: Juan Pérez" className="py-3 bg-itec-bg border-itec-gray focus:border-itec-blue text-sm text-white transition-colors" />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Teléfono (WhatsApp)</label>
                <Input fullWidth placeholder="+54 9 11..." className="py-3 bg-itec-bg border-itec-gray focus:border-itec-blue text-sm text-white transition-colors" />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Especialidad</label>
                <Input fullWidth placeholder="Ej: Ingeniería en Sistemas" className="py-3 bg-itec-bg border-itec-gray focus:border-itec-blue text-sm text-white transition-colors" />
              </div>
              
              <Button variant="primary" className="py-3.5 mt-4 font-bold text-sm uppercase tracking-wider bg-itec-gray hover:bg-itec-gray/20 border-none transition-colors shadow-lg">
                Enviar mis datos
              </Button>
            </form>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};
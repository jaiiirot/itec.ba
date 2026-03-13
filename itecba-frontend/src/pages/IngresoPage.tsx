import React from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Icons } from '../components/atoms/Icons';

// Importamos la data y los organismos modulares
import { INGRESO_DATA } from '../data/ingresoLinks';
import { IngresoHighlightActions } from '../components/organisms/IngresoHighlightActions';
import { IngresoSocialGrid } from '../components/organisms/IngresoSocialGrid';
import { IngresoAcademicGrid } from '../components/organisms/IngresoAcademicGrid';

export const IngresoPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-12 relative z-10">
        
        {/* HEADER DE LA PÁGINA */}
        <div className="text-center mb-10 animate-in fade-in zoom-in-95 duration-500">
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

        {/* Organismo 1: Formularios y Acciones */}
        <IngresoHighlightActions actions={INGRESO_DATA.actions} />

        {/* Organismo 2: WhatsApp, Instagram, etc. */}
        <IngresoSocialGrid links={INGRESO_DATA.mainLinks} />

        {/* Organismo 3: Drive, Resúmenes y SIU Guaraní */}
        <IngresoAcademicGrid 
          materials={INGRESO_DATA.materials} 
          siuLinks={INGRESO_DATA.siuLinks} 
        />

      </div>
    </DashboardLayout>
  );
};
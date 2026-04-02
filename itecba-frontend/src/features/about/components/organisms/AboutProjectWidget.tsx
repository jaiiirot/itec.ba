import React from 'react';
import { Icons } from '@/components/atoms/Icons';

export const AboutProjectWidget: React.FC = () => {
  return (
    <section className="bg-itec-surface border border-itec-gray rounded-2xl p-6 md:p-8 shadow-xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 shadow-sm">
          <div className="w-5 h-5"><Icons type="info" /></div>
        </div>
        <h2 className="text-xl font-bold text-white">Nuestra Misión</h2>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        ITEC es una plataforma colaborativa creada por y para estudiantes de la UTN BA. Nuestro objetivo es centralizar toda la información, herramientas y material de estudio necesarios para facilitar y potenciar la vida universitaria.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-itec-bg border border-itec-gray p-4 rounded-xl hover:border-red-500/30 transition-colors">
          <h3 className="text-white font-bold text-sm mb-1">📚 Aportes</h3>
          <p className="text-[11px] text-gray-500">Compartimos resúmenes y parciales de forma gratuita.</p>
        </div>
        <div className="bg-itec-bg border border-itec-gray p-4 rounded-xl hover:border-red-500/30 transition-colors">
          <h3 className="text-white font-bold text-sm mb-1">🤝 Comunidad</h3>
          <p className="text-[11px] text-gray-500">Conectamos alumnos de cada materia y comisión.</p>
        </div>
        <div className="bg-itec-bg border border-itec-gray p-4 rounded-xl hover:border-red-500/30 transition-colors">
          <h3 className="text-white font-bold text-sm mb-1">⚙️ Open Source</h3>
          <p className="text-[11px] text-gray-500">Código abierto en GitHub para que cualquiera colabore.</p>
        </div>
      </div>
    </section>
  );
};
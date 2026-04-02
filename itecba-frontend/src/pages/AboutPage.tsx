import React from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Icons } from '@/components/atoms/Icons';

import { PageHeader } from '../components/molecules/PageHeader';
import logoItec from '../assets/logo.png'; 

import { AboutProjectWidget } from '@/features/about/components/organisms/AboutProjectWidget';
import { ContributorsWidget } from '@/features/about/components/organisms/ContributorsWidget'; 

export const AboutPage: React.FC = () => {
  usePageTitle('Sobre Nosotros');

  return (
    <DashboardLayout>

        {/* El Header ahora ajusta el logo automáticamente */}
        <div className='max-w-4xl'>

        <PageHeader 
          title="Sobre ITEC"
          description="Conoce más sobre el proyecto open-source, nuestra visión y quiénes están detrás del desarrollo de la plataforma."
          imageUrl={logoItec} 
          colorTheme=""
          />

          </div>
        {/* Organismo 1: Misión y Visión */}
        <AboutProjectWidget />

        {/* Organismo 2: Comunidad de GitHub */}
        <ContributorsWidget />

        {/* 🔴 NUEVO Organismo 3: CTA Gigante para unirse */}
        <div className="flex justify-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <a 
            href="https://instagram.com/itecba" // Reemplázalo por tu enlace de WhatsApp si prefieres: "https://wa.me/TUnumero"
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-black-600 to-black-500 hover:from-red-500 hover:to-orange-400 text-white px-8 py-4 rounded-full font-bold text-sm md:text-base shadow-[0_0_25px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all hover:scale-105"
          >
            <div className="w-5 h-5"><Icons type="profile" /></div>
            Manda un mensaje para unirte a ITEC
          </a>
        </div>

    </DashboardLayout>
  );
};
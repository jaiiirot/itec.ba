import React from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { UniversalSearch } from "../components/organisms/UniversalSearch";
import { HubNavigation } from "../components/organisms/HubNavigation";
import { InstagramCard } from "../components/molecules/InstagramCard";
import { CAMPUS_LIFE_LINKS, MOCK_NEWS } from "../data/dashboardData";
import { useAuth } from "../context/AuthContext"; // <-- 1. Importamos el contexto

export const Dashboard: React.FC = () => {
  const { user } = useAuth(); // <-- 2. Extraemos el usuario actual

  // 3. Obtenemos solo el primer nombre (Ej: "Juan Pérez" -> "Juan")
  const firstName = user?.name ? user.name.split(' ')[0] : 'Estudiante';

  return (
    <DashboardLayout>
      
      {/* 1. BUSCADOR */}
      <UniversalSearch />

      {/* 2. SALUDO Y LINKS DE VIDA UNIVERSITARIA */}
      <section className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-1 text-white">
          ¡Hola, <span className="text-itec-red-skye">{firstName}</span>! 👋
        </h1>
        <p className="text-gray-400 text-sm">
          Tu progreso en la UTN BA, en un solo lugar.
        </p>
      </section>

      <section className="my-6">
        <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">
          Links a la Vida Universitaria
        </h2>
        <div className="flex flex-wrap gap-2">
          {CAMPUS_LIFE_LINKS.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-itec-surface border border-itec-gray hover:border-gray-400 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-medium text-gray-300 hover:text-white transition-colors"
            >
              <span>{link.icon}</span> {link.title}
            </a>
          ))}
        </div>
      </section>

      {/* 3. HUB PRINCIPAL */}
      <HubNavigation />

      {/* 4. FEED DE NOTICIAS DE INSTAGRAM */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Novedades <span className="text-itec-red-skye">ITEC</span>
        </h2>
        <a
          href="https://instagram.com/itecba"
          target="_blank"
          rel="noreferrer"
          className="text-itec-red-skye hover:underline font-medium"
        >
          Ver Instagram
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_NEWS.slice(0, 4).map((news) => (
          <InstagramCard
            key={news.id}
            imageUrl={news.imageUrl}
            caption={news.caption}
            date={news.date}
            link={news.link}
          />
        ))}
      </div>

    </DashboardLayout>
  );
};
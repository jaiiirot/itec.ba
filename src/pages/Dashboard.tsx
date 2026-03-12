import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { UniversalSearch } from "../components/organisms/UniversalSearch";
import { HubNavigation } from "../components/organisms/HubNavigation";
import { InstagramCard } from "../components/molecules/InstagramCard";
import { MOCK_NEWS } from "../data/dashboardData";
import { useAuth } from "../context/AuthContext";
import { Icons } from "../components/atoms/Icons";

// Importamos el servicio y el modal nuevos
import { linksService, type CampusLink } from "../services/linksService";
import { EditLinksModal } from "../components/organisms/EditLinksModal";

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  
  const [links, setLinks] = useState<CampusLink[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadLinks = async () => {
    try {
      const data = await linksService.getLinks();
      setLinks(data);
    } catch (e) { console.error("Error cargando links", e); }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Estudiante';

  return (
    <DashboardLayout>
      <UniversalSearch />

      <section className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-1 text-white">
          ¡Hola, <span className="text-itec-red-skye">{firstName}</span>! 👋
        </h1>
        <p className="text-gray-400 text-sm">Tu progreso en la UTN BA, en un solo lugar.</p>
      </section>

      {/* SECCIÓN DE LINKS DINÁMICA */}
      <section className="my-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            Links a la Vida Universitaria
          </h2>
          {/* BOTÓN DE CONFIGURACIÓN (SOLO ADMINS) */}
          {isAdmin && (
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer"
              title="Editar Links"
            >
              <Icons type="settings" className="w-4 h-4" />
              <span>Agregar mas links</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {links.length === 0 ? (
            <p className="text-xs text-gray-600 italic">No hay links configurados aún.</p>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith('/') ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className="bg-itec-surface border border-itec-gray hover:border-gray-400 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-medium text-gray-300 hover:text-white transition-colors"
              >
                <span>{link.icon}</span> {link.title}
              </a>
            ))
          )}
        </div>
      </section>

      <HubNavigation />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white">
          Novedades <span className="text-itec-red-skye">ITEC</span>
        </h2>
        <a href="https://instagram.com/itecba" target="_blank" rel="noreferrer" className="text-itec-red-skye hover:underline font-medium">
          Ver Instagram
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {MOCK_NEWS.slice(0, 4).map((news) => (
          <InstagramCard key={news.id} imageUrl={news.imageUrl} caption={news.caption} date={news.date} link={news.link} />
        ))}
      </div>

      {/* MODAL DE EDICIÓN */}
      <EditLinksModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onLinksUpdated={loadLinks} 
      />

    </DashboardLayout>
  );
};
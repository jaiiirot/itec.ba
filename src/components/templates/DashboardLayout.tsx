import React, { useState } from "react";
import { Sidebar } from "../organisms/Sidebar";
import { ChatbotWidget } from "../organisms/ChatbotWidget"; // <-- IMPORTAR AQUÍ
import { BackgroundBlur } from "../atoms/BackgroundBlur"; // <-- 1. Importar el componente
import logoItec from "../../assets/logo.png"; // <-- IMPORTA
export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // 2. Agregamos 'relative isolate' al contenedor principal para que los z-index negativos funcionen correctamente
    <div className="flex h-screen w-full bg-itec-bg text-itec-text overflow-hidden relative isolate">
      {/* 3. Inyectamos el componente de fondo para toda la web */}
      <BackgroundBlur />

      {/* Sidebar recibe su estado */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Contenedor Principal:
        - md:pl-20 reserva el espacio de los 80px del Sidebar colapsado. 
        - Al expandirse el Sidebar con :hover, flota por encima (fixed) sin empujar la pantalla, justo como Instagram.
      */}
      <main className="flex-1 overflow-y-auto flex flex-col md:pl-20 transition-all duration-300 relative z-0">
        {/* TOP BAR MOBILE (Solo visible en celular) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[#262626] bg-[#000000] sticky top-0 z-30">
          <div className="font-bold text-xl flex items-center gap-2 text-white">
            {/* REEMPLAZA EL DIV POR LA IMAGEN */}
            <img
              src={logoItec}
              alt="ITEC Logo"
              className="w-8 h-8 object-contain"
            />
            ITEC UTN
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition"
          >
            {/* Ícono Hamburguesa */}
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Contenido inyectado de la página */}
        <div className="p-4 md:p-8 flex-1">{children}</div>
      </main>

      {/* AÑADIR EL CHATBOT AQUÍ */}
      <ChatbotWidget />
    </div>
  );
};

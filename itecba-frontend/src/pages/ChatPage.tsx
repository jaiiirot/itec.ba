import React from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";

// Importamos los nuevos organismos modulares
import { ChatInterface } from "../components/organisms/ChatInterface";
import { ImportantDatesWidget } from "../components/organisms/ImportantDatesWidget";
import { PageHeader } from "../components/molecules/PageHeader";

export const ChatPage: React.FC = () => {
  usePageTitle("Preguntas Frecuentes");
  const { isAdmin } = useAuth(); // Obtenemos el rol para habilitar los botones de admin

  return (
    <DashboardLayout>
      <PageHeader
        title="Ayuda y Consultas"
        description="Resuelve tus dudas rápidas con nuestro Asistente ITEC, o revisa el calendario académico."
        iconType="users" // O si agregas uno de chat en Icons.tsx puedes usar 'chat' o 'message'
        colorTheme="teal"
      />
      <div className="max-w-4xl mx-auto pb-12 relative z-10">
        {/* Cabecera de la Página */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Ayuda y Consultas
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Resuelve tus dudas rápidas con nuestro Bot, o revisa el calendario
            académico abajo.
          </p>
        </div>

        {/* 🔴 ORGANISMO 1: El Chat Limpio (Sin Historial) */}
        <ChatInterface />

        {/* 🔴 ORGANISMO 2: El Calendario (Con permisos de Admin) */}
        <ImportantDatesWidget isAdmin={isAdmin} />
      </div>
    </DashboardLayout>
  );
};

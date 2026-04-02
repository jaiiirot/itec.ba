import React from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";

// Importamos los nuevos organismos modulares
import { ChatInterface } from "@features/faqs/components/organisms/ChatInterface";
import { ImportantDatesWidget } from "@features/faqs/components/organisms/ImportantDatesWidget";
import { PageHeader } from "@/components/molecules/PageHeader";

export const FaqsPage: React.FC = () => {
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
      {/* 🔴 ORGANISMO 1: El Chat Limpio (Sin Historial) */}
      <ChatInterface />

      {/* 🔴 ORGANISMO 2: El Calendario (Con permisos de Admin) */}
      <ImportantDatesWidget isAdmin={isAdmin} />
    </DashboardLayout>
  );
};

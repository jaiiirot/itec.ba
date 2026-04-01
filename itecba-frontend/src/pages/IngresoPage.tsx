import React from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { Icons } from "../components/atoms/Icons";

// Importamos la data y los organismos modulares
import { INGRESO_DATA } from "../data/ingresoLinks";
import { IngresoHighlightActions } from "../components/organisms/IngresoHighlightActions";
import { IngresoSocialGrid } from "../components/organisms/IngresoSocialGrid";
import { IngresoAcademicGrid } from "../components/organisms/IngresoAcademicGrid";
import { PageHeader } from "@/components/molecules/PageHeader";

export const IngresoPage: React.FC = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Ingreso UTN BA"
        description="Todo lo necesario para el Seminario Universitario. Links oficiales, grupos y material de estudio."
        iconType="entry"
        colorTheme="purple"
      ></PageHeader>

      {/* Organismo 1: Formularios y Acciones */}
      <IngresoHighlightActions actions={INGRESO_DATA.actions} />

      {/* Organismo 2: WhatsApp, Instagram, etc. */}
      <IngresoSocialGrid links={INGRESO_DATA.mainLinks} />

      {/* Organismo 3: Drive, Resúmenes y SIU Guaraní */}
      <IngresoAcademicGrid
        materials={INGRESO_DATA.materials}
        siuLinks={INGRESO_DATA.siuLinks}
      />
    </DashboardLayout>
  );
};

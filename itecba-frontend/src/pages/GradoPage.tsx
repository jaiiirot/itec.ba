import React, { useState, Suspense } from "react";
import { DashboardLayout } from "../components/templates/DashboardLayout";
import { CareerGrid } from "../components/organisms/CareerGrid";
import { Icons } from "../components/atoms/Icons";
import { PLANES_DB } from "../data/correlativas";
import { PageHeader } from "../components/molecules/PageHeader";

// 🔴 MEJORA PREMIUM: Lazy Loading del Mapa Interactivo
// Esto evita que las librerías gráficas pesadas se descarguen si el usuario no hace clic en una carrera.
const CareerGraph = React.lazy(() =>
  import("../components/organisms/CareerGraph").then((m) => ({
    default: m.CareerGraph,
  })),
);

export const GradoPage: React.FC = () => {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  // Determinar la clase del contenedor dinámicamente
  // Si hay mapa abierto -> Altura fija para hacer pan & zoom.
  // Si no hay mapa -> Altura fluida para poder scrollear las tarjetas en móviles.
  const containerClass = selectedCareer
    ? "h-[calc(100vh-100px)] flex flex-col w-full relative z-10 px-2"
    : "min-h-[calc(100vh-100px)] flex flex-col max-w-7xl mx-auto w-full relative z-10 px-2";

  return (
    <DashboardLayout>
      <div className={containerClass}>
        <PageHeader
          title="Planes de Estudio"
          description="Explora el mapa de materias y correlatividades de la UTN BA."
          iconType="search"
          colorTheme="yellow"
        >
          {selectedCareer && (
            <button
              onClick={() => setSelectedCareer(null)}
              className="bg-itec-surface border border-itec-gray hover:bg-white hover:text-black text-gray-300 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
            >
              <div className="w-4 h-4">
                <Icons type="arrowLeft" />
              </div>
              Volver a Carreras
            </button>
          )}
        </PageHeader>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex-1 w-full relative">
          {/* MODO SELECCIÓN (Organismo) */}
          {!selectedCareer && <CareerGrid onSelect={setSelectedCareer} />}

          {/* MODO MAPA INTERACTIVO (Lazy Loaded) */}
          {selectedCareer && PLANES_DB[selectedCareer] && (
            <div className="w-full h-full bg-itec-surface/50 border border-itec-gray rounded-2xl overflow-hidden animate-in fade-in duration-700 shadow-2xl relative">
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-itec-surface">
                    <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400 font-medium text-sm">
                      Cargando mapa interactivo...
                    </p>
                  </div>
                }
              >
                <CareerGraph planData={PLANES_DB[selectedCareer]} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

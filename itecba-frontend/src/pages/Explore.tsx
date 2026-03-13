import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Button } from '../components/atoms/Button';
import { useAuth } from '../context/AuthContext';
import { resourcesService } from '../services/resourcesService';
import type { ResourceData } from '../services/resourcesService';

// Importamos nuestros nuevos componentes limpios
import { ResourceFilters } from '../components/organisms/ResourceFilters';
import { ResourcesTable } from '../components/organisms/ResourcesTable';

// 🔴 LAZY LOADING: Estos componentes pesados no se descargan hasta que se haga clic en los botones
const AddResourceModal = React.lazy(() => import('../components/organisms/AddResourceModal').then(m => ({ default: m.AddResourceModal })));
const AdminPendingResourcesModal = React.lazy(() => import('../components/organisms/AdminPendingResourcesModal').then(m => ({ default: m.AdminPendingResourcesModal })));

export const Explore: React.FC = () => {
  const { isAdmin } = useAuth();

  const [allResources, setAllResources] = useState<ResourceData[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');

  // Estados de Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    resourcesService.getApprovedResources()
      .then(res => {
        const sorted = res.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setAllResources(sorted);
      })
      .catch(err => console.error("Error al traer recursos:", err))
      .finally(() => setIsLoading(false));

    if (isAdmin) {
      resourcesService.getPendingResources().then(res => setPendingCount(res.length));
    }
  }, [isAdmin]);

  const handleClearFilters = () => {
    setSearchQuery(''); setCarrera(''); setNivel(''); setMateria('');
  };

  // Filtrado en tiempo real
  const filteredResources = useMemo(() => {
    return allResources.filter(r => {
      const matchText = searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCarrera = carrera === '' || r.carrera === carrera;
      const matchNivel = nivel === '' || r.nivel === nivel;
      const matchMateria = materia === '' || r.materia.toLowerCase().includes(materia.toLowerCase());
      return matchText && matchCarrera && matchNivel && matchMateria;
    });
  }, [allResources, searchQuery, carrera, nivel, materia]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10 relative z-10">
        
        {/* Cabecera Principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Explorar Aportes</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
            Resúmenes, parciales y guías compartidas por la comunidad de ITEC.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} className="text-xs bg-orange-600/20 text-orange-500 border-none hover:bg-orange-600 hover:text-white transition-all">
              + Aportar Archivo (+1 Punto)
            </Button>
            {isAdmin && (
              <Button variant="primary" onClick={() => setIsAdminModalOpen(true)} className="relative text-xs bg-itec-surface border-itec-gray hover:bg-itec-gray transition-all shadow-lg">
                Moderar Archivos
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-orange-500 text-white text-[10px] items-center justify-center font-bold">{pendingCount}</span>
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Organismo: Filtros */}
        <ResourceFilters 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          carrera={carrera} setCarrera={setCarrera}
          nivel={nivel} setNivel={setNivel}
          materia={materia} setMateria={setMateria}
          onClear={handleClearFilters}
        />

        {/* Organismo: Tabla de Resultados */}
        <ResourcesTable 
          resources={filteredResources} 
          isLoading={isLoading} 
          onAddClick={() => setIsAddModalOpen(true)} 
        />

      </div>

      {/* Renderizado Perezoso de Modales (Solo se cargan si se activan) */}
      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />}>
        {isAddModalOpen && (
          <AddResourceModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            isAdmin={isAdmin} 
            onResourceAdded={(newRes, isDirect) => {
              if (isDirect) setAllResources(prev => [newRes, ...prev]);
              else if (isAdmin) setPendingCount(prev => prev + 1);
            }}
          />
        )}
        
        {isAdminModalOpen && isAdmin && (
          <AdminPendingResourcesModal 
            isOpen={isAdminModalOpen} 
            onClose={() => setIsAdminModalOpen(false)} 
            onResourceApproved={(res) => {
              setAllResources(prev => [res, ...prev]);
              setPendingCount(prev => prev - 1);
            }}
          />
        )}
      </Suspense>

    </DashboardLayout>
  );
};
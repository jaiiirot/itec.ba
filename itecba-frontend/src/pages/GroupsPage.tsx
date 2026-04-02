import React, { useMemo, Suspense, useState } from 'react';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { Icons } from '@/components/atoms/Icons';

import { useAuth } from '@/context/AuthContext';
import { GroupFilters } from '@features/groups/components/organisms/GroupFilters';
import { SpecialtyGrid } from '@features/groups/components/organisms/SpecialtyGrid';
import { GroupResults } from '@features/groups/components/organisms/GroupResults';
import { PageHeader } from '@/components/molecules/PageHeader';
import { usePageTitle } from '@/hooks/usePageTitle';

import { useApprovedGroups, usePendingGroups } from '@features/groups/hooks/useGroups';
import { useGroupFilters } from '@features/groups/hooks/useGroupFilters'; // 🟢 NUEVO HOOK

const AddGroupModal = React.lazy(() => import('@features/groups/components/organisms/AddGroupModal').then(m => ({ default: m.AddGroupModal })));
const AdminPendingGroupsModal = React.lazy(() => import('@features/groups/components/organisms/AdminPendingGroupsModal').then(m => ({ default: m.AdminPendingGroupsModal })));

export const GroupsPage: React.FC = () => {
  usePageTitle("Grupos de WhatsApp | ITEC");
  const { user, isAdmin } = useAuth();

  const { data: allGroups = [], isLoading: isLoadingGroups } = useApprovedGroups();
  const { data: pendingGroups = [] } = usePendingGroups(isAdmin);
  const pendingCount = pendingGroups.length;

  const [hasSearched, setHasSearched] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // 🟢 Instanciamos nuestro Hook atómico
  const filters = useGroupFilters(() => setHasSearched(true));

  // Lógica de grilla de inicio rápida
  const handleSpecialtyClick = (val: string) => {
    filters.setCarrera(val); 
    filters.setNivel(val === 'ingreso' ? '0' : ''); 
    filters.setMateria(''); 
    filters.setComision('');
    setHasSearched(true);
  };

  // 🟢 Búsqueda unificada en el lado del cliente (Mejora: Si busca desde homogéneas o carrera, mapea correctamente)
  const filteredResults = useMemo(() => {
    if (!hasSearched) return [];
    
    return allGroups.filter(g => {
      // Si el filtro de carrera está en una especialidad (ej. sistemas) 
      // pero el grupo se creó bajo "homogeneas" (Z), y el nombre de la materia coincide, DEBEMOS mostrarlo.
      const isHomogeneaCompatibility = (filters.carrera !== 'homogeneas' && g.carrera === 'homogeneas' && g.materia === filters.materia);
      
      const matchCarrera = filters.carrera === '' || g.carrera === filters.carrera || isHomogeneaCompatibility;
      const matchNivel = filters.nivel === '' || g.nivel === filters.nivel;
      const matchMateria = filters.materia === '' || (g.materia || '').toLowerCase().includes(filters.materia.toLowerCase());
      const matchComision = filters.comision === '' || (g.comision || '').toLowerCase().includes(filters.comision.toLowerCase());
      
      return matchCarrera && matchNivel && matchMateria && matchComision;
    });
  }, [allGroups, hasSearched, filters.carrera, filters.nivel, filters.materia, filters.comision]);

  const handleClearSearch = () => {
    filters.handleClear();
    setHasSearched(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto w-full pb-10">
        
        <PageHeader 
          title="Grupos de Estudio"
          description="Centralizá tu cursada. Encontrá y unite a los grupos oficiales de WhatsApp de tus materias y comisiones al instante."
          iconType="users"
          colorTheme="green"
        >
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="cursor-pointer bg-itec-surface border border-itec-gray hover:bg-white hover:text-black text-gray-300 px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <div className="w-4 h-4"><Icons type="plus" /></div>
              Aportar Grupo
            </button>

            {isAdmin && (
              <button 
                onClick={() => setIsAdminModalOpen(true)} 
                className="cursor-pointer relative bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)] active:scale-95"
              >
                Panel Admin
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white text-[10px] items-center justify-center font-bold shadow-lg border-2 border-green-500">
                      {pendingCount > 9 ? '+9' : pendingCount}
                    </span>
                  </span>
                )}
              </button>
            )}
          </div>
        </PageHeader>

        {/* Pasamos el objeto filters limpio */}
        <GroupFilters filters={filters} isLoading={isLoadingGroups} />

        {isLoadingGroups ? (
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
            <div className="relative w-20 h-20 flex items-center justify-center mb-5">
               <div className="absolute inset-0 border-4 border-itec-gray/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
               <Icons type="whatsapp" className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-white font-bold text-lg mb-1">Sincronizando base de datos...</p>
            <p className="text-gray-500 text-sm">Conectando con la red estudiantil</p>
          </div>
        ) : hasSearched ? (
          <GroupResults 
            results={filteredResults} 
            onClear={handleClearSearch} 
            onAddClick={() => setIsAddModalOpen(true)} 
          />
        ) : (
          <SpecialtyGrid onSpecialtyClick={handleSpecialtyClick} />
        )}

      </div>

      <Suspense fallback={<div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md" />}>
        {isAddModalOpen && (
          <AddGroupModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            isAdmin={isAdmin} 
            userEmail={user?.email || 'invitado'} 
            existingGroups={allGroups}
          />
        )}
        {isAdminModalOpen && isAdmin && (
          <AdminPendingGroupsModal 
            isOpen={isAdminModalOpen} 
            onClose={() => setIsAdminModalOpen(false)} 
          />
        )}
      </Suspense>
    </DashboardLayout>
  );
};
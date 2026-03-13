import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Button } from '../components/atoms/Button';

import { useAuth } from '../context/AuthContext';
import { groupsService, type GroupData } from '../services/groupsService';

import { GroupFilters } from '../components/organisms/GroupFilters';
import { SpecialtyGrid } from '../components/organisms/SpecialtyGrid';
import { GroupResults } from '../components/organisms/GroupResults';
import { PageHeader } from '../components/molecules/PageHeader';

const AddGroupModal = React.lazy(() => import('../components/organisms/AddGroupModal').then(m => ({ default: m.AddGroupModal })));
const AdminPendingGroupsModal = React.lazy(() => import('../components/organisms/AdminPendingGroupsModal').then(m => ({ default: m.AdminPendingGroupsModal })));

export const GroupsPage: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [allGroups, setAllGroups] = useState<GroupData[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  // Estados de Búsqueda
  const [carrera, setCarrera] = useState('');
  const [nivel, setNivel] = useState('');
  const [materia, setMateria] = useState('');
  const [comision, setComision] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setIsLoadingGroups(true);
    groupsService.getApprovedGroups()
      .then(dbGroups => setAllGroups(dbGroups))
      .catch(err => console.error("Error al cargar grupos:", err))
      .finally(() => setIsLoadingGroups(false));

    if (isAdmin) {
      groupsService.getPendingGroups().then(pendings => setPendingCount(pendings.length));
    }
  }, [isAdmin]);

  const handleClear = () => {
    setCarrera(''); setNivel(''); setMateria(''); setComision('');
    setHasSearched(false);
  };

  const handleSpecialtyClick = (val: string) => {
    setCarrera(val); 
    setNivel(val === 'ingreso' ? '0' : ''); 
    setMateria(''); 
    setComision('');
    setHasSearched(true);
  };

  // 🔴 MEJORA PREMIUM: Filtrado seguro con useMemo (Eliminamos el useState sobrante)
  const filteredResults = useMemo(() => {
    if (!hasSearched) return [];
    
    return allGroups.filter(g => {
      const matchCarrera = carrera === '' || g.carrera === carrera;
      const matchNivel = nivel === '' || g.nivel === nivel;
      // BLINDAJE CONTRA CRASH: Usamos (g.materia || '') por si MongoDB devuelve un dato incompleto
      const matchMateria = materia === '' || (g.materia || '').toLowerCase().includes(materia.toLowerCase());
      const matchComision = comision === '' || (g.comision || '').toLowerCase().includes(comision.toLowerCase());
      
      return matchCarrera && matchNivel && matchMateria && matchComision;
    });
  }, [allGroups, hasSearched, carrera, nivel, materia, comision]);

  // Estados de Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-10 relative z-10">
        
        <PageHeader 
            title="Grupos de WhatsApp"
            description="Encontrá la comunidad de tu materia o comisión."
            iconType="users"
            colorTheme="green"
          >
            <Button variant="secondary" onClick={() => setIsAddModalOpen(true)} className="text-xs bg-itec-surface border-itec-gray hover:bg-white hover:text-black">
              + Aportar nuevo grupo
            </Button>
            {isAdmin && (
              <Button variant="primary" onClick={() => setIsAdminModalOpen(true)} className="relative text-xs bg-itec-blue/20 text-itec-blue-skye hover:bg-itec-blue hover:text-white border-none shadow-lg">
                Ver solicitudes
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-itec-red-skye opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-itec-red-skye text-white text-[10px] items-center justify-center font-bold">{pendingCount}</span>
                  </span>
                )}
              </Button>
            )}
          </PageHeader>

        <GroupFilters 
          carrera={carrera} setCarrera={setCarrera}
          nivel={nivel} setNivel={setNivel}
          materia={materia} setMateria={setMateria}
          comision={comision} setComision={setComision}
          isLoading={isLoadingGroups}
          onSearch={() => setHasSearched(true)} // Solo activa el render, useMemo hace el resto
          onClear={handleClear}
        />

        {isLoadingGroups ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Sincronizando comunidades...</p>
          </div>
        ) : hasSearched ? (
          <GroupResults 
            results={filteredResults} 
            onClear={handleClear} 
            onAddClick={() => setIsAddModalOpen(true)} 
          />
        ) : (
          <SpecialtyGrid 
            onSpecialtyClick={handleSpecialtyClick} 
          />
        )}
      </div>

      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />}>
        {isAddModalOpen && (
          <AddGroupModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            isAdmin={isAdmin} 
            userEmail={user?.email || 'invitado'} 
            existingGroups={allGroups}
            onGroupAdded={(newGroup, isDirectPublish) => {
              if (isDirectPublish) setAllGroups(prev => [...prev, newGroup]);
              else if (isAdmin) setPendingCount(prev => prev + 1);
            }}
          />
        )}

        {isAdminModalOpen && isAdmin && (
          <AdminPendingGroupsModal 
            isOpen={isAdminModalOpen} 
            onClose={() => setIsAdminModalOpen(false)} 
            onGroupApproved={(group) => {
              setAllGroups(prev => [...prev, group]);
              setPendingCount(prev => prev - 1);
            }}
          />
        )}
      </Suspense>

    </DashboardLayout>
  );
};
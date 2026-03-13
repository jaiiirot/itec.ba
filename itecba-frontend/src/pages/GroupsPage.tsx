import React, { useState, useEffect, Suspense } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Button } from '../components/atoms/Button';

import { useAuth } from '../context/AuthContext';
import { groupsService, type GroupData } from '../services/groupsService';

// Importamos nuestros nuevos organismos modulares
import { GroupFilters } from '../components/organisms/GroupFilters';
import { SpecialtyGrid } from '../components/organisms/SpecialtyGrid';
import { GroupResults } from '../components/organisms/GroupResults';

// 🔴 LAZY LOADING: Los modales solo se descargan si el usuario hace clic
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
  const [results, setResults] = useState<GroupData[]>([]);

  // Estados de Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

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
    setHasSearched(false); setResults([]);
  };

  // 🔴 CORRECCIÓN: Búsqueda parcial (includes) implementada
  const handleSearch = () => {
    const filtered = allGroups.filter(g => {
      return (carrera === '' || g.carrera === carrera) &&
             (nivel === '' || g.nivel === nivel) &&
             // Ahora busca coincidencias parciales sin importar mayúsculas/minúsculas
             (materia === '' || g.materia.toLowerCase().includes(materia.toLowerCase())) &&
             (comision === '' || g.comision.toLowerCase().includes(comision.toLowerCase()));
    });
    setResults(filtered);
    setHasSearched(true);
  };

  const handleSpecialtyClick = (val: string) => {
    setCarrera(val); 
    setNivel(val === 'ingreso' ? '0' : ''); 
    setMateria(''); 
    setComision('');
    setResults(allGroups.filter(g => g.carrera === val));
    setHasSearched(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-10 relative z-10">
        
        {/* Cabecera Principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Grupos de WhatsApp</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-4">
            Encontrá la comunidad de tu materia o comisión.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
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
          </div>
        </div>

        {/* Organismo 1: Filtros */}
        <GroupFilters 
          carrera={carrera} setCarrera={setCarrera}
          nivel={nivel} setNivel={setNivel}
          materia={materia} setMateria={setMateria}
          comision={comision} setComision={setComision}
          isLoading={isLoadingGroups}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* Lógica de Renderizado Principal */}
        {isLoadingGroups ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Sincronizando comunidades...</p>
          </div>
        ) : hasSearched ? (
          /* Organismo 2: Resultados */
          <GroupResults 
            results={results} 
            onClear={handleClear} 
            onAddClick={() => setIsAddModalOpen(true)} 
          />
        ) : (
          /* Organismo 3: Especialidades */
          <SpecialtyGrid 
            onSpecialtyClick={handleSpecialtyClick} 
          />
        )}
      </div>

      {/* Modales (Lazy Loaded) */}
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
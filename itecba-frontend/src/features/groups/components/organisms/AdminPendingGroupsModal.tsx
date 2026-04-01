import React, { useState, useEffect } from 'react';
import { groupsService, type GroupData } from '../../services/groupsService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGroupApproved: (group: GroupData) => void;
}

export const AdminPendingGroupsModal: React.FC<Props> = ({ isOpen, onClose, onGroupApproved }) => {
  const [pendingGroups, setPendingGroups] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      groupsService.getPendingGroups()
        .then(setPendingGroups)
        .catch(() => alert("Error cargando solicitudes"))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleApprove = async (group: GroupData) => {
    try {
      const newId = await groupsService.approvePendingGroup(group);
      setPendingGroups(prev => prev.filter(g => g.id !== group.id));
      onGroupApproved({ ...group, id: newId });
      alert(`✅ Grupo ${group.comision} publicado.`);
    } catch {
      alert("Error al aprobar.");
    }
  };

  const handleReject = async (groupId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta solicitud?")) return;
    try {
      await groupsService.rejectPendingGroup(groupId);
      setPendingGroups(prev => prev.filter(g => g.id !== groupId));
    } catch {
      alert("Error al rechazar.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-itec-surface border border-itec-gray rounded-2xl w-full max-w-5xl shadow-2xl p-6 relative flex flex-col max-h-[85vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10">✖</button>
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">🛡️ Panel de Moderación</h2>
          <p className="text-xs text-gray-400 mt-2">Revisá y aprobá los grupos enviados por los usuarios.</p>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar border border-itec-gray rounded-xl bg-itec-bg">
          {isLoading ? (
            <div className="flex justify-center items-center py-20"><div className="w-8 h-8 border-2 border-t-itec-blue rounded-full animate-spin"></div></div>
          ) : pendingGroups.length > 0 ? (
            <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
              <thead className="bg-itec-surface sticky top-0 z-10 border-b border-itec-gray">
                <tr>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Materia</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Comisión</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Carrera</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase">Link</th>
                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingGroups.map((group) => (
                  <tr key={group.id} className="border-b border-itec-gray/50 hover:bg-itec-surface/50 transition-colors">
                    <td className="p-3 text-white font-medium">{group.materia}</td>
                    <td className="p-3"><span className="bg-itec-blue/20 text-itec-blue-skye px-2 py-0.5 rounded text-xs font-bold border border-itec-blue/30">{group.comision}</span></td>
                    <td className="p-3 text-gray-400 text-xs"><span className="capitalize">{group.carrera}</span></td>
                    <td className="p-3"><a href={group.link} target="_blank" rel="noreferrer" className="text-itec-blue-skye hover:text-white underline text-xs inline-block max-w-[150px] truncate">{group.link}</a></td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleReject(group.id)} className="px-3 py-1.5 text-xs font-bold bg-itec-red/10 text-itec-red-skye hover:bg-itec-red hover:text-white rounded-lg">Rechazar</button>
                        <button onClick={() => handleApprove(group)} className="px-3 py-1.5 text-xs font-bold bg-itec-blue text-white hover:bg-itec-blue-skye rounded-lg">Aprobar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20"><p className="text-gray-400">No hay grupos pendientes.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};
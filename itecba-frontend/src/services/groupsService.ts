// import { db } from '../lib/firebase';
// import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

// export interface GroupData {
//   id: string;
//   carrera: string;
//   nivel: string;
//   materia: string;
//   comision: string;
//   link: string;
//   tipo: 'Oficial' | 'Alumnos';
//   createdAt?: Date | { seconds: number; nanoseconds: number };
//   submittedBy?: string;
// }

// export const groupsService = {
//   getApprovedGroups: async (): Promise<GroupData[]> => {
//     const snap = await getDocs(collection(db, 'groups'));
//     return snap.docs.map(d => ({ id: d.id, ...d.data() } as GroupData));
//   },

//   getPendingGroups: async (): Promise<GroupData[]> => {
//     const snap = await getDocs(collection(db, 'pending_groups'));
//     return snap.docs.map(d => ({ id: d.id, ...d.data() } as GroupData));
//   },

//   checkIsDuplicatePending: async (materia: string, comision: string, link: string): Promise<boolean> => {
//     const pending = await groupsService.getPendingGroups();
//     return pending.some(g => 
//       (g.materia === materia && g.comision.toLowerCase() === comision.toLowerCase()) || g.link === link
//     );
//   },

//   submitNewGroup: async (groupData: Omit<GroupData, 'id'>, isAdmin: boolean): Promise<string> => {
//     const collectionName = isAdmin ? 'groups' : 'pending_groups';
//     const docRef = await addDoc(collection(db, collectionName), {
//       ...groupData,
//       createdAt: serverTimestamp(),
//     });
//     return docRef.id;
//   },

//   approvePendingGroup: async (group: GroupData): Promise<string> => {
//     const { id, ...data } = group;
//     const docRef = await addDoc(collection(db, 'groups'), data);
//     await deleteDoc(doc(db, 'pending_groups', id!));
//     return docRef.id;
//   },

//   rejectPendingGroup: async (groupId: string): Promise<void> => {
//     await deleteDoc(doc(db, 'pending_groups', groupId));
//   }
// };

import { auth } from '../lib/firebase';

export interface GroupData {
  id?: string;
  carrera: string;
  nivel: string;
  materia: string;
  comision: string;
  link: string;
  tipo: 'Oficial' | 'Alumnos';
  createdAt?: any;
  submittedBy?: string;
}

const API_URL = 'http://127.0.0.1:5001/api/groups';

// Obtenemos el token de seguridad de Firebase Auth
const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

export const groupsService = {
  getApprovedGroups: async (): Promise<GroupData[]> => {
    const res = await fetch(`${API_URL}/approved`);
    if (!res.ok) throw new Error('Error al traer grupos');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id })); // Mapeamos _id a id
  },

  getPendingGroups: async (): Promise<GroupData[]> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al traer grupos pendientes');
    const data = await res.json();
    return data.map((d: any) => ({ ...d, id: d._id }));
  },

  checkIsDuplicatePending: async (materia: string, comision: string, link: string): Promise<boolean> => {
    const pending = await groupsService.getPendingGroups();
    return pending.some(g => 
      (g.materia === materia && g.comision.toLowerCase() === comision.toLowerCase()) || g.link === link
    );
  },

  submitNewGroup: async (groupData: Omit<GroupData, 'id'>, isAdmin: boolean): Promise<string> => {
    const token = await getToken();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(groupData)
    });
    const data = await res.json();
    return data._id;
  },

  approvePendingGroup: async (group: GroupData): Promise<string> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/${group.id}/approve`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data._id;
  },

  rejectPendingGroup: async (groupId: string): Promise<void> => {
    const token = await getToken();
    await fetch(`${API_URL}/${groupId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface GroupData {
  id: string;
  carrera: string;
  nivel: string;
  materia: string;
  comision: string;
  link: string;
  tipo: 'Oficial' | 'Alumnos';
  createdAt?: Date | { seconds: number; nanoseconds: number };
  submittedBy?: string;
}

export const groupsService = {
  getApprovedGroups: async (): Promise<GroupData[]> => {
    const snap = await getDocs(collection(db, 'groups'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as GroupData));
  },

  getPendingGroups: async (): Promise<GroupData[]> => {
    const snap = await getDocs(collection(db, 'pending_groups'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as GroupData));
  },

  checkIsDuplicatePending: async (materia: string, comision: string, link: string): Promise<boolean> => {
    const pending = await groupsService.getPendingGroups();
    return pending.some(g => 
      (g.materia === materia && g.comision.toLowerCase() === comision.toLowerCase()) || g.link === link
    );
  },

  submitNewGroup: async (groupData: Omit<GroupData, 'id'>, isAdmin: boolean): Promise<string> => {
    const collectionName = isAdmin ? 'groups' : 'pending_groups';
    const docRef = await addDoc(collection(db, collectionName), {
      ...groupData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  approvePendingGroup: async (group: GroupData): Promise<string> => {
    const { id, ...data } = group;
    const docRef = await addDoc(collection(db, 'groups'), data);
    await deleteDoc(doc(db, 'pending_groups', id!));
    return docRef.id;
  },

  rejectPendingGroup: async (groupId: string): Promise<void> => {
    await deleteDoc(doc(db, 'pending_groups', groupId));
  }
};
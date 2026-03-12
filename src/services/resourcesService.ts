/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface ResourceData {
  id: string;
  title: string;
  carrera: string;
  nivel: string;
  materia: string;
  tipo: string;
  formato: string;
  link: string;
  autor: string;
  createdAt?: Timestamp | any;
  submittedBy?: string;
}

export const resourcesService = {
  getApprovedResources: async (): Promise<ResourceData[]> => {
    const snap = await getDocs(collection(db, 'resources'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ResourceData));
  },

  getPendingResources: async (): Promise<ResourceData[]> => {
    const snap = await getDocs(collection(db, 'pending_resources'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ResourceData));
  },

  submitNewResource: async (resourceData: Omit<ResourceData, 'id'>, isDirectPublish: boolean): Promise<string> => {
    const collectionName = isDirectPublish ? 'resources' : 'pending_resources';
    const docRef = await addDoc(collection(db, collectionName), {
      ...resourceData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  approvePendingResource: async (resource: ResourceData): Promise<string> => {
    const { id, ...data } = resource;
    const docRef = await addDoc(collection(db, 'resources'), data);
    await deleteDoc(doc(db, 'pending_resources', id));
    return docRef.id;
  },

  rejectPendingResource: async (resourceId: string): Promise<void> => {
    await deleteDoc(doc(db, 'pending_resources', resourceId));
  }
};
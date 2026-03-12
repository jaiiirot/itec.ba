/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import type { User } from '../context/AuthContext';

export interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  expiresAt: Timestamp | any;
  createdAt: Timestamp | any;
}

export const adminService = {
  // --- GESTIÓN DE USUARIOS ---
  getAllUsers: async (): Promise<User[]> => {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
  },

  updateUserRole: async (userId: string, newRole: 'admin' | 'student'): Promise<void> => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
  },

  // --- GESTIÓN DE AVISOS GLOBAL ---
  createAnnouncement: async (title: string, message: string, hoursActive: number): Promise<string> => {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hoursActive); // Le sumamos las horas de duración
    
    const docRef = await addDoc(collection(db, 'announcements'), {
      title,
      message,
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  getActiveAnnouncements: async (): Promise<AnnouncementData[]> => {
    const now = Timestamp.now();
    // Traemos solo los anuncios cuya fecha de expiración sea mayor a AHORA
    const q = query(collection(db, 'announcements'), where('expiresAt', '>', now));
    const snap = await getDocs(q);
    // Los ordenamos por fecha de creación (el más reciente primero)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AnnouncementData))
                    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'announcements', id));
  }
};

// Pequeño helper temporal para el serverTimestamp (ya que en este scope no lo importamos arriba)
import { serverTimestamp } from 'firebase/firestore';
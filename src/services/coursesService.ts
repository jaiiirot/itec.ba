/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl: string;
  playlistId: string;
  videos: Video[];
  createdAt?: any;
}

export const coursesService = {
  getCourses: async (): Promise<CourseData[]> => {
    const snap = await getDocs(collection(db, 'courses'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as CourseData));
  },

  getCourseById: async (id: string): Promise<CourseData | null> => {
    const docRef = doc(db, 'courses', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as CourseData;
    return null;
  },

  addCourse: async (courseData: Omit<CourseData, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'courses'), { ...courseData, createdAt: serverTimestamp() });
    return docRef.id;
  },

  // ¡NUEVA FUNCIÓN PARA BORRAR!
  deleteCourse: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'courses', id));
  }
};
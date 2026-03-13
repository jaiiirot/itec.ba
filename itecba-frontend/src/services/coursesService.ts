/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { db } from '../lib/firebase';
// import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';

// export interface Video {
//   id: string;
//   youtubeId: string;
//   title: string;
//   duration: string;
// }

// export interface CourseData {
//   id: string;
//   title: string;
//   description: string;
//   progress: number;
//   imageUrl: string;
//   playlistId: string;
//   videos: Video[];
//   createdAt?: any;
// }

// export const coursesService = {
//   getCourses: async (): Promise<CourseData[]> => {
//     const snap = await getDocs(collection(db, 'courses'));
//     return snap.docs.map(d => ({ id: d.id, ...d.data() } as CourseData));
//   },

//   getCourseById: async (id: string): Promise<CourseData | null> => {
//     const docRef = doc(db, 'courses', id);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as CourseData;
//     return null;
//   },

//   addCourse: async (courseData: Omit<CourseData, 'id'>): Promise<string> => {
//     const docRef = await addDoc(collection(db, 'courses'), { ...courseData, createdAt: serverTimestamp() });
//     return docRef.id;
//   },

//   // ¡NUEVA FUNCIÓN PARA BORRAR!
//   deleteCourse: async (id: string): Promise<void> => {
//     await deleteDoc(doc(db, 'courses', id));
//   }
// };

import { auth } from '../lib/firebase';

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

const API_URL = 'http://127.0.0.1:5001/api/courses';

const getToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("Debes iniciar sesión");
  return token;
};

export const coursesService = {
  getCourses: async (): Promise<CourseData[]> => {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data.map((c: any) => ({ ...c, id: c._id })); // Mapeo de _id a id
  },

  getCourseById: async (id: string): Promise<CourseData | null> => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return { ...data, id: data._id }; // Mapeo de _id a id
  },

  addCourse: async (courseData: Omit<CourseData, 'id'>): Promise<string> => {
    const token = await getToken();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    const data = await res.json();
    return data._id;
  },

  deleteCourse: async (id: string): Promise<void> => {
    const token = await getToken();
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  fetchPlaylistDetails: async (playlistUrl: string): Promise<{ title: string, videos: Video[] }> => {
    const token = await getToken();
    const res = await fetch(`${API_URL}/fetch-playlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ playlistUrl })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al conectar con YouTube');
    }
    
    return await res.json();
  },
};


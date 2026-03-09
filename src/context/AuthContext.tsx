import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface User {
  id?: string;
  name: string;
  email: string;
  dni?: string;
  specialty?: string;
  phone?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Este observador es el "Guardia de Seguridad" maestro de tu app
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        
        // 🚨 1. REGLA DE SEGURIDAD ESTRICTA AQUÍ ADENTRO 🚨
        if (!firebaseUser.email?.endsWith('@frba.utn.edu.ar')) {
          console.warn("Intento de login bloqueado:", firebaseUser.email);
          await signOut(auth); // Cerramos su sesión inmediatamente
          setUser(null);
          setLoading(false);
          return; // Cortamos la ejecución, no entra a la app.
        }

        try {
          // 2. Si pasó el filtro, buscamos si ya completó su DNI en Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
          } else {
            // 3. Es de la FRBA pero es nuevo. Le armamos el perfil básico.
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Estudiante',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
            });
          }
        } catch (error) {
          console.warn("⚠️ Firestore bloqueado por el navegador. Usando datos básicos.");
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Estudiante',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
          });
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Validación visual para lanzarle el cartel rojo al usuario
      if (!result.user.email?.endsWith('@frba.utn.edu.ar')) {
        await signOut(auth);
        throw new Error('ACCESO DENEGADO: Solo se permiten correos institucionales (@frba.utn.edu.ar).');
      }
    } catch (error: any) {
      console.error('Error de login:', error);
      // Evitamos mostrar error si el usuario simplemente cerró la ventana de Google
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert(error.message || 'Error al iniciar sesión con Google.');
      }
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(docRef, { ...user, ...data }, { merge: true });
      setUser((prev) => ({ ...prev, ...data }) as User);
    } catch (error) {
      console.error("Error guardando perfil:", error);
      throw error;
    }
  };

  const logoutUser = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, updateProfile, logout: logoutUser, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
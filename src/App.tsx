import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { MisCursos } from './pages/MisCursos';
import { CourseDetail } from './pages/CourseDetail';
import { Explore } from './pages/Explore'; // <-- IMPORTA AQUÍ
import { ChatPage } from './pages/ChatPage';
import { GroupsPage } from './pages/GroupsPage'; // <-- IMPORTA AQUÍ
import { IngresoPage } from './pages/IngresoPage';
import { GradoPage } from './pages/GradoPage';
import { NosotrosPage } from './pages/NosotrosPage';

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/cursos", element: <MisCursos /> },
  { path: "/cursos/:id", element: <CourseDetail /> },
  { path: "/explore", element: <Explore /> }, // <-- AÑADE LA RUTA
  { path: "/chat", element: <ChatPage /> },
  { path: "/grupos", element: <GroupsPage /> }, // <-- AÑADE LA RUTA
  { path: "/ingreso", element: <IngresoPage /> },
  { path: "/grado", element: <GradoPage /> },
  { path: "/nosotros", element: <NosotrosPage /> },
  { path: "*", element: <div className="text-white p-10">Página no encontrada</div> }
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
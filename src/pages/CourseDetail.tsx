import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { VideoEmbed } from '../components/atoms/VideoEmbed';
import { PlaylistSidebar } from '../components/organisms/PlaylistSidebar';
import type { VideoData } from '../components/organisms/PlaylistSidebar';
import { VideoDetails } from '../components/organisms/VideoDetails';

// Datos reales extraídos de la lista de YouTube (Seminario de Ingreso ITEC)
const CURSO_SEMINARIO: VideoData[] = [
  { id: 'i5uk2fCBlhE', title: 'ⵥ𝖳𝖤𝖢 𝖢𝖫𝖠𝖲𝖤 𝖳𝖤𝖮𝖱𝖨𝖢𝖠 - 𝖲𝖤𝖬𝖨𝖭𝖠𝖱𝖨𝖮 𝖣𝖤 𝖨𝖭𝖦𝖱𝖤𝖲𝖮 - 𝖴𝖭𝖨𝖣𝖠𝖣 10', duration: '1:41:15', thumbnail: 'https://i.ytimg.com/vi/i5uk2fCBlhE/hqdefault.jpg' },
  { id: 'RcV851uOm4Q', title: 'ⵥ𝖳𝖤𝖢 𝖢𝖫𝖠𝖲𝖤 𝖳𝖤𝖮𝖱𝖨𝖢𝖠 - 𝖲𝖤𝖬𝖨𝖭𝖠𝖱𝖨𝖮 𝖣𝖤 𝖨𝖭𝖦𝖱𝖤𝖲𝖮 - 𝖴𝖭𝖨𝖣𝖠𝖣 8 Y 9', duration: '1:52:37', thumbnail: 'https://i.ytimg.com/vi/RcV851uOm4Q/hqdefault.jpg' },
  { id: '0v7LC-ZlE-U', title: 'ⵥ𝖳𝖤𝖢 𝖢𝖫𝖠𝖲𝖤 𝖳𝖤𝖮𝖱𝖨𝖢𝖠 - 𝖲𝖤𝖬𝖨𝖭𝖠𝖱𝖨𝖮 𝖣𝖤 𝖨𝖭𝖦𝖱𝖤𝖲𝖮 - 𝖴𝖭𝖨𝖣𝖠𝖣 5 - 6 - 7', duration: '3:14:54', thumbnail: 'https://i.ytimg.com/vi/0v7LC-ZlE-U/hqdefault.jpg' },
  { id: 'TVaL0A3R53s', title: 'ⵥ𝖳𝖤𝖢 𝖢𝖫𝖠𝖲𝖤 𝖳𝖤𝖮𝖱𝖨𝖢𝖠 - 𝖲𝖤𝖬𝖨𝖭𝖠𝖱𝖨𝖮 𝖣𝖤 𝖨𝖭𝖦𝖱𝖤𝖲𝖮 - 𝖴𝖭𝖨𝖣𝖠𝖣 4', duration: '1:57:59', thumbnail: 'https://i.ytimg.com/vi/TVaL0A3R53s/hqdefault.jpg' },
  { id: 'ZzZ_DkpHp6o', title: 'ⵥ𝖳𝖤𝖢 𝖢𝖫𝖠𝖲𝖤 𝖳𝖤𝖮𝖱𝖨𝖢𝖠 - 𝖲𝖤𝖬𝖨𝖭𝖠𝖱𝖨𝖮 𝖣𝖤 𝖨𝖭𝖦𝖱𝖤𝖲𝖮 - 𝖴𝖭𝖨𝖣𝖠𝖣 2 𝖸 3 - 2𝖽𝖺 𝖯𝖠𝖱𝖳𝖤', duration: '5:02:21', thumbnail: 'https://i.ytimg.com/vi/ZzZ_DkpHp6o/hqdefault.jpg' },
  { id: '1IKYyN7GvYA', title: 'ⵥ𝖳𝖤𝖢 𝖢𝖫𝖠𝖲𝖤 𝖳𝖤𝖮𝖱𝖨𝖢𝖠 - 𝖲𝖤𝖬𝖨𝖭𝖠𝖱𝖨𝖮 𝖣𝖤 𝖨𝖭𝖦𝖱𝖤𝖲𝖮 - 𝖴𝖭𝖨𝖣𝖠𝖣 2 𝖸 3 - 1𝗋𝖺 𝖯𝖠𝖱𝖳𝖤', duration: '11:29', thumbnail: 'https://i.ytimg.com/vi/1IKYyN7GvYA/hqdefault.jpg' },
  { id: 'Ffe3MnBquoo', title: 'ⵥ𝖳𝖤𝖢 𝖢𝖫𝖠𝖲𝖤 𝖳𝖤𝖮𝖱𝖨𝖢𝖠 - 𝖲𝖤𝖬𝖨𝖭𝖠𝖱𝖨𝖮 𝖣𝖤 𝖨𝖭𝖦𝖱𝖤𝖲𝖮 - 𝖴𝖭𝖨𝖣𝖠𝖣 1', duration: '4:04:51', thumbnail: 'https://i.ytimg.com/vi/Ffe3MnBquoo/hqdefault.jpg' },
];

export const CourseDetail: React.FC = () => {
  const navigate = useNavigate();
  
  // Por defecto, carga la Unidad 1 (que en tu lista era el último video, index 6)
  // o el primero de la lista
  const [currentVideo, setCurrentVideo] = useState<VideoData>(CURSO_SEMINARIO[6]);

  return (
    <DashboardLayout>
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition flex items-center gap-2">
          ← Volver a Mis Cursos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Columna Izquierda: Reproductor Principal */}
        <div className="lg:col-span-2 xl:col-span-3">
          <VideoEmbed videoId={currentVideo.id} />
          <VideoDetails title={currentVideo.title} />
          
          {/* Caja de descripción */}
          <div className="mt-4 bg-[#0a0a0a] p-4 rounded-xl border border-[#262626]">
            <p className="text-sm font-bold mb-2">Seminario de Ingreso UTN BA • Clases Teóricas</p>
            <p className="text-sm text-gray-300">
              Estás viendo el contenido de la materia Seminario de Ingreso.
              Recordá que estos videos corresponden a las clases teóricas de repaso de todas las unidades.
            </p>
          </div>
        </div>
        
        {/* Columna Derecha: Sidebar de Playlist */}
        <div className="lg:col-span-1 xl:col-span-1">
          {/* Aquí le pasamos el título correcto como prop (si quieres modificar tu PlaylistSidebar para recibir el título dinámico) */}
          <PlaylistSidebar 
            videos={CURSO_SEMINARIO} 
            currentVideoId={currentVideo.id} 
            onVideoSelect={setCurrentVideo}
          />
        </div>
        
      </div>
    </DashboardLayout>
  );
};
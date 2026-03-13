import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Icons } from '../atoms/Icons';
import { coursesService } from '../../services/coursesService';
import type { CourseData } from '../../services/coursesService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCourseAdded: (newCourse: CourseData) => void;
}

interface VideoItem {
  title: string;
  youtubeId: string;
  duration: string;
}

// ==========================================
// COMPONENTE 1: DATOS GENERALES
// ==========================================
const CourseGeneralData = ({ title, setTitle, image, setImage, desc, setDesc }: any) => (
  <div className="space-y-4 mb-8">
    <h3 className="text-sm font-bold text-white border-b border-itec-gray pb-2">
      Detalles del Curso
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Título del Curso</label>
        <Input fullWidth placeholder="Ej: Curso de React..." value={title} onChange={(e: any) => setTitle(e.target.value)} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
      </div>
      <div>
        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">URL Portada (Opcional)</label>
        <Input fullWidth placeholder="https://..." value={image} onChange={(e: any) => setImage(e.target.value)} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Descripción corta</label>
        <Input fullWidth placeholder="Ej: Repaso general para finales..." value={desc} onChange={(e: any) => setDesc(e.target.value)} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
      </div>
    </div>
  </div>
);

// ==========================================
// COMPONENTE 2: LISTA DE VIDEOS (DISEÑO MINIMALISTA)
// ==========================================
const CourseVideoList = ({
  videos, setVideos,
  mode, setMode,
  playlistUrl, setPlaylistUrl,
  onFetchPlaylist, isFetching
}: any) => {

  const addVideoRow = () => setVideos([...videos, { title: '', youtubeId: '', duration: '' }]);
  const removeVideoRow = (index: number) => setVideos(videos.filter((_: any, i: number) => i !== index));

  const updateVideo = (index: number, field: keyof VideoItem, value: string) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setVideos(newVideos);
  };

  return (
    <div className="space-y-4">
      {/* HEADER MINIMALISTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-itec-gray pb-2">
        <h3 className="text-lg font-bold text-white">
          Contenido del curso
        </h3>

        {/* SELECTOR DE MODO (Pastillas) */}
        <div className="flex bg-itec-surface border border-itec-gray rounded-full p-1">
          <button type="button" onClick={() => setMode('manual')} className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase transition-colors ${mode === 'manual' ? 'bg-itec-gray text-white' : 'text-gray-500 hover:text-gray-300'}`}>
            Manual
          </button>
          <button type="button" onClick={() => setMode('youtube')} className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase transition-colors ${mode === 'youtube' ? 'bg-[#FF0000]/20 text-red-500' : 'text-gray-500 hover:text-gray-300'}`}>
            YouTube
          </button>
        </div>
      </div>

      {/* BUSCADOR YOUTUBE */}
      {mode === 'youtube' && (
        <div className="flex flex-col sm:flex-row gap-2 pb-4">
          <div className="flex-1">
             <Input fullWidth placeholder="Pega el link de la Playlist aquí..." value={playlistUrl} onChange={(e: any) => setPlaylistUrl(e.target.value)} className="bg-itec-surface border-red-500/30 text-sm py-2 focus:border-red-500" />
          </div>
          <Button type="button" onClick={onFetchPlaylist} disabled={isFetching || !playlistUrl} className="bg-red-600 hover:bg-red-700 border-none text-white px-6 w-full sm:w-auto shrink-0 py-2">
            {isFetching ? 'Extrayendo...' : 'Extraer Videos'}
          </Button>
        </div>
      )}

      {/* LISTA ESTILO PLAYLIST INVISIBLE */}
      <div className="space-y-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
        {videos.map((video: VideoItem, index: number) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-itec-surface/50 transition-colors group border-b border-itec-gray/30 last:border-0">
            
            {/* Ícono Play */}
            <div className="w-8 h-8 rounded-full bg-itec-surface flex items-center justify-center shrink-0 text-gray-400 group-hover:text-white transition-colors">
              <Icons type="playFill" className="w-3 h-3 ml-0.5" />
            </div>

            {/* Inputs Invisibles */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              <div className="sm:col-span-7">
                <input 
                  type="text" 
                  placeholder="Ej: Unidad 1: Introducción..." 
                  value={video.title} 
                  onChange={(e: any) => updateVideo(index, 'title', e.target.value)} 
                  className="w-full bg-transparent border-none text-sm text-gray-200 focus:ring-0 outline-none placeholder-gray-600 font-medium"
                />
              </div>
              <div className="sm:col-span-3">
                <input 
                  type="text" 
                  placeholder="ID: dQw4w9WgXcQ" 
                  value={video.youtubeId} 
                  onChange={(e: any) => updateVideo(index, 'youtubeId', e.target.value)} 
                  className="w-full bg-transparent border-none text-[11px] text-gray-500 font-mono focus:ring-0 outline-none placeholder-gray-700"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <input 
                  type="text" 
                  placeholder="00:00 min" 
                  value={video.duration} 
                  onChange={(e: any) => updateVideo(index, 'duration', e.target.value)} 
                  className="w-full bg-transparent border-none text-xs text-gray-400 text-right focus:ring-0 outline-none placeholder-gray-600"
                />
              </div>
            </div>

            {/* Basurero (Oculto hasta hacer hover) */}
            <button type="button" onClick={() => removeVideoRow(index)} disabled={videos.length === 1} className="opacity-0 group-hover:opacity-100 p-2 text-gray-600 hover:text-red-500 disabled:opacity-0 transition-all shrink-0">
              <Icons type="trash" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* BOTÓN AÑADIR */}
      <button type="button" onClick={addVideoRow} className="mt-4 text-gray-400 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors py-2">
        <div className="w-6 h-6 rounded-full bg-itec-surface flex items-center justify-center">
          <Icons type="plus" className="w-3 h-3" />
        </div>
        Añadir nuevo video
      </button>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL (MODAL)
// ==========================================
export const AddCourseModal: React.FC<Props> = ({ isOpen, onClose, onCourseAdded }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videos, setVideos] = useState<VideoItem[]>([{ title: '', youtubeId: '', duration: '' }]);

  const [mode, setMode] = useState<'manual' | 'youtube'>('manual');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFetchPlaylist = async () => {
    if (!playlistUrl) return;
    setIsFetching(true);
    setError('');
    try {
      const data = await coursesService.fetchPlaylistDetails(playlistUrl);
      if (!courseTitle && data.title) setCourseTitle(data.title);
      const extractedVideos = data.videos?.map((v: any) => ({
        title: v.title || '',
        youtubeId: v.youtubeId || v.id || '',
        duration: v.duration || '0:00'
      })) || [];

      if (extractedVideos.length > 0) {
        setVideos(extractedVideos);
        if (!imageUrl) setImageUrl(`https://i.ytimg.com/vi/${extractedVideos[0].youtubeId}/hqdefault.jpg`);
      } else {
        setError('La playlist fue leída, pero no tiene videos públicos.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con YouTube. Verifica el link.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (isSubmitting) return;
    setError('');

    const cleanVideos = videos.filter(v => v.title.trim() && v.youtubeId.trim());

    if (!courseTitle || !courseDesc || cleanVideos.length === 0) {
      setError('Completa el título, la descripción y asegúrate de tener al menos un video válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalImageUrl = imageUrl || `https://i.ytimg.com/vi/${cleanVideos[0].youtubeId}/hqdefault.jpg`;

      const newCourseData = {
        title: courseTitle,
        description: courseDesc,
        progress: 0,
        imageUrl: finalImageUrl,
        playlistId: mode === 'youtube' ? playlistUrl : `custom_${Date.now()}`,
        videos: cleanVideos.map((v, idx) => ({
          id: `v_${Date.now()}_${idx}`,
          youtubeId: v.youtubeId,
          title: v.title,
          duration: v.duration || '0:00'
        }))
      };

      const newId = await coursesService.addCourse(newCourseData as any);
      onCourseAdded({ id: newId, ...newCourseData } as CourseData);

      setCourseTitle(''); setCourseDesc(''); setImageUrl(''); setPlaylistUrl('');
      setVideos([{ title: '', youtubeId: '', duration: '' }]);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Error al subir el curso a la base de datos.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-itec-bg border border-itec-gray rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden">

        <button onClick={onClose} disabled={isSubmitting} className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-itec-surface border border-itec-gray text-gray-500 hover:text-white transition-colors disabled:opacity-50">
          <Icons type="close" className="w-4 h-4" />
        </button>

        <div className="p-8 pb-4 shrink-0">
          <h2 className="text-2xl font-bold text-white mb-1">
            Creador de Cursos
          </h2>
          <p className="text-sm text-gray-400">Agrega o importa contenido para los estudiantes.</p>
        </div>

        {error && (
          <div className="px-8 pt-2 shrink-0">
            <p className="text-itec-red-skye text-xs font-bold bg-itec-red/10 p-3 rounded-lg border border-itec-red/20">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            <CourseGeneralData 
              title={courseTitle} setTitle={setCourseTitle} 
              image={imageUrl} setImage={setImageUrl} 
              desc={courseDesc} setDesc={setCourseDesc} 
            />
            
            <CourseVideoList 
              videos={videos} setVideos={setVideos}
              mode={mode} setMode={setMode}
              playlistUrl={playlistUrl} setPlaylistUrl={setPlaylistUrl}
              onFetchPlaylist={handleFetchPlaylist} isFetching={isFetching}
            />
          </div>

          <div className="p-6 border-t border-itec-gray bg-itec-surface flex justify-end gap-3 shrink-0">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} className="bg-itec-bg border-itec-gray text-gray-400 hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || videos.length === 0} className="bg-white text-black hover:bg-gray-200 border-none">
              {isSubmitting ? 'Guardando...' : 'Publicar Curso'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
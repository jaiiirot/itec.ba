import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Icons } from '../components/atoms/Icons'; 

// Organismos separados para mantener el código limpio
import { CourseVideoPlayer } from '../components/organisms/CourseVideoPlayer';
import { CoursePlaylist } from '../components/organisms/CoursePlaylist';
import { CourseMaterialModal } from '../components/organisms/CourseMaterialModal';

import { coursesService } from '../services/coursesService';
import type { CourseData, Video } from '../services/coursesService';
import { resourcesService } from '../services/resourcesService';
import type { ResourceData } from '../services/resourcesService';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  
  const [course, setCourse] = useState<CourseData | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [allResources, setAllResources] = useState<ResourceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      
      try {
        // 🔴 MEJORA 1: Promise.all (Peticiones en Paralelo)
        // Ahora MongoDB buscará el curso y los apuntes al mismo tiempo (¡Mucho más rápido!)
        const [fetchedCourse, dbResources] = await Promise.all([
          coursesService.getCourseById(id),
          resourcesService.getApprovedResources()
        ]);

        setAllResources(dbResources);

        if (fetchedCourse) {
          setCourse(fetchedCourse);

          // Recuperar progreso del LocalStorage
          const savedData = localStorage.getItem(`itec_course_${id}`);
          let lastVideoId = null;

          if (savedData) {
            const parsed = JSON.parse(savedData);
            setWatchedVideos(new Set(parsed.watched || []));
            lastVideoId = parsed.lastVideo;
          }

          // Asignar el video activo (el último visto o el primero de la lista)
          if (lastVideoId && fetchedCourse.videos) {
            const last = fetchedCourse.videos.find(v => v.id === lastVideoId || (v as any)._id === lastVideoId);
            setActiveVideo(last || fetchedCourse.videos[0]);
          } else if (fetchedCourse.videos && fetchedCourse.videos.length > 0) {
            setActiveVideo(fetchedCourse.videos[0]);
          }
        }
      } catch (error) {
        console.error("Error al cargar detalles del curso:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filtrado inteligente de materiales de apoyo
  const relatedResources = useMemo(() => {
    if (!course) return [];
    
    // 🔴 MEJORA 2: Soporte para IDs Híbridos en la lógica de filtrado
    const courseId = course.id || (course as any)._id || "";

    return allResources.filter(res => {
      const cTitle = course.title.toLowerCase();
      const rSubj = res.materia.toLowerCase();
      
      return cTitle.includes(rSubj) || 
             (courseId.includes('seminario') && res.carrera === 'ingreso');
    }).slice(0, 4); 
  }, [course, allResources]);

  const handleVideoSelect = (video: Video) => {
    setActiveVideo(video);
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      const vidId = video.id || (video as any)._id;
      newSet.add(vidId);
      localStorage.setItem(`itec_course_${id}`, JSON.stringify({
        watched: Array.from(newSet),
        lastVideo: vidId
      }));
      return newSet;
    });
  };

  const toggleWatchedStatus = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) newSet.delete(videoId);
      else newSet.add(videoId);
      
      localStorage.setItem(`itec_course_${id}`, JSON.stringify({
        watched: Array.from(newSet),
        lastVideo: activeVideo?.id || (activeVideo as any)?._id
      }));
      return newSet;
    });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: `ITEC UTN BA - ${course?.title}`, url: shareUrl }); } 
      catch (error) { console.error('Error al compartir', error); }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
           <div className="w-12 h-12 border-4 border-itec-gray border-t-itec-blue rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course || !activeVideo) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-itec-surface border border-itec-gray rounded-xl">
          <span className="text-5xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-white mb-2">Curso no encontrado</h2>
          <Link to="/cursos" className="bg-itec-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors inline-block mt-4">Volver a Mis Cursos</Link>
        </div>
      </DashboardLayout>
    );
  }

  const currentProgress = Math.round((watchedVideos.size / (course.videos?.length || 1)) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10 relative z-10">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-3">
          <Link to="/cursos" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium bg-itec-surface px-3 py-1.5 rounded-lg border border-itec-gray">
            <div className="w-4 h-4"><Icons type="arrowLeft" /></div> Volver
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-itec-blue-skye text-sm font-bold truncate">{course.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Organismo: Reproductor y Detalles */}
          <div className="lg:col-span-2">
            <CourseVideoPlayer 
              course={course}
              activeVideo={activeVideo}
              watchedVideos={watchedVideos}
              relatedResourcesCount={relatedResources.length}
              copySuccess={copySuccess}
              onToggleWatched={toggleWatchedStatus}
              onOpenMaterialModal={() => setIsMaterialModalOpen(true)}
              onShare={handleShare}
            />
          </div>

          {/* Organismo: Lista de Videos (Playlist) */}
          <div className="lg:col-span-1">
            <CoursePlaylist 
              course={course}
              activeVideo={activeVideo}
              watchedVideos={watchedVideos}
              currentProgress={currentProgress}
              onVideoSelect={handleVideoSelect}
            />
          </div>

        </div>
      </div>

      {/* Organismo: Modal de Materiales */}
      <CourseMaterialModal 
        isOpen={isMaterialModalOpen} 
        onClose={() => setIsMaterialModalOpen(false)} 
        relatedResources={relatedResources} 
      />

    </DashboardLayout>
  );
};
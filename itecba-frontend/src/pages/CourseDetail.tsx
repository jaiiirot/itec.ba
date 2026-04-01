import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Icons } from '../components/atoms/Icons'; 

import { CourseVideoPlayer } from '../features/courses/components/organisms/CourseVideoPlayer';
import { CoursePlaylist } from '../features/courses/components/organisms/CoursePlaylist';

import { coursesService, type CourseData, type Video} from "../features/courses/services/coursesService";
import { resourcesService, type ResourceData} from '../features/resources/services/resourcesService';
import { useAuth } from '../context/AuthContext'; // 🔴 NUEVO

// Importa el modal de la misma forma que lo hiciste en MisCursos.tsx
const AddCourseModal = React.lazy(() => import('../features/courses/components/organisms/AddCourseModal').then(m => ({ default: m.AddCourseModal })));
// 🔴 MEJORA DE RENDIMIENTO: Lazy Loading para el modal de materiales
const CourseMaterialModal = React.lazy(() => import('../features/courses/components/organisms/CourseMaterialModal').then(m => ({ default: m.CourseMaterialModal })));

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { isAdmin } = useAuth(); // 🔴 NUEVO

  const [course, setCourse] = useState<CourseData | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [allResources, setAllResources] = useState<ResourceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 🔴 NUEVO
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      
      try {
        // Ejecución en paralelo (Más rápido)
        const [fetchedCourse, dbResources] = await Promise.all([
          coursesService.getCourseById(id),
          resourcesService.getApprovedResources()
        ]);

        setAllResources(dbResources);

        if (fetchedCourse) {
          setCourse(fetchedCourse);
          const savedData = localStorage.getItem(`itec_course_${id}`);
          let lastVideoId = null;

          if (savedData) {
            const parsed = JSON.parse(savedData);
            setWatchedVideos(new Set(parsed.watched || []));
            lastVideoId = parsed.lastVideo;
          }

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

  // 🔴 MEJORA DEL ALGORITMO: Filtra todos los parciales precisos sin limitarlos
  const relatedResources = useMemo(() => {
    if (!course) return [];
    
    const courseId = course.id || (course as any)._id || "";
    // Limpiamos el título para que el match sea más exacto (Ej: "Curso de Álgebra" -> "álgebra")
    const cleanCourseTitle = course.title.toLowerCase().replace('curso de ', '').trim();

    return allResources.filter(res => {
      const rSubj = res.materia.toLowerCase();
      // Match bidireccional inteligente
      const isMatch = cleanCourseTitle.includes(rSubj) || rSubj.includes(cleanCourseTitle);
      const isIngreso = courseId.includes('seminario') && res.carrera === 'ingreso';

      return isMatch || isIngreso;
    }); 
    // 🔴 ELIMINAMOS EL .slice(0,4) -> Ahora si hay 15 parciales, el alumno verá los 15 en el modal
  }, [course, allResources]);

  const handleVideoSelect = (video: Video) => {
    setActiveVideo(video);
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      const vidId = video.id || (video as any)._id;
      newSet.add(vidId);
      localStorage.setItem(`itec_course_${id}`, JSON.stringify({ watched: Array.from(newSet), lastVideo: vidId }));
      return newSet;
    });
  };

  const toggleWatchedStatus = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) newSet.delete(videoId);
      else newSet.add(videoId);
      localStorage.setItem(`itec_course_${id}`, JSON.stringify({ watched: Array.from(newSet), lastVideo: activeVideo?.id || (activeVideo as any)?._id }));
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
    
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/cursos" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium bg-itec-surface px-3 py-1.5 rounded-lg border border-itec-gray">
              <div className="w-4 h-4"><Icons type="arrowLeft" /></div> Volver
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-600 text-sm font-bold truncate">{course.title}</span>
          </div>

          {/* 🔴 NUEVO: Botón de Editar solo para Admins */}
          {isAdmin && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-itec-surface hover:bg-itec-gray border border-itec-gray text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2 w-fit"
            >
              <span>✏️</span> Editar Curso
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      {/* 🔴 Lazy Loading envolviendo el Modal */}
      <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />}>
        {isMaterialModalOpen && (
          <CourseMaterialModal 
            isOpen={isMaterialModalOpen} 
            onClose={() => setIsMaterialModalOpen(false)} 
            relatedResources={relatedResources} 
          />
        )}
        {/* 🔴 NUEVO: Lazy Loading del modal de Edición */}
      {isAdmin && isEditModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />}>
          <AddCourseModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            existingCourse={course} // Le pasamos los datos actuales para que los pre-cargue
            onCourseAdded={(updatedCourse) => {
              setCourse(updatedCourse); // Actualiza la pantalla instantáneamente
            }}
          />
        </Suspense>
      )}
      </Suspense>

    </DashboardLayout>
  );
};
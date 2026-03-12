import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { Icons } from '../components/atoms/Icons'; 

// Importaciones de servicios mixtos (Local + Firebase)
import { COURSE_DATA } from '../data/courses';
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
  
  // Estados para el progreso local
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());

  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Buscar el curso (Primero en static, sino en Firebase)
        let fetchedCourse = COURSE_DATA.find(c => c.id === id) as CourseData | undefined;
        if (!fetchedCourse && id) {
          fetchedCourse = await coursesService.getCourseById(id) || undefined;
        }

        // 2. Traer recursos de Firebase para el Material de Apoyo
        const dbResources = await resourcesService.getApprovedResources();
        setAllResources(dbResources);

        if (fetchedCourse) {
          setCourse(fetchedCourse);

          // 3. RECUPERAR PROGRESO LOCAL
          const savedData = localStorage.getItem(`itec_course_${id}`);
          let lastVideoId = null;

          if (savedData) {
            const parsed = JSON.parse(savedData);
            setWatchedVideos(new Set(parsed.watched || []));
            lastVideoId = parsed.lastVideo;
          }

          // Asignar el video activo (el último que vio, o el primero)
          if (lastVideoId && fetchedCourse.videos) {
            const last = fetchedCourse.videos.find(v => v.id === lastVideoId);
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

  // Filtrar recursos relacionados basados en el título o materia
  const relatedResources = useMemo(() => {
    if (!course) return [];
    return allResources.filter(res => {
      const cTitle = course.title.toLowerCase();
      const rSubj = res.materia.toLowerCase();
      return cTitle.includes(rSubj) || 
             (course.id.includes('seminario') && res.carrera === 'ingreso') ||
             (course.id.includes('arquitectura') && rSubj.includes('arquitectura')) ||
             (course.id.includes('analisis-mat-i') && rSubj.includes('análisis matemático i'));
    }).slice(0, 4); 
  }, [course, allResources]);

  // Manejar el cambio de video y guardar en local
  const handleVideoSelect = (video: Video) => {
    setActiveVideo(video);
    
    // Lo marcamos automáticamente como visto al hacer click
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      newSet.add(video.id);
      
      // Guardar estado
      localStorage.setItem(`itec_course_${id}`, JSON.stringify({
        watched: Array.from(newSet),
        lastVideo: video.id
      }));
      
      return newSet;
    });
  };

  // Botón manual para marcar/desmarcar
  const toggleWatchedStatus = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) newSet.delete(videoId);
      else newSet.add(videoId);
      
      localStorage.setItem(`itec_course_${id}`, JSON.stringify({
        watched: Array.from(newSet),
        lastVideo: activeVideo?.id
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
          <p className="text-gray-400 mb-6">El curso que buscas no existe o no tiene videos disponibles.</p>
          <Link to="/cursos" className="bg-itec-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">Volver a Mis Cursos</Link>
        </div>
      </DashboardLayout>
    );
  }

  // Progreso en tiempo real
  const currentProgress = Math.round((watchedVideos.size / course.videos.length) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10 relative z-10">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/cursos" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium bg-itec-surface px-3 py-1.5 rounded-lg border border-itec-gray">
              <div className="w-4 h-4"><Icons type="arrowLeft" /></div> Volver
            </Link>
            <span className="text-gray-600 hidden sm:inline">/</span>
            <span className="text-itec-blue-skye text-sm font-bold truncate hidden sm:inline">{course.title}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Reproductor */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* Reproductor de Video */}
            <div className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-itec-gray relative pt-[56.25%] group">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Detalles del Video Activo */}
            <div className="bg-itec-surface border border-itec-gray rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">{activeVideo.title}</h1>
                  <p className="text-gray-400 text-sm mt-2">{course.description}</p>
                </div>
                
                {/* Botón marcar como visto (Principal) */}
                <button 
                  onClick={(e) => toggleWatchedStatus(activeVideo.id, e)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    watchedVideos.has(activeVideo.id) 
                    ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' 
                    : 'bg-itec-bg text-gray-300 border-itec-gray hover:text-white hover:border-gray-500'
                  }`}
                >
                  <div className="w-4 h-4">{watchedVideos.has(activeVideo.id) ? <Icons type="check" /> : <Icons type="play" />}</div>
                  {watchedVideos.has(activeVideo.id) ? 'Visto' : 'Marcar como visto'}
                </button>
              </div>
              
              {/* Botones de acción inferiores */}
              <div className="flex flex-wrap items-center gap-3 border-t border-itec-gray/50 pt-5 mt-2">
                <button 
                  onClick={() => setIsMaterialModalOpen(true)}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-itec-bg hover:bg-itec-gray px-4 py-2.5 rounded-xl transition-colors border border-itec-gray shadow-sm"
                >
                  <div className="w-4 h-4"><Icons type="documentFill" /></div>
                  Material de apoyo
                  {relatedResources.length > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1">
                      {relatedResources.length}
                    </span>
                  )}
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-itec-bg hover:bg-itec-gray px-4 py-2.5 rounded-xl transition-colors border border-itec-gray shadow-sm"
                >
                  {copySuccess ? (
                    <><div className="w-4 h-4 text-green-500"><Icons type="check" /></div><span className="text-green-500 font-medium">¡Copiado!</span></>
                  ) : (
                    <><div className="w-4 h-4"><Icons type="shareNetwork" /></div> Compartir</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Playlist (Lista de Videos) */}
          <div className="lg:col-span-1">
            <div className="bg-itec-surface border border-itec-gray rounded-2xl flex flex-col h-full max-h-[700px] shadow-lg overflow-hidden">
              
              {/* Header Playlist */}
              <div className="p-5 border-b border-itec-gray bg-itec-sidebar shrink-0">
                <h3 className="font-bold text-white text-lg leading-tight">Contenido del Curso</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    <strong className="text-white">{watchedVideos.size}</strong> / {course.videos.length} completados
                  </p>
                  <span className={`text-xs font-bold ${currentProgress === 100 ? 'text-green-400' : 'text-itec-blue-skye'}`}>
                    {currentProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-itec-bg rounded-full mt-3 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${currentProgress === 100 ? 'bg-green-500' : 'bg-itec-blue'}`} style={{ width: `${currentProgress}%` }}></div>
                </div>
              </div>

              {/* Lista de Videos */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1 bg-itec-surface/50">
                {course.videos.map((video, index) => {
                  const isActive = activeVideo.id === video.id;
                  const isWatched = watchedVideos.has(video.id);

                  return (
                    <div key={video.id} className="relative group">
                      <button
                        onClick={() => handleVideoSelect(video)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                          isActive 
                          ? 'bg-itec-blue/10 border-itec-blue/30 shadow-inner' 
                          : 'bg-transparent border-transparent hover:bg-white/5'
                        } border`}
                      >
                        {/* Indicador Numérico / Estado */}
                        <div className="shrink-0 mt-0.5">
                          {isActive ? (
                            <div className="w-7 h-7 rounded-full bg-itec-blue flex items-center justify-center text-white shadow-[0_0_10px_rgba(0,64,147,0.5)]">
                              <div className="w-3.5 h-3.5"><Icons type="playFill" /></div>
                            </div>
                          ) : isWatched ? (
                            <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400">
                              <div className="w-3.5 h-3.5"><Icons type="check" /></div>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-itec-bg border border-itec-gray flex items-center justify-center text-gray-500 text-xs font-bold">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        
                        {/* Info Video */}
                        <div className="flex-1 min-w-0 pr-6">
                          <h4 className={`text-sm font-medium leading-snug line-clamp-2 ${isActive ? 'text-itec-blue-skye font-bold' : isWatched ? 'text-gray-400' : 'text-gray-200'}`}>
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-500">
                            <div className="w-3 h-3"><Icons type="clock" /></div>
                            {video.duration}
                          </div>
                        </div>
                      </button>

                      {/* Botón flotante para marcar/desmarcar rápido (solo visible en hover si no está activo) */}
                      {!isActive && (
                        <button 
                          onClick={(e) => toggleWatchedStatus(video.id, e)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-itec-bg border border-itec-gray flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-400 opacity-0 group-hover:opacity-100 transition-all z-10"
                          title={isWatched ? "Desmarcar" : "Marcar como visto"}
                        >
                          <div className="w-4 h-4">{isWatched ? <Icons type="close" /> : <Icons type="check" />}</div>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: MATERIAL DE APOYO                                  */}
      {/* ========================================================= */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-itec-surface border border-itec-gray rounded-3xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsMaterialModalOpen(false)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-itec-bg border border-itec-gray flex items-center justify-center text-gray-500 hover:text-white transition-colors">
              <div className="w-4 h-4"><Icons type="close" /></div>
            </button>
            
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="text-orange-500">📚</span> Material de Apoyo
            </h2>
            <p className="text-xs text-gray-400 mb-6">Archivos de Firebase relacionados a este curso.</p>

            {relatedResources.length > 0 ? (
              <div className="space-y-3">
                {relatedResources.map(res => (
                  <div key={res.id} className="bg-itec-bg border border-itec-gray rounded-xl p-3 flex items-center justify-between group hover:border-orange-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-itec-surface border border-itec-gray flex items-center justify-center text-gray-400 group-hover:text-orange-400 transition-colors shrink-0">
                        <div className="w-[18px] h-[18px]"><Icons type="documentFill" /></div>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-white leading-tight mb-1 truncate max-w-[200px] sm:max-w-[250px]">{res.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{res.tipo}</span>
                          <span className="text-[10px] text-gray-500">Por {res.autor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={res.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-itec-surface hover:bg-itec-gray border border-itec-gray rounded-lg text-gray-300 hover:text-white transition-colors" title="Abrir vista previa">
                        <div className="w-4 h-4"><Icons type="externalLink" /></div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-itec-bg rounded-2xl border border-itec-gray border-dashed">
                <span className="text-4xl block mb-3 opacity-50">📂</span>
                <p className="text-gray-400 text-sm font-medium">Aún no hay apuntes para esta materia.</p>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-itec-gray text-center">
              <Link to="/explore" className="text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors flex items-center justify-center gap-2">
                Buscar más en Aportes <div className="w-4 h-4"><Icons type="arrowRight" /></div>
              </Link>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
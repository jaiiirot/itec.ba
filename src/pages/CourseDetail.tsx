import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { getCourseById } from '../data/courses';
import type { Course, Video } from '../data/courses';
import { RESOURCES_DB } from '../data/resources'; // Importamos los apuntes

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para las nuevas funcionalidades
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (id) {
        const fetchedCourse = getCourseById(id);
        if (fetchedCourse) {
          setCourse(fetchedCourse);
          if (fetchedCourse.videos.length > 0) {
            setActiveVideo(fetchedCourse.videos[0]);
          }
        }
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  // Lógica Inteligente para encontrar apuntes relacionados a este curso
  const relatedResources = useMemo(() => {
    if (!course) return [];
    return RESOURCES_DB.filter(res => {
      const cTitle = course.title.toLowerCase();
      const rSubj = res.subject.toLowerCase();
      // Reglas de coincidencia (Nombre de curso vs Materia del apunte)
      return cTitle.includes(rSubj) || 
             (course.id.includes('seminario') && res.specialty === 'Ingreso') ||
             (course.id.includes('arquitectura') && rSubj.includes('arquitectura')) ||
             (course.id.includes('analisis-mat-i') && rSubj.includes('análisis matemático i'));
    }).slice(0, 4); // Traemos un máximo de 4 aportes clave
  }, [course]);

  // Función para Compartir el Curso
  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ITEC UTN BA - ${course?.title}`,
          text: `¡Mirá las clases de ${course?.title} en el campus de ITEC!`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error al compartir', error);
      }
    } else {
      // Fallback para PC: Copiar al portapapeles
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
          <Link to="/cursos" className="bg-itec-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
            Volver a Mis Cursos
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-10 relative z-10">
        
        <div className="mb-6 flex items-center gap-3">
          <Link to="/cursos" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-itec-blue text-sm font-bold truncate">{course.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-itec-gray relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="bg-itec-surface border border-itec-gray rounded-xl p-6">
              <h1 className="text-2xl font-bold text-white mb-2">{activeVideo.title}</h1>
              <p className="text-gray-400 text-sm mb-4">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 border-t border-itec-gray pt-4">
                {/* BOTÓN MATERIAL DE APOYO */}
                <button 
                  onClick={() => setIsMaterialModalOpen(true)}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                  Material de apoyo
                  {relatedResources.length > 0 && (
                    <span className="bg-itec-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                      {relatedResources.length}
                    </span>
                  )}
                </button>
                
                {/* BOTÓN COMPARTIR */}
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-white/10"
                >
                  {copySuccess ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span className="text-green-500 font-medium">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                      Compartir
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-itec-surface border border-itec-gray rounded-xl flex flex-col h-full max-h-[800px]">
              <div className="p-4 border-b border-itec-gray bg-[#111] rounded-t-xl shrink-0">
                <h3 className="font-bold text-white text-lg">Contenido del Curso</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {course.videos.length} videos • {course.progress}% completado
                </p>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-itec-blue rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {course.videos.map((video, index) => {
                  const isActive = activeVideo.id === video.id;
                  return (
                    <button
                      key={video.id}
                      onClick={() => setActiveVideo(video)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        isActive 
                        ? 'bg-itec-blue/10 border border-itec-blue/30' 
                        : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isActive ? (
                          <div className="w-6 h-6 rounded-full bg-itec-blue flex items-center justify-center text-white">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-gray-500 text-xs font-bold">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium line-clamp-2 ${isActive ? 'text-itec-blue' : 'text-gray-300'}`}>
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {video.duration}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: MATERIAL DE APOYO (Conecta con Explore)            */}
      {/* ========================================================= */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-[#333] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            
            <button onClick={() => setIsMaterialModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h2 className="text-xl font-bold text-white mb-1">Material de Apoyo</h2>
            <p className="text-xs text-gray-400 mb-6">Archivos y resúmenes relacionados a este curso.</p>

            {relatedResources.length > 0 ? (
              <div className="space-y-3">
                {relatedResources.map(res => (
                  <div key={res.id} className="bg-[#111] border border-[#262626] rounded-xl p-3 flex items-center justify-between group hover:border-itec-blue transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-gray-400 group-hover:text-itec-blue transition-colors shrink-0">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-white leading-tight mb-1 truncate max-w-[200px] sm:max-w-[250px]">{res.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-400 bg-[#1a1a1a] border border-[#333] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{res.type}</span>
                          <span className="text-[10px] text-gray-500">Por {res.author}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors" title="Abrir vista previa">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                      </a>
                      <a href={res.fileUrl} download className="p-2 bg-itec-blue hover:bg-blue-600 rounded-lg text-white transition-colors shadow-md" title="Descargar archivo">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-[#111] rounded-xl border border-[#262626]">
                <span className="text-3xl block mb-2">📂</span>
                <p className="text-gray-400 text-sm">No encontramos apuntes específicos para este curso.</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#262626] text-center">
              <Link to="/explore" className="text-sm font-bold text-itec-blue hover:text-white transition-colors">
                Ir al Explorador de Aportes general ➔
              </Link>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
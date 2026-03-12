import React, { useState } from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { coursesService } from '../../services/coursesService';
import type { CourseData } from '../../services/coursesService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCourseAdded: (newCourse: CourseData) => void;
}

export const AddCourseModal: React.FC<Props> = ({ isOpen, onClose, onCourseAdded }) => {
  const [form, setForm] = useState({
    courseTitle: '',
    courseDesc: '',
    videoTitle: '',
    youtubeId: '',
    duration: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    if (!form.courseTitle || !form.courseDesc || !form.videoTitle || !form.youtubeId || !form.duration) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Auto-generamos la imagen usando la API pública de miniaturas de YouTube
      const imageUrl = `https://i.ytimg.com/vi/${form.youtubeId}/hqdefault.jpg`;

      const newCourseData = {
        title: form.courseTitle,
        description: form.courseDesc,
        progress: 0, // Inicia en 0% por defecto
        imageUrl: imageUrl,
        playlistId: `custom_${Date.now()}`,
        videos: [
          {
            id: `v_${Date.now()}`,
            youtubeId: form.youtubeId,
            title: form.videoTitle,
            duration: form.duration
          }
        ]
      };

      const newId = await coursesService.addCourse(newCourseData);
      onCourseAdded({ id: newId, ...newCourseData });
      
      setForm({ courseTitle: '', courseDesc: '', videoTitle: '', youtubeId: '', duration: '' });
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
      <div className="bg-itec-surface border border-itec-gray rounded-3xl w-full max-w-lg shadow-2xl p-8 relative">
        <button onClick={onClose} disabled={isSubmitting} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-itec-bg border border-itec-gray text-gray-500 hover:text-white transition-colors disabled:opacity-50">✖</button>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-itec-blue-skye">🛡️</span> Subir Nuevo Curso
        </h2>
        <p className="text-sm text-gray-400 mb-6">Herramienta exclusiva de administración.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-itec-bg border border-itec-gray rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Datos del Curso</h3>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Título del Curso / Materia</label>
              <Input fullWidth placeholder="Ej: Clase de Consulta AM1..." value={form.courseTitle} onChange={e => setForm({...form, courseTitle: e.target.value})} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Descripción corta</label>
              <Input fullWidth placeholder="Ej: Repaso para finales..." value={form.courseDesc} onChange={e => setForm({...form, courseDesc: e.target.value})} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
            </div>
          </div>

          <div className="p-4 bg-itec-blue/5 border border-itec-blue/20 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-itec-blue-skye uppercase tracking-widest">Primer Video</h3>
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Título del Video</label>
              <Input fullWidth placeholder="Ej: Unidad 1: Límites..." value={form.videoTitle} onChange={e => setForm({...form, videoTitle: e.target.value})} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">ID de YouTube</label>
                <Input fullWidth placeholder="Ej: dQw4w9WgXcQ" value={form.youtubeId} onChange={e => setForm({...form, youtubeId: e.target.value})} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Duración</label>
                <Input fullWidth placeholder="Ej: 1:30:00" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="bg-itec-surface border-itec-gray text-sm py-2.5" />
              </div>
            </div>
          </div>

          {error && <p className="text-itec-red-skye text-xs font-bold bg-itec-red/10 p-2 rounded">{error}</p>}

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting} className="bg-itec-bg border-none text-gray-400">Cancelar</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} className="bg-itec-blue border-none text-white">{isSubmitting ? 'Publicando...' : 'Crear Curso'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
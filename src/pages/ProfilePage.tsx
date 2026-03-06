import React, { useState } from 'react';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';

export const ProfilePage: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Estado para el formulario de login
  const [formData, setFormData] = useState({
    name: 'Jairo', // Autocompletado sugerido
    email: '',
    legajo: '',
    dni: '',
    specialty: 'Sistemas',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email.endsWith('@frba.utn.edu.ar')) {
      setError('Debes utilizar tu correo institucional terminado en @frba.utn.edu.ar');
      return;
    }
    
    if (!formData.name || !formData.legajo || !formData.dni || !formData.phone) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    login(formData as User);
  };

  // ==========================================
  // VISTA 1: USUARIO NO LOGUEADO (LOGIN)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto pt-10">
          <div className="bg-itec-surface border border-itec-gray rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-itec-blue/20 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-itec-blue text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-[0_0_20px_rgba(0,64,147,0.5)]">I</div>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">Acceso Estudiantes</h2>
              <p className="text-xs text-gray-400 mb-8 text-center">Ingresá con tu cuenta institucional para acceder a tu TarjeTEC y beneficios.</p>
              
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Nombre y Apellido *</label>
                  <Input fullWidth value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="py-2.5 bg-[#111] text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Correo Estudiantil *</label>
                  <Input fullWidth placeholder="usuario@frba.utn.edu.ar" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="py-2.5 bg-[#111] text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Legajo *</label>
                    <Input fullWidth placeholder="Sin guiones" value={formData.legajo} onChange={e => setFormData({...formData, legajo: e.target.value})} className="py-2.5 bg-[#111] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">DNI *</label>
                    <Input fullWidth placeholder="Sin puntos" value={formData.dni} onChange={e => setFormData({...formData, dni: e.target.value})} className="py-2.5 bg-[#111] text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Especialidad</label>
                    <Input fullWidth value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="py-2.5 bg-[#111] text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">Celular *</label>
                    <Input fullWidth value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="py-2.5 bg-[#111] text-sm" />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>}
                
                <Button type="submit" variant="primary" className="py-3 mt-4 font-bold text-sm uppercase tracking-wider bg-itec-blue hover:bg-blue-600 border-none transition-colors shadow-lg">
                  Generar mi Credencial
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // VISTA 2: ESTUDIANTE LOGUEADO (PERFIL & TARJETA)
  // ==========================================
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-10">
        
        {/* HEADER PERFIL */}
        <div className="flex justify-between items-end mb-8 border-b border-itec-gray pb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-itec-blue flex items-center justify-center overflow-hidden">
               <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" alt="Perfil" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">{user?.name}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Estudiante Activo</span>
                {user?.specialty}
              </p>
            </div>
          </div>
          <button onClick={logout} className="text-sm text-itec-red hover:underline font-medium">Cerrar Sesión</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: TARJETEC Y DATOS */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* DISEÑO DE LA TARJETEC (Estilo Tarjeta de Crédito Negra) */}
            <div className="w-full aspect-[1.586/1] bg-gradient-to-br from-[#1a1a1a] to-[#050505] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#333] relative overflow-hidden flex flex-col justify-between group">
               {/* Decoración de circuitos (Simulada con SVG) */}
               <svg className="absolute -right-10 -bottom-10 opacity-10 w-64 h-64 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="0.5"><path d="M10 90 L40 60 L60 60 L90 30 M20 90 L50 60 L50 40 L80 10 M30 90 L60 60" /></svg>
               
               {/* Top de la Tarjeta */}
               <div className="flex justify-between items-start relative z-10">
                 <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white tracking-tighter">TEC.</span>
                    <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L12 22M2 12L22 12M5 5L19 19M5 19L19 5"/></svg>
                 </div>
                 {/* Ícono NFC */}
                 <svg width="24" height="24" fill="none" stroke="gray" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 8a10 10 0 0 1 16 0M6 12a6 6 0 0 1 12 0M8 16a2 2 0 0 1 8 0"/></svg>
               </div>

               {/* Chip */}
               <div className="w-12 h-9 rounded bg-gradient-to-br from-[#d4af37] to-[#a67c00] relative z-10 flex flex-wrap gap-[1px] p-[2px] opacity-90">
                 <div className="w-full h-[30%] border-b border-black/20"></div>
                 <div className="w-full h-[30%] border-b border-black/20"></div>
               </div>

               {/* Bottom de la Tarjeta */}
               <div className="relative z-10 flex justify-between items-end">
                 <div>
                   <p className="font-mono text-lg text-gray-300 tracking-widest mb-1 shadow-black drop-shadow-md">
                     {user?.legajo.replace(/(.{3})/g, '$1 ')} {/* Formatea el legajo tipo tarjeta */}
                   </p>
                   <div className="flex gap-4">
                     <p className="text-[10px] text-gray-500 uppercase tracking-widest">STUDENT ITEC</p>
                     <p className="text-[10px] text-white uppercase tracking-widest font-bold">{user?.name}</p>
                   </div>
                 </div>
                 {/* Código QR Simulado */}
                 <div className="w-12 h-12 bg-white rounded p-1 shrink-0">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user?.legajo}`} alt="QR Code" className="w-full h-full opacity-90" />
                 </div>
               </div>
            </div>

            {/* Datos del Estudiante */}
            <div className="bg-itec-surface border border-itec-gray rounded-xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Información Personal</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-[#262626] pb-2">
                  <span className="text-sm text-gray-400">Email Institucional</span>
                  <span className="text-sm text-white font-medium truncate max-w-[150px]">{user?.email}</span>
                </div>
                <div className="flex justify-between border-b border-[#262626] pb-2">
                  <span className="text-sm text-gray-400">DNI</span>
                  <span className="text-sm text-white font-medium">{user?.dni}</span>
                </div>
                <div className="flex justify-between border-b border-[#262626] pb-2">
                  <span className="text-sm text-gray-400">Teléfono</span>
                  <span className="text-sm text-white font-medium">{user?.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: BENEFICIOS */}
          <div className="lg:col-span-2">
            <div className="bg-itec-surface border border-itec-gray rounded-xl p-6 h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Tus Beneficios TarjeTEC</h2>
                <p className="text-gray-400 text-sm">Mostrá tu credencial virtual y tu DNI en los locales adheridos para acceder a los descuentos exclusivos.</p>
              </div>

              {/* Acordeón de Beneficios */}
              <div className="space-y-6">
                
                {/* Sede Medrano */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-itec-blue uppercase tracking-widest mb-3">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Cerca de Sede Medrano (951)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-itec-blue transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Barbería Gambino</h4>
                      <p className="text-green-400 text-xs font-bold mb-1">20% OFF en cortes</p>
                      <span className="text-[10px] text-gray-500">Rocamora 4008</span>
                    </div>
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-itec-blue transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">CHS Burguer Palermo</h4>
                      <p className="text-green-400 text-xs font-bold mb-1">15% OFF menú / 10% promos</p>
                      <span className="text-[10px] text-gray-500">Medrano 1046</span>
                    </div>
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-itec-blue transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Fútbol 5 Cabrera</h4>
                      <p className="text-green-400 text-xs font-bold mb-1">10% OFF de 12 a 17 h</p>
                      <span className="text-[10px] text-gray-500">Cabrera 3544</span>
                    </div>
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-itec-blue transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Tecnomedrano</h4>
                      <p className="text-green-400 text-xs font-bold mb-1">5%-10% OFF en calculadoras</p>
                      <span className="text-[10px] text-gray-500">Medrano 938</span>
                    </div>
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-itec-blue transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Alcon Bakery Café</h4>
                      <p className="text-green-400 text-xs font-bold mb-1">10% OFF en total de compra</p>
                      <span className="text-[10px] text-gray-500">Río de Janeiro 1086</span>
                    </div>
                  </div>
                </div>

                {/* Sede Campus */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-itec-blue uppercase tracking-widest mb-3">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Cerca de Sede Campus (Mozart)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-itec-blue transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Las delicias de Mora</h4>
                      <p className="text-green-400 text-xs font-bold mb-1">5% OFF en compra total</p>
                      <span className="text-[10px] text-gray-500">Santander 4189</span>
                    </div>
                  </div>
                </div>

                {/* Servicios Adheridos */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase tracking-widest mb-3">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    Servicios Académicos y Digitales
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-purple-500 transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">CriptexEdu</h4>
                      <p className="text-purple-400 text-xs font-bold mb-1">50% OFF en todos los cursos</p>
                      <span className="text-[10px] text-gray-500">Programación y Tech</span>
                    </div>
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-purple-500 transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Viktorclases</h4>
                      <p className="text-purple-400 text-xs font-bold mb-1">10% OFF en Ingreso, AM1 y AGA</p>
                    </div>
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-purple-500 transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Mentor.math</h4>
                      <p className="text-purple-400 text-xs font-bold mb-1">5% OFF en clases particulares</p>
                      <span className="text-[10px] text-gray-500">Pagando 8h juntas, 1h gratis</span>
                    </div>
                    <div className="bg-[#111] p-3 rounded-lg border border-[#262626] hover:border-purple-500 transition-colors">
                      <h4 className="text-white font-bold text-sm mb-1">Disegno Soft</h4>
                      <p className="text-purple-400 text-xs font-bold mb-1">5% OFF en cursos SolidWorks</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};
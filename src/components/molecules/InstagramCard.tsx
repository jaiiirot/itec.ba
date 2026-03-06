import React from 'react';

interface InstagramCardProps {
  imageUrl: string;
  caption: string;
  date: string;
  link: string;
}

export const InstagramCard: React.FC<InstagramCardProps> = ({ imageUrl, caption, date, link }) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-itec-bg rounded-xl overflow-hidden shadow-lg transition-all group flex flex-col h-full cursor-pointer"
    >
      {/* Contenedor de la Imagen (Aspect Ratio 1:1 estilo Instagram) */}
      <div className="relative w-full pt-[100%] bg-itec-bg overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Publicación ITEC" 
          className="absolute top-0 left-0 w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
        />
        {/* Icono de Instagram en la esquina superior derecha */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-1.5 rounded-lg text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </div>
      </div>

      {/* Pie de foto y fecha */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm text-gray-300 line-clamp-3 mb-3 flex-1">
          {caption}
        </p>
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          {date}
        </span>
      </div>
    </a>
  );
};
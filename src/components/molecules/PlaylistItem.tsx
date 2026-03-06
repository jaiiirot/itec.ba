import React from 'react';

interface PlaylistItemProps {
  title: string;
  duration: string;
  isActive: boolean;
  thumbnail: string;
  onClick: () => void;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({ 
  title, 
  duration, 
  isActive, 
  thumbnail, 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive ? 'bg-itec-gray bg-opacity-50' : 'hover:bg-itec-surface'
      }`}
    >
      {/* Miniatura del video */}
      <div className="relative w-32 h-20 shrink-0 bg-black rounded-md overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover opacity-90" />
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-[10px] px-1.5 py-0.5 rounded">
          {duration}
        </span>
      </div>
      
      {/* Información del video */}
      <div className="flex flex-col flex-1 py-1">
        <h4 className={`text-sm font-medium line-clamp-3 ${isActive ? 'text-white' : 'text-itec-text'}`}>
          {title}
        </h4>
        <p className="text-xs text-gray-400 mt-1">TEC UTN BA</p>
      </div>
    </div>
  );
};
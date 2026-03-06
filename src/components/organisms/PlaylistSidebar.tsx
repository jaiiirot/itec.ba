import React from 'react';
import { PlaylistItem } from '../molecules/PlaylistItem';

export interface VideoData {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

interface PlaylistSidebarProps {
  videos: VideoData[];
  currentVideoId: string;
  onVideoSelect: (video: VideoData) => void;
}

export const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({ videos, currentVideoId, onVideoSelect }) => {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col">
      {/* Cabecera de la Playlist */}
      <div className="p-4 bg-itec-surface border-b border-itec-gray">
        <h3 className="font-bold text-lg text-itec-text leading-tight">
          ✳️TEC ESPACIO DE CONSULTAS - SEMINARIO DE INGRESO
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Lista de reproducción • {videos.length} videos
        </p>
      </div>
      
      {/* Lista scrolleable */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
        {videos.map((video) => (
          <PlaylistItem
            key={video.id}
            title={video.title}
            duration={video.duration}
            thumbnail={video.thumbnail}
            isActive={video.id === currentVideoId}
            onClick={() => onVideoSelect(video)}
          />
        ))}
      </div>
    </div>
  );
};